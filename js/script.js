// =====================================================================
// 1) PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
//    (see /google-apps-script/README.md for setup instructions)
// =====================================================================
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbza_VIqot59fwxURJag9A2M-3gKydnK_cbc_UqJIcozLpj2X77Pd-_9ZPHcu8eOqR4a/exec";

// ---------------------------------------------------------------------
// Guest name from the invitation link, e.g. index.html?to=Budi%20Santoso
// ---------------------------------------------------------------------
(function setGuestName(){
  const params = new URLSearchParams(window.location.search);
  const to = params.get("to");
  if (to) {
    document.getElementById("guest-name").textContent = decodeURIComponent(to);
  }
})();

// ---------------------------------------------------------------------
// Open invitation (envelope) interaction
// ---------------------------------------------------------------------
const cover = document.getElementById("cover");
const main = document.getElementById("main");
document.getElementById("open-invitation").addEventListener("click", () => {
  cover.classList.add("opened");
  main.classList.add("visible");
  document.body.style.overflow = "auto";
  window.scrollTo({ top: 0, behavior: "instant" });
});
document.body.style.overflow = "hidden"; // locked until opened

// ---------------------------------------------------------------------
// Countdown to 12 September 2026, 08:00 WIB (UTC+7)
// ---------------------------------------------------------------------
const WEDDING_DATE = new Date("2026-09-12T08:00:00+07:00").getTime();

function updateCountdown(){
  const now = Date.now();
  const diff = WEDDING_DATE - now;
  const els = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    min: document.getElementById("cd-min"),
    sec: document.getElementById("cd-sec"),
  };
  if (diff <= 0){
    els.days.textContent = "00"; els.hours.textContent = "00";
    els.min.textContent = "00"; els.sec.textContent = "00";
    return;
  }
  const d = Math.floor(diff / (1000*60*60*24));
  const h = Math.floor((diff / (1000*60*60)) % 24);
  const m = Math.floor((diff / (1000*60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  els.days.textContent = String(d).padStart(2,"0");
  els.hours.textContent = String(h).padStart(2,"0");
  els.min.textContent = String(m).padStart(2,"0");
  els.sec.textContent = String(s).padStart(2,"0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ---------------------------------------------------------------------
// Copy bank account number
// ---------------------------------------------------------------------
function copyAccount(){
  const num = document.getElementById("acc-number").textContent.trim();
  navigator.clipboard.writeText(num).then(() => {
    alert("Nomor rekening disalin: " + num);
  }).catch(() => {
    alert("Nomor rekening: " + num);
  });
}
window.copyAccount = copyAccount;

// ---------------------------------------------------------------------
// RSVP submit -> Google Sheet (via Apps Script Web App)
// ---------------------------------------------------------------------
const form = document.getElementById("rsvp-form");
const formMsg = document.getElementById("form-msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!SCRIPT_URL || SCRIPT_URL.includes("PASTE_YOUR")) {
    formMsg.textContent = "Belum terhubung ke Google Sheet — lihat google-apps-script/README.md";
    formMsg.style.color = "#b23b3b";
    return;
  }

  const submitBtn = form.querySelector("button[type=submit]");
  submitBtn.disabled = true;
  formMsg.textContent = "Mengirim...";
  formMsg.style.color = "";

  const payload = {
    nama: document.getElementById("rsvp-nama").value.trim(),
    kehadiran: document.getElementById("rsvp-hadir").value,
    jumlah: document.getElementById("rsvp-jumlah").value,
    pesan: document.getElementById("rsvp-pesan").value.trim(),
  };

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", // Apps Script doesn't return readable CORS headers on POST
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    formMsg.textContent = "Terima kasih! Konfirmasi kamu sudah kami terima.";
    formMsg.style.color = "#4a6b3a";
    form.reset();
    document.getElementById("rsvp-jumlah").value = "1";
    loadGuestbook(); // refresh counts + wishes
  } catch (err) {
    formMsg.textContent = "Gagal mengirim. Coba lagi ya.";
    formMsg.style.color = "#b23b3b";
  } finally {
    submitBtn.disabled = false;
  }
});

// ---------------------------------------------------------------------
// Load guestbook + live RSVP counts (GET request, JSON response)
// ---------------------------------------------------------------------
async function loadGuestbook(){
  const wishList = document.getElementById("wish-list");
  if (!SCRIPT_URL || SCRIPT_URL.includes("PASTE_YOUR")) {
    wishList.innerHTML = '<p class="wish-empty">Hubungkan ke Google Sheet untuk menampilkan ucapan tamu.</p>';
    return;
  }
  try {
    const res = await fetch(SCRIPT_URL + "?action=list");
    const data = await res.json();

    document.getElementById("count-hadir").textContent = data.totalHadir ?? 0;
    document.getElementById("count-tidak").textContent = data.totalTidakHadir ?? 0;
    document.getElementById("count-tamu").textContent = data.totalTamu ?? 0;

    const entries = (data.entries || []).slice().reverse(); // newest first
    if (entries.length === 0) {
      wishList.innerHTML = '<p class="wish-empty">Jadi yang pertama memberi ucapan!</p>';
      return;
    }
    wishList.innerHTML = entries.map(en => `
      <div class="wish">
        <div class="who">${escapeHtml(en.nama || "Tamu")} <span class="status">— ${escapeHtml(en.kehadiran || "")}</span></div>
        <div class="msg">${escapeHtml(en.pesan || "")}</div>
      </div>
    `).join("");
  } catch (err) {
    wishList.innerHTML = '<p class="wish-empty">Tidak bisa memuat ucapan saat ini.</p>';
  }
}

function escapeHtml(str){
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

loadGuestbook();

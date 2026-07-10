# Undangan Pernikahan — Rio & Myisha

Website undangan pernikahan single-page, mobile-first, dengan:
- Layar sampul "Open Invitation" bergaya amplop, dengan nama tamu dari link (`?to=Nama`)
- Ilustrasi pasangan (kacamata, busana putih) — ganti dengan foto asli kalau sudah ada
- Ayat Ar-Rum: 21
- Profil mempelai
- Hitung mundur ke hari-H (12 September 2026, 08.00 WIB)
- Detail acara Akad & Resepsi (Stay.vie Dinoyo, Surabaya) + tombol buka lokasi di Google Maps
- Galeri foto
- Wedding gift (QR code + nomor rekening, dengan tombol salin)
- RSVP (Nama, Konfirmasi Kehadiran, Jumlah Tamu, Ucapan) yang tersimpan langsung ke **Google Sheets**
- Dinding ucapan tamu yang tampil otomatis di undangan, plus hitungan live Hadir / Tidak Hadir / Total Tamu

## Struktur folder
```
index.html                     -> halaman utama
css/style.css                  -> semua styling
js/script.js                   -> logic (amplop, countdown, RSVP, guestbook)
assets/img/                    -> semua gambar (ganti dengan foto kalian)
google-apps-script/Code.gs     -> script backend Google Sheets (paste ke Apps Script)
google-apps-script/README.md   -> panduan setup Google Sheets step-by-step
```

## Langkah 1 — Ganti isi dengan data kalian
Buka `index.html` dan cari lalu ganti bagian berikut:
- `Putra dari Bapak [Nama Ayah] & Ibu [Nama Ibu]` — nama orang tua Rio & Myisha
- `Bank — a.n. [Nama Pemilik Rekening]` dan `0000000000` — info rekening transfer
- Alamat lengkap venue kalau ingin ditambahkan di bawah "Stay.vie Dinoyo, Surabaya"

## Langkah 2 — Ganti gambar
Masukkan file kalian ke `assets/img/` dengan nama persis seperti ini (kalau file belum ada, website akan menampilkan placeholder otomatis):
- `photo-groom.jpg` — foto Rio
- `photo-bride.jpg` — foto Myisha
- `gallery-1.jpg` s/d `gallery-6.jpg` — foto galeri
- `qr-code.png` — QR code transfer (kamu akan kirim sendiri filenya, tinggal simpan di sini)

## Langkah 3 — Hubungkan RSVP ke Google Sheets
Ikuti panduan lengkap di `google-apps-script/README.md`. Intinya:
1. Buat Google Sheet baru
2. Extensions → Apps Script → paste isi `Code.gs`
3. Deploy → New deployment → Web app → access "Anyone"
4. Copy URL hasil deploy, tempel ke `SCRIPT_URL` di `js/script.js`

## Langkah 4 — Push ke GitHub & hosting gratis via GitHub Pages
Dari VS Code (terminal):
```bash
git add .
git commit -m "Wedding invitation Rio & Myisha"
git push origin main
```
Lalu di GitHub repo: **Settings → Pages → Branch: main → Save**.
Setelah beberapa menit, situs akan aktif di:
`https://myishazara-cloud.github.io/rio-myisha-wedding/`

## Kirim undangan personal ke tamu
Tambahkan `?to=NamaTamu` di akhir link, contoh:
```
https://myishazara-cloud.github.io/rio-myisha-wedding/?to=Budi%20Santoso
```
Nama tamu akan otomatis muncul di layar sampul.

## Catatan
- Aku (Claude) tidak punya akses login/OAuth ke akun GitHub atau Google kamu — jadi file-file ini perlu kamu commit & push sendiri dari VS Code, dan setup Google Sheets dilakukan manual mengikuti panduan di atas. Semua kode sudah siap pakai, tinggal isi data & deploy.

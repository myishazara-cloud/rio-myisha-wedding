/**
 * Rio & Myisha — RSVP backend
 * Paste this into Extensions > Apps Script of your Google Sheet,
 * then deploy as a Web App (see README.md in this folder for steps).
 */

const SHEET_NAME = "RSVP"; // the tab name inside your Google Sheet

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["Timestamp", "Nama", "Konfirmasi Kehadiran", "Jumlah Tamu", "Ucapan"]);
  }
  return sheet;
}

// Handles the RSVP form submission (POST)
function doPost(e) {
  const sheet = getSheet_();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.nama || "",
    data.kehadiran || "",
    Number(data.jumlah || 0),
    data.pesan || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Serves the guest list + live counts back to the site (GET)
function doGet(e) {
  const sheet = getSheet_();
  const rows = sheet.getDataRange().getValues();
  rows.shift(); // remove header row

  let totalHadir = 0, totalTidakHadir = 0, totalTamu = 0;
  const entries = rows
    .filter(r => r[1]) // has a name
    .map(r => {
      const [timestamp, nama, kehadiran, jumlah, pesan] = r;
      const n = Number(jumlah) || 0;
      if (kehadiran === "Hadir") { totalHadir++; totalTamu += n; }
      if (kehadiran === "Tidak Hadir") { totalTidakHadir++; }
      return { nama, kehadiran, jumlah: n, pesan };
    });

  const payload = { entries, totalHadir, totalTidakHadir, totalTamu };

  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

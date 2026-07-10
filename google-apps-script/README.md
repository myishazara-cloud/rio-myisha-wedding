# Menghubungkan RSVP ke Google Sheets

## 1. Buat Google Sheet baru
- Buka https://sheets.google.com → buat spreadsheet baru, misalnya beri nama **"RSVP Rio & Myisha"**.
- Kamu tidak perlu membuat header manual, script akan membuatnya otomatis di tab bernama `RSVP`.

## 2. Tempel script
- Di spreadsheet, klik **Extensions → Apps Script**.
- Hapus isi default, lalu copy-paste seluruh isi file `Code.gs` (satu folder dengan README ini) ke editor tersebut.
- Klik ikon 💾 **Save**.

## 3. Deploy sebagai Web App
- Klik tombol **Deploy → New deployment**.
- Pilih tipe **Web app**.
- Isi:
  - **Execute as:** Me (email kamu)
  - **Who has access:** Anyone
- Klik **Deploy**. Google akan minta izin akses — klik **Authorize**, pilih akun Google kamu, lalu **Advanced → Go to (nama project) → Allow**.
- Setelah deploy selesai, copy **Web app URL** yang muncul (bentuknya seperti:
  `https://script.google.com/macros/s/AKfycb..../exec`)

## 4. Tempel URL ke website
- Buka file `js/script.js` di folder utama project.
- Cari baris:
  ```js
  const SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
  ```
- Ganti dengan URL yang kamu copy tadi, contoh:
  ```js
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycb.../exec";
  ```
- Simpan file, lalu commit & push ke GitHub.

## 5. Cek total RSVP
- Setiap ada tamu yang submit RSVP, baris baru otomatis muncul di tab **RSVP** pada spreadsheet kamu — di situ kamu bisa lihat semua nama, status kehadiran, jumlah tamu, dan ucapan.
- Halaman undangan juga menampilkan hitungan **Hadir / Tidak Hadir / Total Tamu** secara otomatis (diambil langsung dari sheet ini).

## 6. Kalau nanti kamu edit script Apps Script lagi
- Setiap kali kamu mengubah isi `Code.gs` di Apps Script editor, kamu harus **Deploy → Manage deployments → edit (pensil) → New version → Deploy** lagi supaya perubahan ikut ter-update di URL yang sama.

## Troubleshooting
- **RSVP tidak masuk ke sheet:** pastikan "Who has access" di deployment diset ke **Anyone**, bukan "Only myself".
- **Ucapan/counter tidak muncul di web:** buka `SCRIPT_URL?action=list` langsung di browser — kalau muncul JSON, berarti backend OK dan masalah ada di `SCRIPT_URL` di script.js (cek typo/URL lama).
- **Ganti nama tab lain:** kalau kamu ingin nama tab selain `RSVP`, ubah juga konstanta `SHEET_NAME` di `Code.gs`.

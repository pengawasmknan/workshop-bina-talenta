# Panduan Setup — Bina Talenta Test

Website ini punya dua mode:

- **Mode lokal (default, tanpa setup apa pun)** — pre/post-test langsung bisa dicoba, tapi skor hanya tersimpan di browser masing-masing perangkat. Panitia yang login akan melihat data kosong kalau membuka dari perangkat berbeda. Cocok untuk pratinjau/demo.
- **Mode tersambung (disarankan untuk hari-H)** — setiap hasil otomatis masuk ke satu Google Sheet, dan dashboard panitia membaca dari sana. Butuh 5 menit setup, gratis, tanpa perlu server sendiri.

## 1. Soal

Soal di [js/questions.js](js/questions.js) sudah diisi dari `Soal_Pretest_Posttest_Workshop_Bina_Talenta.docx` (5 soal pre-test, 5 soal post-test, sesuai kunci jawaban di dokumen tersebut). Kalau nanti ada revisi soal, edit array `pre`/`post` di file itu — formatnya:

```js
{ text: "Pertanyaannya...", options: ["A", "B", "C", "D"], correct: 2 }
```

`correct` adalah index jawaban benar (0 = pilihan pertama). Tidak perlu menyusun urutan soal atau pilihan secara acak manual — website **otomatis mengacak urutan soal dan urutan pilihan jawaban** setiap kali seorang mahasiswa memulai pengerjaan, jadi peserta yang duduk berdekatan mendapat tampilan berbeda.

## 2. Aktifkan mode tersambung (Google Sheets)

1. Buka [sheets.google.com](https://sheets.google.com) → buat spreadsheet baru, beri nama misalnya "Bina Talenta - Hasil Test".
2. Di spreadsheet itu, klik menu **Extensions → Apps Script**.
3. Hapus kode default di editor, lalu salin-tempel seluruh isi file [apps-script/Code.gs](apps-script/Code.gs) dari proyek ini.
4. Cek baris `var PANITIA_PASSWORD = "BinaTalenta2026";` — ganti sesuai kode akses yang ingin dipakai panitia (opsional).
5. Klik **Deploy → New deployment**.
   - Klik ikon gerigi di samping "Select type" → pilih **Web app**.
   - **Execute as**: Me (akun Anda).
   - **Who has access**: Anyone.
   - Klik **Deploy**, lalu izinkan akses saat diminta (Authorize access).
6. Salin **Web app URL** yang muncul (bentuknya seperti `https://script.google.com/macros/s/XXXXXXX/exec`).
7. Buka [js/config.js](js/config.js) di proyek ini, tempel URL tadi ke:
   ```js
   API_URL: "https://script.google.com/macros/s/XXXXXXX/exec",
   ```
8. Kalau tadi mengganti `PANITIA_PASSWORD` di Code.gs, samakan juga nilainya di `js/config.js` (`PANITIA_PASSWORD`) — keduanya harus identik.
9. Simpan, refresh website. Coba isi satu pre-test, lalu cek apakah baris baru muncul otomatis di Google Sheet.

> Setiap kali kode di `Code.gs` diubah, ulangi **Deploy → Manage deployments → Edit (ikon pensil) → New version → Deploy** supaya perubahan aktif.

## 3. Menjalankan / meng-host website

Karena situs ini murni HTML/CSS/JS tanpa proses build, bisa langsung:

- **Coba di komputer sendiri**: buka folder ini di terminal lalu jalankan `python3 -m http.server 8080`, kemudian buka `http://localhost:8080`.
- **Bagikan ke peserta**: unggah seluruh isi folder (kecuali folder `apps-script`) ke hosting statis gratis seperti Netlify Drop, Vercel, atau GitHub Pages, lalu bagikan link-nya lewat grup WhatsApp/poster acara.

## 4. Login panitia

Klik **Login Panitia** di pojok kanan atas → masukkan kode akses (`CONFIG.PANITIA_PASSWORD`, default `BinaTalenta2026`, **segera ganti** sebelum acara). Dashboard menampilkan rata-rata skor, filter pre/post, pencarian nama/NIM, dan tombol ekspor CSV.

## Catatan keamanan

Kode akses panitia ini bersifat sederhana (bukan sistem akun berlapis) — cukup untuk kebutuhan internal workshop satu hari. Jangan gunakan kode yang sama dengan password penting lain, dan ganti kodenya setelah acara selesai bila proyek ini dipakai ulang.

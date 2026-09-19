// ============================================================
// KONFIGURASI — panitia edit di sini saja, tidak perlu sentuh file lain.
// ============================================================
const CONFIG = {
  // Tempel URL Web App Google Apps Script di sini setelah deploy
  // (lihat PANDUAN-SETUP.md). Kosongkan untuk mode lokal (demo only,
  // skor hanya tersimpan di browser perangkat masing-masing).
  API_URL: "https://script.google.com/macros/s/AKfycbz6Ar0db2DEisK2kgGOn_YAxY3WKJ4GBgg6DRXvYV8ZTcm0zW4jMsQc6jo4lVEjpA1GLg/exec",

  // Kode akses yang dipakai panitia untuk masuk ke dashboard skor.
  // HARUS SAMA PERSIS dengan PANITIA_PASSWORD di apps-script/Code.gs.
  PANITIA_PASSWORD: "BinaTalenta2026",

  // Nama acara, dipakai di beberapa tempat kecil (judul dokumen, ekspor CSV).
  EVENT_NAME: "Workshop Bina Talenta",

  // Jumlah soal yang ditampilkan ke tiap peserta, diambil acak dari bank
  // soal (js/questions.js) yang boleh berisi lebih banyak soal daripada
  // ini. Contoh: bank berisi 8 soal, angka ini 5 -> tiap peserta cuma
  // dapat 5 soal acak dari 8, tidak ada yang diulang dalam satu sesi.
  QUESTIONS_PER_PARTICIPANT: 5,
};

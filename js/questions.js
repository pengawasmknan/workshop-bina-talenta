// ============================================================
// BANK SOAL — Workshop Bina Talenta Riset dan Pengembangan
// Sumber: Soal_Pretest_Posttest_Workshop_Bina_Talenta.docx (panitia)
// Struktur tiap soal:
//   { text: "...", options: ["...","...","...","..."], correct: 0 }
// `correct` adalah index jawaban benar (0 = pilihan pertama, dst).
// Urutan soal & urutan pilihan otomatis DIACAK setiap kali seorang
// peserta memulai (lihat prepareQuestions() di js/app.js) — array di
// bawah ini cukup diedit apa adanya, tidak perlu disusun acak manual.
// ============================================================
const QUESTION_BANK = {
  pre: [
    {
      text: "Paradigma yang mendorong perguruan tinggi menjadi pusat solusi nyata bagi masyarakat, melampaui peran penelitian dan pengajaran semata, disebut...",
      options: [
        "Merdeka Belajar",
        "Diktisaintek Berdampak",
        "Kampus Merdeka",
        "Tri Dharma Konvensional",
      ],
      correct: 1,
    },
    {
      text: "Direktorat Jenderal yang menyelenggarakan Workshop Bina Talenta ini bersama Komisi X DPR RI adalah...",
      options: [
        "Ditjen Pendidikan Tinggi",
        "Ditjen Riset dan Pengembangan (Ditjen Risbang)",
        "Ditjen Kebudayaan",
        "Ditjen Vokasi",
      ],
      correct: 1,
    },
    {
      text: "Visi jangka panjang yang menjadi arah pembangunan nasional dan dikaitkan dengan peran perguruan tinggi dalam kegiatan ini adalah...",
      options: [
        "Indonesia Emas 2045",
        "Indonesia Maju 2030",
        "Revolusi Industri 4.0",
        "Merdeka Belajar Kampus Merdeka",
      ],
      correct: 0,
    },
    {
      text: "Kolaborasi riset dan pengabdian kepada masyarakat pada dasarnya diarahkan untuk...",
      options: [
        "Meningkatkan jumlah kelulusan mahasiswa",
        "Menghasilkan inovasi yang hilirisasinya berdampak nyata bagi masyarakat dan daerah",
        "Menambah jumlah publikasi internasional semata",
        "Memenuhi syarat akreditasi kampus",
      ],
      correct: 1,
    },
    {
      text: "Metode utama yang digunakan dalam pelaksanaan workshop ini adalah...",
      options: [
        "Simulasi dan praktik lapangan",
        "Ceramah dan diskusi",
        "Ujian tertulis",
        "Kunjungan industri",
      ],
      correct: 1,
    },
  ],
  post: [
    {
      text: "Salah satu tujuan utama kolaborasi antara perguruan tinggi, pemerintah, dunia usaha/industri, dan masyarakat dalam kegiatan ini adalah...",
      options: [
        "Membangun kolaborasi strategis lintas sektor agar kampus menjadi pusat solusi dan inovasi",
        "Mengurangi jumlah program studi",
        "Membatasi kerja sama dengan pihak eksternal",
        "Menstandardisasi kurikulum nasional",
      ],
      correct: 0,
    },
    {
      text: "Karakter yang ingin ditumbuhkan pada talenta muda Indonesia melalui kegiatan ini, sesuai tema workshop, adalah...",
      options: [
        "Karakter pasif dan menunggu arahan",
        "Karakter unggul dan semangat kompetitif",
        "Karakter individualis",
        "Karakter konsumtif",
      ],
      correct: 1,
    },
    {
      text: "Salah satu manfaat yang diharapkan dari kegiatan ini bagi kebijakan Kemdiktisaintek adalah...",
      options: [
        "Menghapus kebijakan yang sudah ada",
        "Menjaring aspirasi dan masukan untuk kebijakan yang lebih adaptif dan tepat sasaran",
        "Mengurangi anggaran riset",
        "Membatasi partisipasi perguruan tinggi daerah",
      ],
      correct: 1,
    },
    {
      text: "Perguruan tinggi didorong bergeser orientasinya dari sekadar kuantitas kelulusan menuju...",
      options: [
        "Peningkatan jumlah mahasiswa baru",
        "Pemecahan masalah konkret bangsa dan kemajuan daerah",
        "Penambahan gedung kampus",
        "Pengurangan jumlah dosen",
      ],
      correct: 1,
    },
    {
      text: "Unsur yang terlibat sebagai narasumber dalam kegiatan Workshop Bina Talenta ini umumnya berasal dari...",
      options: [
        "Hanya mahasiswa",
        "Pimpinan perguruan tinggi, pejabat Kemdiktisaintek, dan pakar/praktisi eksternal",
        "Hanya alumni",
        "Hanya media massa",
      ],
      correct: 1,
    },
  ],
};

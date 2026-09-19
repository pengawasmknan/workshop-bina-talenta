// ============================================================
// BANK SOAL — Workshop Bina Talenta Riset dan Pengembangan
// Sumber: bank_soal.json (panitia, revisi 19 Sep 2026)
//
// Catatan dari panitia: Pretest = pengetahuan/persepsi umum mahasiswa
// tentang talenta unggul & karakter kompetitif (tidak menuntut materi
// yang belum disampaikan). Posttest = menguji pemahaman atas materi
// Dr. Robi Cahyadi Kurniawan dan materi kebijakan Kemdiktisaintek
// (Prof. Junaidi Khotib) yang disampaikan saat workshop.
//
// Struktur tiap soal:
//   { text: "...", options: ["...","...","...","..."], correct: 0 }
// `correct` adalah index jawaban benar (0 = pilihan pertama, dst).
//
// Bank ini berisi 8 soal per sesi, tapi tiap peserta HANYA menerima 5
// soal acak dari 8 itu (lihat CONFIG.QUESTIONS_PER_PARTICIPANT di
// js/config.js) — urutan soal & urutan pilihan jawaban juga diacak
// ulang setiap kali seorang peserta memulai (lihat prepareQuestions()
// di js/app.js). Array di bawah ini cukup diedit apa adanya sesuai
// urutan bank, tidak perlu disusun acak manual.
// ============================================================
const QUESTION_BANK = {
  pre: [
    {
      text: "Menurut Anda, talenta unggul seorang mahasiswa paling tepat digambarkan sebagai...",
      options: [
        "Mahasiswa dengan IPK tertinggi di angkatannya",
        "Mahasiswa yang mampu menerapkan kemampuannya untuk menyelesaikan masalah nyata di masyarakat",
        "Mahasiswa yang paling banyak mengikuti seminar",
        "Mahasiswa yang paling populer di kampus",
      ],
      correct: 1,
    },
    {
      text: "Kemampuan menyampaikan gagasan secara jelas kepada orang lain, baik lisan maupun tulisan, termasuk dalam soft skill yang disebut...",
      options: ["Komunikasi (public speaking)", "Analisis data", "Pemrograman komputer", "Akuntansi"],
      correct: 0,
    },
    {
      text: "Salah satu ciri mahasiswa yang berkarakter unggul dan kompetitif adalah...",
      options: [
        "Mudah menyerah saat menghadapi tantangan",
        "Aktif berkolaborasi dan terbuka terhadap hal baru",
        "Enggan menerima kritik dan masukan",
        "Bekerja sendiri tanpa mau bekerja sama",
      ],
      correct: 1,
    },
    {
      text: "Riset dan pengabdian kepada masyarakat yang dilakukan mahasiswa/dosen pada dasarnya bertujuan untuk...",
      options: [
        "Memenuhi syarat kelulusan semata",
        "Menjawab persoalan nyata yang dihadapi masyarakat",
        "Menambah koleksi sertifikat",
        "Meningkatkan jumlah tugas kuliah",
      ],
      correct: 1,
    },
    {
      text: "Menurut Anda, kolaborasi antara mahasiswa, kampus, pemerintah, dan masyarakat penting dilakukan karena...",
      options: [
        "Tidak berpengaruh terhadap kualitas lulusan",
        "Dapat memperluas dampak positif dan mempercepat penyelesaian masalah bersama",
        "Hanya menguntungkan pihak pemerintah",
        "Membebani mahasiswa tanpa manfaat jelas",
      ],
      correct: 1,
    },
    {
      text: "Sikap proaktif dalam mencari solusi atas suatu masalah disebut sebagai bentuk...",
      options: ["Inisiatif", "Apatis", "Pasrah", "Acuh tak acuh"],
      correct: 0,
    },
    {
      text: "Salah satu manfaat mengikuti organisasi kemahasiswaan di kampus adalah...",
      options: [
        "Mengurangi kesempatan belajar",
        "Mengasah soft skill seperti kepemimpinan dan komunikasi",
        "Menghambat penyelesaian studi",
        "Tidak memberikan manfaat apa pun",
      ],
      correct: 1,
    },
    {
      text: "Karakter unggul seorang talenta muda, sesuai tema workshop ini, erat kaitannya dengan semangat...",
      options: ["Individualis dan tertutup", "Kompetitif dan kolaboratif", "Pasif menunggu arahan", "Menghindari tantangan"],
      correct: 1,
    },
  ],
  post: [
    {
      text: "Menurut Adrian (2013), identitas seseorang terdiri dari tiga unsur: tanda, ciri, dan...",
      options: ["Status", "Jatidiri", "Silsilah", "Reputasi"],
      correct: 1,
    },
    {
      text: "Ciri talenta unggul yang disampaikan Dr. Robi Cahyadi Kurniawan dalam workshop mencakup hal-hal berikut, KECUALI...",
      options: [
        "Adaptif terhadap perubahan zaman",
        "Mampu memecahkan masalah nyata",
        "Hanya mengejar nilai akademik tinggi",
        "Berkarakter dan berintegritas",
      ],
      correct: 2,
    },
    {
      text: "Visi Kemdiktisaintek dalam mewujudkan Indonesia Emas 2045 menekankan pendidikan tinggi, sains, dan teknologi yang...",
      options: [
        "Kompetitif, eksklusif, dan berorientasi profit",
        "Inklusif, adaptif, dan berdampak",
        "Konvensional dan seragam",
        "Terpusat dan birokratis",
      ],
      correct: 1,
    },
    {
      text: "Dalam kerangka “Kampus Berdampak” yang disampaikan Prof. Junaidi Khotib, tiga dimensi yang menjadi ukuran dampak sebuah perguruan tinggi adalah...",
      options: [
        "Akademik, riset, dan pengabdian",
        "Sosial, ekonomi, dan lingkungan",
        "Nasional, regional, dan internasional",
        "Dosen, mahasiswa, dan tenaga kependidikan",
      ],
      correct: 1,
    },
    {
      text: "Solusi mengatasi kekurangan soft skill di kalangan Gen Z, seperti disampaikan dalam workshop, adalah dengan...",
      options: [
        "Menambah jam pelajaran teori di kelas",
        "Melatih diri melalui organisasi, komunitas, atau kegiatan kerelawanan",
        "Membatasi penggunaan teknologi digital",
        "Mengurangi keterlibatan dalam kegiatan sosial",
      ],
      correct: 1,
    },
    {
      text: "Menurut teori Multiple Intelligence Howard Gardner yang dipaparkan dalam workshop, ada berapa tipe kecerdasan majemuk?",
      options: ["5", "7", "9", "12"],
      correct: 2,
    },
    {
      text: "Salah satu dari empat transformasi paradigma pendidikan tinggi yang disampaikan Prof. Junaidi Khotib adalah Transformasi Menuju...",
      options: ["Kampus Berdampak", "Kampus Merdeka", "Sekolah Penggerak", "Zonasi Pendidikan"],
      correct: 0,
    },
    {
      text: "Alat ukur relevansi capaian kompetensi mahasiswa yang mencakup Knowledge, Practical Skill, hingga Integrity, seperti disinggung dalam materi kebijakan Kemdiktisaintek, disebut...",
      options: [
        "iCGPA (Integrated Cumulative Grade Point Average)",
        "IPK murni",
        "SKS kumulatif",
        "Nilai UKT",
      ],
      correct: 0,
    },
  ],
};

// ============================================================
// BANK SOAL — Workshop Bina Talenta Riset dan Pengembangan
// Sumber: bank_soal.json (panitia, 19 Sep 2026)
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
      text: "Menurut Adrian (2013), identitas seseorang terdiri dari tiga unsur, yaitu...",
      options: [
        "Nama, alamat, dan pekerjaan",
        "Tanda, ciri, dan jatidiri",
        "Ijazah, KTP, dan paspor",
        "Fisik, mental, dan sosial",
      ],
      correct: 1,
    },
    {
      text: "Berdasarkan data Alvara Research Center (2026), tiga generasi muda (Post Gen Z, Gen Z, dan Milenial) mencakup berapa persen dari total penduduk Indonesia?",
      options: ["Sekitar 40%", "Sekitar 55%", "Sekitar 70%", "Sekitar 85%"],
      correct: 2,
    },
    {
      text: "Salah satu masalah utama yang disebutkan mengenai kekurangan soft skill di kalangan Gen Z adalah...",
      options: [
        "Kelebihan motivasi dan inisiatif",
        "Kurang motivasi dan inisiatif",
        "Terlalu mudah menerima kritik",
        "Terlalu ahli memecahkan masalah",
      ],
      correct: 1,
    },
    {
      text: "Talenta unggul, menurut materi workshop, tidak cukup diukur hanya dari...",
      options: [
        "Tanggung jawab sosial",
        "Kemampuan memecahkan masalah nyata",
        "Prestasi akademik semata (nilai, IP, IPK)",
        "Karakter dan integritas",
      ],
      correct: 2,
    },
    {
      text: "Workshop Bina Talenta Riset dan Pengembangan FISIP Unila dilaksanakan di...",
      options: [
        "Aula Gedung D 3.1 FISIP Unila",
        "Gedung Rektorat Unila",
        "Gedung Serba Guna Unila",
        "Aula Perpustakaan Unila",
      ],
      correct: 0,
    },
    {
      text: "Gerakan nasional yang diluncurkan Kemdiktisaintek untuk mewujudkan pendidikan tinggi yang berkeadilan, relevan, dan berdampak disebut...",
      options: ["Merdeka Belajar", "Diktisaintek Berdampak", "Kampus Mengajar", "Kurikulum Merdeka"],
      correct: 1,
    },
    {
      text: "Salah satu Unit Kegiatan Mahasiswa Fakultas (UKMF) di FISIP Unila adalah...",
      options: ["BEM", "DPM", "Social Political English Club (SPEC)", "HMJ Sosiologi"],
      correct: 2,
    },
    {
      text: "Menurut teori Multiple Intelligence Howard Gardner, kemampuan memahami diri sendiri dan mengontrol emosi termasuk tipe kecerdasan...",
      options: ["Interpersonal", "Intrapersonal", "Naturalistik", "Eksistensial"],
      correct: 1,
    },
  ],
  post: [
    {
      text: "Visi Kementerian Pendidikan Tinggi, Sains, dan Teknologi (Kemdiktisaintek) adalah mewujudkan pendidikan tinggi, sains, dan teknologi yang...",
      options: [
        "Kompetitif, eksklusif, dan berorientasi profit",
        "Inklusif, adaptif, dan berdampak",
        "Konvensional, stabil, dan seragam",
        "Terpusat, birokratis, dan hierarkis",
      ],
      correct: 1,
    },
    {
      text: "Transformasi paradigma yang menekankan pergeseran peran pemimpin institusi dari administrator tradisional menjadi penggerak akademik yang mampu menjalin kemitraan strategis disebut...",
      options: [
        "Transformasi Menuju Kampus Berdampak",
        "Transformasi Leadership 4.0 pada Perguruan Tinggi",
        "Transformasi Menuju Kemandirian Sains dan Teknologi",
        "Transformasi Digital dan Sumber Daya Manusia",
      ],
      correct: 1,
    },
    {
      text: "Dalam kerangka “Kampus Berdampak”, tiga dimensi yang menjadi ukuran dampak sebuah perguruan tinggi adalah...",
      options: [
        "Akademik, riset, dan pengabdian",
        "Sosial, ekonomi, dan lingkungan",
        "Nasional, regional, dan internasional",
        "Dosen, mahasiswa, dan tenaga kependidikan",
      ],
      correct: 1,
    },
    {
      text: "Penguatan pendidikan, sains, dan teknologi, serta digitalisasi kampus yang didukung Kemdiktisaintek termasuk dalam Program Prioritas Nasional...",
      options: [
        "Prioritas 1 (swasembada pangan, energi, dan air)",
        "Prioritas 8 (penguatan pendidikan, sains, dan teknologi, serta digitalisasi)",
        "Prioritas 11 (pelestarian lingkungan hidup)",
        "Prioritas 17 (pelestarian seni budaya)",
      ],
      correct: 1,
    },
    {
      text: "Ciri talenta unggul yang disampaikan dalam workshop mencakup hal-hal berikut, KECUALI...",
      options: [
        "Adaptif terhadap perubahan zaman",
        "Mampu memecahkan masalah nyata",
        "Hanya berorientasi pada nilai akademik tinggi",
        "Berkarakter dan berintegritas",
      ],
      correct: 2,
    },
    {
      text: "Alat ukur relevansi capaian kompetensi mahasiswa yang mencakup Knowledge, Practical Skill, Leadership, Integrity, hingga Communication & Collaboration disebut...",
      options: [
        "iCGPA (Integrated Cumulative Grade Point Average)",
        "IPK murni",
        "SKS kumulatif",
        "Nilai UKT",
      ],
      correct: 0,
    },
    {
      text: "Fungsi identitas menurut Richard Jenkins (dalam Zharfandy, 2016) adalah menerjemahkan kenyataan lingkungan ke dalam persepsi individu, serta...",
      options: [
        "Menghapus batas-batas diri seseorang",
        "Memperpanjang atau mempertahankan keberadaan individu",
        "Mengubah identitas menjadi status sosial",
        "Menyeragamkan pandangan individu terhadap lingkungan",
      ],
      correct: 1,
    },
    {
      text: "Solusi yang ditawarkan untuk mengatasi kekurangan soft skill di kalangan Gen Z, seperti disampaikan dalam workshop, adalah dengan...",
      options: [
        "Menambah jam pelajaran teori di kelas",
        "Melatih diri melalui organisasi, komunitas, atau kegiatan kerelawanan",
        "Membatasi penggunaan teknologi digital",
        "Mengurangi keterlibatan dalam kegiatan sosial",
      ],
      correct: 1,
    },
  ],
};

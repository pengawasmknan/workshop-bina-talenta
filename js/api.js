// ============================================================
// LAPISAN DATA
// Jika CONFIG.API_URL kosong -> mode lokal (localStorage, demo saja,
// tidak terlihat panitia dari perangkat lain).
// Jika CONFIG.API_URL diisi -> hasil dikirim ke Google Apps Script
// yang menulis ke Google Sheets, dan dashboard membacanya dari sana.
// Lihat PANDUAN-SETUP.md untuk cara deploy Apps Script-nya.
// ============================================================

const LOCAL_KEY = "binaTalenta.submissions.v1";
const LOCAL_POSTTEST_KEY = "binaTalenta.postTestEnabled.v1";

function readLocalSubmissions() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

function writeLocalSubmission(entry) {
  try {
    const list = readLocalSubmissions();
    list.push(entry);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  } catch (err) {
    /* penyimpanan lokal tidak tersedia (mode privat dsb) — abaikan */
  }
}

const Api = {
  isRemote() {
    return Boolean(CONFIG.API_URL && CONFIG.API_URL.trim());
  },

  /** Kirim satu hasil pengerjaan. Selalu resolve (tidak pernah throw)
   *  supaya alur UI tidak terhambat kalau koneksi bermasalah — hasil
   *  tetap disimpan sebagai cadangan lokal di perangkat peserta. */
  async submitResult(entry) {
    writeLocalSubmission(entry);
    if (!this.isRemote()) {
      return { ok: true, mode: "local" };
    }
    try {
      const res = await fetch(CONFIG.API_URL, {
        method: "POST",
        // text/plain menghindari CORS preflight yang tidak didukung
        // Apps Script secara default.
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "submit", entry }),
      });
      const json = await res.json();
      return { ok: Boolean(json && json.ok), mode: "remote" };
    } catch (err) {
      return { ok: false, mode: "remote", error: String(err) };
    }
  },

  /** Ambil seluruh hasil untuk dashboard panitia. */
  async fetchResults(password) {
    if (!this.isRemote()) {
      let enabled = true;
      try {
        const raw = localStorage.getItem(LOCAL_POSTTEST_KEY);
        if (raw !== null) enabled = raw === "true";
      } catch (err) {}
      return { ok: true, mode: "local", data: readLocalSubmissions(), postTestEnabled: enabled };
    }
    try {
      const url = `${CONFIG.API_URL}?action=list&password=${encodeURIComponent(password)}`;
      const res = await fetch(url);
      const json = await res.json();
      if (!json || !json.ok) {
        return { ok: false, mode: "remote", error: json && json.error };
      }
      return { ok: true, mode: "remote", data: json.data || [], postTestEnabled: json.postTestEnabled !== false };
    } catch (err) {
      return { ok: false, mode: "remote", error: String(err) };
    }
  },

  /** Dipanggil semua peserta di halaman utama (tanpa kode akses) untuk
   *  tahu apakah Post-Test sudah dibuka panitia. Gagal terhubung ->
   *  dianggap terbuka, supaya gangguan jaringan tidak mengunci semua
   *  peserta dari post-test. */
  async fetchPostTestStatus() {
    if (!this.isRemote()) {
      try {
        const raw = localStorage.getItem(LOCAL_POSTTEST_KEY);
        return { ok: true, enabled: raw === null ? true : raw === "true" };
      } catch (err) {
        return { ok: true, enabled: true };
      }
    }
    try {
      const res = await fetch(`${CONFIG.API_URL}?action=status`);
      const json = await res.json();
      if (!json || !json.ok) return { ok: true, enabled: true };
      return { ok: true, enabled: json.postTestEnabled !== false };
    } catch (err) {
      return { ok: true, enabled: true };
    }
  },

  /** Panitia menyalakan/mematikan akses Post-Test untuk semua peserta. */
  async setPostTestEnabled(password, enabled) {
    if (!this.isRemote()) {
      try {
        localStorage.setItem(LOCAL_POSTTEST_KEY, enabled ? "true" : "false");
      } catch (err) {}
      return { ok: true, enabled };
    }
    try {
      const res = await fetch(CONFIG.API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "setPostTest", password, enabled }),
      });
      const json = await res.json();
      if (!json || !json.ok) return { ok: false, error: json && json.error };
      return { ok: true, enabled: json.postTestEnabled };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  },
};

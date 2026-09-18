// ============================================================
// LAPISAN DATA
// Jika CONFIG.API_URL kosong -> mode lokal (localStorage, demo saja,
// tidak terlihat panitia dari perangkat lain).
// Jika CONFIG.API_URL diisi -> hasil dikirim ke Google Apps Script
// yang menulis ke Google Sheets, dan dashboard membacanya dari sana.
// Lihat PANDUAN-SETUP.md untuk cara deploy Apps Script-nya.
// ============================================================

const LOCAL_KEY = "binaTalenta.submissions.v1";

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
      return { ok: true, mode: "local", data: readLocalSubmissions() };
    }
    try {
      const url = `${CONFIG.API_URL}?action=list&password=${encodeURIComponent(password)}`;
      const res = await fetch(url);
      const json = await res.json();
      if (!json || !json.ok) {
        return { ok: false, mode: "remote", error: json && json.error };
      }
      return { ok: true, mode: "remote", data: json.data || [] };
    } catch (err) {
      return { ok: false, mode: "remote", error: String(err) };
    }
  },
};

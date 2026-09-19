// ============================================================
// Backend Google Apps Script untuk Bina Talenta Test
// ------------------------------------------------------------
// Cara pakai: lihat PANDUAN-SETUP.md di root folder proyek.
// Script ini menulis setiap hasil pre/post-test ke satu Google
// Sheet ("Responses"), menyediakan endpoint baca yang dijaga
// kode akses panitia, dan menyimpan status buka/tutup Pre-Test
// & Post-Test secara terpisah.
// ============================================================

// HARUS SAMA PERSIS dengan CONFIG.PANITIA_PASSWORD di js/config.js
var PANITIA_PASSWORD = "BinaTalenta2026";

var SHEET_NAME = "Responses";
var HEADERS = [
  "Waktu", "Nama", "Email", "NIM", "Prodi", "WhatsApp",
  "Tipe", "Skor", "Total", "Persentase", "DurasiDetik",
];

// Nama properti tersimpan per jenis tes. Kunci "postTestEnabled" sengaja
// dipertahankan (bukan "posttest") supaya status yang sudah di-set
// panitia sebelumnya tidak ke-reset saat kode ini di-update.
var ACCESS_PROP_KEYS = {
  pre: "preTestEnabled",
  post: "postTestEnabled",
};

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  // NIM (kolom D) & WhatsApp (kolom F) dipaksa jadi teks polos supaya
  // angka nol di depan (mis. NIM/nomor HP yang diawali 0) tidak hilang
  // karena dianggap angka oleh Google Sheets.
  sheet.getRange("D:D").setNumberFormat("@");
  sheet.getRange("F:F").setNumberFormat("@");
  return sheet;
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

// Memaksa Sheets menyimpan nilai sebagai teks murni (bukan angka), supaya
// angka nol di depan (NIM, nomor WA) tidak hilang. setNumberFormat("@")
// saja TIDAK cukup untuk nilai yang ditulis lewat appendRow/setValue —
// awalan tanda kutip tunggal ini yang benar-benar memaksanya jadi teks,
// sama seperti trik mengetik manual di Sheets. Tanda kutipnya sendiri
// tidak ikut tersimpan/tampil.
function asText_(value) {
  if (value === null || value === undefined || value === "") return "";
  return "'" + String(value);
}

// Default TERBUKA kalau belum pernah di-set panitia sama sekali.
// `type` adalah "pre" atau "post".
function isTestEnabled_(type) {
  var key = ACCESS_PROP_KEYS[type];
  if (!key) return true;
  var raw = PropertiesService.getScriptProperties().getProperty(key);
  if (raw === null) return true;
  return raw === "true";
}

function accessStatus_() {
  return { pre: isTestEnabled_("pre"), post: isTestEnabled_("post") };
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);

    if (body.action === "submit") {
      if (!body.entry) return jsonOutput_({ ok: false, error: "invalid_payload" });
      var entry = body.entry;
      var sheet = getSheet_();
      sheet.appendRow([
        entry.waktu || new Date().toISOString(),
        entry.nama || "",
        entry.email || "",
        asText_(entry.nim),
        entry.prodi || "",
        asText_(entry.wa),
        entry.tipe || "",
        entry.skor != null ? entry.skor : "",
        entry.total != null ? entry.total : "",
        entry.persentase != null ? entry.persentase : "",
        entry.durasiDetik != null ? entry.durasiDetik : "",
      ]);
      return jsonOutput_({ ok: true });
    }

    if (body.action === "setAccess") {
      if (body.password !== PANITIA_PASSWORD) {
        return jsonOutput_({ ok: false, error: "unauthorized" });
      }
      var key = ACCESS_PROP_KEYS[body.testType];
      if (!key) return jsonOutput_({ ok: false, error: "invalid_test_type" });
      PropertiesService.getScriptProperties().setProperty(key, body.enabled ? "true" : "false");
      var status = accessStatus_();
      return jsonOutput_({ ok: true, pre: status.pre, post: status.post });
    }

    return jsonOutput_({ ok: false, error: "invalid_payload" });
  } catch (err) {
    return jsonOutput_({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  var params = e.parameter || {};

  // Publik, tanpa kode akses — dipanggil dari halaman utama semua peserta
  // untuk tahu apakah Pre-Test/Post-Test sudah dibuka panitia.
  if (params.action === "status") {
    var status = accessStatus_();
    return jsonOutput_({ ok: true, pre: status.pre, post: status.post });
  }

  if (params.action !== "list") {
    return jsonOutput_({ ok: false, error: "unknown_action" });
  }
  if (params.password !== PANITIA_PASSWORD) {
    return jsonOutput_({ ok: false, error: "unauthorized" });
  }

  var sheet = getSheet_();
  var values = sheet.getDataRange().getValues();
  var rows = values.slice(1); // buang header

  var data = rows
    .filter(function (row) {
      return row[1]; // baris dengan nama terisi
    })
    .map(function (row) {
      return {
        waktu: row[0],
        nama: row[1],
        email: row[2],
        nim: row[3],
        prodi: row[4],
        wa: row[5],
        tipe: row[6],
        skor: row[7],
        total: row[8],
        persentase: row[9],
        durasiDetik: row[10],
      };
    });

  var accessNow = accessStatus_();
  return jsonOutput_({ ok: true, data: data, pre: accessNow.pre, post: accessNow.post });
}

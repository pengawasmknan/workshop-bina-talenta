// ============================================================
// Backend Google Apps Script untuk Bina Talenta Test
// ------------------------------------------------------------
// Cara pakai: lihat PANDUAN-SETUP.md di root folder proyek.
// Script ini menulis setiap hasil pre/post-test ke satu Google
// Sheet ("Responses") dan menyediakan endpoint baca yang dijaga
// kode akses panitia.
// ============================================================

// HARUS SAMA PERSIS dengan CONFIG.PANITIA_PASSWORD di js/config.js
var PANITIA_PASSWORD = "BinaTalenta2026";

var SHEET_NAME = "Responses";
var HEADERS = [
  "Waktu", "Nama", "NIM", "Prodi", "WhatsApp",
  "Tipe", "Skor", "Total", "Persentase", "DurasiDetik",
];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    if (body.action !== "submit" || !body.entry) {
      return jsonOutput_({ ok: false, error: "invalid_payload" });
    }
    var entry = body.entry;
    var sheet = getSheet_();
    sheet.appendRow([
      entry.waktu || new Date().toISOString(),
      entry.nama || "",
      entry.nim || "",
      entry.prodi || "",
      entry.wa || "",
      entry.tipe || "",
      entry.skor != null ? entry.skor : "",
      entry.total != null ? entry.total : "",
      entry.persentase != null ? entry.persentase : "",
      entry.durasiDetik != null ? entry.durasiDetik : "",
    ]);
    return jsonOutput_({ ok: true });
  } catch (err) {
    return jsonOutput_({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  var params = e.parameter || {};
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
        nim: row[2],
        prodi: row[3],
        wa: row[4],
        tipe: row[5],
        skor: row[6],
        total: row[7],
        persentase: row[8],
        durasiDetik: row[9],
      };
    });

  return jsonOutput_({ ok: true, data: data });
}

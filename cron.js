const fs = require("fs");
const path = require("path");
const cron = require("node-cron");

let fetchFn = global.fetch;
if (!fetchFn) {
  try { fetchFn = require("node-fetch"); } catch { throw new Error("Install node-fetch: npm i node-fetch@2"); }
}

const OUTDIR = path.join(__dirname, "home", "cron");
if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });

function baseNameNow() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const HH = String(now.getHours()).padStart(2, "0");
  const MM = String(now.getMinutes()).padStart(2, "0");
  return `cron_${dd}${mm}${yyyy}_${HH}.${MM}`;
}

function jsonToCsv(rows, headers) {
  const esc = (v) => {
    const s = v == null ? "" : String(v);
    const needWrap = /[",\r\n]/.test(s);
    const body = s.replace(/"/g, '""');
    return needWrap ? `"${body}"` : body;
  };
  const headerLine = headers.map(esc).join(",");
  const lines = rows.map(r => headers.map(h => esc(r[h])).join(","));
  return "\uFEFF" + [headerLine, ...lines].join("\r\n");
}

async function saveData() {
  const url = "http://localhost:3000/api/get_all_submission_data";
  const base = path.join(OUTDIR, baseNameNow());
  const jsonPath = `${base}.json`;
  const csvPath  = `${base}.csv`;

  try {
    const res = await fetchFn(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const payload = await res.json();

    fs.writeFileSync(jsonPath, JSON.stringify(payload, null, 2));

    const rows = Array.isArray(payload?.data) ? payload.data : [];
    const headers = ["id", "name", "email", "message", "createdAt"];
    const csv = jsonToCsv(rows, headers);
    fs.writeFileSync(csvPath, csv);

    console.log("Saved:", path.basename(jsonPath), "and", path.basename(csvPath));
  } catch (e) {
    console.error("Save error:", e.message);
  }
}

function cleanupOld() {
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  for (const name of fs.readdirSync(OUTDIR)) {
    if (!/^cron_\d{8}_\d{2}\.\d{2}\.(json|csv)$/.test(name)) continue;
    const fp = path.join(OUTDIR, name);
    try {
      const age = now - fs.statSync(fp).mtimeMs;
      if (age > THIRTY_DAYS) {
        fs.unlinkSync(fp);
        console.log("Deleted:", name);
      }
    } catch {}
  }
}

cron.schedule("0 8,12,15 * * *", saveData, { timezone: "Asia/Jakarta" });
cron.schedule("30 2 * * *", cleanupOld, { timezone: "Asia/Jakarta" });

saveData();
// Fails (exit 1) while a placeholder is still in the page. Run before every push or merge: node scripts/check-no-placeholder.mjs
import fs from "node:fs";
const bad = ["PLACEHOLDER_YOUTUBE_ID"];
let failed = false;
for (const f of ["index.html", "site.js", "styles.css", "sitemap.xml"]) {
  const t = fs.readFileSync(f, "utf8");
  for (const b of bad) if (t.includes(b)) { console.error("FAIL: " + f + " still contains " + b); failed = true; }
}
if (!failed) console.log("ok: no placeholders");
process.exit(failed ? 1 : 0);

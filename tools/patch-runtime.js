// Parche para que el runtime de turbopack acepte src relativos ("./_next/...")
// derivando la misma clave que las refs absolutas del payload ("/_next/...").
const fs = require("fs");
const file = process.argv[2];
let s = fs.readFileSync(file, "utf8");

const needle =
  'e.getAttribute("src")).replace(/[?#].*$/,""));return r.startsWith(t)?r.slice(t.length):r';
const repl =
  'e.getAttribute("src")).replace(/[?#].*$/,"").replace(/^\\.\\/?/,"/"));return r.startsWith(t)?r.slice(t.length):r';

const count = s.split(needle).length - 1;
if (count === 0) {
  console.error("NEEDLE NOT FOUND en " + file);
  process.exit(1);
}
fs.writeFileSync(file, s.split(needle).join(repl));
const patched = fs.readFileSync(file, "utf8");
console.log(
  "PATCHED",
  count,
  "ocurrencia(s) · verificación:",
  patched.includes('replace(/^\\.\\/?/,"/")') ? "OK" : "FAIL"
);

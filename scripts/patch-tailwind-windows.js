/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Patches @tailwindcss/postcss to skip the Windows "nul" device path.
 *
 * On Windows, the Tailwind oxide scanner emits "nul" as a sentinel base path
 * for empty glob entries. @tailwindcss/postcss then calls path.resolve("nul")
 * which resolves to C:\project\nul — the Windows null device. Turbopack tries
 * to read that path and crashes with "Incorrect function (os error 1)".
 *
 * The fix: add a guard that skips any scanner.globs entry whose base is "nul"
 * or empty before pushing it to PostCSS result.messages.
 */

const fs = require("fs");
const path = require("path");

const file = path.join(
  __dirname,
  "..",
  "node_modules",
  "@tailwindcss",
  "postcss",
  "dist",
  "index.js"
);

if (!fs.existsSync(file)) {
  console.log("patch-tailwind-windows: @tailwindcss/postcss not found, skipping.");
  process.exit(0);
}

let src = fs.readFileSync(file, "utf8");

const TARGET =
  "for(let{base:w,pattern:R}of c.scanner.globs)R===\"*\"&&r===w";
const PATCHED =
  "for(let{base:w,pattern:R}of c.scanner.globs)!w||w===\"nul\"||R===\"*\"&&r===w";

if (src.includes(PATCHED)) {
  console.log("patch-tailwind-windows: already applied, skipping.");
  process.exit(0);
}

if (!src.includes(TARGET)) {
  console.warn(
    "patch-tailwind-windows: target string not found in @tailwindcss/postcss " +
      "(version may have changed). Patch not applied."
  );
  process.exit(0);
}

src = src.replace(TARGET, PATCHED);
fs.writeFileSync(file, src, "utf8");
console.log(
  "patch-tailwind-windows: patched @tailwindcss/postcss to skip Windows nul device path."
);

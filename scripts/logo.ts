// Writes the static logo files from src/lib/logo.ts. Run: node scripts/logo.ts
import { writeFileSync } from "node:fs";
import { lockupSvg, markSvg } from "../src/lib/logo.ts";

writeFileSync("src/app/icon.svg", markSvg({ tile: true }) + "\n");
writeFileSync("public/logo.svg", markSvg({ size: 128 }) + "\n");
writeFileSync("public/logo-light.svg", lockupSvg("light") + "\n");
writeFileSync("public/logo-dark.svg", lockupSvg("dark") + "\n");
console.log("wrote icon.svg, logo.svg, logo-light.svg, logo-dark.svg");

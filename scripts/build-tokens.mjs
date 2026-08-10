#!/usr/bin/env node
import { readFileSync, writeFileSync, copyFileSync } from "fs";
import { transform } from "lightningcss";

const src = "src/theme/tokens.css";
const dist = "dist/tokens.css";
const distMin = "dist/tokens.min.css";

copyFileSync(src, dist);

const srcBuf = readFileSync(src);
const { code } = transform({ filename: "tokens.css", code: srcBuf, minify: true });
writeFileSync(distMin, code);

const saved = ((1 - code.length / srcBuf.length) * 100).toFixed(1);
console.log(`tokens.min.css  ${code.length} bytes (${saved}% smaller)`);

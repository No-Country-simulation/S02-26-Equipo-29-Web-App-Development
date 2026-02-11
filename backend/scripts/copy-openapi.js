/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`[copy-openapi] source not found: ${src}`);
    return;
  }

  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

const cwd = process.cwd();
const srcOpenapi = path.join(cwd, 'openapi');
const destOpenapi = path.join(cwd, 'dist', 'openapi');

copyDir(srcOpenapi, destOpenapi);
console.log(`[copy-openapi] copied ${srcOpenapi} -> ${destOpenapi}`);

/**
 * Copies custom IcoMoon font files from assets/ to rnvi-fonts/icomoon/
 * so that @react-native-vector-icons/icomoon can find them during native builds.
 *
 * Run automatically via postinstall.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ICONS_DIR = path.join(ROOT, 'src', 'icons');
const ASSETS_DIR = path.join(ROOT, 'assets');
const DEST_DIR = path.join(ROOT, 'rnvi-fonts', 'icomoon');

// Parse icon source files to find all .ttf filenames used with createIconSetFromIcoMoon
const fontFiles = new Set();
for (const file of fs.readdirSync(ICONS_DIR)) {
  if (!file.endsWith('.ts') && !file.endsWith('.tsx')) continue;
  const content = fs.readFileSync(path.join(ICONS_DIR, file), 'utf8');
  const matches = content.matchAll(/createIconSetFromIcoMoon\([^,]+,\s*'[^']+',\s*'([^']+)'\)/g);
  for (const m of matches) {
    fontFiles.add(m[1]);
  }
}

if (fontFiles.size === 0) {
  console.log('[copy-rnvi-fonts] No IcoMoon fonts found, skipping.');
  process.exit(0);
}

// Also copy into the RNVI package's fonts/ dir so iOS builds find them
// after yarn reinstalls (pod install copies from rnvi-fonts/ but yarn wipes the package dir)
const POD_FONTS_DIR = path.join(ROOT, 'node_modules', '@react-native-vector-icons', 'icomoon', 'fonts');

const dirs = [DEST_DIR, POD_FONTS_DIR];
for (const dir of dirs) {
  fs.mkdirSync(dir, { recursive: true });
}

let copied = 0;
for (const font of fontFiles) {
  const src = path.join(ASSETS_DIR, font);
  if (fs.existsSync(src)) {
    for (const dir of dirs) {
      fs.copyFileSync(src, path.join(dir, font));
    }
    copied++;
  } else {
    console.warn(`[copy-rnvi-fonts] WARNING: ${src} not found`);
  }
}

console.log(`[copy-rnvi-fonts] Copied ${copied} font files to rnvi-fonts/icomoon/ and icomoon/fonts/`);

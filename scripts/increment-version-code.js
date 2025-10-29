#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../app.config.js');
const configContent = fs.readFileSync(configPath, 'utf8');

// Find the versionCode line and increment it
const versionCodeRegex = /(versionCode:\s*)(\d+)/;
const match = configContent.match(versionCodeRegex);

if (!match) {
  console.error('Could not find versionCode in app.config.js');
  process.exit(1);
}

const currentVersion = parseInt(match[2], 10);
const newVersion = currentVersion + 1;

const newContent = configContent.replace(versionCodeRegex, `$1${newVersion}`);

fs.writeFileSync(configPath, newContent, 'utf8');

console.log(`✓ Incremented Android versionCode: ${currentVersion} → ${newVersion}`);

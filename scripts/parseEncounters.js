'use strict';

const fs = require('fs');
const path = require('path');

const csvPath = path.resolve(__dirname, '../local/Master Sheet - Encounters.csv');
const outPath = path.resolve(__dirname, '../src/js/data/encounters.js');

// CSV row parser that handles quoted fields
function parseCSVRow(row) {
  const cells = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      cells.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  cells.push(current);
  return cells;
}

const raw = fs.readFileSync(csvPath, 'utf8');
const lines = raw.split('\n').map(l => l.replace(/\r$/, ''));

// lines[1] = route header row:
//   col 0 = "Repel Manip?"
//   col 1 = "Starter" (spans cols 1-3: Level, Pokemon, checked — no %)
//   col 4 = "Littleroot Town", cols 4-7: %, Level, Pokemon, checked
//   col 8 = next route, etc.
const headerRow = parseCSVRow(lines[1]);

const routes = [{ name: 'Starter', colStart: 1, hasPercent: false }];
let col = 4;
while (col < headerRow.length) {
  const name = headerRow[col].trim();
  if (name) {
    routes.push({ name, colStart: col, hasPercent: true });
  }
  col += 4;
}

// Category label mapping.
// The Fish section uses a single space " " as col 0 — a CSV artifact from
// the merged cell in the source spreadsheet.
const CATEGORY_MAP = {
  'Land':  'Land',
  ' ':     'Fish',
  'Surf':  'Surf',
  'Rocks': 'Rocks',
  'Other': 'Other',
};

const encounters = {};
for (const r of routes) {
  encounters[r.name] = {};
}

let currentCategory = null;

// Data rows start at index 4:
//   lines[0] = "t,..." (meta row)
//   lines[1] = route headers
//   lines[2] = col type headers (Level, Pokemon, %, ...)
//   lines[3] = "Encountered,FALSE,..." (checkbox row)
for (let i = 4; i < lines.length; i++) {
  if (!lines[i].trim()) continue;

  const cols = parseCSVRow(lines[i]);
  const col0 = cols[0];

  if (col0 in CATEGORY_MAP) {
    currentCategory = CATEGORY_MAP[col0];
  }
  // else: empty or unknown → carry forward currentCategory

  if (!currentCategory) continue;

  for (const route of routes) {
    let pokemon, level, percent;

    if (route.hasPercent) {
      // 4-col block: %, Level, Pokemon, checked
      percent  = (cols[route.colStart]     || '').trim();
      level    = (cols[route.colStart + 1] || '').trim();
      pokemon  = (cols[route.colStart + 2] || '').trim();
    } else {
      // Starter 3-col block: Level, Pokemon, checked (no %)
      level   = (cols[route.colStart]     || '').trim();
      pokemon = (cols[route.colStart + 1] || '').trim();
    }

    if (!pokemon) continue;

    // For Starter, filter out config-note rows where level is not a valid number/range
    if (!route.hasPercent && !/^\d/.test(level)) continue;

    if (!encounters[route.name][currentCategory]) {
      encounters[route.name][currentCategory] = [];
    }

    const entry = { level, pokemon };
    if (route.hasPercent) entry.percent = percent;
    encounters[route.name][currentCategory].push(entry);
  }
}

const routeNames = routes.map(r => r.name);
const output = `window.ENCOUNTER_DATA = ${JSON.stringify({ routes: routeNames, encounters }, null, 2)};\n`;

fs.writeFileSync(outPath, output);

console.log(`✓ Written ${outPath}`);
console.log(`  Routes: ${routeNames.length}`);

// Quick sanity check: Littleroot Town should have Fish and Surf
const lt = encounters['Littleroot Town'] || {};
console.log(`  Littleroot Town Fish:`, (lt['Fish'] || []).map(e => e.pokemon).join(', '));
console.log(`  Littleroot Town Surf:`, (lt['Surf'] || []).map(e => e.pokemon).join(', '));

'use strict';

const fs = require('fs');
const path = require('path');

const csvPath = path.resolve(__dirname, '../local/Master Sheet - Trainer Lookup.csv');
const outPath = path.resolve(__dirname, '../src/js/data/trainers.js');

// CSV row parser that handles quoted fields (same approach as parseEncounters.js)
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

// Parse a single pokemon cell: "Name,Level ,Item,Ability,Nature,Move1,Move2,Move3,Move4"
// The inner values are comma-separated within the quoted outer cell.
// Level often has a trailing space (e.g., "5 ").
function parsePokemonCell(cell) {
  const trimmed = cell.trim();
  if (!trimmed) return null;
  // The cell is already unquoted by parseCSVRow, so just split on comma
  const parts = trimmed.split(',');
  const name = (parts[0] || '').trim();
  if (!name) return null;
  const level = (parts[1] || '').trim();
  const item = (parts[2] || '').trim();
  const ability = (parts[3] || '').trim();
  const nature = (parts[4] || '').trim();
  const moves = [];
  for (let i = 5; i <= 8; i++) {
    const m = (parts[i] || '').trim();
    if (m) moves.push(m);
  }
  return { name, level, item, ability, nature, moves };
}

// Extract tags like [Boss], [Optional], [Double] from trainer name
function parseTrainerName(rawName) {
  let name = rawName.trim();
  const isBoss = /\[Boss\]/i.test(name);
  const isOptional = /\[Optional\]/i.test(name);
  const isDouble = /\[Double\]/i.test(name);
  // Clean up: remove tags and extra whitespace
  name = name.replace(/\s*\[(Boss|Optional|Double)\]\s*/gi, ' ').trim();
  return { name, isBoss, isOptional, isDouble };
}

const raw = fs.readFileSync(csvPath, 'utf8');
const lines = raw.split('\n').map(l => l.replace(/\r$/, ''));

// Line 0 is the header. Data starts at line 1.
// Columns: 0=SplitNumber, 1=Split, 2=Location, 3=Trainer, 4=TrainerSprite, 5-10=Pokémon1-6

const splitsSet = new Map();       // splitNumber -> splitName  (preserve order)
const trainersByRoute = {};        // location -> [ trainer, ... ]
const routeToSplit = {};           // location -> splitNumber (e.g., "1 - Brawly")

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;

  const cols = parseCSVRow(line);
  const splitNumber = (cols[0] || '').trim();
  const splitName = (cols[1] || '').trim();
  const location = (cols[2] || '').trim();
  const trainerRaw = (cols[3] || '').trim();
  // cols[4] = TrainerSprite (skipping for now)
  if (!splitNumber || !location || !trainerRaw) continue;

  // Record split
  if (!splitsSet.has(splitNumber)) {
    splitsSet.set(splitNumber, splitName);
  }

  // Parse trainer name & tags
  const { name, isBoss, isOptional, isDouble } = parseTrainerName(trainerRaw);

  // Parse pokemon (columns 5-10)
  const pokemon = [];
  for (let p = 5; p <= 10; p++) {
    const cell = cols[p] || '';
    const poke = parsePokemonCell(cell);
    if (poke) pokemon.push(poke);
  }

  const trainer = {
    split: splitNumber,
    name: name,
    isBoss: isBoss,
    isOptional: isOptional,
    isDouble: isDouble,
    pokemon: pokemon,
  };

  // Group by location
  if (!trainersByRoute[location]) {
    trainersByRoute[location] = [];
  }
  trainersByRoute[location].push(trainer);

  // Map route to split (first seen split wins — routes can appear in multiple splits)
  if (!routeToSplit[location]) {
    routeToSplit[location] = splitNumber;
  }
}

// Build ordered splits array
const splits = [];
for (const [num] of splitsSet) {
  splits.push(num);
}
// Sort numerically
splits.sort((a, b) => {
  const na = parseInt(a);
  const nb = parseInt(b);
  return na - nb;
});

const output = {
  splits: splits,
  trainersByRoute: trainersByRoute,
  routeToSplit: routeToSplit,
};

const js = 'window.TRAINER_DATA = ' + JSON.stringify(output, null, 2) + ';\n';
fs.writeFileSync(outPath, js, 'utf8');

// Summary
const routeCount = Object.keys(trainersByRoute).length;
let trainerCount = 0;
for (const r of Object.values(trainersByRoute)) trainerCount += r.length;
console.log(`Wrote ${outPath}`);
console.log(`  ${splits.length} splits, ${routeCount} routes, ${trainerCount} trainers`);

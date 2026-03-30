'use strict';

const fs = require('fs');
const path = require('path');

const csvPath = path.resolve(__dirname, '../local/Master Sheet - Items.csv');
const outPath = path.resolve(__dirname, '../src/js/data/items.js');

// CSV row parser matching the approach used in parseTrainers.js / parseEncounters.js
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

// ── Column map (verified by inspecting actual data rows) ─────────────────
// Heart Scales   : col 0=location, 1=description, 2=collected, 3=used, 4=used_on
// Rare Candies   : col 5=location, 6=description, 7=collected, 8=used
// TMs/HMs        : col 10=name,    11=location,   12=collected, 13=used
// Passive Items  : col 14=name,    15=location,   16=collected, 17=lost
// Consumable     : col 18=name,    19=location,   20=collected, 21=used
// Mega Stones    : col 22=name,    23=location,   24=collected
// Evolution Items: col 25=name,    26=location,   27=available
// Berries        : col 28=name,    29=description, 30=yield
// Move Tutors    : col 31=name,    32=location,   33=available

const CATEGORIES = [
  {
    name: 'Heart Scales',
    colName: null,     // name is constant ("Heart Scale")
    colLocation: 0,
    colDesc: 1,
    colCollected: 2,
    colUsed: 3,
    colUsedOn: 4,
    hasUsed: true,
    hasUsedOn: true,
  },
  {
    name: 'Rare Candies',
    colName: null,
    colLocation: 5,
    colDesc: 6,
    colCollected: 7,
    colUsed: 8,
    colUsedOn: null,
    hasUsed: true,
    hasUsedOn: false,
  },
  {
    name: 'TMs',
    colName: 10,
    colLocation: 11,
    colDesc: null,
    colCollected: 12,
    colUsed: 13,
    colUsedOn: null,
    hasUsed: true,
    hasUsedOn: false,
  },
  {
    name: 'Passive Held Items',
    colName: 14,
    colLocation: 15,
    colDesc: null,
    colCollected: 16,
    colUsed: null,
    colLost: 17,
    colUsedOn: null,
    hasUsed: false,
    hasLost: true,
    hasUsedOn: false,
  },
  {
    name: 'Consumable Held Items',
    colName: 18,
    colLocation: 19,
    colDesc: null,
    colCollected: 20,
    colUsed: 21,
    colUsedOn: null,
    hasUsed: true,
    hasUsedOn: false,
  },
  {
    name: 'Mega Stones',
    colName: 22,
    colLocation: 23,
    colDesc: null,
    colCollected: 24,
    colUsed: null,
    colUsedOn: null,
    hasUsed: false,
    hasUsedOn: false,
  },
  {
    name: 'Evolution Items',
    colName: 25,
    colLocation: 26,
    colDesc: null,
    colCollected: 27,
    colUsed: null,
    colUsedOn: null,
    hasUsed: false,
    hasUsedOn: false,
  },
  {
    name: 'Berries',
    colName: 28,
    colLocation: null,
    colDesc: 29,
    colYield: 30,
    colCollected: null,
    colUsed: null,
    colUsedOn: null,
    hasUsed: false,
    hasUsedOn: false,
  },
  {
    name: 'Move Tutors',
    colName: 31,
    colLocation: 32,
    colDesc: null,
    colCollected: 33,
    colUsed: null,
    colUsedOn: null,
    hasUsed: false,
    hasUsedOn: false,
  },
];

// ── Known location names for route-extraction regex ─────────────────────────
// These are the canonical route names from the game used as keys in ENCOUNTER_DATA.
// Listed longest-first so longer matches always win over shorter prefixes.
const KNOWN_LOCATIONS = [
  // Multi-word locations (longest first)
  'Abandoned Ship B1F Rooms', 'Abandoned Ship',
  'Safari Zone (Southwest)', 'Safari Zone (Northwest)', 'Safari Zone (South)', 'Safari Zone (North)',
  'New Mauville (Outside)', 'New Mauville (Inside)', 'New Mauville',
  'Seafloor Cavern 6-7', 'Seafloor Cavern 1-5', 'Seafloor Cavern 8', 'Seafloor Cavern E',
  'Magma Hideout 6-7', 'Magma Hideout 2-4', 'Magma Hideout 5', 'Magma Hideout 1',
  'Meteor Falls B1F1', 'Meteor Falls B1F2', 'Meteor Falls 1F1', 'Meteor Falls 1F2', 'Meteor Falls',
  'Shoal Cave (Entrance/Inner)', 'Shoal Cave (Other)', 'Shoal Cave (Ice)', 'Shoal Cave',
  'Mt. Pyre 1F-2F', 'Mt. Pyre 3F-4F', 'Mt. Pyre 5F-6F', 'Mt. Pyre (Exterior)', 'Mt. Pyre (Summit)', 'Mt. Pyre',
  'Mirage Tower 1F', 'Mirage Tower 2F', 'Mirage Tower 3F', 'Mirage Tower 4F',
  'Sky Pillar 1F/3F', 'Sky Pillar 5F',
  'Victory Road 1F', 'Victory Road B1F', 'Victory Road B2F', 'Victory Road',
  'Granite Cave B1F', 'Granite Cave B2F', 'Granite Cave 1F', 'Granite Cave',
  'Aqua Hideout B1F', 'Aqua Hideout',
  'Cave of Origin',
  'Petalburg Woods', 'Petalburg City',
  'Littleroot Town',
  'Rustboro City',
  'Fallarbor Town',
  'Verdanturf Town',
  'Ever Grande City',
  'Mossdeep City',
  'Sootopolis City',
  'Lilycove City',
  'Lavaridge Town',
  'Fortree City',
  'Mauville City',
  'Dewford Town',
  'Slateport City',
  'Pacifidlog Town',
  'Oldale Town',
  'Fiery Path',
  'Jagged Pass',
  'Mt. Chimney',
  'Desert Underpass',
  'Rusturf Tunnel',
  'Altering Cave',
  'Scorched Slab',
  'Steven\'s Room',
  // Routes — longest first to prevent "Route 1" matching "Route 115"
  'Route 134', 'Route 133', 'Route 132', 'Route 131', 'Route 130',
  'Route 129', 'Route 128', 'Route 127', 'Route 126', 'Route 125',
  'Route 124', 'Route 123', 'Route 122', 'Route 121', 'Route 120',
  'Route 119', 'Route 118', 'Route 117', 'Route 116', 'Route 115',
  'Route 114', 'Route 113', 'Route 112', 'Route 111', 'Route 110',
  'Route 109', 'Route 108', 'Route 107', 'Route 106', 'Route 105',
  'Route 104', 'Route 103', 'Route 102', 'Route 101',
];

// Escape special regex characters in a location name
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Build a combined regex that matches any known location (longest-first ordering ensures
// greedy matches win).  Returns an array of matched location names from a given string.
function extractRoutes(text) {
  if (!text) return [];
  const found = [];
  const remaining = text; // we scan the whole text each time (names don't overlap)
  for (const loc of KNOWN_LOCATIONS) {
    const re = new RegExp('(?:^|[\\s,.(])' + escapeRegex(loc) + '(?=$|[\\s,.(])', 'i');
    if (re.test(remaining) && found.indexOf(loc) === -1) {
      found.push(loc);
    }
  }
  return found;
}

// ── Parse CSV ────────────────────────────────────────────────────────────────

const raw = fs.readFileSync(csvPath, 'utf8');
// lines[0] = header row  (category labels)
// lines[1] = totals row  ("0 / 30, 0 / 30, ...")
// lines[2+] = data rows
const lines = raw.split('\n').map(l => l.replace(/\r$/, ''));

const categories = CATEGORIES.map(cat => ({ name: cat.name, items: [] }));
const itemsByRoute = {};   // location name -> array of { category, key, name, location, description, yield }

for (let i = 2; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;

  const cols = parseCSVRow(line);
  const get = (idx) => (idx != null && cols[idx] != null ? cols[idx].trim() : '');

  CATEGORIES.forEach((cat, catIndex) => {
    // Determine the item name and location for this category in this row
    let itemName, location, description, yieldRange;

    if (cat.colName != null) {
      // Categories with explicit item names (TMs, held items, stones, etc.)
      itemName = get(cat.colName);
    } else {
      // Heart Scales & Rare Candies: name is always the category item name
      itemName = cat.name === 'Heart Scales' ? 'Heart Scale' : 'Rare Candy';
    }

    if (cat.colLocation != null) {
      location = get(cat.colLocation);
    } else {
      location = '';
    }

    if (cat.colDesc != null) {
      description = get(cat.colDesc);
    } else {
      description = '';
    }

    if (cat.colYield != null) {
      yieldRange = get(cat.colYield);
    }

    // Skip empty rows for this category (nothing in the name/location column)
    const primaryField = cat.colName != null ? itemName : location;
    if (!primaryField) return;

    // Skip the "FALSE" sentinel rows that appear in some categories (totals or stray rows)
    if (primaryField === 'FALSE' || primaryField === 'TRUE') return;

    // Build the item object
    const item = { name: itemName, location: location, description: description };
    if (yieldRange) item.yield = yieldRange;

    // For Heart Scales and Rare Candies the "location" field (col 0/6) is already
    // the route name. For everything else, extract routes from the location text.
    let routes;
    if (cat.name === 'Heart Scales' || cat.name === 'Rare Candies') {
      // The location column IS the route; normalise it just in case
      routes = location ? [location] : [];
    } else if (cat.name === 'Berries') {
      // Berries live at specific routes mentioned in their description
      routes = extractRoutes(description);
    } else {
      routes = extractRoutes(location);
    }
    item.routes = routes;

    // Composite key for this item (guarantees uniqueness in localStorage tracking)
    // Heart Scales share the name so include the location; everything else uses the name.
    const key = (cat.name === 'Heart Scales' || cat.name === 'Rare Candies')
      ? cat.name + '|' + location
      : cat.name + '|' + itemName;
    item.key = key;

    categories[catIndex].items.push(item);

    // Populate reverse look-up
    for (const route of routes) {
      if (!itemsByRoute[route]) itemsByRoute[route] = [];
      itemsByRoute[route].push({
        category: cat.name,
        key: key,
        name: itemName,
        location: location,
        description: description,
      });
    }
  });
}

// ── Output ────────────────────────────────────────────────────────────────────

const output = {
  categories: categories,
  itemsByRoute: itemsByRoute,
};

const js = 'window.ITEM_DATA = ' + JSON.stringify(output, null, 2) + ';\n';
fs.writeFileSync(outPath, js, 'utf8');

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`Wrote ${outPath}`);
for (const cat of categories) {
  console.log(`  ${cat.name}: ${cat.items.length} items`);
}
const routeCount = Object.keys(itemsByRoute).length;
let totalRouteItems = 0;
for (const arr of Object.values(itemsByRoute)) totalRouteItems += arr.length;
console.log(`  itemsByRoute: ${routeCount} locations, ${totalRouteItems} total entries`);

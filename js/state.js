// ---- Application State ----

import { loadScriptWithFallbacks } from './loader.js';

export const CATS = ['op', 'oc', 'tr', 'co', 'te'];
export const weights = { op: 50, oc: 50, tr: 50, co: 50, te: 50 };

export const state = {
  estimateMissing: true,
  selectedCountry: null
};

// Data arrays and lookup maps (populated by loadData)
export let COUNTRY_DATA = [];
export const dataByA3 = {};
export const dataByA2 = {};

// Column mapping: Excel header → object key
const NUM_FIELDS = ['op', 'oc', 'tr', 'co', 'te', 'td'];

function parseRow(row) {
  const entry = {
    a2:  row.a2  || null,
    a3:  row.a3  || null,
    num: row.num != null ? String(row.num) : null,
    en:  row.en  || null,
    de:  row.de  || null,
    gr:  row.gr  || null
  };
  for (const f of NUM_FIELDS) {
    const val = row[f];
    entry[f] = (val != null && val !== '') ? Number(val) : null;
  }
  return entry;
}

export async function loadData() {
  // Load SheetJS (xlsx) library from CDN
  await loadScriptWithFallbacks(
    [
      'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
      'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
      'https://unpkg.com/xlsx@0.18.5/dist/xlsx.full.min.js'
    ],
    () => typeof window.XLSX !== 'undefined',
    'xlsx'
  );

  // Fetch the Excel file
  const response = await fetch('data/data.xlsx');
  if (!response.ok) throw new Error(`Failed to load data.xlsx: HTTP ${response.status}`);
  const buffer = await response.arrayBuffer();

  // Parse workbook — read first sheet
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  // Transform rows into country objects
  COUNTRY_DATA = rows.map(parseRow);

  // Build lookup maps
  for (const key in dataByA3) delete dataByA3[key];
  for (const key in dataByA2) delete dataByA2[key];
  COUNTRY_DATA.forEach(c => {
    if (c.a3) dataByA3[c.a3] = c;
    if (c.a2) dataByA2[c.a2] = c;
  });
}

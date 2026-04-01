// ---- Application State ----

import { loadScriptWithFallbacks } from './loader.js';

export const CATS = ['op', 'oc', 'tr', 'co', 'te'];
export const weights = { op: 50, oc: 50, tr: 50, co: 50, te: 50 };

export const state = {
  estimateMissing: true,
  selectedCountry: null
};

// Data arrays and lookup maps (populated by loadData)
export const COUNTRY_DATA = [];
export const dataByA3 = {};
export const dataByA2 = {};

// Map Excel column headers to internal keys.
// Headers may contain extra whitespace, so we normalize before matching.
const COLUMN_MAP = {
  'alpha2':                       'a2',
  'alpha3':                       'a3',
  'numeric':                      'num',
  'shortname_en':                 'en',
  'shortname_de':                 'de',
  'totaloperationalrisk':         'op',
  'totalownershipcontrolrisk':    'oc',
  'totaltransferrisk':            'tr',
  'totalcorruptionrisk':          'co',
  'totalterrorismrisk':           'te',
  'totalcommercialrisk':          'gr',
  'totalpoliticalrisk(5yeartrend)': 'td'
};

const NUM_FIELDS = new Set(['op', 'oc', 'tr', 'co', 'te', 'td']);

function normalizeHeader(h) {
  return String(h).replace(/\s+/g, '').toLowerCase();
}

function buildHeaderMap(rawHeaders) {
  const map = {};
  for (const raw of rawHeaders) {
    const norm = normalizeHeader(raw);
    if (COLUMN_MAP[norm]) {
      map[raw] = COLUMN_MAP[norm];
    }
  }
  return map;
}

function parseRow(row, headerMap) {
  const entry = { a2: null, a3: null, num: null, en: null, de: null, op: null, oc: null, tr: null, co: null, te: null, gr: null, td: null };
  for (const [rawCol, key] of Object.entries(headerMap)) {
    let val = row[rawCol];
    if (val == null || val === '' || val === '#') {
      entry[key] = null;
      continue;
    }
    if (typeof val === 'string') val = val.trim();
    if (key === 'num') {
      entry[key] = String(val);
    } else if (NUM_FIELDS.has(key)) {
      entry[key] = Number(val);
      if (isNaN(entry[key])) entry[key] = null;
    } else {
      entry[key] = val;
    }
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
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet);

  // Build column mapping from actual Excel headers
  const rawHeaders = rows.length > 0 ? Object.keys(rows[0]) : [];
  const headerMap = buildHeaderMap(rawHeaders);

  // Transform rows into country objects
  COUNTRY_DATA.length = 0;
  rows.forEach(row => {
    const entry = parseRow(row, headerMap);
    if (entry.a3) COUNTRY_DATA.push(entry);
  });

  // Build lookup maps
  for (const key in dataByA3) delete dataByA3[key];
  for (const key in dataByA2) delete dataByA2[key];
  COUNTRY_DATA.forEach(c => {
    if (c.a3) dataByA3[c.a3] = c;
    if (c.a2) dataByA2[c.a2] = c;
  });
}

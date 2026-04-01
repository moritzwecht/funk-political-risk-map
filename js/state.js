// ---- Application State ----

import COUNTRY_DATA from '../data/countries.js';

export const CATS = ['op', 'oc', 'tr', 'co', 'te'];
export const weights = { op: 50, oc: 50, tr: 50, co: 50, te: 50 };

export const state = {
  estimateMissing: true,
  selectedCountry: null
};

// Build lookup maps
export const dataByA3 = {};
export const dataByA2 = {};
COUNTRY_DATA.forEach(c => {
  dataByA3[c.a3] = c;
  dataByA2[c.a2] = c;
});

export { COUNTRY_DATA };

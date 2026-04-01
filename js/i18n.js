// ---- Internationalization ----

const I18N = {
  en: {
    title: 'Political Risk Map 2026',
    subtitle: 'Interactive Risk Assessment',
    search: 'Search',
    searchPlaceholder: 'Search country...',
    riskWeighting: 'Risk Weighting',
    reset: 'Reset Weights',
    options: 'Options',
    missingDataLabel: 'Estimate score when data is missing',
    legend: 'Legend',
    lowRisk: 'Low Risk',
    highRisk: 'High Risk',
    noData: 'No data',
    grade: 'Grade',
    trend: 'Trend',
    trendUp: 'Increasing ↑',
    trendStable: 'Stable →',
    weightedScore: 'Weighted Score',
    commercialRisk: 'Commercial Risk',
    gradeDescriptions: {
      A: 'Very Low Risk', B: 'Low Risk', C: 'Moderate-Low Risk',
      D: 'Moderate Risk', E: 'Moderate-High Risk', F: 'High Risk', G: 'Very High Risk'
    },
    categories: {
      op: 'Operational Risk',
      oc: 'Ownership & Control Risk',
      tr: 'Transfer Risk',
      co: 'Corruption Risk',
      te: 'Terrorism Risk'
    }
  },
  de: {
    title: 'Political Risk Map 2026',
    subtitle: 'Interaktive Risikobewertung',
    search: 'Suche',
    searchPlaceholder: 'Land suchen...',
    riskWeighting: 'Risikogewichtung',
    reset: 'Gewichtung zurücksetzen',
    options: 'Optionen',
    missingDataLabel: 'Score schätzen bei fehlenden Daten',
    legend: 'Legende',
    lowRisk: 'Niedriges Risiko',
    highRisk: 'Hohes Risiko',
    noData: 'Keine Daten',
    grade: 'Stufe',
    trend: 'Trend',
    trendUp: 'Steigend ↑',
    trendStable: 'Stabil →',
    weightedScore: 'Gewichteter Score',
    commercialRisk: 'Kommerzielles Risiko',
    gradeDescriptions: {
      A: 'Sehr niedriges Risiko', B: 'Niedriges Risiko', C: 'Moderat-niedriges Risiko',
      D: 'Moderates Risiko', E: 'Moderat-hohes Risiko', F: 'Hohes Risiko', G: 'Sehr hohes Risiko'
    },
    categories: {
      op: 'Operationelles Risiko',
      oc: 'Eigentums- & Kontrollrisiko',
      tr: 'Transferrisiko',
      co: 'Korruptionsrisiko',
      te: 'Terrorismusrisiko'
    }
  }
};

let lang = 'en';

export function getLang() {
  return lang;
}

export function setLang(newLang) {
  lang = newLang;
}

export function t(key) {
  const keys = key.split('.');
  let val = I18N[lang];
  for (const k of keys) val = val?.[k];
  return val || key;
}

export { I18N };

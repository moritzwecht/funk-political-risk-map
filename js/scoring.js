// ---- Scoring & Color Utilities ----

import { CATS, weights, state } from './state.js';

export const RISK_COLORS = ['#10b981','#34d399','#a3e635','#facc15','#fb923c','#f87171','#dc2626'];
export const GRADE_COLORS = { A:'#10b981', B:'#34d399', C:'#a3e635', D:'#facc15', E:'#fb923c', F:'#f87171', G:'#dc2626' };

export function lerpColor(a, b, t) {
  const ar = parseInt(a.slice(1,3),16), ag = parseInt(a.slice(3,5),16), ab = parseInt(a.slice(5,7),16);
  const br = parseInt(b.slice(1,3),16), bg = parseInt(b.slice(3,5),16), bb = parseInt(b.slice(5,7),16);
  const r = Math.round(ar + (br-ar)*t);
  const g = Math.round(ag + (bg-ag)*t);
  const bl = Math.round(ab + (bb-ab)*t);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${bl.toString(16).padStart(2,'0')}`;
}

export function scoreToColor(score) {
  if (score == null) return '#1a2235';
  const s = Math.max(0, Math.min(1, score));
  const idx = s * (RISK_COLORS.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.min(lo + 1, RISK_COLORS.length - 1);
  const frac = idx - lo;
  return lerpColor(RISK_COLORS[lo], RISK_COLORS[hi], frac);
}

export function computeScore(country) {
  const total = CATS.reduce((s, c) => s + weights[c], 0);
  if (total === 0) return null;

  let scoreSum = 0, weightSum = 0;
  for (const cat of CATS) {
    if (weights[cat] === 0) continue;
    const val = country[cat];
    if (val == null) {
      if (!state.estimateMissing) return null;
      continue;
    }
    scoreSum += val * weights[cat];
    weightSum += weights[cat];
  }
  if (weightSum === 0) return null;
  return scoreSum / weightSum;
}

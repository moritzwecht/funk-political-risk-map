// ---- Legend ----

import { RISK_COLORS } from '../scoring.js';

export function buildLegend() {
  const bar = document.getElementById('legendBar');
  bar.innerHTML = '';
  RISK_COLORS.forEach(color => {
    const el = document.createElement('div');
    el.className = 'legend__bar';
    el.style.background = color;
    bar.appendChild(el);
  });
}

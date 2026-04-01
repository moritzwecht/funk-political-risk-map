// ---- Slider Controls ----

import { CATS, weights } from '../state.js';
import { t } from '../i18n.js';

export function buildSliders(onChange) {
  const container = document.getElementById('sliderContainer');
  container.innerHTML = '';
  CATS.forEach(cat => {
    const group = document.createElement('div');
    group.className = 'slider-group';
    const total = CATS.reduce((s, c) => s + weights[c], 0);
    const pct = total > 0 ? Math.round(weights[cat] / total * 100) : 0;
    group.innerHTML = `
      <div class="slider-label">
        <span class="slider-label__name">${t('categories.' + cat)}</span>
        <span class="slider-label__value" id="val_${cat}">${weights[cat]}</span>
        <span class="slider-label__pct" id="pct_${cat}">${pct}%</span>
      </div>
      <input type="range" min="0" max="100" value="${weights[cat]}" id="slider_${cat}">
    `;
    container.appendChild(group);
    const slider = group.querySelector('input');
    slider.addEventListener('input', (e) => {
      weights[cat] = parseInt(e.target.value);
      updateSliderLabels();
      if (onChange) onChange();
    });
  });
}

export function updateSliderLabels() {
  const total = CATS.reduce((s, c) => s + weights[c], 0);
  CATS.forEach(cat => {
    document.getElementById('val_' + cat).textContent = weights[cat];
    const pct = total > 0 ? Math.round(weights[cat] / total * 100) : 0;
    document.getElementById('pct_' + cat).textContent = pct + '%';
  });
}

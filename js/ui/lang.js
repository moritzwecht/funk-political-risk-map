// ---- Language Switching ----

import { t, setLang } from '../i18n.js';
import { state } from '../state.js';
import { buildSliders } from './sliders.js';
import { updateSliderLabels } from './sliders.js';
import { updateDetailPanel } from './detail-panel.js';

export function applyLang(onChange) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });
  buildSliders(onChange);
  updateSliderLabels();
  if (state.selectedCountry) updateDetailPanel(state.selectedCountry);
}

export function initLangToggle(onChange) {
  document.querySelectorAll('.lang-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      setLang(btn.getAttribute('data-lang'));
      document.querySelectorAll('.lang-toggle button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.documentElement.lang = btn.getAttribute('data-lang');
      applyLang(onChange);
    });
  });
}

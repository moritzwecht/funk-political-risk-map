// ---- Search ----

import { COUNTRY_DATA } from '../state.js';
import { GRADE_COLORS } from '../scoring.js';
import { t, getLang } from '../i18n.js';
import { openDetailPanel } from './detail-panel.js';
import { zoomToCountry } from '../map.js';

export function initSearch() {
  const input = document.getElementById('countrySearch');
  const results = document.getElementById('searchResults');

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    results.innerHTML = '';
    if (q.length < 2) return;

    const matches = COUNTRY_DATA.filter(c => {
      return c.en.toLowerCase().includes(q) || c.de.toLowerCase().includes(q) ||
             c.a2.toLowerCase() === q || c.a3.toLowerCase() === q;
    }).slice(0, 10);

    matches.forEach(c => {
      const name = getLang() === 'de' ? c.de : c.en;
      const div = document.createElement('div');
      div.className = 'search-result';
      const gradeColor = c.gr ? GRADE_COLORS[c.gr] : 'transparent';
      div.innerHTML = `
        <span class="search-result__name">${name}</span>
        ${c.gr ? `<span class="search-result__grade" style="background:${gradeColor};color:#000">${c.gr}</span>` : ''}
      `;
      div.addEventListener('click', () => {
        openDetailPanel(c);
        zoomToCountry(c.a3);
        results.innerHTML = '';
        input.value = name;
      });
      results.appendChild(div);
    });
  });
}

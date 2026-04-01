// ---- Detail Panel ----

import { computeScore, scoreToColor, GRADE_COLORS } from '../scoring.js';
import { CATS, state } from '../state.js';
import { t, getLang } from '../i18n.js';

export function openDetailPanel(country) {
  state.selectedCountry = country;
  document.querySelectorAll('.country.selected').forEach(el => el.classList.remove('selected'));
  const path = document.querySelector(`.country[data-a3="${country.a3}"]`);
  if (path) path.classList.add('selected');

  updateDetailPanel(country);
  document.getElementById('detailPanel').classList.add('open');
}

export function updateDetailPanel(country) {
  const name = getLang() === 'de' ? country.de : country.en;
  document.getElementById('detailName').textContent = name;
  document.getElementById('detailMeta').textContent = `${country.a2} · ${country.a3} · ${country.num}`;

  const badge = document.getElementById('detailGradeBadge');
  if (country.gr) {
    badge.textContent = country.gr;
    badge.style.background = GRADE_COLORS[country.gr] || '#555';
    badge.style.display = '';
  } else {
    badge.style.display = 'none';
  }

  const trendText = country.td === 1 ? t('trendUp') : country.td === 0 ? t('trendStable') : '—';
  const gradeDesc = country.gr ? t('gradeDescriptions.' + country.gr) : '';
  document.getElementById('detailGradeInfo').innerHTML =
    `<div>${t('commercialRisk')}: ${gradeDesc}</div>` +
    `<div class="detail-panel__trend">${t('trend')}: ${trendText}</div>` +
    `<div style="margin-top:4px;font-family:var(--font-mono)">${t('weightedScore')}: ${computeScore(country) != null ? (computeScore(country)*100).toFixed(1)+'%' : '—'}</div>`;

  const barsContainer = document.getElementById('detailBars');
  barsContainer.innerHTML = '';
  CATS.forEach(cat => {
    const val = country[cat];
    const bar = document.createElement('div');
    bar.className = 'risk-bar';
    const pctVal = val != null ? (val * 100).toFixed(1) + '%' : '—';
    const width = val != null ? (val * 100) + '%' : '0%';
    const color = val != null ? scoreToColor(val) : '#333';
    bar.innerHTML = `
      <div class="risk-bar__header">
        <span class="risk-bar__name">${t('categories.' + cat)}</span>
        <span class="risk-bar__value">${pctVal}</span>
      </div>
      <div class="risk-bar__track">
        <div class="risk-bar__fill" style="width:${width};background:${color}"></div>
      </div>
    `;
    barsContainer.appendChild(bar);
  });
}

export function closeDetailPanel() {
  state.selectedCountry = null;
  document.getElementById('detailPanel').classList.remove('open');
  document.querySelectorAll('.country.selected').forEach(el => el.classList.remove('selected'));
}

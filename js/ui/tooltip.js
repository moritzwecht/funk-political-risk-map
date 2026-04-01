// ---- Tooltip ----

import { computeScore } from '../scoring.js';
import { t, getLang } from '../i18n.js';

const tooltip = document.getElementById('tooltip');
const tooltipName = document.getElementById('tooltipName');
const tooltipScore = document.getElementById('tooltipScore');

export function showTooltip(country, event) {
  const name = getLang() === 'de' ? country.de : country.en;
  const score = computeScore(country);
  tooltipName.textContent = name;
  let scoreText = score != null ? `${t('weightedScore')}: ${(score * 100).toFixed(0)}%` : t('noData');
  if (country.gr) scoreText += `  |  ${t('grade')}: ${country.gr}`;
  tooltipScore.textContent = scoreText;
  tooltip.classList.add('visible');
  positionTooltip(event);
}

export function positionTooltip(event) {
  const pad = 12;
  let x = event.clientX + pad;
  let y = event.clientY + pad;
  const rect = tooltip.getBoundingClientRect();
  if (x + rect.width > window.innerWidth) x = event.clientX - rect.width - pad;
  if (y + rect.height > window.innerHeight) y = event.clientY - rect.height - pad;
  tooltip.style.left = x + 'px';
  tooltip.style.top = y + 'px';
}

export function hideTooltip() {
  tooltip.classList.remove('visible');
}

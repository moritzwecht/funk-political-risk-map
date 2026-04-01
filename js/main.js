// ============================================
// Political Risk Map 2026 — Main Application
// ============================================

import { CATS, weights, state } from './state.js';
import { initMap, updateMap, zoomIn, zoomOut, zoomReset, showInitError } from './map.js';
import { buildSliders, updateSliderLabels } from './ui/sliders.js';
import { buildLegend } from './ui/legend.js';
import { initSearch } from './ui/search.js';
import { initLangToggle } from './ui/lang.js';
import { closeDetailPanel, updateDetailPanel } from './ui/detail-panel.js';

function onWeightsChange() {
  updateMap();
  if (state.selectedCountry) updateDetailPanel(state.selectedCountry);
}

async function init() {
  buildSliders(onWeightsChange);
  buildLegend();
  initSearch();
  initLangToggle(onWeightsChange);

  // Reset weights
  document.getElementById('resetBtn').addEventListener('click', () => {
    CATS.forEach(cat => {
      weights[cat] = 50;
      document.getElementById('slider_' + cat).value = 50;
    });
    updateSliderLabels();
    onWeightsChange();
  });

  // Missing data toggle
  document.getElementById('missingDataToggle').addEventListener('change', (e) => {
    state.estimateMissing = e.target.checked;
    onWeightsChange();
  });

  // Detail panel close
  document.getElementById('detailClose').addEventListener('click', closeDetailPanel);

  // Zoom controls
  document.getElementById('zoomIn').addEventListener('click', zoomIn);
  document.getElementById('zoomOut').addEventListener('click', zoomOut);
  document.getElementById('zoomReset').addEventListener('click', zoomReset);

  // Load map
  await initMap();
}

init().catch((err) => {
  console.error('Failed to initialize app:', err);
  showInitError();
});

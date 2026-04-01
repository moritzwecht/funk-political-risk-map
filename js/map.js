// ---- Map Rendering ----

import { COUNTRY_DATA, dataByA3, state } from './state.js';
import { computeScore, scoreToColor } from './scoring.js';
import { loadScriptWithFallbacks, fetchJsonWithFallbacks } from './loader.js';
import { showTooltip, positionTooltip, hideTooltip } from './ui/tooltip.js';
import { openDetailPanel } from './ui/detail-panel.js';
import { getLang } from './i18n.js';

let svg, g, projection, path, zoom;
let geoData = null;

const TOPO_URLS = [
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json',
  'https://unpkg.com/world-atlas@2/countries-50m.json',
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json',
  'https://unpkg.com/world-atlas@2/countries-110m.json'
];

export function isMapReady() {
  return typeof window.d3 !== 'undefined' && !!svg && !!zoom && !!projection;
}

export function showInitError() {
  const loadingEl = document.getElementById('loading');
  if (!loadingEl) return;
  const message = getLang() === 'de'
    ? 'Karte konnte nicht geladen werden. Bitte Internetzugang und Content-Blocker pruefen und die Seite neu laden.'
    : 'Map failed to load. Please check internet access and content blockers, then reload the page.';
  loadingEl.innerHTML = `<div style="max-width:340px;padding:16px;text-align:center;font-size:13px;line-height:1.5;color:#e8ecf4;">${message}</div>`;
  loadingEl.classList.remove('hidden');
}

export async function initMap() {
  const container = document.getElementById('mapContainer');
  const width = container.clientWidth;
  const height = container.clientHeight;

  svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  container.insertBefore(svg, container.firstChild);

  await loadScriptWithFallbacks(
    [
      'https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js',
      'https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js',
      'https://unpkg.com/d3@7.9.0/dist/d3.min.js'
    ],
    () => typeof window.d3 !== 'undefined',
    'd3'
  );
  await loadScriptWithFallbacks(
    [
      'https://cdnjs.cloudflare.com/ajax/libs/topojson-client/3.1.0/topojson-client.min.js',
      'https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js',
      'https://unpkg.com/topojson-client@3.1.0/dist/topojson-client.min.js'
    ],
    () => typeof window.topojson !== 'undefined',
    'topojson-client'
  );

  const world = await fetchJsonWithFallbacks(TOPO_URLS);
  const countries = topojson.feature(world, world.objects.countries);

  const numToData = {};
  COUNTRY_DATA.forEach(c => {
    numToData[String(parseInt(c.num))] = c;
  });

  projection = d3.geoNaturalEarth1()
    .precision(0.2)
    .fitSize([width - 20, height - 20], countries)
    .translate([width/2, height/2]);

  path = d3.geoPath().projection(projection);

  g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  svg.appendChild(g);

  zoom = d3.zoom()
    .scaleExtent([1, 12])
    .on('zoom', (event) => {
      g.setAttribute('transform', `translate(${event.transform.x},${event.transform.y}) scale(${event.transform.k})`);
    });

  d3.select(svg).call(zoom);

  countries.features.forEach(feature => {
    const numId = String(feature.id);
    const country = numToData[numId];

    const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    el.setAttribute('d', path(feature));
    el.setAttribute('class', 'country' + (country ? '' : ' no-data'));
    if (country) {
      el.setAttribute('data-a3', country.a3);
      el.setAttribute('data-num', numId);
      const score = computeScore(country);
      el.setAttribute('fill', scoreToColor(score));

      el.addEventListener('mouseenter', (e) => showTooltip(country, e));
      el.addEventListener('mousemove', (e) => positionTooltip(e));
      el.addEventListener('mouseleave', hideTooltip);
      el.addEventListener('click', () => openDetailPanel(country));
    } else {
      el.setAttribute('fill', '#1a2235');
    }
    g.appendChild(el);
  });

  document.getElementById('loading').classList.add('hidden');
}

export function updateMap() {
  document.querySelectorAll('.country:not(.no-data)').forEach(el => {
    const a3 = el.getAttribute('data-a3');
    const country = dataByA3[a3];
    if (country) {
      const score = computeScore(country);
      el.setAttribute('fill', scoreToColor(score));
      if (score == null && !state.estimateMissing) {
        el.classList.add('no-data');
      } else {
        el.classList.remove('no-data');
      }
    }
  });
}

export function zoomToCountry(a3) {
  if (!isMapReady()) return;
  const el = document.querySelector(`.country[data-a3="${a3}"]`);
  if (!el) return;
  const bbox = el.getBBox();
  const width = svg.clientWidth;
  const height = svg.clientHeight;

  const scale = Math.min(8, 0.8 / Math.max(bbox.width / width, bbox.height / height));
  const tx = width/2 - scale * (bbox.x + bbox.width/2);
  const ty = height/2 - scale * (bbox.y + bbox.height/2);

  d3.select(svg).transition().duration(600)
    .call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
}

// Zoom control helpers (used by main.js)
export function zoomIn() {
  if (!isMapReady()) return;
  d3.select(svg).transition().duration(300).call(zoom.scaleBy, 1.5);
}

export function zoomOut() {
  if (!isMapReady()) return;
  d3.select(svg).transition().duration(300).call(zoom.scaleBy, 0.67);
}

export function zoomReset() {
  if (!isMapReady()) return;
  d3.select(svg).transition().duration(500).call(zoom.transform, d3.zoomIdentity);
}

// Resize handling
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (!isMapReady()) return;
    const container = document.getElementById('mapContainer');
    svg.setAttribute('width', container.clientWidth);
    svg.setAttribute('height', container.clientHeight);
    svg.setAttribute('viewBox', `0 0 ${container.clientWidth} ${container.clientHeight}`);
    projection.fitSize([container.clientWidth - 20, container.clientHeight - 20],
      { type: 'Sphere' }).translate([container.clientWidth/2, container.clientHeight/2]);
  }, 300);
});

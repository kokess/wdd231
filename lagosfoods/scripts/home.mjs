// home.mjs — Home page module
import { setFooterYear, initNav, starsHTML, saveToStorage, getFromStorage } from './utils.mjs';

setFooterYear();
initNav();

// ── Fetch restaurant data (async with try/catch) ──────────────
async function fetchRestaurants() {
  try {
    const response = await fetch('data/restaurants.json');
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to load restaurant data:', error);
    return [];
  }
}

// ── Fetch Lagos weather from Open-Meteo (free, no key needed) ─
async function fetchWeather() {
  // Lagos coordinates: 6.5244°N, 3.3792°E
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=6.5244&longitude=3.3792&current_weather=true&timezone=Africa%2FLagos';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather fetch failed');
    const data = await res.json();
    return data.current_weather;
  } catch (err) {
    console.error('Weather error:', err);
    return null;
  }
}

// ── Weather code → emoji + description map ────────────────────
function weatherCodeInfo(code) {
  if (code === 0)           return { icon: '☀️', desc: 'Clear sky' };
  if (code <= 3)            return { icon: '⛅', desc: 'Partly cloudy' };
  if (code <= 49)           return { icon: '🌫️', desc: 'Foggy or hazy' };
  if (code <= 67)           return { icon: '🌧️', desc: 'Rainy' };
  if (code <= 77)           return { icon: '🌨️', desc: 'Snowy' };
  if (code <= 82)           return { icon: '🌦️', desc: 'Showers' };
  if (code <= 99)           return { icon: '⛈️', desc: 'Thunderstorm' };
  return { icon: '🌤️', desc: 'Mixed conditions' };
}

// ── Render weather widget ─────────────────────────────────────
async function renderWeather() {
  const weather = await fetchWeather();
  const iconEl  = document.querySelector('#weatherIcon');
  const titleEl = document.querySelector('#weatherTitle');
  const descEl  = document.querySelector('#weatherDesc');
  if (!weather) {
    descEl.textContent = 'Weather unavailable right now.';
    return;
  }
  const { icon, desc } = weatherCodeInfo(weather.weathercode);
  iconEl.textContent  = icon;
  titleEl.textContent = `Lagos Weather — ${weather.temperature}°C`;
  descEl.textContent  = `${desc}. Wind: ${weather.windspeed} km/h. Good time for ${desc.includes('Rain') ? 'indoor dining 🍲' : 'outdoor eating! 🌿'}`;
}

// ── Build a featured card ─────────────────────────────────────
function buildFeaturedCard(place) {
  const card = document.createElement('article');
  card.classList.add('featured-card');
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `View details for ${place.name}`);

  // Tags html
  const tagsHTML = place.tags.map(t => `<span class="tag">${t}</span>`).join('');

  card.innerHTML = `
    <img src="${place.image}" alt="${place.name}" loading="lazy" width="400" height="180">
    <div class="featured-card-body">
      <h3>${place.name}</h3>
      <div class="card-meta">
        <span>${place.cuisine} · ${place.location}</span>
        <span class="card-stars" aria-label="Rating: ${place.rating} out of 5">${starsHTML(place.rating)} ${place.rating}</span>
      </div>
      <p style="font-size:0.82rem;color:var(--text-light);margin-bottom:0.5rem;">${place.specialty}</p>
      <div>${tagsHTML}</div>
    </div>
  `;

  // Open modal on click
  card.addEventListener('click', () => openModal(place));
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openModal(place); });

  return card;
}

// ── Render featured grid ──────────────────────────────────────
function renderFeatured(restaurants, filter = 'all') {
  const grid = document.querySelector('#featuredGrid');
  grid.innerHTML = '';

  // Filter using array method
  const filtered = filter === 'all'
    ? restaurants
    : restaurants.filter(r => r.tags.some(t => t.toLowerCase().includes(filter)));

  // Show top 6
  const toShow = filtered.slice(0, 6);

  if (toShow.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-light);grid-column:1/-1">No restaurants match this filter.</p>';
    return;
  }

  // map → array of cards (array method)
  const cards = toShow.map(r => buildFeaturedCard(r));
  cards.forEach(c => grid.appendChild(c));
}

// ── Category filter buttons ───────────────────────────────────
function initCategories(restaurants) {
  const btns = document.querySelectorAll('.cat-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      // Save last filter to localStorage
      saveToStorage('lastFilter', filter);
      renderFeatured(restaurants, filter);
    });
  });

  // Restore last filter from localStorage
  const saved = getFromStorage('lastFilter');
  if (saved && saved !== 'all') {
    const match = [...btns].find(b => b.dataset.filter === saved);
    if (match) {
      btns.forEach(b => b.classList.remove('active'));
      match.classList.add('active');
      renderFeatured(restaurants, saved);
    }
  }
}

// ── Hero search → redirect to restaurants page ────────────────
function initHeroSearch() {
  const input = document.querySelector('#heroSearch');
  const btn   = document.querySelector('#heroSearchBtn');

  const doSearch = () => {
    const q = input.value.trim();
    if (q) {
      window.location.href = `restaurants.html?q=${encodeURIComponent(q)}`;
    }
  };

  btn.addEventListener('click', doSearch);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
}

// ── Modal ─────────────────────────────────────────────────────
const overlay   = document.querySelector('#modalOverlay');
const modalBody = document.querySelector('#modalBody');
const modalTitle = document.querySelector('#modalTitle');
const closeBtn  = document.querySelector('#modalClose');

function openModal(place) {
  modalTitle.textContent = place.name;
  const tagsHTML = place.tags.map(t => `<span class="tag">${t}</span>`).join('');
  modalBody.innerHTML = `
    <img src="${place.image}" alt="${place.name}" loading="lazy">
    <div class="modal-stars" aria-label="Rating ${place.rating} out of 5">${starsHTML(place.rating)} <strong>${place.rating}</strong> / 5</div>
    <div class="modal-meta">
      <div><span>Cuisine</span><br><strong>${place.cuisine}</strong></div>
      <div><span>Location</span><br><strong>${place.location}</strong></div>
      <div><span>Price</span><br><strong>${place.price}</strong></div>
      <div><span>Hours</span><br><strong>${place.hours}</strong></div>
    </div>
    <p class="modal-desc">${place.description}</p>
    <p class="modal-specialty"><strong>Specialty:</strong> ${place.specialty}</p>
    <div class="modal-tags">${tagsHTML}</div>
  `;
  overlay.classList.add('open');
  closeBtn.focus();

  // Track last viewed in localStorage
  saveToStorage('lastViewed', place.name);
}

function closeModal() {
  overlay.classList.remove('open');
}

closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── Init ──────────────────────────────────────────────────────
async function init() {
  const restaurants = await fetchRestaurants();
  renderFeatured(restaurants);
  initCategories(restaurants);
  initHeroSearch();
  renderWeather();
}

init();
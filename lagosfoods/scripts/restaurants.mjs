// restaurants.mjs — Restaurants page module
import { setFooterYear, initNav, starsHTML, saveToStorage, getFromStorage } from './utils.mjs';

setFooterYear();
initNav();

let allRestaurants = [];
let favourites = getFromStorage('favourites') || [];
let showFavOnly = false;

// ── Fetch data (async + try/catch) ───────────────────────────
async function fetchRestaurants() {
  try {
    const res = await fetch('data/restaurants.json');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to fetch restaurant data:', err);
    const grid = document.querySelector('#restaurantGrid');
    grid.innerHTML = `<div class="no-results"><p>⚠️ Could not load restaurants. Please try refreshing.</p></div>`;
    return [];
  }
}

// ── Build restaurant card ─────────────────────────────────────
function buildCard(r) {
  const card = document.createElement('article');
  card.classList.add('restaurant-card');
  card.dataset.id = r.id;
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `View details for ${r.name}`);

  const isFav = favourites.includes(r.id);
  const tagsHTML = r.tags.map(t => `<span class="tag">${t}</span>`).join('');

  card.innerHTML = `
    <img src="${r.image}" alt="${r.name}" loading="lazy" width="400" height="170">
    <div class="restaurant-card-body">
      <button class="fav-btn" data-id="${r.id}" aria-label="${isFav ? 'Remove from' : 'Add to'} favourites" aria-pressed="${isFav}">
        ${isFav ? '❤️' : '🤍'}
      </button>
      <h3>${r.name}</h3>
      <p class="r-cuisine">${r.cuisine}</p>
      <p class="r-stars" aria-label="Rating ${r.rating} out of 5">${starsHTML(r.rating)} <strong>${r.rating}</strong></p>
      <p class="r-location">📍 ${r.location}</p>
      <p class="r-price">💵 ${r.price}</p>
      <div class="r-tags">${tagsHTML}</div>
      <button class="card-btn" data-id="${r.id}">View Details</button>
    </div>
  `;

  // View details opens modal
  card.querySelector('.card-btn').addEventListener('click', e => {
    e.stopPropagation();
    openModal(r);
  });

  // Card click also opens modal
  card.addEventListener('click', () => openModal(r));
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openModal(r); });

  // Fav toggle
  card.querySelector('.fav-btn').addEventListener('click', e => {
    e.stopPropagation();
    toggleFav(r.id, card.querySelector('.fav-btn'));
  });

  return card;
}

// ── Toggle favourite ──────────────────────────────────────────
function toggleFav(id, btn) {
  if (favourites.includes(id)) {
    favourites = favourites.filter(f => f !== id);
    btn.textContent = '🤍';
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', 'Add to favourites');
  } else {
    favourites.push(id);
    btn.textContent = '❤️';
    btn.setAttribute('aria-pressed', 'true');
    btn.setAttribute('aria-label', 'Remove from favourites');
  }
  saveToStorage('favourites', favourites);
}

// ── Render cards ──────────────────────────────────────────────
function renderCards(list) {
  const grid    = document.querySelector('#restaurantGrid');
  const counter = document.querySelector('#resultsCount');
  grid.innerHTML = '';

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <p>🍽 No restaurants found.</p>
        <p style="font-size:0.9rem;">Try a different search term or filter.</p>
      </div>`;
    counter.textContent = '0 restaurants';
    return;
  }

  // forEach array method
  list.forEach(r => grid.appendChild(buildCard(r)));
  counter.textContent = `${list.length} restaurant${list.length !== 1 ? 's' : ''}`;
}

// ── Filter + sort ─────────────────────────────────────────────
function applyFilters() {
  const q       = document.querySelector('#searchInput').value.trim().toLowerCase();
  const cuisine = document.querySelector('#cuisineFilter').value;
  const sort    = document.querySelector('#sortFilter').value;

  // filter array method
  let filtered = allRestaurants.filter(r => {
    const matchSearch  = !q ||
      r.name.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q) ||
      r.tags.some(t => t.toLowerCase().includes(q));
    const matchCuisine = !cuisine || r.cuisine === cuisine;
    const matchFav     = !showFavOnly || favourites.includes(r.id);
    return matchSearch && matchCuisine && matchFav;
  });

  // Sort
  if (sort === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'price-low') {
    filtered.sort((a, b) => parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, '')));
  } else if (sort === 'price-high') {
    filtered.sort((a, b) => parseInt(b.price.replace(/[^0-9]/g, '')) - parseInt(a.price.replace(/[^0-9]/g, '')));
  }

  renderCards(filtered);
}

// ── Favourites toggle button ──────────────────────────────────
function initFavToggle() {
  const btn = document.querySelector('#favToggle');
  btn.addEventListener('click', () => {
    showFavOnly = !showFavOnly;
    btn.setAttribute('aria-pressed', showFavOnly);
    btn.textContent = showFavOnly ? '❤️ Showing Favourites' : '♡ Show Favourites Only';
    btn.classList.toggle('btn-orange', showFavOnly);
    btn.classList.toggle('btn-outline', !showFavOnly);
    applyFilters();
  });
}

// ── Modal ─────────────────────────────────────────────────────
const overlay    = document.querySelector('#modalOverlay');
const modalBody  = document.querySelector('#modalBody');
const modalTitle = document.querySelector('#modalTitle');
const closeBtn   = document.querySelector('#modalClose');

function openModal(r) {
  modalTitle.textContent = r.name;
  const tagsHTML = r.tags.map(t => `<span class="tag">${t}</span>`).join('');
  modalBody.innerHTML = `
    <img src="${r.image}" alt="${r.name}" loading="lazy">
    <div class="modal-stars" aria-label="Rating ${r.rating} out of 5">${starsHTML(r.rating)} <strong>${r.rating}</strong> / 5</div>
    <div class="modal-meta">
      <div><span>Cuisine</span><br><strong>${r.cuisine}</strong></div>
      <div><span>Location</span><br><strong>${r.location}</strong></div>
      <div><span>Price</span><br><strong>${r.price}</strong></div>
      <div><span>Hours</span><br><strong>${r.hours}</strong></div>
    </div>
    <p class="modal-desc">${r.description}</p>
    <p class="modal-specialty"><strong>Specialty:</strong> ${r.specialty}</p>
    <div class="modal-tags mb-2">${tagsHTML}</div>
    <button class="btn btn-primary w-full" id="modalFavBtn">
      ${favourites.includes(r.id) ? '❤️ Remove from Favourites' : '🤍 Add to Favourites'}
    </button>
  `;

  // Fav from modal
  modalBody.querySelector('#modalFavBtn').addEventListener('click', () => {
    toggleFav(r.id, { textContent: '', setAttribute: () => {}, getAttribute: () => '' });
    const favBtn = modalBody.querySelector('#modalFavBtn');
    favBtn.textContent = favourites.includes(r.id) ? '❤️ Remove from Favourites' : '🤍 Add to Favourites';
    // Re-render to reflect change
    applyFilters();
  });

  overlay.classList.add('open');
  closeBtn.focus();

  // Track last viewed
  saveToStorage('lastViewed', { id: r.id, name: r.name, time: Date.now() });
}

function closeModal() {
  overlay.classList.remove('open');
}

closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── Handle URL search param (from home page hero search) ──────
function handleURLQuery() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q) {
    const searchInput = document.querySelector('#searchInput');
    searchInput.value = q;
  }
}

// ── Init ──────────────────────────────────────────────────────
async function init() {
  allRestaurants = await fetchRestaurants();

  document.querySelector('#totalCount').textContent = allRestaurants.length;

  handleURLQuery();
  applyFilters();
  initFavToggle();

  // Event listeners for controls
  document.querySelector('#searchInput').addEventListener('input', applyFilters);
  document.querySelector('#cuisineFilter').addEventListener('change', applyFilters);
  document.querySelector('#sortFilter').addEventListener('change', applyFilters);
}

init();

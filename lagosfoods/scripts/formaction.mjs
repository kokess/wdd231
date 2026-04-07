// formaction.mjs — Form action page
import { setFooterYear, initNav } from './utils.mjs';

setFooterYear();
initNav();

// ── Read URL search params and display them ───────────────────
const params = new URLSearchParams(window.location.search);
const container = document.querySelector('#submissionData');

// Map of param key → display label
const labels = {
  name:       'Your Name',
  email:      'Email',
  restaurant: 'Restaurant Name',
  location:   'Location',
  cuisine:    'Cuisine Type',
  message:    'Message',
  subscribe:  'Newsletter'
};

// Build rows using array method on entries
const rows = [...params.entries()]
  .filter(([key]) => labels[key])                    // only known fields
  .map(([key, value]) => {                           // template literals
    const label = labels[key] ?? key;
    const displayValue = key === 'subscribe' ? 'Yes, subscribed ✅' : value || '—';
    return `
      <div class="data-row">
        <span class="label">${label}:</span>
        <span class="value">${displayValue}</span>
      </div>
    `;
  });

if (rows.length === 0) {
  container.innerHTML = `
    <div class="data-row">
      <span class="value" style="color:var(--text-light);">No submission data found. Please fill out the form.</span>
    </div>
  `;
} else {
  container.innerHTML += rows.join('');
}

// Also display submission date/time
const dateRow = document.createElement('div');
dateRow.classList.add('data-row');
dateRow.innerHTML = `
  <span class="label">Submitted:</span>
  <span class="value">${new Date().toLocaleString('en-NG', { dateStyle: 'long', timeStyle: 'short' })}</span>
`;
container.appendChild(dateRow);

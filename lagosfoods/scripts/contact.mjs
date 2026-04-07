// contact.mjs — Contact page module
import { setFooterYear, initNav, saveToStorage, getFromStorage } from './utils.mjs';

setFooterYear();
initNav();

// ── Restore saved cuisine preference ──────────────────────────
const prefSelect = document.querySelector('#prefCuisine');
const prefStatus = document.querySelector('#prefStatus');
const savePrefBtn = document.querySelector('#savePref');

const savedPref = getFromStorage('cuisinePref');
if (savedPref && prefSelect) {
  prefSelect.value = savedPref;
  prefStatus.textContent = `✅ Saved: ${savedPref}`;
}

if (savePrefBtn) {
  savePrefBtn.addEventListener('click', () => {
    const val = prefSelect.value;
    if (!val) {
      prefStatus.textContent = 'Please select a cuisine first.';
      prefStatus.style.color = 'var(--orange)';
      return;
    }
    saveToStorage('cuisinePref', val);
    prefStatus.textContent = `✅ Saved: ${val}`;
    prefStatus.style.color = 'var(--green)';
  });
}

// ── Form submission ───────────────────────────────────────────
const form = document.querySelector('#contactForm');

if (form) {
  form.addEventListener('submit', e => {
    // Native HTML5 validation — let the browser handle it,
    // but we enhance with our own check for good UX
    const name       = form.querySelector('#fullName');
    const email      = form.querySelector('#email');
    const restaurant = form.querySelector('#restaurantName');

    let valid = true;

    [name, email, restaurant].forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#c0392b';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    if (!valid) {
      e.preventDefault();
      // Scroll to first error
      form.querySelector('[style*="c0392b"]')?.focus();
      return;
    }

    // Save submission timestamp to localStorage
    saveToStorage('lastSubmission', {
      restaurant: restaurant.value.trim(),
      time: new Date().toISOString()
    });
    // Form proceeds to formaction.html via GET
  });

  // Live validation on blur
  form.querySelectorAll('input[required]').forEach(field => {
    field.addEventListener('blur', () => {
      if (!field.value.trim()) {
        field.style.borderColor = '#c0392b';
      } else {
        field.style.borderColor = 'var(--green)';
      }
    });
  });
}

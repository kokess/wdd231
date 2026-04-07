// utils.mjs — shared ES module utilities

// ── Footer year ──────────────────────────────────────────────
export function setFooterYear() {
  const el = document.querySelector("#year");
  if (el) el.textContent = new Date().getFullYear();
}

// ── Hamburger nav toggle ──────────────────────────────────────
export function initNav() {
  const btn = document.querySelector("#menuBtn");
  const nav = document.querySelector("#mainNav");
  if (!btn || !nav) return;
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
    btn.textContent = open ? "✕" : "☰";
  });
}

// ── Star rating display ───────────────────────────────────────
export function starsHTML(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    "★".repeat(full) +
    (half ? "½" : "") +
    "☆".repeat(empty)
  );
}

// ── Local storage helpers ─────────────────────────────────────
export function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getFromStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

import { places } from "../data/places.mjs";

// ============================
// HAMBURGER MENU
// ============================
const menuBtn = document.querySelector("#menuBtn");
const navMenu = document.querySelector("#navMenu");

menuBtn.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    // Accessibility: update aria-expanded
    menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

// ============================
// CREATE CARDS
// ============================
// The container now has BOTH id="discoverGrid" and class="discover-grid"
// (set in HTML) so CSS named grid areas apply correctly.
const container = document.querySelector("#discoverGrid");

places.forEach((place, index) => {
    const card = document.createElement("section");
    card.classList.add("discover-card");

    // Named grid area — matches CSS nth-child rules
    card.style.gridArea = `card${index + 1}`;

    // Use webp image — falls back gracefully if missing
    const imgSrc = place.image.replace(/\.(jpg|jpeg|png)$/i, ".webp");

    card.innerHTML = `
        <h2>${place.name}</h2>
        <figure>
            <img
                src="images/${imgSrc}"
                alt="${place.name}"
                loading="lazy"
                width="400"
                height="180"
            >
        </figure>
        <address>${place.address}</address>
        <p>${place.description}</p>
        <button type="button">Learn More</button>
    `;

    container.appendChild(card);
});

// ============================
// LOCAL STORAGE — VISIT MESSAGE
// ============================
const message = document.querySelector("#visitMessage");
const lastVisit = localStorage.getItem("lastVisit");
const now = Date.now();

if (!lastVisit) {
    message.textContent = "Welcome! Let us know if you have any questions.";
} else {
    const days = Math.floor((now - Number(lastVisit)) / (1000 * 60 * 60 * 24));
    if (days < 1) {
        message.textContent = "Back so soon! Awesome!";
    } else if (days === 1) {
        message.textContent = "You last visited 1 day ago.";
    } else {
        message.textContent = `You last visited ${days} days ago.`;
    }
}

localStorage.setItem("lastVisit", now);

// ============================
// FOOTER — CURRENT YEAR
// ============================
document.querySelector("#year").textContent = new Date().getFullYear();
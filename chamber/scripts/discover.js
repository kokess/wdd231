// js/discover.js
import { places } from '../data/discover.mjs';

function buildCards() {
    const container = document.querySelector(".discover-grid");

    if (!container) return; // Exit if the grid isn't found

    // Clear the container first
    container.innerHTML = "";

    places.forEach(place => {
        const card = document.createElement("section");
        card.className = "discover-card";

        // Using the data from your .mjs file
        card.innerHTML = `
            <h2>${place.name}</h2>
            <figure>
                <img src="${place.image}" alt="${place.name}" width="300" height="200">
            </figure>
            <address>${place.address}</address>
            <p>${place.description}</p>
            <button>Learn More</button>
        `;
        container.appendChild(card);
    });
}

// Call the function immediately since it's a module
buildCards();

// --- Visitor Message Logic ---
const visitorMessage = document.getElementById("visitor-message");
const lastVisit = localStorage.getItem("lastVisit");
const now = Date.now();

if (!lastVisit) {
    visitorMessage.textContent = "Welcome! Let us know if you have any questions.";
} else {
    const daysSince = Math.floor((now - lastVisit) / (1000 * 60 * 60 * 24));
    if (daysSince < 1) {
        visitorMessage.textContent = "Back so soon! Awesome!";
    } else {
        visitorMessage.textContent = `You last visited ${daysSince} ${daysSince === 1 ? 'day' : 'days'} ago.`;
    }
}
localStorage.setItem("lastVisit", now);
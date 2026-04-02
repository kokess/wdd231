import { places } from '../data/discover.mjs';

document.addEventListener("DOMContentLoaded", () => {
    displayVisitorMessage();
    buildCards();
});

function displayVisitorMessage() {
    const messageDisplay = document.getElementById("visitor-message");
    const lastVisit = localStorage.getItem("lastVisitDate");
    const now = Date.now();

    // Save current visit for next time
    localStorage.setItem("lastVisitDate", now);

    if (!lastVisit) {
        messageDisplay.textContent = "Welcome! Let us know if you have any questions.";
        return;
    }

    const msPerDay = 24 * 60 * 60 * 1000;
    const timeDifference = now - parseInt(lastVisit);
    const daysDifference = Math.floor(timeDifference / msPerDay);

    if (timeDifference < msPerDay) {
        messageDisplay.textContent = "Back so soon! Awesome!";
    } else {
        const dayText = daysDifference === 1 ? "day" : "days";
        messageDisplay.textContent = `You last visited ${daysDifference} ${dayText} ago.`;
    }
}

function buildCards() {
    const container = document.querySelector(".discover-grid");

    places.forEach(item => {
        const card = document.createElement("section");
        card.className = "discover-card";

        card.innerHTML = `
            <h2>${item.name}</h2>
            <figure>
                <img src="${item.image}" alt="${item.name}" loading="lazy" width="300" height="200">
            </figure>
            <address>${item.address}</address>
            <p>${item.description}</p>
            <button>Learn More</button>
        `;

        container.appendChild(card);
    });
}
// ============================================================
// HOME.JS – Navigation + Weather + Spotlights
// ============================================================

// -----------------------------
// HAMBURGER MENU
// -----------------------------
const menuBtn = document.querySelector("#menuBtn");
const navMenu = document.querySelector("#navMenu");

menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("open");
});

// -----------------------------
// WEATHER CONFIG
// -----------------------------
const API_KEY = "YOUR_API_KEY_HERE"; // 🔥 PUT YOUR REAL KEY HERE
const CITY = "Lagos";
const COUNTRY = "NG";
const UNITS = "metric"; // Celsius

// -----------------------------
// CURRENT WEATHER
// -----------------------------
async function getCurrentWeather() {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY}&units=${UNITS}&appid=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        document.querySelector("#current-temp").textContent =
            `${Math.round(data.main.temp)}°C`;

        document.querySelector("#temp-high").textContent =
            Math.round(data.main.temp_max);

        document.querySelector("#temp-low").textContent =
            Math.round(data.main.temp_min);

        const desc = data.weather[0].description;
        const icon = data.weather[0].icon;

        const iconEl = document.querySelector("#weather-icon");
        iconEl.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        iconEl.alt = desc;

    } catch (error) {
        console.error("Weather error:", error);
    }
}

// -----------------------------
// 3-DAY FORECAST
// -----------------------------
async function getForecast() {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY},${COUNTRY}&units=${UNITS}&appid=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        const forecastList = document.querySelector("#forecast-list");
        forecastList.innerHTML = "";

        const days = {};

        data.list.forEach(item => {
            const date = new Date(item.dt_txt);
            const day = date.toLocaleDateString("en-US", { weekday: "short" });

            if (!days[day] && date.getHours() === 12) {
                days[day] = item;
            }
        });

        Object.keys(days).slice(0, 3).forEach(day => {
            const li = document.createElement("li");

            li.innerHTML = `
                <span class="forecast-day">${day}</span>
                <span class="forecast-temp">${Math.round(days[day].main.temp)}°C</span>
            `;

            forecastList.appendChild(li);
        });

    } catch (error) {
        console.error("Forecast error:", error);
    }
}

// -----------------------------
// SPOTLIGHTS
// -----------------------------
async function loadSpotlights() {
    try {
        const response = await fetch("data/members.json");
        const data = await response.json();

        const eligible = data.members.filter(m => m.membership === 2 || m.membership === 3);

        // Shuffle
        eligible.sort(() => Math.random() - 0.5);

        const selected = eligible.slice(0, 3);

        const container = document.querySelector("#spotlight-cards");
        container.innerHTML = "";

        selected.forEach(member => {
            const card = document.createElement("article");
            card.classList.add("spotlight-card");

            card.innerHTML = `
                <img src="images/${member.image}" alt="${member.name} logo">
                <h3>${member.name}</h3>
                <p>${member.phone}</p>
                <p>${member.address}</p>
                <a href="${member.website}" target="_blank">${member.website}</a>
                <span class="spotlight-badge ${member.membership === 3 ? "badge-gold" : "badge-silver"}">
                    ${member.membership === 3 ? "⭐ Gold Member" : "Silver Member"}
                </span>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Spotlight error:", error);
    }
}

// -----------------------------
// FOOTER
// -----------------------------
document.querySelector("#weather-desc").textContent =
    data.weather[0].description;
document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = document.lastModified;

// -----------------------------
// INIT
// -----------------------------
getCurrentWeather();
getForecast();
loadSpotlights();
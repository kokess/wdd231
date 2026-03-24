// ============================================================
//  home.js  –  Weather (OpenWeatherMap) + Business Spotlights
// ============================================================

// -----------------------------------------------
// CONFIG  –  swap in your own API key and city
// -----------------------------------------------
const WEATHER_API_KEY = "PASTE_YOUR_REAL_API_KEY_HERE";
const CITY = "Lagos";
const COUNTRY_CODE = "NG";
const UNITS = "metric";
// -----------------------------------------------
// WEATHER – current conditions
// -----------------------------------------------
async function getCurrentWeather() {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY_CODE}&units=${UNITS}&appid=${WEATHER_API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error(`Weather API error: ${response.status}`);

        const data = await response.json();

        // Temperature
        document.querySelector("#current-temp").textContent =
            `${Math.round(data.main.temp)}°C`;

        // Description
        const desc = data.weather[0].description;
        document.querySelector("#weather-desc").textContent =
            desc.charAt(0).toUpperCase() + desc.slice(1);

        // High / Low / Humidity
        document.querySelector("#temp-high").textContent = Math.round(data.main.temp_max);
        document.querySelector("#temp-low").textContent = Math.round(data.main.temp_min);
        document.querySelector("#humidity").textContent = data.main.humidity;

        // Sunrise / Sunset  (unix timestamp → readable time)
        document.querySelector("#sunrise").textContent = formatTime(data.sys.sunrise);
        document.querySelector("#sunset").textContent = formatTime(data.sys.sunset);

        // Icon
        const iconCode = data.weather[0].icon;
        const iconEl = document.querySelector("#weather-icon");
        iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        iconEl.alt = desc;

    } catch (err) {
        console.error("Could not load current weather:", err);
        document.querySelector("#weather-desc").textContent = "Weather unavailable.";
    }
}

// -----------------------------------------------
// WEATHER – 3-day forecast
// -----------------------------------------------
async function getWeatherForecast() {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY},${COUNTRY_CODE}&units=${UNITS}&appid=${WEATHER_API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error(`Forecast API error: ${response.status}`);

        const data = await response.json();

        // The free forecast endpoint returns 3-hour steps for 5 days.
        // We grab one reading per day at noon (or the closest available).
        const dailyMap = {};
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dateKey = date.toLocaleDateString("en-US", { weekday: "long" });
            const hour = date.getHours();

            // Keep the entry closest to 12:00 for each day
            if (!dailyMap[dateKey] || Math.abs(hour - 12) < Math.abs(new Date(dailyMap[dateKey].dt * 1000).getHours() - 12)) {
                dailyMap[dateKey] = item;
            }
        });

        const days = Object.entries(dailyMap).slice(0, 3); // first 3 days
        const list = document.querySelector("#forecast-list");
        list.innerHTML = "";

        days.forEach(([dayName, item]) => {
            const li = document.createElement("li");
            const daySpan = document.createElement("span");
            const tempSpan = document.createElement("span");

            daySpan.classList.add("forecast-day");
            daySpan.textContent = dayName;

            tempSpan.classList.add("forecast-temp");
            tempSpan.textContent = `${Math.round(item.main.temp)}°C`;

            li.appendChild(daySpan);
            li.appendChild(tempSpan);
            list.appendChild(li);
        });

    } catch (err) {
        console.error("Could not load forecast:", err);
        document.querySelector("#forecast-list").innerHTML =
            "<li>Forecast unavailable.</li>";
    }
}

// Helper: unix timestamp → "7:30 AM"
function formatTime(unix) {
    return new Date(unix * 1000).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
}

// -----------------------------------------------
// SPOTLIGHTS – random gold/silver members
// -----------------------------------------------
async function loadSpotlights() {
    try {
        const response = await fetch("data/members.json");
        const data = await response.json();

        // Filter: gold (3) or silver (2) only
        const eligible = data.members.filter(m => m.membership === 3 || m.membership === 2);

        // Shuffle using Fisher-Yates
        for (let i = eligible.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [eligible[i], eligible[j]] = [eligible[j], eligible[i]];
        }

        // Pick 2 or 3 (prefer 3 if available)
        const count = eligible.length >= 3 ? 3 : 2;
        const selected = eligible.slice(0, count);

        const container = document.querySelector("#spotlight-cards");
        container.innerHTML = "";

        selected.forEach(member => {
            const card = document.createElement("article");
            card.classList.add("spotlight-card");

            const logo = document.createElement("img");
            logo.src = `images/${member.image}`;
            logo.alt = `${member.name} logo`;
            logo.loading = "lazy";
            logo.onerror = () => { logo.src = "images/placeholder.png"; };

            const name = document.createElement("h3");
            name.textContent = member.name;

            const phone = document.createElement("p");
            phone.textContent = member.phone;

            const address = document.createElement("p");
            address.textContent = member.address;

            const site = document.createElement("a");
            site.href = member.website;
            site.textContent = member.website.replace(/^https?:\/\//, "");
            site.target = "_blank";
            site.rel = "noopener noreferrer";

            const badge = document.createElement("span");
            badge.classList.add("spotlight-badge");
            if (member.membership === 3) {
                badge.classList.add("badge-gold");
                badge.textContent = "⭐ Gold Member";
            } else {
                badge.classList.add("badge-silver");
                badge.textContent = "Silver Member";
            }

            card.append(logo, name, phone, address, site, badge);
            container.appendChild(card);
        });

    } catch (err) {
        console.error("Could not load spotlights:", err);
        document.querySelector("#spotlight-cards").textContent =
            "Spotlight data unavailable.";
    }
}

// -----------------------------------------------
// FOOTER
// -----------------------------------------------
document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = document.lastModified;

// -----------------------------------------------
// INIT
// -----------------------------------------------
getCurrentWeather();
getWeatherForecast();
loadSpotlights();
// ✅ WEATHER CONFIG (FIXED: Lagos + metric)
const API_KEY = "YOUR_API_KEY_HERE";
const CITY = "Lagos";
const COUNTRY = "NG";
const UNITS = "metric";

// CURRENT WEATHER
async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY}&units=${UNITS}&appid=${API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    document.getElementById("current-temp").textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById("weather-desc").textContent = data.weather[0].description;
    document.getElementById("temp-high").textContent = Math.round(data.main.temp_max);
    document.getElementById("temp-low").textContent = Math.round(data.main.temp_min);
    document.getElementById("humidity").textContent = data.main.humidity;

    document.getElementById("weather-icon").src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
}

// FORECAST (3 days)
async function getForecast() {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY},${COUNTRY}&units=${UNITS}&appid=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    const list = document.getElementById("forecast-list");
    list.innerHTML = "";

    const days = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);

    days.forEach(day => {
        const li = document.createElement("li");
        li.textContent = `${new Date(day.dt_txt).toLocaleDateString()} - ${Math.round(day.main.temp)}°C`;
        list.appendChild(li);
    });
}

// ✅ HAMBURGER MENU
const btn = document.getElementById("menu-btn");
const nav = document.getElementById("nav-menu");

btn.addEventListener("click", () => {
    nav.classList.toggle("open");
});

// FOOTER
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;

// INIT
getWeather();
getForecast();
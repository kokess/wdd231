// MENU
const menuBtn = document.querySelector("#menuBtn");
const nav = document.querySelector("nav ul");

menuBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
});

// FOOTER
document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = document.lastModified;


// WEATHER
const apiKey = "YOUR_API_KEY"; // <-- PUT YOUR KEY HERE
const url = `https://api.openweathermap.org/data/2.5/forecast?q=Lagos,NG&units=metric&appid=${apiKey}`;

async function getWeather() {
    const res = await fetch(url);
    const data = await res.json();

    document.querySelector("#temp").textContent =
        Math.round(data.list[0].main.temp) + "°C";

    document.querySelector("#desc").textContent =
        data.list[0].weather[0].description;

    const icon = data.list[0].weather[0].icon;
    document.querySelector("#weather-icon").src =
        `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const forecast = document.querySelector("#forecast");

    for (let i = 8; i <= 24; i += 8) {
        const li = document.createElement("li");
        li.textContent = Math.round(data.list[i].main.temp) + "°C";
        forecast.appendChild(li);
    }
}

getWeather();


// SPOTLIGHTS
async function getSpotlights() {
    const res = await fetch("data/members.json");
    const data = await res.json();

    let members = data.members.filter(m => m.membership >= 2);

    members = members.sort(() => 0.5 - Math.random()).slice(0, 3);

    const container = document.querySelector("#spotlights");

    members.forEach(m => {
        const div = document.createElement("div");

        div.innerHTML = `
<h3>${m.name}</h3>
<img src="images/${m.image}" alt="${m.name}">
<p>${m.phone}</p>
<a href="${m.website}" target="_blank">Visit</a>
`;

        container.appendChild(div);
    });
}

getSpotlights();
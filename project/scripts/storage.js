const visitMessage = document.querySelector("#visitMessage");

let lastVisit = localStorage.getItem("lastVisit");

if (!lastVisit) {
    visitMessage.textContent = "Welcome! First visit!";
} else {
    visitMessage.textContent = "Welcome back!";
}

localStorage.setItem("lastVisit", Date.now());
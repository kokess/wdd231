const btn = document.querySelector("#menuBtn");
const nav = document.querySelector("#navMenu");

btn.addEventListener("click", () => {
    nav.classList.toggle("open");
});
// Timestamp
document.querySelector("#timestamp").value = Date.now();

// Footer
document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = document.lastModified;

// Open modals
document.querySelectorAll("[data-modal]").forEach(btn => {
    btn.addEventListener("click", () => {
        document.getElementById(btn.dataset.modal).showModal();
    });
});

// Close modals
document.querySelectorAll(".close-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        btn.closest("dialog").close();
    });
});
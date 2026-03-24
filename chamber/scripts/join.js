// Timestamp
document.querySelector("#timestamp").value = new Date().toISOString();

// Modal handling
document.querySelectorAll("[data-modal]").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const modal = document.getElementById(link.dataset.modal);
        modal.showModal();
    });
});
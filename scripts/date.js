const year = document.getElementById("currentYear");
const modified = document.getElementById("lastModified");

year.textContent = new Date().getFullYear();

modified.textContent = "Last Modified: " + document.lastModified;
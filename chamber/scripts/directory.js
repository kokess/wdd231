// js/directory.js

const url = "data/members.json";
const cards = document.querySelector("#cards");

// Async fetch function
async function getMembers() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayMembers(data.members);
    } catch (error) {
        console.error("Error fetching member data:", error);
    }
}

// Display members in cards
const displayMembers = (members) => {
    members.forEach(member => {
        const card = document.createElement("section");

        const fullName = document.createElement("h2");
        fullName.textContent = member.name;

        const portrait = document.createElement("img");
        portrait.setAttribute("src", `images/${member.image}`);
        portrait.setAttribute("alt", `Logo of ${member.name}`);
        portrait.setAttribute("loading", "lazy");
        portrait.setAttribute("width", "340");
        portrait.setAttribute("height", "440");

        const info = document.createElement("p");
        info.classList.add("member-info");
        info.textContent = `${member.address} | ${member.phone} | ${member.website}`;

        card.appendChild(fullName);
        card.appendChild(portrait);
        card.appendChild(info);

        cards.appendChild(card);
    });
};

// Call fetch
getMembers();
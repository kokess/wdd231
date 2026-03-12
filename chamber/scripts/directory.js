const url = "data/members.json";
const cards = document.querySelector("#cards");

async function getMembers() {

    const response = await fetch(url);

    const data = await response.json();

    displayMembers(data.members);

}

function displayMembers(members) {

    cards.innerHTML = "";

    members.forEach(member => {

        const card = document.createElement("section");

        const name = document.createElement("h3");
        name.textContent = member.name;

        const logo = document.createElement("img");
        logo.src = `images/${member.image}`;
        logo.alt = `${member.name} logo`;
        logo.loading = "lazy";

        const address = document.createElement("p");
        address.textContent = member.address;

        const phone = document.createElement("p");
        phone.textContent = member.phone;

        const website = document.createElement("a");
        website.href = member.website;
        website.textContent = "Visit Website";
        website.target = "_blank";

        const membership = document.createElement("p");

        if (member.membership === 3) membership.textContent = "Gold Member";
        if (member.membership === 2) membership.textContent = "Silver Member";
        if (member.membership === 1) membership.textContent = "Member";

        card.appendChild(name);
        card.appendChild(logo);
        card.appendChild(address);
        card.appendChild(phone);
        card.appendChild(website);
        card.appendChild(membership);

        cards.appendChild(card);

    });

}

getMembers();


const gridBtn = document.querySelector("#gridBtn");
const listBtn = document.querySelector("#listBtn");

gridBtn.addEventListener("click", () => {

    cards.classList.add("grid");
    cards.classList.remove("list");

});

listBtn.addEventListener("click", () => {

    cards.classList.add("list");
    cards.classList.remove("grid");

});


document.querySelector("#year").textContent = new Date().getFullYear();

document.querySelector("#lastModified").textContent = document.lastModified;
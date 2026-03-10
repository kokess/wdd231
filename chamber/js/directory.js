const url = "data/members.json";
const membersContainer = document.querySelector("#members");

const gridBtn = document.querySelector("#grid");
const listBtn = document.querySelector("#list");

async function getMembers() {

    const response = await fetch(url);
    const data = await response.json();

    displayMembers(data.members);

}

const displayMembers = (members) => {

    members.forEach(member => {

        let card = document.createElement("section");

        let name = document.createElement("h3");
        let address = document.createElement("p");
        let phone = document.createElement("p");
        let website = document.createElement("a");
        let logo = document.createElement("img");

        name.textContent = member.name;
        address.textContent = member.address;
        phone.textContent = member.phone;

        website.textContent = "Visit Website";
        website.href = member.website;

        logo.src = `images/${member.image}`;
        logo.alt = member.name;

        card.appendChild(logo);
        card.appendChild(name);
        card.appendChild(address);
        card.appendChild(phone);
        card.appendChild(website);

        membersContainer.appendChild(card);

    });

};

gridBtn.addEventListener("click", () => {
    membersContainer.classList.add("grid");
    membersContainer.classList.remove("list");
});

listBtn.addEventListener("click", () => {
    membersContainer.classList.add("list");
    membersContainer.classList.remove("grid");
});

document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = document.lastModified;

getMembers();
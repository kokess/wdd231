const grid = document.querySelector("#discoverGrid");

async function getFoods() {
    try {
        const response = await fetch("data/foods.json");
        const data = await response.json();
        displayFoods(data);
    } catch (error) {
        console.error("Error:", error);
    }
}

function displayFoods(foods) {
    grid.innerHTML = foods.map(food => `
    <div class="card">
      <img src="${food.image}" loading="lazy">
      <h2>${food.name}</h2>
      <p>${food.location}</p>
      <p>${food.price}</p>
      <button class="viewBtn">View</button>
    </div>
  `).join("");
}

getFoods();
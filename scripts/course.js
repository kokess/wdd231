const courses = [
    { id: 1, name: "WDD 130", type: "WDD", credits: 2, completed: true },
    { id: 2, name: "WDD 131", type: "WDD", credits: 2, completed: false },
    { id: 3, name: "WDD 231", type: "WDD", credits: 2, completed: false }
];

const coursesContainer = document.getElementById("courses");
const totalCredits = document.getElementById("totalCredits");

function displayCourses(filter = "All") {
    let filtered = courses;
    if (filter !== "All") filtered = courses.filter(c => c.type === filter);

    coursesContainer.innerHTML = "";
    filtered.forEach(c => {
        const div = document.createElement("div");
        div.className = `course-card ${c.completed ? "completed" : ""}`;
        div.textContent = `${c.name} (${c.credits} credits)`;
        coursesContainer.appendChild(div);
    });

    const sumCredits = filtered.reduce((sum, c) => sum + c.credits, 0);
    totalCredits.textContent = `Total credits: ${sumCredits}`;
}

document.getElementById("allBtn").addEventListener("click", () => displayCourses("All"));
document.getElementById("wddBtn").addEventListener("click", () => displayCourses("WDD"));
document.getElementById("cseBtn").addEventListener("click", () => displayCourses("CSE"));

displayCourses();
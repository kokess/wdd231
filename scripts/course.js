const courses = [
    { id: 1, name: "WDD 130", type: "WDD", credits: 2, completed: true },
    { id: 2, name: "WDD 131", type: "WDD", credits: 2, completed: false },
    { id: 3, name: "WDD 231", type: "WDD", credits: 2, completed: false }
];

const coursesContainer = document.getElementById("courses");
const totalCredits = document.getElementById("totalCredits");

function displayCourses(filter = "All") {

    let filtered = courses;

    if (filter !== "All") {
        filtered = courses.filter(course => course.type === filter);
    }

    coursesContainer.innerHTML = "";

    filtered.forEach(course => {

        const div = document.createElement("div");

        div.className = "course-card";

        if (course.completed) {
            div.classList.add("completed");
        }

        div.textContent = `${course.name} (${course.credits} credits)`;

        coursesContainer.appendChild(div);

    });

    const total = filtered.reduce((sum, course) => sum + course.credits, 0);

    totalCredits.textContent = `Total Credits: ${total}`;

}

document.getElementById("allBtn").addEventListener("click", () => displayCourses("All"));
document.getElementById("wddBtn").addEventListener("click", () => displayCourses("WDD"));
document.getElementById("cseBtn").addEventListener("click", () => displayCourses("CSE"));

displayCourses();
const addTaskBtn = document.getElementById("addTaskBtn");
const taskModal = document.getElementById("taskModal");
const closeBtn = document.querySelector(".closeBtn");
const saveTaskBtn = document.getElementById("saveTask");

const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskPriority = document.getElementById("taskPriority");
const taskDate = document.getElementById("taskDate");

const taskList = document.getElementById("taskList");
const searchTask = document.getElementById("searchTask");
const filterTasks = document.getElementById("filterTasks");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

let tasks = JSON.parse(localStorage.getItem("premiumTasks")) || [];
let editIndex = null;

/* Open Modal */
addTaskBtn.addEventListener("click", () => {
    taskModal.style.display = "flex";
    clearForm();
});

/* Close Modal */
closeBtn.addEventListener("click", () => {
    taskModal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === taskModal) {
        taskModal.style.display = "none";
    }
});

/* Save Task */
saveTaskBtn.addEventListener("click", () => {
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();
    const priority = taskPriority.value;
    const dueDate = taskDate.value;

    if (!title || !description || !dueDate) {
        alert("Please fill all fields!");
        return;
    }

    const taskData = {
        title,
        description,
        priority,
        dueDate,
        completed: false
    };

    if (editIndex !== null) {
        taskData.completed = tasks[editIndex].completed;
        tasks[editIndex] = taskData;
        editIndex = null;
    } else {
        tasks.push(taskData);
    }

    saveTasks();
    renderTasks();
    taskModal.style.display = "none";
    clearForm();
});

/* Render Tasks */
function renderTasks(filteredTasks = tasks) {
    taskList.innerHTML = "";

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <div class="task-item">
                <h3>No Tasks Found ✨</h3>
                <p>Create your first premium task.</p>
            </div>
        `;
        updateStats();
        return;
    }

    filteredTasks.forEach((task, index) => {
        const taskDiv = document.createElement("div");
        taskDiv.className = `task-item ${task.completed ? "completed" : ""}`;

        taskDiv.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>📅 Due Date: ${task.dueDate}</p>
            <span class="priority ${task.priority.toLowerCase()}">${task.priority} Priority</span>

            <div class="task-actions">
                <button class="complete-btn" onclick="toggleComplete(${index})">
                    ${task.completed ? "↩ Undo" : "✅ Complete"}
                </button>
                <button class="edit-btn" onclick="editTask(${index})">✏ Edit</button>
                <button class="delete-btn" onclick="deleteTask(${index})">🗑 Delete</button>
            </div>
        `;

        taskList.appendChild(taskDiv);
    });

    updateStats();
}

/* Complete Task */
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

/* Delete Task */
function deleteTask(index) {
    if (confirm("Delete this task?")) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
}

/* Edit Task */
function editTask(index) {
    const task = tasks[index];

    taskTitle.value = task.title;
    taskDescription.value = task.description;
    taskPriority.value = task.priority;
    taskDate.value = task.dueDate;

    editIndex = index;
    taskModal.style.display = "flex";
}

/* Search */
searchTask.addEventListener("input", () => {
    const query = searchTask.value.toLowerCase();

    const filtered = tasks.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
    );

    renderTasks(filtered);
});

/* Filter */
filterTasks.addEventListener("change", () => {
    const value = filterTasks.value;
    let filtered = [];

    switch (value) {
        case "pending":
            filtered = tasks.filter(task => !task.completed);
            break;

        case "completed":
            filtered = tasks.filter(task => task.completed);
            break;

        case "high":
            filtered = tasks.filter(task => task.priority === "High");
            break;

        default:
            filtered = tasks;
    }

    renderTasks(filtered);
});

/* Stats */
function updateStats() {
    totalTasks.textContent = tasks.length;
    completedTasks.textContent = tasks.filter(task => task.completed).length;
    pendingTasks.textContent = tasks.filter(task => !task.completed).length;
}

/* Save Local Storage */
function saveTasks() {
    localStorage.setItem("premiumTasks", JSON.stringify(tasks));
}

/* Clear Form */
function clearForm() {
    taskTitle.value = "";
    taskDescription.value = "";
    taskPriority.value = "Low";
    taskDate.value = "";
}

/* Load Tasks */
renderTasks();
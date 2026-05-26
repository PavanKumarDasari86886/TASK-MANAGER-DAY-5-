const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const category = document.getElementById("category");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");
const taskList = document.getElementById("taskList");
const searchTask = document.getElementById("searchTask");
const filterTasks = document.getElementById("filterTasks");
const clearAll = document.getElementById("clearAll");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

let tasks = JSON.parse(localStorage.getItem("neonTasks")) || [];

/* Save tasks */
function saveTasks() {
    localStorage.setItem("neonTasks", JSON.stringify(tasks));
}

/* Update stats */
function updateStats() {
    totalTasks.textContent = tasks.length;
    completedTasks.textContent = tasks.filter(task => task.completed).length;
    pendingTasks.textContent = tasks.filter(task => !task.completed).length;
}

/* Render tasks */
function renderTasks() {
    taskList.innerHTML = "";

    const searchValue = searchTask.value.toLowerCase();
    const filterValue = filterTasks.value;

    let filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchValue);

        let matchesFilter = true;

        if (filterValue === "completed") {
            matchesFilter = task.completed;
        } else if (filterValue === "pending") {
            matchesFilter = !task.completed;
        }

        return matchesSearch && matchesFilter;
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <h3>No tasks yet</h3>
                <p>Add a new task to get started</p>
            </div>
        `;
    } else {
        filteredTasks.forEach((task, index) => {
            const taskCard = document.createElement("div");
            taskCard.className = "task-card";

            if (task.completed) {
                taskCard.style.opacity = "0.6";
                taskCard.style.border = "2px solid #00ff88";
            }

            taskCard.innerHTML = `
                <h3>${task.title}</h3>
                <p><strong>Category:</strong> ${task.category}</p>
                <p><strong>Priority:</strong> ${task.priority}</p>
                <p><strong>Due Date:</strong> ${task.dueDate}</p>

                <div class="task-actions">
                    <button class="complete-btn" onclick="toggleComplete(${index})">
                        ${task.completed ? "Undo" : "Complete"}
                    </button>

                    <button class="edit-btn" onclick="editTask(${index})">
                        Edit
                    </button>

                    <button class="delete-btn" onclick="deleteTask(${index})">
                        Delete
                    </button>
                </div>
            `;

            taskList.appendChild(taskCard);
        });
    }

    updateStats();
    saveTasks();
}

/* Add task */
taskForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = taskInput.value.trim();

    if (title === "") return;

    const newTask = {
        title,
        category: category.value,
        priority: priority.value,
        dueDate: dueDate.value,
        completed: false
    };

    tasks.push(newTask);

    taskInput.value = "";
    dueDate.value = "";

    renderTasks();
});

/* Complete */
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

/* Delete */
function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

/* Edit */
function editTask(index) {
    const task = tasks[index];

    const newTitle = prompt("Edit task name:", task.title);
    if (!newTitle || newTitle.trim() === "") return;

    task.title = newTitle.trim();

    renderTasks();
}

/* Search */
searchTask.addEventListener("input", renderTasks);

/* Filter */
filterTasks.addEventListener("change", renderTasks);

/* Clear all */
clearAll.addEventListener("click", function () {
    const confirmDelete = confirm("Delete all tasks?");
    if (confirmDelete) {
        tasks = [];
        renderTasks();
    }
});

/* Initial load */
renderTasks();
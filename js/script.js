const input = document.getElementById("input-box");
const addButton = document.getElementById("add-btn");
const listContainer = document.getElementById("list-el");
const noTask = document.getElementById("no-task");
const countDis = document.getElementById("count");
const clearBtn = document.getElementById("clear-btn");

countDis.style.display = "none";

// Create a task item
function createTaskElement(taskText) {
  const li = document.createElement("li");
  li.classList.add("d-flex", "justify-content-between", "align-items-center", "px-2", "py-2");

  const taskSpan = document.createElement("span");
  taskSpan.textContent = taskText;
  taskSpan.style.flexGrow = "1";

  const buttonGroup = document.createElement("div");

  // Edit button
  const editBtn = document.createElement("i");
  editBtn.className = "bi bi-pencil-square text-primary me-2"; // Blue color for edit button
  editBtn.style.cursor = "pointer";
  editBtn.title = "Edit task";

  // Delete button (same blue color for delete icon)
  const deleteBtn = document.createElement("i");
  deleteBtn.className = "bi bi-x-circle text-primary"; // Blue color for delete icon
  deleteBtn.style.cssText = "cursor: pointer; font-size: 20px;";
  deleteBtn.title = "Delete task";

  // Edit handler
  editBtn.addEventListener("click", () => {
    taskSpan.contentEditable = "true";
    taskSpan.focus();
    taskSpan.classList.add("border", "border-primary", "rounded", "px-1");

    // Save on blur (when clicked away)
    taskSpan.addEventListener("blur", () => {
      taskSpan.contentEditable = "false";
      taskSpan.classList.remove("border", "border-primary", "rounded", "px-1");
      saveTasksToLocal();
      refreshUI();
    });

    // Optional: Save on Enter key too
    taskSpan.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault(); // prevent new line
        taskSpan.blur();    // trigger blur event
      }
    });
  });

  // Delete handler (blue color for delete icon)
  deleteBtn.addEventListener("click", () => {
    li.remove();
    saveTasksToLocal();
    refreshUI();
  });

  buttonGroup.appendChild(editBtn);
  buttonGroup.appendChild(deleteBtn);

  li.appendChild(taskSpan);
  li.appendChild(buttonGroup);
  listContainer.appendChild(li);
}

// Load tasks from localStorage
document.addEventListener("DOMContentLoaded", () => {
  const storedTasks = JSON.parse(localStorage.getItem("Tasks")) || [];
  storedTasks.forEach(task => createTaskElement(task));
  refreshUI();
});

// Add new task
addButton.addEventListener("click", () => {
  const taskValue = input.value.trim();
  if (taskValue === "") {
    const myModal = new bootstrap.Modal(document.getElementById('taskAlertModal'));
    myModal.show();
    return;
  }

  createTaskElement(taskValue);
  saveTasksToLocal();
  input.value = "";
  refreshUI();
});

// Add task with Enter key
input.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    addButton.click();
  }
});

// Clear all tasks
clearBtn.addEventListener('click', () => {
  listContainer.innerHTML = '';
  localStorage.removeItem("Tasks");
  refreshUI();
});

// Save tasks to localStorage
function saveTasksToLocal() {
  const tasks = [];
  const listItems = listContainer.querySelectorAll("li span");
  listItems.forEach(span => {
    tasks.push(span.textContent.trim());
  });
  localStorage.setItem("Tasks", JSON.stringify(tasks));
}

// Update task count display
function refreshUI() {
  const listLength = listContainer.children.length;

  if (listLength > 0) {
    noTask.style.display = "none";
    countDis.style.display = "block";
    countDis.innerText = `You have ${listLength} task${listLength > 1 ? 's' : ''}`;
    countDis.classList.remove("bg-warning", "bg-danger", "text-light");

    if (listLength > 10) {
      countDis.classList.add("bg-danger", "text-light");
    } else if (listLength > 5) {
      countDis.classList.add("bg-warning");
    }
  } else {
    noTask.style.display = "block";
    countDis.style.display = "none";
    countDis.classList.remove("bg-warning", "bg-danger", "text-light");
  }
}

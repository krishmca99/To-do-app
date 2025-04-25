const input = document.getElementById("input-box");
const addButton = document.getElementById("add-btn");
const listContainer = document.getElementById("list-el");
const noTask = document.getElementById("no-task");
const countDis = document.getElementById("count");
const clearBtn = document.getElementById("clear-btn");

countDis.style.display = "none";

// create a list item (reusable)
function createTaskElement(taskText) {
  const li = document.createElement("li");
  li.textContent = taskText;

  const spanElement = document.createElement("span");
  spanElement.className = "close";
  spanElement.style.verticalAlign = "middle";

  const closeIcon = document.createElement("i");
  closeIcon.className = "bi bi-x-circle";
  closeIcon.style.cssText = "cursor: pointer; font-size: 20px; float: right;";
  closeIcon.setAttribute("aria-hidden", "true");

  // Delete event
  closeIcon.addEventListener("click", () => {
    li.remove();
    saveTasksToLocal();
    refreshUI();
  });

  li.appendChild(spanElement);
  spanElement.appendChild(closeIcon);
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

// Save all tasks to localStorage
function saveTasksToLocal() {
  const tasks = [];
  const listItems = listContainer.querySelectorAll("li");
  listItems.forEach(li => {
    tasks.push(li.firstChild.textContent.trim());
  });
  localStorage.setItem("Tasks", JSON.stringify(tasks));
}

// Refresh UI 
function refreshUI() {
  const listLength = listContainer.children.length;

  if (listLength > 0) {
    noTask.style.display = "none";
    countDis.style.display = "block";
    countDis.innerText = `You have ${listLength} tasks`;
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

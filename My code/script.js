let tasks = [];

function addTask() {
  const taskName = document.getElementById("taskName").value;
  const taskDate = document.getElementById("taskDate").value;
  const taskTime = document.getElementById("taskTime").value;

  if (!taskName || !taskDate || !taskTime) {
    alert("Please fill in all fields.");
    return;
  }

  const task = {
    name: taskName,
    date: taskDate,
    time: taskTime,
    status: "none", // "none" (remaining), "true" (completed), "false" (missing)
  };

  tasks.push(task);
  renderTasks();
  resetInputFields();
}

function renderTasks(filter = null) {
  const tableBody = document.getElementById("taskTable").getElementsByTagName("tbody")[0];
  tableBody.innerHTML = '';

  const filteredTasks = filter === null ? tasks : tasks.filter(task => {
    if (filter === 'false') {
      return task.status === "none" && isTaskOverdue(task.date);
    }
    return task.status === filter;
  });

  filteredTasks.forEach((task, index) => {
    const isMissing = task.status === "none" && isTaskOverdue(task.date);

    const row = tableBody.insertRow();
    row.innerHTML = `
      <td>
        <input type="radio" ${task.status === "true" ? 'checked' : ''} onclick="toggleTaskStatus(${index})" />
      </td>
      <td class="${task.status === "true" ? 'strike' : (isMissing ? 'missing' : '')}">${task.name}</td>
      <td>${task.date} ${task.time}</td>
      <td>${task.status === "true" ? "Completed" : isMissing ? "Missing" : "Remaining"}</td>
      <td>
        <button onclick="editTask(${index})" class="edit">Edit</button>
        <button onclick="deleteTask(${index})" class="delete">Delete</button>
      </td>
    `;
  });
}

function resetInputFields() {
  document.getElementById("taskName").value = '';
  document.getElementById("taskDate").value = '';
  document.getElementById("taskTime").value = '';
}

function toggleTaskStatus(index) {
  const task = tasks[index];
  task.status = task.status === "none" ? "true" : "none";
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function editTask(index) {
  const task = tasks[index];
  document.getElementById("taskName").value = task.name;
  document.getElementById("taskDate").value = task.date;
  document.getElementById("taskTime").value = task.time;

  const addTaskButton = document.getElementById("addTaskButton");
  addTaskButton.textContent = "Update Task";
  addTaskButton.onclick = function() {
    updateTask(index);
  };
}

function updateTask(index) {
  const taskName = document.getElementById("taskName").value;
  const taskDate = document.getElementById("taskDate").value;
  const taskTime = document.getElementById("taskTime").value;

  if (!taskName || !taskDate || !taskTime) {
    alert("Please fill in all fields.");
    return;
  }

  tasks[index] = {
    ...tasks[index],
    name: taskName,
    date: taskDate,
    time: taskTime,
  };

  resetInputFields();

  const addTaskButton = document.getElementById("addTaskButton");
  addTaskButton.textContent = "Add Task";
  addTaskButton.onclick = addTask;

  renderTasks();
}

function filterTasks(status) {
  renderTasks(status === 'all' ? null : status);
}

function clearTasks() {
  tasks = [];
  renderTasks();
}

function isTaskOverdue(taskDate) {
  const taskDateObj = new Date(taskDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return taskDateObj < today;
}

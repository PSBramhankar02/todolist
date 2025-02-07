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
}

function renderTasks(filter = null) {
  const tableBody = document.getElementById("taskTable").getElementsByTagName("tbody")[0];
  tableBody.innerHTML = '';

  // Filter tasks based on status
  const filteredTasks = filter === null ? tasks : tasks.filter(task => {
    if (filter === 'false') {
      // Missing tasks are remaining tasks that have an overdue date
      return task.status === "none" && isTaskOverdue(task.date);
    }
    return task.status === filter;
  });

  filteredTasks.forEach((task, index) => {
    const isMissing = task.status === "none" && isTaskOverdue(task.date); // Check if task is missing (overdue)

    const row = tableBody.insertRow();
    row.innerHTML = `
      <td>
        <input type="radio" ${task.status === "true" ? 'checked' : ''} onclick="toggleTaskStatus(${index})" />
      </td>
      <td class="${task.status === "true" ? 'strike' : (isMissing ? 'missing' : '')}">${task.name}</td>
      <td>${task.date} ${task.time}</td>
      <td>${task.status === "true" ? "Completed" : isMissing ? "Missing" : "Remaining"}</td>
      <td>
        <button onclick="deleteTask(${index})" class="delete">Delete</button>
      </td>
    `;
  });
}

function toggleTaskStatus(index) {
  const task = tasks[index];
  
  // Toggle task status between completed and remaining
  if (task.status === "none") {
    task.status = "true"; // Mark as completed
  } else {
    task.status = "none"; // Mark as remaining
  }

  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function filterTasks(status) {
  renderTasks(status);
}

function clearTasks() {
  tasks = [];
  renderTasks();
}

function isTaskOverdue(taskDate) {
  const taskDateObj = new Date(taskDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight for comparison
  return taskDateObj < today;
}

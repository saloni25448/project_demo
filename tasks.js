$(document).ready(function () {
  // --- Mobile Menu Toggle ---
  $(".mobile-menu-btn").click(function () {
    $(".main-nav").toggleClass("active");
  });

  // Sample task data (replace or load from localStorage/backend)
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // --- Update Quick Stats ---
  function updateQuickStats(tasks) {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const pending = tasks.filter((t) => t.status === "Pending").length;
    const today = new Date().setHours(0, 0, 0, 0);
    const overdue = tasks.filter((t) => {
      const due = new Date(t.dueDate).setHours(0, 0, 0, 0);
      return due < today && t.status !== "Completed";
    }).length;

    $(".stat-item:contains('Total Tasks') .stat-number").text(total);
    $(".stat-item:contains('Completed') .stat-number").text(completed);
    $(".stat-item:contains('Pending') .stat-number").text(pending);
    $(".stat-item:contains('Overdue') .stat-number").text(overdue);
  }

  // --- Render Recent Tasks (latest 5) ---
  function renderRecentTasks(tasks) {
    // Example container; add your HTML container for recent tasks if needed
    const recentTasksContainer = $("#recentTasks");
    if (!recentTasksContainer.length) return; // skip if no container

    recentTasksContainer.empty();

    const recentTasks = tasks
      .slice()
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      .slice(0, 5);

    recentTasks.forEach((task) => {
      const statusClass = task.status.toLowerCase();
      const taskHTML = `
        <div class="task-item ${statusClass}">
          <div class="task-checkbox">
            <input type="checkbox" ${
              task.status === "Completed" ? "checked" : ""
            } disabled />
            <span class="checkmark"></span>
          </div>
          <div class="task-details">
            <h4 class="task-title">${task.name}</h4>
            <div class="task-meta">
              <span class="task-category ${task.category.toLowerCase()}">${task.category}</span>
              <span class="task-priority ${task.priority.toLowerCase()}">${task.priority}</span>
              <span class="task-date">Due: ${task.dueDate}</span>
            </div>
          </div>
        </div>
      `;
      recentTasksContainer.append(taskHTML);
    });
  }

  // --- Initialize and update ---
  function init() {
    updateQuickStats(tasks);
    renderRecentTasks(tasks);
  }

  // Initialize on page load
  init();
});

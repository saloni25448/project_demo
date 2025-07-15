$(document).ready(function() {
  // Load tasks from localStorage or empty array
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
$(".mobile-menu-btn").click(function() {
  $(".dashboard-sidebar").toggleClass("mobile-visible");
});

  // --- Update Task Stats ---
  function updateTaskStats(tasks) {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'Pending').length;

    const today = new Date().setHours(0,0,0,0);
    const overdueTasks = tasks.filter(t => {
      const due = new Date(t.dueDate).setHours(0,0,0,0);
      return due < today && t.status !== 'Completed';
    }).length;

    $('.stat-card .total-tasks + .stat-info .stat-value').text(totalTasks);
    $('.stat-card .completed-tasks + .stat-info .stat-value').text(completedTasks);
    $('.stat-card .pending-tasks + .stat-info .stat-value').text(pendingTasks);
    $('.stat-card .overdue-tasks + .stat-info .stat-value').text(overdueTasks);
  }

  // --- Initialize flatpickr datepicker ---
  $(".datepicker").flatpickr({
    mode: "range",
    dateFormat: "Y-m-d",
    defaultDate: "today"
  });

  // --- Date range filter buttons ---
  $(".date-range-btn").click(function() {
    $(".date-range-btn").removeClass("active");
    $(this).addClass("active");
    const range = $(this).text().toLowerCase();
    console.log("Filtering tasks for:", range);
    // Optional: Implement filtering logic per date range here
  });

  // --- Chart Setup ---
  const completionCtx = document.getElementById('completionChart').getContext('2d');
  const completionChart = new Chart(completionCtx, {
    type: 'line',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{
        label: 'Completion Rate',
        data: [0, 0, 0, 0], // will be updated
        backgroundColor: 'rgba(128, 203, 196, 0.2)',
        borderColor: '#80CBC4',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { callback: val => val + '%' }
        }
      }
    }
  });

  const categoryCtx = document.getElementById('categoryChart').getContext('2d');
  const categoryChart = new Chart(categoryCtx, {
    type: 'doughnut',
    data: {
      labels: ['Work', 'Personal', 'Home', 'Urgent'],
      datasets: [{
        data: [0, 0, 0, 0], // will be updated
        backgroundColor: ['#80CBC4', '#B4EBE6', '#FFB433', '#e57373'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'right' } },
      cutout: '70%'
    }
  });
  


  // --- Update Charts dynamically ---
  function updateCharts(tasks) {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    completionChart.data.datasets[0].data = [completionRate, completionRate, completionRate, completionRate];
    completionChart.update();

    const categories = ['Work', 'Personal', 'Home', 'Urgent'];
    const counts = categories.map(cat => tasks.filter(t => t.category === cat).length);

    categoryChart.data.datasets[0].data = counts;
    categoryChart.update();
  }

  // --- Helper to calculate time left for deadlines ---
  function getTimeLeft(dueDateStr) {
    const today = new Date().setHours(0,0,0,0);
    const due = new Date(dueDateStr).setHours(0,0,0,0);
    const diffDays = Math.floor((due - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  }

  // --- Render Recent Tasks (top 5 by startDate descending) ---
  function renderRecentTasks(tasks) {
    const container = $('.recent-tasks .task-list');
    container.empty();

    const recentTasks = tasks.slice().sort((a,b) => new Date(b.startDate) - new Date(a.startDate)).slice(0,5);

    recentTasks.forEach(task => {
      const statusClass = task.status.toLowerCase() === 'completed' ? 'completed' : 
                          (task.status.toLowerCase() === 'pending' ? 'pending' : '');
      container.append(`
        <div class="task-item ${statusClass}">
          <div class="task-checkbox">
            <input type="checkbox" ${task.status === 'Completed' ? 'checked' : ''} disabled>
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
          <div class="task-actions">
            <button class="btn-icon edit-task" title="Edit task" onclick="openEditModal(${task.id})">
              <i class="fas fa-edit"></i>
            </button>
          </div>
        </div>
      `);
    });
  }

  // --- Render Upcoming Deadlines (top 5 with dueDate >= today) ---
  function renderUpcomingDeadlines(tasks) {
    const container = $('.upcoming-deadlines .deadline-list');
    container.empty();

    const today = new Date().setHours(0,0,0,0);

    const upcoming = tasks
      .filter(t => new Date(t.dueDate).setHours(0,0,0,0) >= today)
      .sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0,5);

    upcoming.forEach(task => {
      const dueDate = new Date(task.dueDate);
      const day = dueDate.getDate();
      const month = dueDate.toLocaleString('default', { month: 'short' });

      container.append(`
        <div class="deadline-item ${task.priority.toLowerCase()}">
          <div class="deadline-date">
            <span class="day">${day}</span>
            <span class="month">${month}</span>
          </div>
          <div class="deadline-details">
            <h4 class="deadline-title">${task.name}</h4>
            <p class="deadline-project">${task.category} Task</p>
            <div class="deadline-meta">
              <span class="priority ${task.priority.toLowerCase()}">${task.priority}</span>
              <span class="time-left">${getTimeLeft(task.dueDate)}</span>
            </div>
          </div>
        </div>
      `);
    });
  }

  // --- Chart period filter change handler (optional) ---
  $(".chart-period").change(function() {
    const period = $(this).val();
    console.log("Chart period changed to:", period);
    // Implement filtering logic based on period if desired
  });

  // --- Refresh productivity tips (optional) ---
  $(".refresh-tips").click(function() {
    console.log("Refreshing productivity tips");
    $(this).find("i").addClass("fa-spin");
    setTimeout(() => {
      $(this).find("i").removeClass("fa-spin");
      // Update tips content here
    }, 1000);
  });

  // --- Mobile sidebar toggle ---
  $(".mobile-menu-btn").click(function() {
    $(".dashboard-sidebar").toggleClass("mobile-visible");
  });

  // --- Initial updates ---
  updateTaskStats(tasks);
  updateCharts(tasks);
  renderRecentTasks(tasks);
  renderUpcomingDeadlines(tasks);
});

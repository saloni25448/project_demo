// settings.js

document.addEventListener("DOMContentLoaded", () => {
  const completedBarFill = document.querySelector("#completedBar .progress-fill");
  const ongoingBarFill = document.querySelector("#ongoingBar .progress-fill");
  const completedCount = document.getElementById("completedCount");
  const ongoingCount = document.getElementById("ongoingCount");

  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const updateBtn = document.getElementById("updateBtn");
  const statusText = document.getElementById("status");
  const modeToggle = document.getElementById("modeToggle");

  // Load profile info from localStorage (demo)
  const savedProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
  usernameInput.value = savedProfile.username || "";
  emailInput.value = savedProfile.email || "";

  // Load dark mode preference
  const darkModeEnabled = localStorage.getItem("darkMode") === "true";
  modeToggle.checked = darkModeEnabled;
  toggleDarkMode(darkModeEnabled);

  // Load tasks progress from localStorage
  updateTaskProgress();

  // Update profile info on button click
  updateBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();

    if (!username || !email) {
      showStatus("Please fill in both username and email.", false);
      return;
    }

    // Simple email validation
    if (!validateEmail(email)) {
      showStatus("Please enter a valid email address.", false);
      return;
    }

    localStorage.setItem("userProfile", JSON.stringify({ username, email }));
    showStatus("Profile updated successfully!", true);
  });

  // Dark mode toggle
  modeToggle.addEventListener("change", () => {
    toggleDarkMode(modeToggle.checked);
    localStorage.setItem("darkMode", modeToggle.checked);
  });

  // Function to update dark mode class
  function toggleDarkMode(enabled) {
    if (enabled) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }

  // Function to update progress bars from tasks in localStorage
  function updateTaskProgress() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const completedTasks = tasks.filter((t) => t.status === "Completed").length;
    const ongoingTasks = tasks.filter((t) => t.status !== "Completed").length;
    const totalTasks = tasks.length || 1; // Avoid division by zero

    const completedPercent = Math.round((completedTasks / totalTasks) * 100);
    const ongoingPercent = Math.round((ongoingTasks / totalTasks) * 100);

    completedBarFill.style.width = completedPercent + "%";
    ongoingBarFill.style.width = ongoingPercent + "%";

    completedCount.textContent = `${completedTasks} Task${completedTasks !== 1 ? "s" : ""}`;
    ongoingCount.textContent = `${ongoingTasks} Task${ongoingTasks !== 1 ? "s" : ""}`;
  }

  // Show status message
  function showStatus(msg, success = true) {
    statusText.textContent = msg;
    statusText.style.color = success ? "var(--success-color)" : "var(--danger-color)";
    setTimeout(() => {
      statusText.textContent = "";
    }, 3000);
  }

  // Basic email format validation
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});

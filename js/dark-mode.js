// Initialize dark mode theme immediately based on saved preference
function initializeDarkMode() {
  const currentTheme = localStorage.getItem('theme') || 'light';

  // Apply the saved theme immediately to prevent flash of incorrect theme
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

// Initialize dark mode immediately when script is loaded
initializeDarkMode();

// Flag to ensure we only initialize the toggle once
let darkModeToggleInitialized = false;

// Function to handle theme toggling
function toggleDarkMode(icon = null) {
  const currentTheme = document.documentElement.getAttribute('data-theme');

  // Apply theme change
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    // Update icon if provided
    if (icon) {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    // Update icon if provided
    if (icon) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    }
  }
}

// Set up dark mode functionality after DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Initialize dark mode toggle button
  function initDarkModeToggle() {
    const desktopToggleButton = document.getElementById('dark-mode-toggle');
    const mobileToggleButton = document.getElementById('mobile-dark-mode-toggle');

    // If buttons don't exist yet or we've already initialized, exit
    if ((!desktopToggleButton && !mobileToggleButton) || darkModeToggleInitialized) {
      return;
    }

    // Process desktop toggle
    if (desktopToggleButton) {
      updateToggleIcon(desktopToggleButton, localStorage.getItem('theme') || 'light');
      desktopToggleButton.addEventListener('click', () => {
        toggleDarkMode(desktopToggleButton.querySelector('i'));
      });
    }

    // Process mobile toggle
    if (mobileToggleButton) {
      updateToggleIcon(mobileToggleButton, localStorage.getItem('theme') || 'light');
      mobileToggleButton.addEventListener('click', () => {
        toggleDarkMode(mobileToggleButton.querySelector('i'));
      });
    }

    // Mark as initialized
    darkModeToggleInitialized = true;
  }

  // Update toggle icon based on current theme
  function updateToggleIcon(toggleButton, currentTheme) {
    const icon = toggleButton.querySelector('i');
    if (!icon) return;

    // Apply the saved theme on page load
    if (currentTheme === 'dark') {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  }

  // Try to initialize immediately
  initDarkModeToggle();

  // Listen for header loaded event
  document.addEventListener('headerLoaded', initDarkModeToggle);

  // Also try after a short delay in case header is still loading
  setTimeout(initDarkModeToggle, 100);
});
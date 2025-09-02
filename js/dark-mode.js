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

// Set up dark mode functionality after DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Initialize dark mode toggle button
  function initDarkModeToggle() {
    const toggleButton = document.getElementById('dark-mode-toggle');

    // If button doesn't exist yet or we've already initialized, exit
    if (!toggleButton || darkModeToggleInitialized) {
      return;
    }

    const icon = toggleButton.querySelector('i');

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Apply the saved theme on page load
    if (currentTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (icon) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      }
    } else {
      // Ensure light mode classes are properly set
      document.documentElement.setAttribute('data-theme', 'light');
      if (icon) {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
    }

    // Toggle dark mode when button is clicked
    toggleButton.addEventListener('click', () => {
      // Temporarily disable transitions to prevent staggered updates
      const style = document.createElement('style');
      style.innerHTML = '* { transition: none !important; }';
      document.head.appendChild(style);

      const currentTheme = document.documentElement.getAttribute('data-theme');

      // Apply theme change
      if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        if (icon) {
          icon.classList.remove('fa-sun');
          icon.classList.add('fa-moon');
        }
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (icon) {
          icon.classList.remove('fa-moon');
          icon.classList.add('fa-sun');
        }
      }

      // Re-enable transitions after a short delay
      setTimeout(() => {
        document.head.removeChild(style);
      }, 10);
    });

    // Mark as initialized
    darkModeToggleInitialized = true;
  }

  // Try to initialize immediately
  initDarkModeToggle();

  // Listen for header loaded event
  document.addEventListener('headerLoaded', initDarkModeToggle);

  // Also try after a short delay in case header is still loading
  setTimeout(initDarkModeToggle, 100);
});
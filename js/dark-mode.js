// Function to initialize dark mode immediately
function initializeDarkMode() {
  const currentTheme = localStorage.getItem('theme') || 'light';

  // Apply the saved theme immediately
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

// Initialize dark mode immediately when script is loaded
initializeDarkMode();

// Dark mode functionality
document.addEventListener('DOMContentLoaded', function () {
  // This ensures the dark mode toggle is properly initialized
  // after the header is loaded via templates.js
  setTimeout(() => {
    const toggleButton = document.getElementById('dark-mode-toggle');
    const icon = toggleButton ? toggleButton.querySelector('i') : null;

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
    if (toggleButton) {
      toggleButton.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');

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
      });
    }
  }, 100); // Small delay to ensure header is loaded
});
function initializeDarkMode() {
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

initializeDarkMode();

let darkModeToggleInitialized = false;

function toggleDarkMode(icon) {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  if (icon) {
    icon.classList.toggle('fa-sun', newTheme === 'dark');
    icon.classList.toggle('fa-moon', newTheme === 'light');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  function initDarkModeToggle() {
    const desktopToggleButton = document.getElementById('dark-mode-toggle');
    const mobileToggleButton = document.getElementById('mobile-dark-mode-toggle');

    if ((!desktopToggleButton && !mobileToggleButton) || darkModeToggleInitialized) {
      return;
    }

    if (desktopToggleButton) {
      updateToggleIcon(desktopToggleButton, localStorage.getItem('theme') || 'light');
      desktopToggleButton.addEventListener('click', () => {
        toggleDarkMode(desktopToggleButton.querySelector('i'));
      });
    }

    if (mobileToggleButton) {
      updateToggleIcon(mobileToggleButton, localStorage.getItem('theme') || 'light');
      mobileToggleButton.addEventListener('click', () => {
        toggleDarkMode(mobileToggleButton.querySelector('i'));
      });
    }

    darkModeToggleInitialized = true;
  }

  function updateToggleIcon(toggleButton, currentTheme) {
    const icon = toggleButton.querySelector('i');
    if (!icon) return;

    icon.classList.toggle('fa-sun', currentTheme === 'dark');
    icon.classList.toggle('fa-moon', currentTheme === 'light');
  }

  initDarkModeToggle();
  document.addEventListener('headerLoaded', initDarkModeToggle);
  setTimeout(initDarkModeToggle, 100);
});
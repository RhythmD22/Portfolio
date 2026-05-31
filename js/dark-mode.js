(function initializeDarkMode() {
  const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

function toggleDarkMode(icon) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  if (icon) {
    icon.classList.toggle('fa-sun', newTheme === 'dark');
    icon.classList.toggle('fa-moon', newTheme === 'light');
  }
}

function initDarkModeToggle() {
  const toggles = [document.getElementById('dark-mode-toggle'), document.getElementById('mobile-dark-mode-toggle')].filter(Boolean);
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';

  toggles.forEach(toggle => {
    const icon = toggle.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-sun', currentTheme === 'dark');
      icon.classList.toggle('fa-moon', currentTheme === 'light');
    }
    toggle.onclick = () => toggleDarkMode(toggle.querySelector('i'));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initDarkModeToggle();
  document.addEventListener('headerLoaded', initDarkModeToggle);
});
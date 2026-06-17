(function initializeDarkMode() {
  const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);

  var d = window.matchMedia('(prefers-color-scheme:dark)').matches;
  var m = document.createElement('link');
  m.rel = 'manifest';
  m.href = d ? 'manifest-dark.json' : 'manifest-light.json';
  document.head.appendChild(m);
  window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change', function (e) {
    document.querySelectorAll('link[rel=manifest]:not([media])').forEach(function (l) {
      l.href = e.matches ? 'manifest-dark.json' : 'manifest-light.json';
    });
  });
})();

function isDarkMode() {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

function toggleDarkMode(icon) {
  const isDark = isDarkMode();
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
  const currentTheme = isDarkMode() ? 'dark' : 'light';

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
  document.addEventListener('headerLoaded', initDarkModeToggle);
});
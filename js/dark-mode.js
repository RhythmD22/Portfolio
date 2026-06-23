(function init() {
  const stored = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (systemDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);

  function setThemeColor(dark) {
    const themeMeta = document.getElementById('theme-color-meta');
    if (themeMeta) {
      themeMeta.content = dark ? '#0d1117' : '#faefd8';
    }
  }

  setThemeColor(theme === 'dark');

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      const dark = e.matches;
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
      setThemeColor(dark);
    }
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

  const themeMeta = document.getElementById('theme-color-meta');
  if (themeMeta) {
    themeMeta.content = newTheme === 'dark' ? '#0d1117' : '#faefd8';
  }

  if (icon) {
    icon.classList.toggle('fa-sun', newTheme === 'dark');
    icon.classList.toggle('fa-moon', newTheme === 'light');
  }
}

function initDarkModeToggle() {
  const toggles = [
    document.getElementById('dark-mode-toggle'),
    document.getElementById('mobile-dark-mode-toggle')
  ].filter(Boolean);

  const currentTheme = isDarkMode() ? 'dark' : 'light';

  toggles.forEach(toggle => {
    const icon = toggle.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-sun', currentTheme === 'dark');
      icon.classList.toggle('fa-moon', currentTheme === 'light');
    }
    toggle.onclick = () => toggleDarkMode(icon);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('headerLoaded', initDarkModeToggle);
});
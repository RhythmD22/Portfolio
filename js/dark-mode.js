(function init() {
  const stored = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (systemDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);

  function setManifest(dark) {
    document.querySelectorAll('link[rel=manifest][data-dynamic]').forEach(l => l.remove());
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.setAttribute('data-dynamic', '');
    link.href = dark ? 'manifest-dark.json' : 'manifest-light.json';
    document.head.appendChild(link);
  }

  setManifest(theme === 'dark');

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      setManifest(e.matches);
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

  document.querySelectorAll('link[rel=manifest][data-dynamic]').forEach(l => {
    l.href = newTheme === 'dark' ? 'manifest-dark.json' : 'manifest-light.json';
  });

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
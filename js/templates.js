document.addEventListener('DOMContentLoaded', () => {
  const loadTemplate = (id, file) => {
    const el = document.getElementById(id);
    if (!el) return;

    fetch(file)
      .then(resp => resp.text())
      .then(html => {
        el.innerHTML = html;
        if (id === 'header-placeholder') {
          document.dispatchEvent(new CustomEvent('headerLoaded'));
        }
      })
      .catch(err => console.error(`Failed to load ${file}:`, err));
  };

  loadTemplate('header-placeholder', 'header.html');
  loadTemplate('footer-placeholder', 'footer.html');
});
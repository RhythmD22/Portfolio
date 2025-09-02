document.addEventListener('DOMContentLoaded', () => {
  const load = (id, file) => {
    const el = document.getElementById(id);
    if (!el) return;
    fetch(file)
      .then(resp => resp.text())
      .then(html => {
        el.innerHTML = html;
        // Dispatch a custom event when header is loaded
        if (id === 'header-placeholder') {
          document.dispatchEvent(new CustomEvent('headerLoaded'));
        }
      });
  };
  load('header-placeholder', 'header.html');
  load('footer-placeholder', 'footer.html');
});
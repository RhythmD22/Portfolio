document.addEventListener('DOMContentLoaded', () => {
  const load = (id, file) => {
    const el = document.getElementById(id);
    if (!el) return;
    fetch(file)
      .then(resp => resp.text())
      .then(html => { el.innerHTML = html; });
  };
  load('header-placeholder', 'header.html');
  load('footer-placeholder', 'footer.html');
});

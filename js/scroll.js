document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll anchor fix
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor || anchor.hash.length <= 1) return;

    const target = document.querySelector(anchor.hash);
    const isSPA = anchor.classList.contains('nav-item-link') || anchor.classList.contains('nav-link');

    if (target && !isSPA) {
      e.preventDefault();
      const offset = window.innerWidth <= 768 ? 90 : 87;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });

  const btn = document.querySelector('button[onclick*="scrollTo"], .scroll-btn, .scroll-top-btn');
  if (!btn) return;

  const isProjectPage = window.isProjectPage;

  const setDirection = (dir) => {
    const poly = btn.querySelector('svg polyline');
    if (poly) poly.setAttribute('points', dir === 'up' ? '18 15 12 9 6 15' : '6 9 12 15 18 9');
  };

  function updateBtn() {
    const scrolled = window.scrollY > 100;
    if (scrolled) {
      btn.style.display = 'block';
      btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
      btn.setAttribute('aria-label', 'Scroll to top');
      setDirection('up');
    } else if (isProjectPage) {
      btn.style.display = 'block';
      btn.onclick = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      btn.setAttribute('aria-label', 'Scroll to bottom');
      setDirection('down');
    } else {
      btn.style.display = 'none';
    }
  }

  updateBtn();
  window.addEventListener('scroll', updateBtn);
  window.addEventListener('resize', updateBtn);
});
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll anchor fix
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor || anchor.hash.length <= 1) return;

    const target = document.querySelector(anchor.hash);
    const isSPA = anchor.classList.contains('nav-item-link') || anchor.classList.contains('nav-link');

    if (target && !isSPA) {
      e.preventDefault();
      const offset = window.innerWidth <= 768 ? 104 : 143;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });

  const btn = document.querySelector('.scroll-btn');
  if (!btn) return;

  const isProjectPage = window.isProjectPage;

  const setDirection = (dir) => {
    const poly = btn.querySelector('svg polyline');
    if (poly) poly.setAttribute('points', dir === 'up' ? '18 15 12 9 6 15' : '6 9 12 15 18 9');
  };

  let lastState = null;
  let scrollRAF = null;

  function updateBtn() {
    const scrolled = window.scrollY > 100;
    let state;
    if (scrolled) {
      state = 'up';
    } else if (isProjectPage) {
      state = 'down';
    } else {
      state = 'hidden';
    }

    if (state === lastState) return;
    lastState = state;

    if (state === 'up') {
      btn.style.display = 'block';
      btn.onclick = () => {
        if (isProjectPage) window.showPill?.();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
      btn.setAttribute('aria-label', 'Scroll to top');
      setDirection('up');
    } else if (state === 'down') {
      btn.style.display = 'block';
      btn.onclick = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      btn.setAttribute('aria-label', 'Scroll to bottom');
      setDirection('down');
    } else {
      btn.style.display = 'none';
    }
  }

  const onScrollOrResize = () => {
    if (scrollRAF) return;
    scrollRAF = requestAnimationFrame(() => {
      scrollRAF = null;
      updateBtn();
    });
  };

  updateBtn();
  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize);
});
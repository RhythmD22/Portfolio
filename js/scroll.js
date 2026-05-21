document.addEventListener('DOMContentLoaded', function () {
  // --- Smooth scroll anchor fix ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          requestAnimationFrame(() => {
            const headerOffset = window.innerWidth <= 768 ? 70 : 150;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });
          });
        }
      }
    });
  });

  const scrollButton = document.querySelector('button[onclick*="scrollTo"], .scroll-btn, .scroll-top-btn');

  if (!scrollButton) return;
// ... (rest of the file)
  const isProjectPage = !(
    window.location.pathname.includes('index.html') ||
    window.location.pathname.endsWith('/') ||
    window.location.pathname.includes('About.html')
  );

  function setArrowDirection(direction) {
    const polyline = scrollButton.querySelector('svg polyline');
    if (polyline) {
      polyline.setAttribute('points', direction === 'up' ? '18 15 12 9 6 15' : '6 9 12 15 18 9');
    }
  }

  function updateScrollButton() {
    const scrolled = window.scrollY > 100;

    if (scrolled) {
      scrollButton.style.display = 'block';
      scrollButton.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
      scrollButton.setAttribute('aria-label', 'Scroll to top');
      setArrowDirection('up');
    } else if (isProjectPage) {
      scrollButton.style.display = 'block';
      scrollButton.onclick = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      scrollButton.setAttribute('aria-label', 'Scroll to bottom');
      setArrowDirection('down');
    } else {
      scrollButton.style.display = 'none';
    }
  }

  updateScrollButton();
  window.addEventListener('scroll', updateScrollButton);
  window.addEventListener('resize', updateScrollButton);
});
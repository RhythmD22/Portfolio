// Mobile scroll chaining fix
(function () {
  const isMobile = window.innerWidth <= 900;

  if (isMobile) {
    document.body.classList.add('mobile-scroll-fix');

    // Prevent scroll chaining on touch devices
    let touchStartY = 0;

    document.addEventListener('touchstart', function (e) {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      // Check if we're at scroll boundaries
      const isAtTop = window.pageYOffset <= 0 && deltaY < 0;
      const isAtBottom = (window.innerHeight + window.pageYOffset) >= document.body.offsetHeight && deltaY > 0;

      if (isAtTop || isAtBottom) {
        e.preventDefault();
      }
    }, { passive: false });

    // Handle viewport height changes (mobile browser UI)
    function setViewportHeight() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
  }
})();
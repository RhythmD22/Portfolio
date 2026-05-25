document.addEventListener('headerLoaded', () => {
  const pill = document.querySelector('.header-content-pill');
  const bubble = document.querySelector('.nav-bubble');

  if (!pill || !bubble) return;

  // Scope all selectors to inside the pill so we never accidentally
  // target the mobile header-left logo (which is display:none on desktop)
  const navLinks = pill.querySelectorAll('.nav-item-link, .portfolio-icon-link');
  const logoLink = pill.querySelector('.portfolio-icon-link');

  function updateBubble(targetLink, animated = true) {
    bubble.style.transition = animated ? 'all 0.3s ease' : 'none';

    const pillRect = pill.getBoundingClientRect();
    const linkRect = targetLink.getBoundingClientRect();

    if (linkRect.width === 0) return;

    const isLogo = targetLink.classList.contains('portfolio-icon-link');
    const padding = isLogo ? 8 : 0;
    // Keep logo offset at -2px, apply -8px offset to standard links
    const offset = isLogo ? -2 : -2;

    bubble.style.width = `${linkRect.width + padding}px`;
    bubble.style.left = `${linkRect.left - pillRect.left - (padding / 2) + offset}px`;
    bubble.style.opacity = '1';
  }

  // Expose globally so navigation.js can call it
  window.updateBubble = updateBubble;

  function resetBubble() {
    const isProjectPage = window.location.pathname.includes('Financier') ||
      window.location.pathname.includes('SmartShuttle') ||
      window.location.pathname.includes('Clash') ||
      window.location.pathname.includes('Twine');

    const workLink = pill.querySelector('a[href*="index.html#work"]');
    const activeLink = pill.querySelector('.nav-item-link.active, .portfolio-icon-link.active');

    let targetLink;
    if (isProjectPage) {
      targetLink = workLink;
    } else {
      targetLink = activeLink;
    }

    if (targetLink) {
      updateBubble(targetLink);
    } else if (isProjectPage && workLink) {
      updateBubble(workLink);
    } else {
      bubble.style.opacity = '0';
    }
  }

  function initBubble() {
    const isProjectPage = window.location.pathname.includes('Financier') ||
      window.location.pathname.includes('SmartShuttle') ||
      window.location.pathname.includes('Clash') ||
      window.location.pathname.includes('Twine');

    const workLink = pill.querySelector('a[href*="index.html#work"]');
    let activeLink = pill.querySelector('.nav-item-link.active, .portfolio-icon-link.active');

    if (isProjectPage) {
      activeLink = workLink;
    }

    const target = activeLink || workLink || logoLink;
    if (target) {
      updateBubble(target, false);
    }
  }

  // Double rAF ensures layout is complete before measuring positions
  requestAnimationFrame(() => {
    requestAnimationFrame(initBubble);
  });

  // Reliable fallback once all assets are loaded
  window.addEventListener('load', () => {
    requestAnimationFrame(initBubble);
  });

  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      updateBubble(link);
    });
  });

  pill.addEventListener('mouseleave', () => {
    resetBubble();
  });

  window.addEventListener('resize', () => {
    resetBubble();
  });
});
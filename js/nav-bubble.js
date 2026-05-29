document.addEventListener('headerLoaded', () => {
  const pill = document.querySelector('.header-content-pill');
  const bubble = document.querySelector('.nav-bubble');

  if (!pill || !bubble) return;

  // Scope all selectors to inside the pill so we never accidentally
  // target the mobile header-left logo (which is display:none on desktop)
  const navLinks = pill.querySelectorAll('.nav-item-link, .portfolio-icon-link');
  const firstNavLink = pill.querySelector('.header-nav-left .nav-item-link:first-child');
  const lastNavLink = pill.querySelector('.header-nav-right .nav-item-link:last-child');
  const logoLink = pill.querySelector('.portfolio-icon-link');

  function updateBubble(targetLink, animated = true) {
    bubble.style.transition = animated ? 'all 0.3s ease' : 'none';

    const pillRect = pill.getBoundingClientRect();
    const linkRect = targetLink.getBoundingClientRect();

    if (linkRect.width === 0) return;

    const isFirst = targetLink === firstNavLink;
    const isLast = targetLink === lastNavLink;

    // Account for the pill's 1px border and the bubble's own 1px border
    const innerPillWidth = pill.clientWidth;
    const pillPaddingOffset = 1;

    let left, width;

    if (isFirst) {
      left = 0;
      width = linkRect.right - pillRect.left - pillPaddingOffset;
    } else if (isLast) {
      left = linkRect.left - pillRect.left - pillPaddingOffset + 0.5;
      width = innerPillWidth - left - 1.5;
    } else {
      left = linkRect.left - pillRect.left - pillPaddingOffset;
      width = linkRect.width;
    }

    bubble.style.width = `${width}px`;
    bubble.style.left = `${left}px`;
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
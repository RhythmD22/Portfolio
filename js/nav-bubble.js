document.addEventListener('headerLoaded', () => {
  const pill = document.querySelector('.header-content-pill');
  const bubble = document.querySelector('.nav-bubble');
  if (!pill || !bubble) return;

  const navLinks = pill.querySelectorAll('.nav-item-link, .portfolio-icon-link');
  const firstNavLink = pill.querySelector('.header-nav-left .nav-item-link:first-child');
  const lastNavLink = pill.querySelector('.header-nav-right .nav-item-link:last-child');

  function updateBubble(target, animated = true) {
    bubble.style.transition = animated ? 'all 0.3s ease' : 'none';
    const rect = target.getBoundingClientRect();
    const pillRect = pill.getBoundingClientRect();
    if (rect.width === 0) return;

    let left = rect.left - pillRect.left - 1;
    let width = rect.width;

    if (target === firstNavLink) {
      left = 0;
      width = rect.right - pillRect.left - 1;
    } else if (target === lastNavLink) {
      left = rect.left - pillRect.left - 0.5;
      width = pill.clientWidth - left - 1.5;
    }

    bubble.style.width = `${width}px`;
    bubble.style.left = `${left}px`;
    bubble.style.opacity = '1';
  }

  window.updateBubble = updateBubble;

  const isProjectPage = () => window.isProjectPage;

  function resetBubble() {
    const workLink = pill.querySelector('a[href*="index.html#work"]');
    const activeLink = pill.querySelector('.nav-item-link.active, .portfolio-icon-link.active');
    const target = isProjectPage() ? workLink : activeLink;

    if (target) updateBubble(target);
    else bubble.style.opacity = '0';
  }

  const init = () => {
    const workLink = pill.querySelector('a[href*="index.html#work"]');
    const activeLink = pill.querySelector('.nav-item-link.active, .portfolio-icon-link.active');
    const target = (isProjectPage() ? workLink : activeLink) || pill.querySelector('.portfolio-icon-link');
    if (target) updateBubble(target, false);
  };

  requestAnimationFrame(() => requestAnimationFrame(init));
  window.addEventListener('load', () => requestAnimationFrame(init));
  window.addEventListener('resize', resetBubble);
  pill.addEventListener('mouseleave', resetBubble);
  navLinks.forEach(link => link.addEventListener('mouseenter', () => updateBubble(link)));
});
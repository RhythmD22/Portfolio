// Force instant jump if arriving at the work section from an external page
(function () {
  const isIndexPage = window.location.pathname.includes('index.html') || window.location.pathname === '' || window.location.pathname.endsWith('/');
  if (isIndexPage && window.location.hash === '#work') {
    // Override the CSS smooth scroll temporarily for the initial jump
    document.documentElement.style.scrollBehavior = 'auto';

    // Restore the CSS behavior once the page has settled
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = '';
      }, 100);
    });
  }
})();

function initializeHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');

  if (!hamburger || !sidebar) {
    return false;
  }

  const backdrop = document.createElement('div');
  backdrop.className = 'sidebar-backdrop';
  document.body.appendChild(backdrop);

  function toggleSidebar() {
    const isActive = sidebar.classList.contains('active');

    if (!isActive) {
      sidebar.classList.add('animated');
      setTimeout(() => sidebar.classList.add('active'), 10);
    } else {
      sidebar.classList.remove('active');
      setTimeout(() => sidebar.classList.remove('animated'), 300);
    }

    hamburger.classList.toggle('active');
    backdrop.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', !isActive);
  }

  function closeSidebar() {
    sidebar.classList.remove('active');
    setTimeout(() => sidebar.classList.remove('animated'), 300);
    hamburger.classList.remove('active');
    backdrop.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', toggleSidebar);
  backdrop.addEventListener('click', closeSidebar);

  // Expose closeSidebar for SPA logic
  window.closeSidebar = closeSidebar;

  const workSection = document.getElementById('work');
  let workSectionTop = workSection ? workSection.offsetTop : 0;
  const isIndexPage = window.location.pathname.includes('index') || window.location.pathname === '' || window.location.pathname.endsWith('/');
  const workLink = document.querySelector('#mobile-work-link');

  let scrollThrottle = false;
  window.isNavigating = false;

  function handleScroll() {
    if (!isIndexPage || !workSection || window.isNavigating) return;

    // Disable auto-active on scroll when using SPA nav to prevent UI conflict
    const isSPAActive = window.location.hash === '#resume' || window.location.hash === '#about';
    if (isSPAActive) return;

    workSectionTop = workSection.offsetTop;
    const currentScroll = window.scrollY || window.pageYOffset;

    const shouldBeWork = currentScroll >= workSectionTop - 100;
    const isCurrentlyWork = window.location.hash === '#work';

    if (shouldBeWork) {
      if (workLink && !workLink.classList.contains('active')) {
        workLink.classList.add('active');
      }
      if (!isCurrentlyWork && !scrollThrottle) {
        history.replaceState(null, '', '#work');
        scrollThrottle = true;
        setTimeout(() => scrollThrottle = false, 500);
      }
    } else {
      if (workLink && workLink.classList.contains('active')) {
        workLink.classList.remove('active');
      }
      if (isCurrentlyWork && !scrollThrottle) {
        history.replaceState(null, '', '#home');
        scrollThrottle = true;
        setTimeout(() => scrollThrottle = false, 500);
      }
    }
  }

  if (isIndexPage) {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
  }

  hamburger.addEventListener('click', function () {
    if (isIndexPage) {
      setTimeout(handleScroll, 50);
    }
  });

  return true;
}

function setupSPA() {
  const navLinks = document.querySelectorAll('.nav-item-link, .nav-link:not(.download-link), .portfolio-icon-link');
  const homeSection = document.getElementById('home');
  const workSection = document.getElementById('work');
  const aboutSection = document.getElementById('about');
  const resumeSection = document.getElementById('resume');

  function switchSection(target) {
    const targetHash = target === '#' || target === '' ? '#home' : target;
    const isHome = targetHash === '#home';
    const isAbout = targetHash === '#about';
    const isResume = targetHash === '#resume';
    const isWork = targetHash === '#work';

    // Work and Home are always visible as the main page content. 
    // About and Resume are toggled as SPA pages.
    if (homeSection) homeSection.style.display = (isAbout || isResume) ? 'none' : 'block';
    if (workSection) workSection.style.display = (isAbout || isResume) ? 'none' : 'flex';
    if (aboutSection) aboutSection.style.display = isAbout ? 'block' : 'none';
    if (resumeSection) resumeSection.style.display = isResume ? 'block' : 'none';

    // Update active class
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (isHome) {
        link.classList.toggle('active', link.classList.contains('portfolio-icon-link'));
      } else {
        // Match specific hash to avoid 'work' being active when on 'resume'
        link.classList.toggle('active', href.endsWith(targetHash));
      }
    });

    // Trigger bubble update
    if (typeof updateBubble === 'function') {
      setTimeout(() => {
        const pill = document.querySelector('.header-content-pill');
        let activeLink;
        if (isHome) {
          activeLink = pill ? pill.querySelector('.portfolio-icon-link.active') : document.querySelector('.portfolio-icon-link.active');
        } else {
          activeLink = pill ? pill.querySelector(`.nav-item-link.active[href*="${targetHash}"]`) : document.querySelector(`.nav-item-link.active[href*="${targetHash}"]`);
        }
        if (activeLink) updateBubble(activeLink, true);
      }, 50);
    }
  }

  // Initialize state
  const currentHash = window.location.hash || '#home';
  switchSection(currentHash);

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('http')) return;

      if (href.includes('#')) {
        const parts = href.split('#');
        const path = parts[0];
        const hash = '#' + (parts[1] || '');
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const isIndex = currentPath === 'index.html' || currentPath === '' || currentPath === 'index';

        if (isIndex && (path === '' || path === 'index.html')) {
          e.preventDefault();
          window.isNavigating = true;
          const targetHash = (hash === '#' || hash === '') ? '#home' : hash;
          history.pushState(null, '', targetHash);
          switchSection(targetHash);

          if (typeof window.closeSidebar === 'function') {
            setTimeout(window.closeSidebar, 150);
          }

          if (targetHash === '#work') {
            const targetElement = document.querySelector(targetHash);
            if (targetElement) {
              const headerOffset = window.innerWidth <= 768 ? 70 : 150;
              const elementPosition = targetElement.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
              window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }

          setTimeout(() => {
            window.isNavigating = false;
          }, 1000); // Wait for the scroll animation to finish
        }
      }
    });
  });
}

document.addEventListener('headerLoaded', () => {
  initializeHamburgerMenu();
  setupSPA();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('service-worker.js')
      .then(function (registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(function (err) {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}
window.isIndexPage = ['index.html', '', '/', 'index'].some(path =>
  window.location.pathname.endsWith(path) || (path === '' && window.location.pathname === '/')
);

(function () {
  if (window.isIndexPage && window.location.hash === '#work') {
    document.documentElement.style.scrollBehavior = 'auto';
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
  if (!hamburger || !sidebar) return false;

  const backdrop = document.createElement('div');
  backdrop.className = 'sidebar-backdrop';
  document.body.appendChild(backdrop);

  const toggleSidebar = (forceClose = false) => {
    const isActive = forceClose ? true : sidebar.classList.contains('active');

    if (!isActive) {
      sidebar.classList.add('animated');
      setTimeout(() => sidebar.classList.add('active'), 10);
    } else {
      sidebar.classList.remove('active');
      setTimeout(() => sidebar.classList.remove('animated'), 300);
    }

    hamburger.classList.toggle('active', !isActive);
    backdrop.classList.toggle('active', !isActive);
    hamburger.setAttribute('aria-expanded', !isActive);
  };

  hamburger.addEventListener('click', () => toggleSidebar());
  backdrop.addEventListener('click', () => toggleSidebar(true));
  window.closeSidebar = () => toggleSidebar(true);

  const workSection = document.getElementById('work');
  const workLink = document.querySelector('#mobile-work-link');
  let scrollThrottle = false;
  window.isNavigating = false;

  function handleScroll() {
    if (!window.isIndexPage || !workSection || window.isNavigating) return;

    const isSPAActive = ['#resume', '#about', '#apps'].includes(window.location.hash);
    if (isSPAActive) return;

    const currentScroll = window.scrollY || window.pageYOffset;
    const shouldBeWork = currentScroll >= workSection.offsetTop - 87;
    const isCurrentlyWork = window.location.hash === '#work';

    if (shouldBeWork) {
      workLink?.classList.add('active');
      if (!isCurrentlyWork && !scrollThrottle) {
        history.replaceState(null, '', '#work');
        scrollThrottle = true;
        setTimeout(() => scrollThrottle = false, 500);
      }
    } else {
      workLink?.classList.remove('active');
      if (isCurrentlyWork && !scrollThrottle) {
        history.replaceState(null, '', '#home');
        scrollThrottle = true;
        setTimeout(() => scrollThrottle = false, 500);
      }
    }
  }

  if (window.isIndexPage) {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    hamburger.addEventListener('click', () => setTimeout(handleScroll, 50));
  }

  return true;
}

function setupSPA() {
  const navLinks = document.querySelectorAll('.nav-item-link, .nav-link:not(.download-link), .portfolio-icon-link');
  const sections = {
    home: document.getElementById('home'),
    work: document.getElementById('work'),
    apps: document.getElementById('apps'),
    about: document.getElementById('about'),
    resume: document.getElementById('resume')
  };

  function switchSection(target) {
    const targetHash = target === '#' || target === '' ? '#home' : target;
    const spaHashes = ['#apps', '#about', '#resume'];
    const isSPA = spaHashes.includes(targetHash);

    if (sections.home) sections.home.style.display = isSPA ? 'none' : 'block';
    if (sections.work) sections.work.style.display = isSPA ? 'none' : 'flex';

    spaHashes.forEach(hash => {
      const sectionName = hash.slice(1);
      if (sections[sectionName]) {
        sections[sectionName].style.display = targetHash === hash ? 'block' : 'none';
      }
    });

    document.body.classList.toggle('apps-page', targetHash === '#apps');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const isActive = targetHash === '#home' ? link.classList.contains('portfolio-icon-link') : href.endsWith(targetHash);
      link.classList.toggle('active', isActive);
    });

    document.querySelectorAll('.app-card').forEach(card => card.classList.remove('expanded'));

    if (typeof updateBubble === 'function') {
      setTimeout(() => {
        const pill = document.querySelector('.header-content-pill');
        const selector = targetHash === '#home' ? '.portfolio-icon-link.active' : `.nav-item-link.active[href*="${targetHash}"]`;
        const activeLink = (pill || document).querySelector(selector);
        if (activeLink) updateBubble(activeLink, true);
      }, 50);
    }
  }

  switchSection(window.location.hash || '#home');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('http') || !href.includes('#')) return;

      const [path, hashPart] = href.split('#');
      const hash = '#' + (hashPart || '');
      const currentPath = window.location.pathname.split('/').pop() || 'index.html';
      const isCurrentIndex = ['index.html', '', 'index'].includes(currentPath);

      if (isCurrentIndex && (path === '' || path === 'index.html')) {
        e.preventDefault();
        window.isNavigating = true;
        const targetHash = (hash === '#' || hash === '') ? '#home' : hash;

        history.pushState(null, '', targetHash);
        switchSection(targetHash);
        setTimeout(() => window.closeSidebar?.(), 150);

        if (targetHash === '#work') {
          const targetElement = document.querySelector(targetHash);
          if (targetElement) {
            const headerOffset = window.innerWidth <= 768 ? 90 : 87;
            const offsetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        setTimeout(() => window.isNavigating = false, 1000);
      }
    });
  });
}

document.addEventListener('headerLoaded', () => {
  initializeHamburgerMenu();
  setupSPA();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('ServiceWorker registration successful with scope: ', reg.scope))
      .catch(err => console.log('ServiceWorker registration failed: ', err));
  });
}
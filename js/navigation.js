window.isProjectPage = ['Financier', 'SmartShuttle', 'Clash'].some(p => window.location.pathname.includes(p));

window.isIndexPage = ['index.html', '', '/', 'index'].some(path =>
  window.location.pathname.endsWith(path) || (path === '' && window.location.pathname === '/')
);

(function () {
  if (window.isIndexPage) {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window._pageLoadTime = Date.now();
    if (!window.location.hash || window.location.hash === '#home' || window.location.hash === '#') {
      window.addEventListener('load', function () {
        window.scrollTo(0, 0);
      });
    }
  }
})();

function initializeHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  if (!hamburger || !sidebar) return false;

  const backdrop = document.createElement('div');
  backdrop.className = 'sidebar-backdrop';
  backdrop.setAttribute('role', 'presentation');
  backdrop.setAttribute('aria-hidden', 'true');
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
  const pillWorkLink = document.querySelector('.header-content-pill a[href*="index.html#work"]');
  const pillHomeLink = document.querySelector('.header-content-pill .portfolio-icon-link');
  let scrollThrottle = false;
  window.isNavigating = false;

  function handleScroll() {
    if (!window.isIndexPage || !workSection || window.isNavigating || !window._scrollHandlerReady) return;

    var isSPAActive = ['#resume', '#about', '#apps'].includes(window.location.hash);
    if (isSPAActive) return;

    var currentScroll = window.scrollY || window.pageYOffset;
    var shouldBeWork = currentScroll >= workSection.offsetTop - 142;
    var isCurrentlyWork = window.location.hash === '#work';

    if (shouldBeWork) {
      workLink?.classList.add('active');
      pillWorkLink?.classList.add('active');
      pillHomeLink?.classList.remove('active');
      if (typeof updateBubble === 'function' && pillWorkLink) updateBubble(pillWorkLink);
      if (!isCurrentlyWork && !scrollThrottle) {
        history.replaceState(null, '', '#work');
        scrollThrottle = true;
        setTimeout(function () { scrollThrottle = false; }, 500);
      }
    } else {
      workLink?.classList.remove('active');
      pillWorkLink?.classList.remove('active');
      pillHomeLink?.classList.add('active');
      if (typeof updateBubble === 'function' && pillHomeLink) updateBubble(pillHomeLink);
      if (isCurrentlyWork && !scrollThrottle && Date.now() - window._pageLoadTime > 2000) {
        history.replaceState(null, '', '#home');
        scrollThrottle = true;
        setTimeout(function () { scrollThrottle = false; }, 500);
      }
    }
  }

  if (window.isIndexPage) {
    window.addEventListener('scroll', handleScroll);
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

  var initHash = window.location.hash;
  if (initHash === '#work') {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var el = document.getElementById('work');
        if (el) {
          var offset = window.innerWidth <= 768 ? 90 : 142;
          window.scrollTo(0, el.getBoundingClientRect().top + window.pageYOffset - offset);
        }
        history.replaceState(null, '', '#work');
        window._scrollHandlerReady = true;
      });
    });
  } else {
    window._scrollHandlerReady = true;
  }

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

        var currentHash = window.location.hash;
        var workEl = document.getElementById('work');
        var spaHashes = ['#apps', '#about', '#resume'];
        var atWork = workEl && window.scrollY >= workEl.offsetTop - 142 &&
          currentHash !== '#work' && !spaHashes.includes(currentHash);
        if (atWork) {
          history.replaceState(null, '', '#work');
        }

        history.pushState({ atWork: (atWork || currentHash === '#work') && targetHash !== '#home' }, '', targetHash);
        switchSection(targetHash);
        setTimeout(() => window.closeSidebar?.(), 150);

        if (targetHash === '#work') {
          const targetElement = document.querySelector(targetHash);
          if (targetElement) {
            const headerOffset = window.innerWidth <= 768 ? 90 : 142;
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

  window.addEventListener('popstate', (event) => {
    if (window.isNavigating) return;
    if (!window._scrollHandlerReady) return;
    window.isNavigating = true;
    var hash = window.location.hash || '#home';
    var wasAtWork = event.state && event.state.atWork;
    if (wasAtWork && hash === '#home') {
      history.replaceState(null, '', '#work');
      hash = '#work';
    }
    switchSection(hash);
    if (hash === '#work') {
      var el = document.querySelector('#work');
      if (el) {
        var offset = window.innerWidth <= 768 ? 90 : 142;
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            var top = el.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: top, behavior: 'auto' });
            history.replaceState(null, '', '#work');
          });
        });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
    setTimeout(function () {
      window.isNavigating = false;
    }, 500);
  });
}

document.addEventListener('headerLoaded', () => {
  initializeHamburgerMenu();
  setupSPA();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js');
  });
}
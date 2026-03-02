function initializeHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');

  if (!hamburger || !sidebar) {
    return false;
  }

  const backdrop = document.createElement('div');
  backdrop.className = 'sidebar-backdrop';
  document.body.appendChild(backdrop);

  const navLinks = sidebar.querySelectorAll('.nav-link');

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

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(closeSidebar, 150);
    });
  });

  const workSection = document.getElementById('selected-work');
  let workSectionTop = workSection ? workSection.offsetTop : 0;
  const isIndexPage = window.location.pathname.includes('index') || window.location.pathname === '';
  const workLink = document.querySelector('#mobile-work-link');

  let ticking = false;

  function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop().toLowerCase();
    navLinks.forEach(link => link.classList.remove('active'));

    let activeLink = null;

    if (currentPage.includes('about')) {
      activeLink = document.querySelector('#mobile-about-link');
    } else if (isIndexPage && workSection) {
      const currentScroll = window.scrollY || window.pageYOffset;
      if (window.location.hash === '#selected-work' || currentScroll >= workSectionTop - 100) {
        activeLink = workLink;
      }
    } else if (currentPage.includes('financier') ||
      currentPage.includes('smartshuttle') ||
      currentPage.includes('clash') ||
      currentPage.includes('twine')) {
      activeLink = workLink;
    }

    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  function handleScroll() {
    if (!isIndexPage || !workSection) return;

    workSectionTop = workSection.offsetTop;
    const currentScroll = window.scrollY || window.pageYOffset;

    if (currentScroll >= workSectionTop - 100) {
      if (workLink && !workLink.classList.contains('active')) {
        workLink.classList.add('active');
      }
    } else {
      if (workLink && workLink.classList.contains('active')) {
        workLink.classList.remove('active');
      }
    }
  }

  if (isIndexPage) {
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
    handleScroll();
  }

  hamburger.addEventListener('click', function () {
    if (isIndexPage) {
      setTimeout(handleScroll, 50);
    } else {
      setTimeout(setActiveLink, 50);
    }
  });

  setTimeout(setActiveLink, 100);
  return true;
}

function updateNavigationLinks() {
  document.addEventListener('headerLoaded', function () {
    const desktopWorkLink = document.querySelector('.header-nav a[href="#selected-work"]');
    const mobileWorkLink = document.querySelector('#mobile-work-link');
    const isIndexPage = window.location.pathname.includes('index') || window.location.pathname === '';
    const href = isIndexPage ? '#selected-work' : 'index.html#selected-work';

    if (desktopWorkLink) desktopWorkLink.href = href;
    if (mobileWorkLink) mobileWorkLink.href = href;
  });
}

if (document.readyState !== 'loading') {
  initializeHamburgerMenu();
  updateNavigationLinks();
}

document.addEventListener('DOMContentLoaded', function () {
  initializeHamburgerMenu();
  updateNavigationLinks();
});

document.addEventListener('headerLoaded', function () {
  setTimeout(function () {
    initializeHamburgerMenu();
    updateNavigationLinks();
  }, 100);
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
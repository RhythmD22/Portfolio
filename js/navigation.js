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
    const desktopWorkLink = document.querySelector('.header-nav-left a[href="#selected-work"]');
    const mobileWorkLink = document.querySelector('#mobile-work-link');
    const isIndexPage = window.location.pathname.includes('index.html') || window.location.pathname === '' || window.location.pathname.endsWith('/');
    const isAboutPage = window.location.pathname.includes('About.html');
    
    // Project name detection
    let projectName = '';
    const path = window.location.pathname.toLowerCase();
    if (path.includes('financier')) projectName = 'financier';
    else if (path.includes('smartshuttle')) projectName = 'smartshuttle';
    else if (path.includes('clash')) projectName = 'clashroyale';
    else if (path.includes('twine')) projectName = 'twine';

    // Set correct href for Work link
    let workHref = '#selected-work';
    if (!isIndexPage) {
      if (projectName) {
        workHref = `index.html?transition=${projectName}#selected-work`;
      } else {
        workHref = 'index.html#selected-work';
      }
    }

    if (desktopWorkLink) {
      desktopWorkLink.href = workHref;
      desktopWorkLink.style.opacity = '1';
      desktopWorkLink.style.pointerEvents = 'auto';
    }
    if (mobileWorkLink) {
      mobileWorkLink.href = workHref;
      mobileWorkLink.style.opacity = '1';
      mobileWorkLink.style.pointerEvents = 'auto';
    }

    // Handle View Transitions
    if ('viewTransition' in document || window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      // 1. From Index: Set names only when a card is clicked
      if (isIndexPage) {
        // Check for incoming transition from project page
        const urlParams = new URLSearchParams(window.location.search);
        const transitionTarget = urlParams.get('transition');
        if (transitionTarget) {
          const projectCards = document.querySelectorAll('.project');
          let targetIndex = -1;
          if (transitionTarget === 'financier') targetIndex = 0;
          else if (transitionTarget === 'smartshuttle') targetIndex = 1;
          else if (transitionTarget === 'clashroyale') targetIndex = 2;
          else if (transitionTarget === 'twine') targetIndex = 3;

          if (targetIndex !== -1 && projectCards[targetIndex]) {
            const wrapper = projectCards[targetIndex].querySelector('.project-thumbnail-wrapper');
            if (wrapper) wrapper.style.viewTransitionName = `project-${transitionTarget}`;
          }
        }

        // Set names on outgoing click
        const projects = document.querySelectorAll('.project');
        projects.forEach(project => {
          const link = project.querySelector('a');
          const wrapper = project.querySelector('.project-thumbnail-wrapper');
          if (link && wrapper) {
            link.addEventListener('click', () => {
              const href = link.getAttribute('href').toLowerCase();
              let name = '';
              if (href.includes('financier')) name = 'project-financier';
              else if (href.includes('smartshuttle')) name = 'project-smartshuttle';
              else if (href.includes('clash')) name = 'project-clashroyale';
              else if (href.includes('twine')) name = 'project-twine';
              if (name) wrapper.style.viewTransitionName = name;
            });
          }
        });
      }

      // 2. On Project Page: Always name the banner
      if (projectName) {
        const banner = document.querySelector('.banner-container');
        if (banner) {
          banner.style.viewTransitionName = `project-${projectName}`;
        }
      }
    }
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
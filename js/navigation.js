// Function to initialize the hamburger menu functionality
function initializeHamburgerMenu() {
  // Get DOM elements for the hamburger menu
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');

  // Check if these elements exist before trying to use them
  if (!hamburger || !sidebar) {
    // If elements don't exist yet, they might be loaded later via templates.js
    return false; // Return false to indicate initialization failed
  }

  // Create backdrop element
  const backdrop = document.createElement('div');
  backdrop.className = 'sidebar-backdrop';
  document.body.appendChild(backdrop);

  // Toggle sidebar visibility when hamburger is clicked
  hamburger.addEventListener('click', function () {
    const isActive = sidebar.classList.contains('active');

    if (!isActive) {
      // When opening: add animated class first, then active class for navigation
      sidebar.classList.add('animated');
      setTimeout(() => {
        sidebar.classList.add('active');
      }, 10); // Small delay to ensure animation starts correctly
    } else {
      // When closing: remove active class first, then animated class
      sidebar.classList.remove('active');
      setTimeout(() => {
        sidebar.classList.remove('animated');
      }, 300); // Match the transition time
    }

    hamburger.classList.toggle('active');
    backdrop.classList.toggle('active');

    // Update aria-expanded attribute for accessibility
    const isExpanded = sidebar.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isExpanded);
  });

  // Close sidebar when clicking on backdrop
  backdrop.addEventListener('click', function () {
    sidebar.classList.remove('active');
    setTimeout(() => {
      sidebar.classList.remove('animated');
    }, 300); // Match the transition time
    hamburger.classList.remove('active');
    backdrop.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  });

  // Close sidebar when clicking on navigation links
  const navLinks = sidebar.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      // Small delay to allow navigation to happen
      setTimeout(() => {
        sidebar.classList.remove('active');
        setTimeout(() => {
          sidebar.classList.remove('animated');
        }, 300); // Match the transition time
        hamburger.classList.remove('active');
        backdrop.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }, 150);
    });
  });

  // Cache commonly used elements and values
  const workSection = document.getElementById('selected-work');
  let workSectionTop = workSection ? workSection.offsetTop : 0;
  const isIndexPage = window.location.pathname.includes('index') || window.location.pathname === '';
  const workLink = document.querySelector('#mobile-work-link');

  // Throttle scroll event handler for performance
  let ticking = false;
  function updateScrollHandler() {
    ticking = false;
    handleScroll();
  }

  // Set active link based on current page
  function setActiveLink() {
    // Get current page name from URL
    const currentPage = window.location.pathname.split('/').pop().toLowerCase();

    // Remove active class from all links
    navLinks.forEach(link => link.classList.remove('active'));

    // Determine which link should be active based on current page
    let activeLink = null;

    if (currentPage.includes('about')) {
      // On about page, highlight the about link
      activeLink = document.querySelector('#mobile-about-link');
    } else if (isIndexPage) {
      // On index page, only highlight the work link when user is in the work section
      // Check if we're in the work section by checking scroll position or hash
      if (workSection) {
        const currentScroll = window.scrollY || window.pageYOffset;

        // Highlight work link if we're in the work section or if there's a hash pointing to it
        if (window.location.hash === '#selected-work' || currentScroll >= workSectionTop - 100) {
          activeLink = workLink;
        }
      }
    } else if (currentPage.includes('financier') ||
      currentPage.includes('smartshuttle') ||
      currentPage.includes('clash') ||
      currentPage.includes('twine')) {
      // On project pages, highlight the work link since they're part of work section
      activeLink = workLink;
    }

    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  // Add scroll event listener to handle highlighting based on scroll position
  function handleScroll() {
    if (!isIndexPage || !workSection) return;

    // Update work section position in case it changes
    workSectionTop = workSection.offsetTop;

    const currentScroll = window.scrollY || window.pageYOffset;

    // Check if we're in the work section
    if (currentScroll >= workSectionTop - 100) {
      // We're in the work section, highlight the work link
      if (workLink && !workLink.classList.contains('active')) {
        workLink.classList.add('active');
      }
    } else {
      // We're in the intro section, remove highlight from work link
      if (workLink && workLink.classList.contains('active')) {
        workLink.classList.remove('active');
      }
    }
  }

  // Add scroll event listener when on index page
  if (isIndexPage) {
    // Use throttled scroll handler for better performance
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateScrollHandler);
        ticking = true;
      }
    });

    // Call handleScroll on initial load to ensure correct state
    handleScroll();
  }

  // Call appropriate function when the sidebar is shown based on the current page
  hamburger.addEventListener('click', function () {
    // Only use scroll-based highlighting on index page, otherwise use page-based highlighting
    if (isIndexPage) {
      setTimeout(() => {
        handleScroll(); // Update based on current scroll position
      }, 50); // Small delay to ensure DOM is updated
    } else {
      setTimeout(setActiveLink, 50); // Use page-based highlighting for other pages
    }
  });

  // Set active link when menu is initialized
  setTimeout(setActiveLink, 100);

  return true; // Return true to indicate successful initialization
}

// Function to update navigation links based on current page context
function updateNavigationLinks() {
  // Wait for header to load
  document.addEventListener('headerLoaded', function () {
    const desktopWorkLink = document.querySelector('.header-nav a[href="#selected-work"]');
    const mobileWorkLink = document.querySelector('#mobile-work-link');

    // Update work links based on current page
    if (window.location.pathname.includes('index') || window.location.pathname === '') {
      // On index.html, the work link should just go to #selected-work
      if (desktopWorkLink) {
        desktopWorkLink.href = '#selected-work';
      }
      if (mobileWorkLink) {
        mobileWorkLink.href = '#selected-work';
      }
    } else {
      // On other pages, work link should point to index.html#selected-work
      if (desktopWorkLink) {
        desktopWorkLink.href = 'index.html#selected-work';
      }
      if (mobileWorkLink) {
        mobileWorkLink.href = 'index.html#selected-work';
      }
    }
  });
}

// Try to initialize immediately in case DOM is already loaded and header is already inserted
if (document.readyState !== 'loading') {
  // DOM is already loaded, try to initialize immediately
  initializeHamburgerMenu();
  updateNavigationLinks();
}

// Also try to initialize when DOM is loaded and header is inserted
document.addEventListener('DOMContentLoaded', function () {
  // Try to initialize immediately since DOM is loaded
  initializeHamburgerMenu();
  updateNavigationLinks();
});

// Listen for the headerLoaded event to initialize after header is inserted via templates
document.addEventListener('headerLoaded', function () {
  // Delay a bit to ensure header is fully rendered
  setTimeout(function () {
    initializeHamburgerMenu();
    updateNavigationLinks();
  }, 100);
});
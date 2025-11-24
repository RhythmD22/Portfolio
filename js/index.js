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

// Typing effect for intro text
(function () {
  // Text content to type
  const introHeading = "Hey, I'm Rhythm!";
  const introParagraph = "I'm a UI/UX Designer and a recent University of Pittsburgh graduate. I design clean interfaces and immersive experiences that bring together form and function.";

  // Function to create typing effect
  function typeText(element, text, callback) {
    let i = 0;
    element.textContent = ''; // Clear initial content

    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, 20); // Speed of typing (20ms per character)
      } else {
        if (callback) {
          callback(); // Execute callback after typing is complete
        }
      }
    }

    type();
  }

  // Initialize typing effect when DOM is loaded
  document.addEventListener('DOMContentLoaded', function () {
    const headingElement = document.querySelector('.intro-heading');
    const paragraphElement = document.querySelector('.intro-paragraph');

    // Check if typing effect has already been completed using session storage
    if (!sessionStorage.getItem('typingEffectCompleted')) {
      // Add typing cursor to elements
      headingElement.classList.add('typing-text');
      paragraphElement.classList.add('typing-text');

      // Start typing for heading, then paragraph
      typeText(headingElement, introHeading, function () {
        typeText(paragraphElement, introParagraph, function () {
          // Mark typing effect as completed to prevent re-typing
          sessionStorage.setItem('typingEffectCompleted', 'true');
        });
      });
    } else {
      // If typing was already completed, just show the final text with cursor at end
      if (headingElement && paragraphElement) {
        headingElement.textContent = introHeading;
        paragraphElement.textContent = introParagraph;
        headingElement.classList.add('typing-text');
        paragraphElement.classList.add('typing-text');
      }
    }
  });
})();

// Toggle profile image to reveal spinning circle
document.addEventListener('DOMContentLoaded', function () {
  const profileImage = document.querySelector('.profile-image');

  if (profileImage) {
    profileImage.addEventListener('click', function () {
      this.classList.toggle('hide');
    });
  }
});

// Service Worker Registration
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
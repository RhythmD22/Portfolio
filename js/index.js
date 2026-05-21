const TYPING_SPEED = 20;
const ANIMATION_DURATION = 1500;
const LONG_PRESS_DURATION = 1000;
const OBSERVER_THRESHOLD = 0.3;

function typeText(element, text, callback) {
  let i = 0;
  element.textContent = '';

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, TYPING_SPEED);
    } else if (callback) {
      callback();
    }
  }

  type();
}

function getLottieInstance(element) {
  return element?._dotLottieInstance || element?.dotLottie || null;
}

function playLottieAnimation(element) {
  const instance = getLottieInstance(element);
  if (!instance) return;

  instance.pause();
  instance.setFrame(0);
  instance.setSpeed(1);
  instance.play();

  element.classList.remove('animation-completed');

  setTimeout(() => {
    const inst = getLottieInstance(element);
    if (inst) {
      inst.pause();
      element.classList.add('animation-completed');
    }
  }, ANIMATION_DURATION);
}

(function () {
  if (window.innerWidth > 900) return;

  document.body.classList.add('mobile-scroll-fix');
  let touchStartY = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    const deltaY = touchStartY - e.touches[0].clientY;
    const isAtTop = window.pageYOffset <= 0 && deltaY < 0;
    const isAtBottom = (window.innerHeight + window.pageYOffset) >= document.body.offsetHeight && deltaY > 0;

    if (isAtTop || isAtBottom) {
      e.preventDefault();
    }
  }, { passive: false });

  function setViewportHeight() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }

  setViewportHeight();
  window.addEventListener('resize', setViewportHeight);
  window.addEventListener('orientationchange', setViewportHeight);
})();

(function () {
  function initIntroTyping() {
    const headingElement = document.querySelector('.intro-heading');
    const paragraphElement = document.querySelector('.intro-paragraph');

    if (!headingElement || !paragraphElement) return;

    const introHeading = headingElement.getAttribute('data-text');
    const introParagraph = paragraphElement.getAttribute('data-text');

    if (!sessionStorage.getItem('typingEffectCompleted')) {
      headingElement.textContent = '';
      paragraphElement.textContent = '';
      headingElement.classList.add('typing-text');

      // Wait 1.4 seconds (two full blink cycles) before starting to type
      setTimeout(() => {
        typeText(headingElement, introHeading, function () {
          headingElement.classList.add('typed');
          paragraphElement.classList.add('typing-text');
          typeText(paragraphElement, introParagraph, function () {
            // Paragraph cursor remains blinking
            sessionStorage.setItem('typingEffectCompleted', 'true');
          });
        });
      }, 1400);
    } else {
      headingElement.textContent = introHeading;
      paragraphElement.textContent = introParagraph;
      headingElement.classList.add('typing-text', 'typed');
      paragraphElement.classList.add('typing-text');
    }
  }

  function initSectionTyping() {
    const isIndexPage = window.location.pathname.includes('index.html') || window.location.pathname === '' || window.location.pathname.endsWith('/');
    const contactPillRevealed = sessionStorage.getItem('contactPillRevealed') === 'true';

    // Ensure contact pill is visible statically if already revealed or if not on index
    if (contactPillRevealed || !isIndexPage) {
      document.querySelectorAll('.contact-pill').forEach(pill => pill.classList.add('static-pill'));
    }

    const sectionHeadings = document.querySelectorAll('.work-summary h2[data-text]');
    const sectionDescriptions = document.querySelectorAll('.work-summary p[data-text]');
    const isCompleted = sessionStorage.getItem('typingEffectCompleted') === 'true';

    if (isCompleted) {
      [...sectionHeadings, ...sectionDescriptions].forEach(element => {
        element.textContent = element.getAttribute('data-text');
        element.classList.add('typing-text');
        if (element.tagName.toLowerCase() !== 'p') {
          element.classList.add('typed');
          const pill = element.parentElement.querySelector('.contact-pill');
          if (pill) pill.classList.add('static-pill');
        }
      });
      return;
    }

    // Clear text content immediately to prevent flashing before observer triggers
    [...sectionHeadings, ...sectionDescriptions].forEach(element => {
      element.textContent = '';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || entry.target.classList.contains('typed')) return;

        const element = entry.target;
        const text = element.getAttribute('data-text');

        // Only apply typing animation to non-paragraph elements (h2)
        if (element.tagName.toLowerCase() !== 'p') {
          element.classList.add('typing-text'); // Add typing-text class immediately for the cursor
          typeText(element, text, function () {
            element.classList.add('typed'); // Add typed class to remove cursor after typing
            const pill = element.parentElement.querySelector('.contact-pill');
            if (pill) {
              pill.classList.add('reveal');
              // Mark that the pill has been revealed for this session
              sessionStorage.setItem('contactPillRevealed', 'true');
            }
            sessionStorage.setItem('workSectionTypingCompleted', 'true'); // Set new flag here
          });
        } else {
          // For paragraphs, revert to instant appearance but still add typing-text for cursor
          element.textContent = text;
          element.classList.add('typing-text');
        }
        observer.unobserve(element);
      });
    }, { threshold: OBSERVER_THRESHOLD });

    sectionHeadings.forEach(heading => observer.observe(heading));
    sectionDescriptions.forEach(description => observer.observe(description));
  }

  document.addEventListener('DOMContentLoaded', function () {
    initIntroTyping();
    initSectionTyping();
  });
})();

(function () {
  function setupAnimationEvents(profileAnimation) {
    if (!profileAnimation) return;

    profileAnimation.addEventListener('ready', function () {
      const dotLottie = this.dotLottie;
      if (dotLottie) {
        this._dotLottieInstance = dotLottie;
        dotLottie.setFrame(0);
        dotLottie.pause();
      }
    });

    profileAnimation.addEventListener('mouseenter', function () {
      playLottieAnimation(this);
    });

    let touchStartTime = 0;
    let longPressTimer = null;

    profileAnimation.addEventListener('touchstart', function (e) {
      e.preventDefault();

      if (this._isPlayingOnMobile) return;
      this._isPlayingOnMobile = true;

      const instance = getLottieInstance(this);
      if (instance) {
        instance.pause();
        instance.setFrame(0);
        instance.setSpeed(1);
        instance.play();

        setTimeout(() => {
          const inst = getLottieInstance(this);
          if (inst && this._isPlayingOnMobile) {
            inst.pause();
            inst.setFrame(0);
            this._isPlayingOnMobile = false;
          }
        }, ANIMATION_DURATION);
      }

      touchStartTime = Date.now();
      longPressTimer = setTimeout(() => {
        this.classList.add('hide');
      }, LONG_PRESS_DURATION);
    });

    profileAnimation.addEventListener('touchend', function () {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }

      if (Date.now() - touchStartTime >= LONG_PRESS_DURATION) {
        this.classList.toggle('hide');
      }
    });

    profileAnimation.addEventListener('touchcancel', function () {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
      this.classList.remove('hide');
    });
  }

  function initProfileAnimations() {
    const profileImage = document.querySelector('.profile-image');
    const profileAnimation = document.querySelector('.profile-animation');

    if (profileImage) {
      profileImage.addEventListener('click', function () {
        this.classList.toggle('hide');
      });
    }

    if (profileAnimation) {
      profileAnimation.addEventListener('click', function () {
        this.classList.toggle('hide');
      });

      if (customElements.get('dotlottie-wc')) {
        setupAnimationEvents(profileAnimation);
      } else {
        customElements.whenDefined('dotlottie-wc').then(() => {
          setTimeout(() => setupAnimationEvents(profileAnimation), 100);
        });
      }
    }
  }

  document.addEventListener('DOMContentLoaded', initProfileAnimations);
})();
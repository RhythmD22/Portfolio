// Mobile scroll chaining fix
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

// Typing effect for intro text
(function () {
  const INTRO_HEADING = "Rhythm Desai";
  const INTRO_PARAGRAPH = "Designing clean interfaces and immersive experiences that bring together form and function.";
  const TYPING_SPEED = 20;

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

  document.addEventListener('DOMContentLoaded', function () {
    const headingElement = document.querySelector('.intro-heading');
    const paragraphElement = document.querySelector('.intro-paragraph');

    if (!headingElement || !paragraphElement) return;

    if (!sessionStorage.getItem('typingEffectCompleted')) {
      paragraphElement.classList.add('typing-text');

      typeText(headingElement, INTRO_HEADING, function () {
        typeText(paragraphElement, INTRO_PARAGRAPH, function () {
          sessionStorage.setItem('typingEffectCompleted', 'true');
        });
      });
    } else {
      headingElement.textContent = INTRO_HEADING;
      paragraphElement.textContent = INTRO_PARAGRAPH;
      paragraphElement.classList.add('typing-text');
    }
  });
})();

// Scroll-triggered typing effect for section headings
(function () {
  const TYPING_SPEED = 20;

  function typeSectionHeading(element, text, callback) {
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

  document.addEventListener('DOMContentLoaded', function () {
    const sectionHeadings = document.querySelectorAll('.work-summary h2[data-text]');
    const sectionDescriptions = document.querySelectorAll('.work-summary p[data-text]');

    const createObserver = () => new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || entry.target.classList.contains('typed')) return;

        const element = entry.target;
        const text = element.getAttribute('data-text');
        element.classList.add('typing-text');

        typeSectionHeading(element, text, function () {
          element.classList.add('typed');
        });
        observer.unobserve(element);
      });
    }, { threshold: 0.3 });

    const headingObserver = createObserver();
    const descriptionObserver = createObserver();

    sectionHeadings.forEach(heading => headingObserver.observe(heading));
    sectionDescriptions.forEach(description => descriptionObserver.observe(description));
  });
})();

// Profile animation and Lottie interactions
document.addEventListener('DOMContentLoaded', function () {
  const profileImage = document.querySelector('.profile-image');
  const profileAnimation = document.querySelector('.profile-animation');

  if (profileImage) {
    profileImage.addEventListener('click', function () {
      this.classList.toggle('hide');
    });
  }

  if (!profileAnimation) return;

  profileAnimation.addEventListener('click', function () {
    this.classList.toggle('hide');
  });

  function getLottieInstance(element) {
    return element._dotLottieInstance || element.dotLottie;
  }

  function playLottieAnimation(element) {
    const instance = getLottieInstance(element);
    if (!instance) return;

    instance.pause();
    instance.setFrame(0);
    instance.setSpeed(1);
    instance.play();

    element.classList.remove('animation-completed');

    const self = element;
    setTimeout(() => {
      const inst = getLottieInstance(self);
      if (inst) {
        inst.pause();
        self.classList.add('animation-completed');
      }
    }, 1500);

    const onComplete = function () {
      const inst = getLottieInstance(self);
      if (inst) {
        inst.pause();
        self.classList.add('animation-completed');
      }
      self.removeEventListener('complete', onComplete);
    };

    element.removeEventListener('complete', onComplete);
    element.addEventListener('complete', onComplete);
  }

  function setupAnimationEvents() {
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

    profileAnimation.addEventListener('mouseleave', function () {
      // Let animation complete naturally
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

        const self = this;
        setTimeout(() => {
          const inst = getLottieInstance(self);
          if (inst && self._isPlayingOnMobile) {
            inst.pause();
            inst.setFrame(0);
            self._isPlayingOnMobile = false;
          }
        }, 1500);
      }

      touchStartTime = Date.now();
      longPressTimer = setTimeout(() => {
        this.classList.add('hide');
      }, 1000);
    });

    profileAnimation.addEventListener('touchend', function () {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }

      if (Date.now() - touchStartTime >= 1000) {
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

  if (customElements.get('dotlottie-wc')) {
    setupAnimationEvents();
  } else {
    customElements.whenDefined('dotlottie-wc').then(() => {
      setTimeout(setupAnimationEvents, 100);
    });
  }
});
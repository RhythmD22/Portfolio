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
  const profileAnimation = document.querySelector('.profile-animation');

  if (profileImage) {
    profileImage.addEventListener('click', function () {
      this.classList.toggle('hide');
    });
  }

  // Set up hover and press events for the Lottie animation
  if (profileAnimation) {
    // Add the click event right away
    profileAnimation.addEventListener('click', function () {
      this.classList.toggle('hide');
    });

    // Helper function to get the animation instance (handles both direct access and stored instance)
    function getAnimationInstance(element) {
      return element._dotLottieInstance || element.dotLottie;
    }

    // Helper function to set up animation instance
    function setupAnimationInstance(element) {
      element._dotLottieInstance = element.dotLottie;
    }

    // Helper function to reset and play animation
    function playAnimation(element) {
      const instance = getAnimationInstance(element);
      if (instance) {
        instance.pause();
        instance.setFrame(0);
        instance.setSpeed(1); // Set speed to normal
        instance.play();
        return instance;
      }
      return null;
    }

    // Helper function to pause and reset animation
    function pauseAndResetAnimation(element) {
      const instance = getAnimationInstance(element);
      if (instance) {
        instance.pause();
        instance.setFrame(0);
      }
    }

    // Helper function to add complete listener
    function addCompleteListener(element) {
      const self = element;
      const listener = function () {
        const instance = getAnimationInstance(self);
        if (instance) {
          instance.pause();
        }
        // Remove the listener after use
        self.removeEventListener('complete', listener);
      };
      // Remove any existing listener first
      self.removeEventListener('complete', listener);
      element.addEventListener('complete', listener);
    }

    // Wait for the dotlottie element to be fully loaded and ready
    function setupAnimationEvents() {
      // Wait for the dotlottie element to be ready
      profileAnimation.addEventListener('ready', function () {
        // Get the underlying dotLottie instance
        const dotLottie = this.dotLottie;

        // Store the dotLottie instance for later use
        this._dotLottieInstance = dotLottie;

        // Ensure the animation starts at frame 0 and paused
        if (dotLottie) {
          dotLottie.setFrame(0);
          dotLottie.pause();
        }

      });

      // Play animation once on hover (desktop)
      profileAnimation.addEventListener('mouseenter', function () {
        if (this._dotLottieInstance) {
          // Reset to beginning and play
          this._dotLottieInstance.setFrame(0);
          this._dotLottieInstance.setSpeed(1); // Set speed to normal
          this._dotLottieInstance.play();
          // Listen for the complete event to pause the animation after it finishes
          this.removeEventListener('complete', null);  // Remove any existing listener first
          const self = this;
          const listener = function () {
            if (self._dotLottieInstance) {
              self._dotLottieInstance.pause();
            }
          };
          this.addEventListener('complete', listener);
        } else if (this.dotLottie) {
          // Also try direct access to dotLottie property
          // Reset to beginning and play
          this.dotLottie.setFrame(0);
          this.dotLottie.setSpeed(1); // Set speed to normal
          this.dotLottie.play();
          // Listen for the complete event to pause the animation after it finishes
          this.removeEventListener('complete', null);  // Remove any existing listener first
          const self = this;
          const listener = function () {
            if (self.dotLottie) {
              self.dotLottie.pause();
            }
          };
          this.addEventListener('complete', listener);
        } else {
          // If dotLottie is not ready, try to get it now
          this._dotLottieInstance = this.dotLottie;
          if (this._dotLottieInstance) {
            // Reset to beginning and play
            this._dotLottieInstance.setFrame(0);
            this._dotLottieInstance.setSpeed(1); // Set speed to normal
            this._dotLottieInstance.play();
            // Listen for the complete event to pause the animation after it finishes
            this.removeEventListener('complete', null);  // Remove any existing listener first
            const self = this;
            const listener = function () {
              if (self._dotLottieInstance) {
                self._dotLottieInstance.pause();
              }
            };
            this.addEventListener('complete', listener);
          }
        }
      });

      // Reset animation when mouse leaves (if not completed yet)
      profileAnimation.addEventListener('mouseleave', function () {
        // If animation is still playing, reset to beginning
        if (this._dotLottieInstance) {
          this._dotLottieInstance.pause();
          this._dotLottieInstance.setFrame(0);
        } else if (this.dotLottie) {
          // Also try direct access to dotLottie property
          this.dotLottie.pause();
          this.dotLottie.setFrame(0);
        } else {
          // If dotLottie is not ready, try to get it now
          this._dotLottieInstance = this.dotLottie;
          if (this._dotLottieInstance) {
            this._dotLottieInstance.pause();
            this._dotLottieInstance.setFrame(0);
          }
        }
      });

      // Store touch start time for long press detection
      let touchStartTime = 0;
      let longPressTimer = null;

      // Handle both animation play and long press detection in a single touchstart event
      profileAnimation.addEventListener('touchstart', function (e) {
        e.preventDefault(); // Prevent any default touch behavior

        // For animation play
        // Prevent multiple triggers during a single touch
        if (this._isPlayingOnMobile) {
          return; // If already playing, don't restart
        }

        this._isPlayingOnMobile = true; // Mark as playing

        // Ensure animation starts from the beginning and plays once
        if (this._dotLottieInstance) {
          this._dotLottieInstance.pause();
          this._dotLottieInstance.setFrame(0);
          this._dotLottieInstance.setSpeed(1); // Set speed to normal
          this._dotLottieInstance.play();

          // As a backup, pause the animation after the known duration
          const self = this;
          setTimeout(() => {
            if (self._dotLottieInstance && self._isPlayingOnMobile) {
              self._dotLottieInstance.pause();
              self._dotLottieInstance.setFrame(0);
              self._isPlayingOnMobile = false;
            }
          }, 1500);
        } else if (this.dotLottie) {
          // Also try direct access to dotLottie property
          this.dotLottie.pause();
          this.dotLottie.setFrame(0);
          this.dotLottie.setSpeed(1); // Set speed to normal
          this.dotLottie.play();

          // As a backup, pause the animation after the known duration
          const self = this;
          setTimeout(() => {
            if (self.dotLottie && self._isPlayingOnMobile) {
              self.dotLottie.pause();
              self.dotLottie.setFrame(0);
              self._isPlayingOnMobile = false;
            }
          }, 1500);
        } else {
          // If dotLottie is not ready, try to get it now
          this._dotLottieInstance = this.dotLottie;
          if (this._dotLottieInstance) {
            this._dotLottieInstance.pause();
            this._dotLottieInstance.setFrame(0);
            this._dotLottieInstance.setSpeed(1); // Set speed to normal
            this._dotLottieInstance.play();

            // As a backup, pause the animation after the known duration
            const self = this;
            setTimeout(() => {
              if (self._dotLottieInstance && self._isPlayingOnMobile) {
                self._dotLottieInstance.pause();
                self._dotLottieInstance.setFrame(0);
                self._isPlayingOnMobile = false;
              }
            }, 1500);
          }
        }

        // For long press detection
        touchStartTime = Date.now(); // Store the touch start time

        // Set a timer to hide the animation after 1 second
        longPressTimer = setTimeout(() => {
          // Hide the animation to reveal the spinning circle underneath
          this.classList.add('hide');
        }, 1000); // 1 second threshold
      });

      // Show animation when released (mobile)
      profileAnimation.addEventListener('touchend', function (e) {
        // Clear the long press timer if touch is released
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          longPressTimer = null;
        }

        // Check if the animation was hidden due to a long press
        const touchDuration = Date.now() - touchStartTime;
        if (touchDuration >= 1000) {
          // If it was a long press (animation was hidden), toggle its visibility
          this.classList.toggle('hide');
        }
      });

      // Also handle touch cancel (in case of interruption)
      profileAnimation.addEventListener('touchcancel', function (e) {
        // Clear the long press timer if touch is cancelled
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          longPressTimer = null;
        }

        // Show the animation again when touch is cancelled
        this.classList.remove('hide');
      });

    }

    // Check if the custom element is already defined
    if (customElements.get('dotlottie-wc')) {
      // If it's already loaded, set up events now
      setupAnimationEvents();
    } else {
      // If not loaded yet, wait for it to be defined
      customElements.whenDefined('dotlottie-wc').then(() => {
        // Small delay to ensure element is fully initialized
        setTimeout(setupAnimationEvents, 100);
      });
    }
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
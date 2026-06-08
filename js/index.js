const TYPING_SPEED = 20;
const ANIMATION_DURATION = 1500;
const LONG_PRESS_DURATION = 1000;
const OBSERVER_THRESHOLD = 0.3;

function typeText(element, text, callback) {
  let i = 0;
  element.textContent = '';
  const type = () => {
    if (i < text.length) {
      element.textContent += text.charAt(i++);
      setTimeout(type, TYPING_SPEED);
    } else callback?.();
  };
  type();
}

const getLottieInstance = el => el?._dotLottieInstance || el?.dotLottie || null;

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

// Mobile viewport and scroll fix
(function () {
  if (window.innerWidth > 900) return;

  const setVH = () => document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  setVH();
  window.addEventListener('resize', setVH);
  window.addEventListener('orientationchange', setVH);
})();

function initIntroTyping() {
  const heading = document.querySelector('.intro-heading');
  const paragraph = document.querySelector('.intro-paragraph');
  if (!heading || !paragraph) return;

  const textH = heading.getAttribute('data-text');
  const textP = paragraph.getAttribute('data-text');

  if (!sessionStorage.getItem('typingEffectCompleted')) {
    heading.textContent = '';
    paragraph.textContent = '';
    heading.classList.add('typing-text');
    setTimeout(() => {
      typeText(heading, textH, () => {
        heading.classList.add('typed');
        paragraph.classList.add('typing-text');
        typeText(paragraph, textP, () => sessionStorage.setItem('typingEffectCompleted', 'true'));
      });
    }, 1400);
  } else {
    heading.textContent = textH;
    paragraph.textContent = textP;
    heading.classList.add('typing-text', 'typed');
    paragraph.classList.add('typing-text');
  }
}

function initSectionTyping() {
  const revealed = sessionStorage.getItem('contactPillRevealed') === 'true';
  if (revealed || !window.isIndexPage) {
    document.querySelectorAll('.contact-pill').forEach(pill => pill.classList.add('static-pill'));
  }

  const headings = document.querySelectorAll('.work-summary h2[data-text]');
  const descriptions = document.querySelectorAll('.work-summary p[data-text]');
  const isCompleted = sessionStorage.getItem('typingEffectCompleted') === 'true';

  if (isCompleted) {
    [...headings, ...descriptions].forEach(el => {
      el.textContent = el.getAttribute('data-text');
      el.classList.add('typing-text');
      if (el.tagName !== 'P') {
        el.classList.add('typed');
        el.parentElement.querySelector('.contact-pill')?.classList.add('static-pill');
      }
    });
    return;
  }

  [...headings, ...descriptions].forEach(el => el.textContent = '');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.classList.contains('typed')) return;
      const el = entry.target;
      const text = el.getAttribute('data-text');

      if (el.tagName !== 'P') {
        el.classList.add('typing-text');
        typeText(el, text, () => {
          el.classList.add('typed');
          const pill = el.parentElement.querySelector('.contact-pill');
          if (pill) {
            pill.classList.add('reveal');
            sessionStorage.setItem('contactPillRevealed', 'true');
          }
          sessionStorage.setItem('workSectionTypingCompleted', 'true');
        });
      } else {
        el.textContent = text;
        el.classList.add('typing-text');
      }
      observer.unobserve(el);
    });
  }, { threshold: OBSERVER_THRESHOLD });

  headings.forEach(h => observer.observe(h));
  descriptions.forEach(d => observer.observe(d));
}

function setupAnimationEvents(profileAnimation) {
  if (!profileAnimation) return;

  if (profileAnimation.dotLottie) {
    profileAnimation._dotLottieInstance = profileAnimation.dotLottie;
    profileAnimation._dotLottieInstance.setFrame(0);
    profileAnimation._dotLottieInstance.pause();
  }

  profileAnimation.addEventListener('ready', function () {
    this._dotLottieInstance = this.dotLottie;
    this._dotLottieInstance?.setFrame(0);
    this._dotLottieInstance?.pause();
  });

  profileAnimation.addEventListener('mouseenter', function () { playLottieAnimation(this); });

  let touchStartTime = 0, longPressTimer = null;

  profileAnimation.addEventListener('touchstart', function (e) {
    e.preventDefault();
    if (this._isPlayingOnMobile) return;
    this._isPlayingOnMobile = true;

    playLottieAnimation(this);
    setTimeout(() => {
      this._isPlayingOnMobile = false;
    }, ANIMATION_DURATION);

    touchStartTime = Date.now();
    longPressTimer = setTimeout(() => this.classList.add('hide'), LONG_PRESS_DURATION);
  });

  profileAnimation.addEventListener('touchend', function () {
    clearTimeout(longPressTimer);
    if (Date.now() - touchStartTime >= LONG_PRESS_DURATION) this.classList.toggle('hide');
  });

  profileAnimation.addEventListener('touchcancel', () => {
    clearTimeout(longPressTimer);
    profileAnimation.classList.remove('hide');
  });
}

function initVideoHoverControl() {
  const projectsSection = document.querySelector('.projects-section');
  const thumbnails = document.querySelectorAll('.project-thumbnail');

  let activeMobileProject = null;

  const isProjectActive = (project) => {
    if (window.innerWidth <= 900) {
      return project === activeMobileProject;
    }
    const isHovered = project.matches(':hover');
    const isDefault = project.classList.contains('default-animation');
    const anyHovered = Array.from(document.querySelectorAll('.project')).some(p => p.matches(':hover'));
    return isHovered || (isDefault && !anyHovered);
  };

  const updateMedia = () => {
    thumbnails.forEach(el => {
      const project = el.closest('.project');
      if (!project) return;
      const active = isProjectActive(project);

      if (el.tagName === 'VIDEO') {
        if (active) {
          if (el._playTimeout) {
            clearTimeout(el._playTimeout);
            el._playTimeout = null;
          }
          el.classList.add('is-playing');
          if (el.paused) {
            el.play().catch(() => { });
          }
        } else {
          if (el._playTimeout) {
            clearTimeout(el._playTimeout);
            el._playTimeout = null;
          }
          if (!el.paused) {
            el.pause();
          }
          el.classList.remove('is-playing');
          // Delay resetting currentTime until the fade-out transition is complete
          setTimeout(() => {
            if (!isProjectActive(project)) {
              el.currentTime = 0;
            }
          }, 300);
        }
      } else {
        // CSS Animation (SmartShuttle) - IMMEDIATE RESET
        if (active) {
          project.classList.add('is-animating');
          el.classList.remove('reset-animation');
        } else {
          project.classList.remove('is-animating');
          el.classList.add('reset-animation');
        }
      }
    });
  };

  thumbnails.forEach(el => {
    if (el.tagName === 'VIDEO') {
      el.addEventListener('ended', () => {
        const project = el.closest('.project');
        if (isProjectActive(project)) {
          if (el.src.includes('Financier')) {
            if (el._playTimeout) clearTimeout(el._playTimeout);
            el._playTimeout = setTimeout(() => {
              el._playTimeout = null;
              if (isProjectActive(project)) {
                el.play().catch(() => { });
              }
            }, 2000); // 2 second delay to spread out loops for Financier only
          } else {
            el.play().catch(() => { });
          }
        } else {
          el.pause();
          el.classList.remove('is-playing');
          setTimeout(() => {
            if (!isProjectActive(project)) {
              el.currentTime = 0;
            }
          }, 300);
        }
      });
    }
  });

  if (projectsSection) {
    ['mouseenter', 'mouseleave', 'mouseover', 'mouseout'].forEach(evt => {
      projectsSection.addEventListener(evt, updateMedia, evt.includes('leave') || evt.includes('enter'));
    });

    const observerOptions = {
      root: null,
      rootMargin: '-25% 0px -25% 0px',
      threshold: 0.2
    };

    const intersectingProjects = new Set();

    const updateActiveMobileProject = () => {
      if (intersectingProjects.size > 0) {
        let closestProject = null;
        let minDistance = Infinity;
        const centerY = window.innerHeight / 2;

        intersectingProjects.forEach(project => {
          const rect = project.getBoundingClientRect();
          const projectCenterY = rect.top + rect.height / 2;
          const distance = Math.abs(projectCenterY - centerY);
          if (distance < minDistance) {
            minDistance = distance;
            closestProject = project;
          }
        });

        if (activeMobileProject !== closestProject) {
          activeMobileProject = closestProject;
          updateMedia();
        }
      } else if (activeMobileProject !== null) {
        activeMobileProject = null;
        updateMedia();
      }
    };

    const mobileObserver = new IntersectionObserver((entries) => {
      if (window.innerWidth > 900) return;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          intersectingProjects.add(entry.target);
        } else {
          intersectingProjects.delete(entry.target);
        }
      });
      updateActiveMobileProject();
    }, observerOptions);

    document.querySelectorAll('.project').forEach(p => mobileObserver.observe(p));

    window.addEventListener('scroll', () => {
      if (window.innerWidth <= 900) {
        updateActiveMobileProject();
      }
    }, { passive: true });

    updateMedia();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initIntroTyping();
  initSectionTyping();
  initVideoHoverControl();

  const profileImg = document.querySelector('.profile-image');
  const profileAnim = document.querySelector('.profile-animation');

  profileImg?.addEventListener('click', () => profileImg.classList.toggle('hide'));
  if (profileAnim) {
    profileAnim.addEventListener('click', () => profileAnim.classList.toggle('hide'));
    if (customElements.get('dotlottie-wc')) setupAnimationEvents(profileAnim);
    else customElements.whenDefined('dotlottie-wc').then(() => setTimeout(() => setupAnimationEvents(profileAnim), 100));
  }
});
const TYPING_SPEED = 20;
const ANIMATION_DURATION = 1500;
const LONG_PRESS_DURATION = 1000;
const OBSERVER_THRESHOLD = 0.3;

function typeText(element, text, callback) {
  if (element._typingTimer) {
    clearTimeout(element._typingTimer);
    element._typingTimer = null;
  }
  let i = 0;
  element.textContent = '';
  const type = () => {
    if (i < text.length) {
      element.textContent += text.charAt(i++);
      element._typingTimer = setTimeout(type, TYPING_SPEED);
    } else {
      element._typingTimer = null;
      callback?.();
    }
  };
  type();
}

const getLottieInstance = el => el?._dotLottieInstance || el?.dotLottie || null;

function playLottieAnimation(element) {
  const instance = getLottieInstance(element);
  if (!instance) return;

  try { instance.pause(); } catch (e) { /* WebGL context may be lost */ }
  try { instance.setFrame(0); } catch (e) { /* WebGL context may be lost */ }
  try { instance.setSpeed(1); } catch (e) { /* WebGL context may be lost */ }
  try { instance.play(); } catch (e) { /* WebGL context may be lost */ }
  element.classList.remove('animation-completed');

  setTimeout(() => {
    const inst = getLottieInstance(element);
    if (inst) {
      try { inst.pause(); } catch (e) { /* WebGL context may be lost */ }
      element.classList.add('animation-completed');
    }
  }, ANIMATION_DURATION);
}

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

  let resizeRAF = null;

  const handleResize = () => {
    if (resizeRAF) return;
    resizeRAF = requestAnimationFrame(() => {
      resizeRAF = null;
      const instance = getLottieInstance(profileAnimation);
      if (instance && typeof instance.resize === 'function') {
        try { instance.resize(); } catch (e) { /* WebGL context may be lost */ }
      }
    });
  };

  const safelyInit = (instance) => {
    try { instance.setFrame(0); } catch (e) { /* WebGL context may be lost */ }
    try { instance.pause(); } catch (e) { /* WebGL context may be lost */ }
  };

  if (profileAnimation.dotLottie) {
    profileAnimation._dotLottieInstance = profileAnimation.dotLottie;
    safelyInit(profileAnimation._dotLottieInstance);
    setTimeout(handleResize, 100);
    document.querySelector('.spinning-ring')?.style.setProperty('opacity', '1');
    setTimeout(() => { profileAnimation._lottieReady = true; }, 300);
  }

  profileAnimation.addEventListener('ready', function () {
    this._dotLottieInstance = this.dotLottie;
    if (this._dotLottieInstance) safelyInit(this._dotLottieInstance);
    setTimeout(handleResize, 100);
    document.querySelector('.spinning-ring')?.style.setProperty('opacity', '1');
    const el = this;
    setTimeout(() => { el._lottieReady = true; }, 300);
  });

  window.addEventListener('resize', handleResize);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      setTimeout(handleResize, 10);
    }
  });

  const homeSection = document.getElementById('home');
  if (homeSection) {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'style' || mutation.attributeName === 'class') {
          if (homeSection.style.display !== 'none') {
            setTimeout(handleResize, 50);
          } else {
            observer.disconnect();
          }
          break;
        }
      }
    });
    observer.observe(homeSection, { attributes: true });

    window.addEventListener('beforeunload', () => observer.disconnect());
  }

  profileAnimation.addEventListener('mouseenter', function () {
    if (!this._lottieReady) return;
    playLottieAnimation(this);
  });

  let touchStartTime = 0, longPressTimer = null;

  profileAnimation.addEventListener('touchstart', function (e) {
    e.preventDefault();
    if (!this._lottieReady || this._isPlayingOnMobile) return;
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

  profileAnimation.addEventListener('click', () => profileAnimation.classList.toggle('hide'));
}

function initVideoHoverControl() {
  const projectsSection = document.querySelector('.projects-section');
  const thumbnails = document.querySelectorAll('.project-thumbnail');
  const projectElements = document.querySelectorAll('.project');

  let activeMobileProject = null;
  let hoveredProject = null;
  let rAFId = null;

  const isProjectActive = (project) => {
    if (window.innerWidth <= 900) {
      return project === activeMobileProject;
    }
    return project === hoveredProject ||
      (hoveredProject === null && project.classList.contains('default-animation'));
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
          setTimeout(() => {
            if (!isProjectActive(project)) {
              el.currentTime = 0;
            }
          }, 300);
        }
      } else {
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

  const scheduleUpdate = () => {
    if (rAFId) return;
    rAFId = requestAnimationFrame(() => {
      rAFId = null;
      updateMedia();
    });
  };

  thumbnails.forEach(el => {
    if (el.tagName === 'VIDEO') {
      el.addEventListener('ended', () => {
        const project = el.closest('.project');
        if (!isProjectActive(project)) {
          el.pause();
          el.classList.remove('is-playing');
          setTimeout(() => {
            if (!isProjectActive(project)) {
              el.currentTime = 0;
            }
          }, 300);
          return;
        }

        if (el._replayGuard) return;
        el._replayGuard = true;

        if (el.src.includes('Financier')) {
          if (el._playTimeout) clearTimeout(el._playTimeout);
          el._playTimeout = setTimeout(() => {
            el._playTimeout = null;
            el._replayGuard = false;
            if (isProjectActive(project)) {
              el.play().catch(() => { });
            }
          }, 2000);
        } else {
          setTimeout(() => {
            el._replayGuard = false;
            if (isProjectActive(project)) {
              el.play().catch(() => { });
            }
          }, 100);
        }
      });
    }
  });

  if (projectsSection) {
    projectElements.forEach(project => {
      project.addEventListener('mouseenter', () => {
        hoveredProject = project;
        scheduleUpdate();
      });
      project.addEventListener('mouseleave', () => {
        if (hoveredProject === project) {
          hoveredProject = null;
          scheduleUpdate();
        }
      });
    });

    const observerOptions = {
      root: null,
      rootMargin: '-25% 0px -25% 0px',
      threshold: 0.4
    };

    const intersectingProjects = new Set();
    let mobileUpdateTimer = null;

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
          scheduleUpdate();
        }
      } else if (activeMobileProject !== null) {
        activeMobileProject = null;
        scheduleUpdate();
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
      clearTimeout(mobileUpdateTimer);
      mobileUpdateTimer = setTimeout(updateActiveMobileProject, 150);
    }, observerOptions);

    projectElements.forEach(p => mobileObserver.observe(p));

    scheduleUpdate();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initIntroTyping();
  initSectionTyping();
  initVideoHoverControl();

  const profileAnim = document.querySelector('.profile-animation');

  if (profileAnim) {
    if (customElements.get('dotlottie-wc')) setupAnimationEvents(profileAnim);
    else customElements.whenDefined('dotlottie-wc').then(() => setTimeout(() => setupAnimationEvents(profileAnim), 100));
  }
});
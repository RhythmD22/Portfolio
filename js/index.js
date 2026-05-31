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

  document.body.classList.add('mobile-scroll-fix');
  let touchStartY = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    const deltaY = touchStartY - e.touches[0].clientY;
    const isAtTop = window.pageYOffset <= 0 && deltaY < 0;
    const isAtBottom = (window.innerHeight + window.pageYOffset) >= document.body.offsetHeight && deltaY > 0;
    if (isAtTop || isAtBottom) e.preventDefault();
  }, { passive: false });

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

    const instance = getLottieInstance(this);
    if (instance) {
      instance.pause();
      instance.setFrame(0);
      instance.play();
      setTimeout(() => {
        if (this._isPlayingOnMobile) {
          getLottieInstance(this)?.pause();
          getLottieInstance(this)?.setFrame(0);
          this._isPlayingOnMobile = false;
        }
      }, ANIMATION_DURATION);
    }

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

document.addEventListener('DOMContentLoaded', () => {
  initIntroTyping();
  initSectionTyping();

  const profileImg = document.querySelector('.profile-image');
  const profileAnim = document.querySelector('.profile-animation');

  profileImg?.addEventListener('click', () => profileImg.classList.toggle('hide'));
  if (profileAnim) {
    profileAnim.addEventListener('click', () => profileAnim.classList.toggle('hide'));
    if (customElements.get('dotlottie-wc')) setupAnimationEvents(profileAnim);
    else customElements.whenDefined('dotlottie-wc').then(() => setTimeout(() => setupAnimationEvents(profileAnim), 100));
  }
});
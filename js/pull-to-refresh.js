(function () {
  if (!('ontouchstart' in window)) return;

  if (sessionStorage.getItem('ptr-refresh')) {
    sessionStorage.removeItem('ptr-refresh');
    window.scrollTo(0, 0);
  }

  var PULL_THRESHOLD = 80;
  var MAX_PULL = 150;

  var lastY = 0;
  var pullDistance = 0;
  var pulling = false;
  var refreshing = false;
  var indicator = null;
  var spinnerEl = null;
  var textEl = null;
  var resetTimer = null;

  function createIndicator() {
    indicator = document.createElement('div');
    indicator.className = 'ptr-indicator';
    indicator.innerHTML =
      '<div class="ptr-spinner">' +
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<polyline points="23 4 23 10 17 10"></polyline>' +
      '<path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>' +
      '</svg>' +
      '</div>' +
      '<span class="ptr-text">Pull to refresh</span>';
    document.body.insertBefore(indicator, document.body.firstChild);
    spinnerEl = indicator.querySelector('.ptr-spinner');
    textEl = indicator.querySelector('.ptr-text');
  }

  function setPullDistance(distance) {
    var clamped = distance > MAX_PULL ? MAX_PULL : distance;
    var eased = clamped * 0.5;
    indicator.style.height = eased + 'px';
    indicator.style.opacity = clamped / PULL_THRESHOLD > 1 ? 1 : (clamped / PULL_THRESHOLD);

    if (clamped >= PULL_THRESHOLD) {
      textEl.textContent = 'Release to refresh';
      spinnerEl.style.transform = 'rotate(180deg)';
      indicator.classList.add('ptr-over-threshold');
    } else {
      textEl.textContent = 'Pull to refresh';
      spinnerEl.style.transform = 'rotate(0deg)';
      indicator.classList.remove('ptr-over-threshold');
    }
  }

  function snapToHeight(height, callback) {
    indicator.style.transition = 'height 0.25s ease, opacity 0.25s ease';
    indicator.style.height = height + 'px';
    indicator.style.opacity = height > 0 ? '1' : '0';
    if (callback) {
      setTimeout(callback, 250);
    }
  }

  function resetPull() {
    snapToHeight(0, function () {
      indicator.style.transition = '';
      indicator.classList.remove('refreshing', 'ptr-over-threshold');
      textEl.textContent = 'Pull to refresh';
      spinnerEl.style.transform = 'rotate(0deg)';
      spinnerEl.classList.remove('spinning');
    });
  }

  function startRefresh() {
    if (refreshing) return;
    refreshing = true;

    window.scrollTo(0, 0);
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname);
    }
    sessionStorage.setItem('ptr-refresh', '1');

    indicator.classList.add('refreshing');
    textEl.textContent = 'Refreshing...';
    spinnerEl.classList.add('spinning');
    spinnerEl.style.transform = '';

    snapToHeight(50, function () {
      location.reload();
    });
  }

  document.addEventListener('touchstart', function (e) {
    if (refreshing) return;
    lastY = e.touches[0].clientY;
    pullDistance = 0;
    pulling = false;
    if (resetTimer) { clearTimeout(resetTimer); resetTimer = null; }
  }, { passive: true });

  document.addEventListener('touchmove', function (e) {
    if (refreshing || lastY === 0) return;

    var currentY = e.touches[0].clientY;
    var delta = currentY - lastY;

    if (!pulling && window.scrollY <= 0 && delta > 5) {
      pulling = true;
      pullDistance = 0;
      if (!indicator) createIndicator();
      indicator.style.height = '0px';
      indicator.style.opacity = '0';
    }

    if (pulling && window.scrollY <= 0) {
      e.preventDefault();
      pullDistance += delta;
      if (pullDistance < 0) pullDistance = 0;
      setPullDistance(pullDistance);
    }

    lastY = currentY;
  }, { passive: false });

  document.addEventListener('touchend', function () {
    if (refreshing) return;
    if (pulling) {
      if (pullDistance >= PULL_THRESHOLD) {
        startRefresh();
      } else {
        resetPull();
      }
    }
    pulling = false;
    lastY = 0;
    pullDistance = 0;
  });
})();
// Shared scroll-to-top functionality
document.addEventListener('DOMContentLoaded', function () {
  const topButton = document.querySelector('button[onclick*="scrollTo"]');

  if (topButton) {
    // Initially hide the button
    topButton.style.display = 'none';

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        topButton.style.display = 'block';
      } else {
        topButton.style.display = 'none';
      }
    });
  }
});
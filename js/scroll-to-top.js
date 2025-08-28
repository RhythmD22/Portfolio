// Shared scroll-to-top functionality
const topButton = document.querySelector('button[onclick*="scrollTo"]');

if (topButton) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      topButton.style.display = 'block';
    } else {
      topButton.style.display = 'none';
    }
  });

  window.addEventListener('DOMContentLoaded', () => {
    topButton.style.display = 'none';
  });
}
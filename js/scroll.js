// Scroll functionality - handles both scroll to top and scroll to bottom
document.addEventListener('DOMContentLoaded', function () {
  const scrollButton = document.querySelector('button[onclick*="scrollTo"], .scroll-btn, .scroll-top-btn');

  if (scrollButton) {
    // Initially hide the button
    scrollButton.style.display = 'none';

    // Check if we're on a project page (not index or about)
    const isProjectPage = !(
      window.location.pathname.includes('index.html') ||
      window.location.pathname.endsWith('/') ||
      window.location.pathname.includes('About.html')
    );

    // Update button function based on scroll position
    function updateScrollButton() {
      // Show button when scrolled down (> 100px)
      if (window.scrollY > 100) {
        scrollButton.style.display = 'block';
        // Scroll to top when scrolled down
        scrollButton.onclick = function () {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        // Update aria label for accessibility
        scrollButton.setAttribute('aria-label', 'Scroll to top');
        // Restore arrow direction to point up
        const svg = scrollButton.querySelector('svg');
        if (svg) {
          const polyline = svg.querySelector('polyline');
          if (polyline) {
            polyline.setAttribute('points', '18 15 12 9 6 15');
          }
        }
      }
      // When near top (< 100px)
      else {
        // For project pages, show scroll to bottom button
        if (isProjectPage) {
          scrollButton.style.display = 'block';
          // Change button to scroll to bottom
          scrollButton.onclick = function () {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          };
          // Update aria label for accessibility
          scrollButton.setAttribute('aria-label', 'Scroll to bottom');
          // Point arrow down
          const svg = scrollButton.querySelector('svg');
          if (svg) {
            const polyline = svg.querySelector('polyline');
            if (polyline) {
              polyline.setAttribute('points', '6 9 12 15 18 9');
            }
          }
        }
        // For index/about pages, hide the button at the top
        else {
          scrollButton.style.display = 'none';
        }
      }
    }

    // Set initial state
    updateScrollButton();

    // Update on scroll
    window.addEventListener('scroll', updateScrollButton);

    // Also update on resize in case page height changes
    window.addEventListener('resize', updateScrollButton);
  }
});
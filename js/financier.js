// Add touch event listeners for the Magnate link
document.addEventListener('DOMContentLoaded', function () {
  const magnateLink = document.getElementById('magnate-link');
  if (magnateLink) {
    magnateLink.addEventListener('touchstart', function () {
      this.style.color = '#518be5';
    });

    magnateLink.addEventListener('touchend', function () {
      this.style.color = '#1143b0';
    });

    // Keep the existing mouse events for desktop users
    magnateLink.addEventListener('mouseover', function () {
      this.style.color = '#518be5';
    });

    magnateLink.addEventListener('mouseout', function () {
      this.style.color = '#1143b0';
    });
  }

  Fancybox.bind('[data-fancybox="financier-outline"], [data-fancybox="financier-mockup"], [data-fancybox="iGrad"]', {
    Carousel: {
      Toolbar: {
        display: {
          left: ["counter"],
          right: ["zoomIn", "zoomOut", "autoplay", "thumbs", "close"],
        },
      },
    },
  });
});
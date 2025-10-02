// Initialize Fancybox for other designs gallery on index page
Fancybox.bind('[data-fancybox="other-designs"]', {
  Carousel: {
    Toolbar: {
      display: {
        left: ["counter"],
        right: ["zoomIn", "zoomOut", "autoplay", "thumbs", "close"],
      },
    },
  },
});
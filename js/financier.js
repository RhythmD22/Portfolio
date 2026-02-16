Fancybox.bind(
  '[data-fancybox="financier-outline"], [data-fancybox="financier-mockup"], [data-fancybox="iGrad"], [data-fancybox="moneyhelper-voya"]',
  {
    Carousel: {
      Toolbar: {
        display: {
          left: ["counter"],
          right: ["zoomIn", "zoomOut", "autoplay", "thumbs", "close"],
        },
      },
    },
  }
);

document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll('.feature-video');

  videos.forEach(video => {
    video.controls = false;

    video.addEventListener('loadeddata', () => {
      video.play().catch(() => {
        video.muted = true;
        video.play().catch(e => console.log('Autoplay failed:', e));
      });
    });
  });
});
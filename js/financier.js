// Initialize Fancybox for image galleries
Fancybox.bind('[data-fancybox="financier-outline"], [data-fancybox="financier-mockup"], [data-fancybox="iGrad"], [data-fancybox="moneyhelper-voya"]', {
  Carousel: {
    Toolbar: {
      display: {
        left: ["counter"],
        right: ["zoomIn", "zoomOut", "autoplay", "thumbs", "close"],
      },
    },
  },
});

// Video functionality
document.addEventListener('DOMContentLoaded', function () {
  const videos = document.querySelectorAll('.feature-video');

  videos.forEach(video => {
    // Ensure videos autoplay without controls
    video.controls = false;

    // Attempt to play the video when it's loaded
    video.addEventListener('loadeddata', function () {
      // Try to play the video
      const playPromise = video.play();

      // Handle browsers that require user interaction for autoplay
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Autoplay was prevented, mute the video and try again
          video.muted = true;
          video.play().catch(e => {
            console.log("Autoplay failed:", e);
          });
        });
      }
    });
  });
});
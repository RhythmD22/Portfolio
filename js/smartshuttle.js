Fancybox.bind('[data-fancybox="smartshuttle-outline-1"], [data-fancybox="smartshuttle-outline-2"], [data-fancybox="smartshuttle-outline-3"]', {
  Carousel: {
    Toolbar: {
      display: {
        left: ["counter"],
        right: ["zoomIn", "zoomOut", "autoplay", "thumbs", "close"],
      },
    },
  },
});

// Ensure the SmartShuttle video plays automatically
document.addEventListener('DOMContentLoaded', function () {
  const video = document.getElementById('smartshuttle-video');
  if (video) {
    // Set muted to true programmatically, which is required for autoplay
    video.muted = true;

    // Try to play the video
    const playPromise = video.play();

    // Handle potential promise rejection
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // Auto-play was prevented, log the error
        console.log('SmartShuttle video autoplay failed: ', error);
      });
    }
  }
});
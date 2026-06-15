function updateCharts() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const opts = getChartOptions(isDark);
  if (window.problemsChart) { window.problemsChart.options = opts.bar; window.problemsChart.update(); }
  if (window.commuteChart) { window.commuteChart.options = opts.pie; window.commuteChart.update(); }
  if (window.techChart) { window.techChart.options = opts.bar; window.techChart.update(); }
}

function initCharts() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const opts = getChartOptions(isDark);

  window.problemsChart = createChart('problemsChart', 'bar', {
    labels: ['Shuttle Unreliability', 'Shuttle Overcrowding', 'Parking Issues', 'Walking Distance/Hills'],
    datasets: [{
      label: 'Number of Mentions',
      data: [3, 2, 1, 1],
      backgroundColor: ['rgba(220, 53, 69, 0.7)', 'rgba(220, 53, 69, 0.5)', 'rgba(255, 193, 7, 0.7)', 'rgba(255, 193, 7, 0.5)'],
      borderColor: ['rgba(220, 53, 69, 1)', 'rgba(220, 53, 69, 1)', 'rgba(255, 193, 7, 1)', 'rgba(255, 193, 7, 1)'],
      borderWidth: 1
    }]
  }, opts.bar);

  window.commuteChart = createChart('commuteChart', 'doughnut', {
    labels: ['Shuttle', 'Walking', 'Car'],
    datasets: [{
      label: 'Number of Users',
      data: [3, 1, 1],
      backgroundColor: ['rgba(153, 102, 255, 0.7)', 'rgba(199, 199, 199, 0.7)', 'rgba(255, 159, 64, 0.7)'],
      borderColor: ['rgba(153, 102, 255, 1)', 'rgba(199, 199, 199, 1)', 'rgba(255, 159, 64, 1)'],
      borderWidth: 1
    }]
  }, opts.pie);

  window.techChart = createChart('techChart', 'bar', {
    labels: ['Real-time Updates', 'Parking Info', 'Alternative Transport'],
    datasets: [{
      label: 'Number of Requests',
      data: [3, 1, 1],
      backgroundColor: ['rgba(40, 167, 69, 0.7)', 'rgba(40, 167, 69, 0.5)', 'rgba(40, 167, 69, 0.3)'],
      borderColor: ['rgba(40, 167, 69, 1)', 'rgba(40, 167, 69, 1)', 'rgba(40, 167, 69, 1)'],
      borderWidth: 1
    }]
  }, opts.bar);
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof Fancybox !== 'undefined') {
    Fancybox.bind('[data-fancybox^="smartshuttle-outline"]', {
      Carousel: { Toolbar: { display: { left: ["counter"], right: ["zoomIn", "zoomOut", "autoplay", "thumbs", "close"] } } }
    });
  }

  const video = document.getElementById('smartshuttle-video');
  if (video) {
    video.muted = true;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(video);
        video.play().catch(() => { });
      });
    }, { rootMargin: '200px' });
    observer.observe(video);
  }

  initCharts();
  observeThemeChanges(updateCharts);
});
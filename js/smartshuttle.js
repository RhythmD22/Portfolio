const getChartOptions = (isDark) => {
  const textColor = isDark ? '#f0f0f0' : '#333';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
  const tickColor = isDark ? '#f0f0f0' : '#666';

  const base = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'top', labels: { color: textColor, font: { size: 14 } } },
      title: { display: false }
    }
  };

  return {
    bar: {
      ...base,
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1, color: tickColor, font: { size: 12 } }, grid: { color: gridColor } },
        x: { ticks: { maxRotation: 45, minRotation: 0, color: tickColor, font: { size: 12 } }, grid: { color: gridColor } }
      }
    },
    doughnut: base
  };
};

function updateCharts() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const { bar, doughnut } = getChartOptions(isDark);
  if (window.problemsChart) { window.problemsChart.options = bar; window.problemsChart.update(); }
  if (window.commuteChart) { window.commuteChart.options = doughnut; window.commuteChart.update(); }
  if (window.techChart) { window.techChart.options = bar; window.techChart.update(); }
}

function initCharts() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const { bar, doughnut } = getChartOptions(isDark);

  const createChart = (id, type, data, options) => {
    const el = document.getElementById(id);
    if (el) return new Chart(el.getContext('2d'), { type, data, options });
  };

  window.problemsChart = createChart('problemsChart', 'bar', {
    labels: ['Shuttle Unreliability', 'Shuttle Overcrowding', 'Parking Issues', 'Walking Distance/Hills'],
    datasets: [{
      label: 'Number of Mentions',
      data: [3, 2, 1, 1],
      backgroundColor: ['rgba(220, 53, 69, 0.7)', 'rgba(220, 53, 69, 0.5)', 'rgba(255, 193, 7, 0.7)', 'rgba(255, 193, 7, 0.5)'],
      borderColor: ['rgba(220, 53, 69, 1)', 'rgba(220, 53, 69, 1)', 'rgba(255, 193, 7, 1)', 'rgba(255, 193, 7, 1)'],
      borderWidth: 1
    }]
  }, bar);

  window.commuteChart = createChart('commuteChart', 'doughnut', {
    labels: ['Shuttle', 'Walking', 'Car'],
    datasets: [{
      label: 'Number of Users',
      data: [3, 1, 1],
      backgroundColor: ['rgba(153, 102, 255, 0.7)', 'rgba(199, 199, 199, 0.7)', 'rgba(255, 159, 64, 0.7)'],
      borderColor: ['rgba(153, 102, 255, 1)', 'rgba(199, 199, 199, 1)', 'rgba(255, 159, 64, 1)'],
      borderWidth: 1
    }]
  }, doughnut);

  window.techChart = createChart('techChart', 'bar', {
    labels: ['Real-time Updates', 'Parking Info', 'Alternative Transport'],
    datasets: [{
      label: 'Number of Requests',
      data: [3, 1, 1],
      backgroundColor: ['rgba(40, 167, 69, 0.7)', 'rgba(40, 167, 69, 0.5)', 'rgba(40, 167, 69, 0.3)'],
      borderColor: ['rgba(40, 167, 69, 1)', 'rgba(40, 167, 69, 1)', 'rgba(40, 167, 69, 1)'],
      borderWidth: 1
    }]
  }, bar);
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
    video.play().catch(e => console.log('SmartShuttle video autoplay failed:', e));
  }

  initCharts();

  new MutationObserver(mutations => {
    if (mutations.some(m => m.attributeName === 'data-theme')) updateCharts();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
});
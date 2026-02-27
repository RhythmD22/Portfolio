// Chart data
const problemsData = {
  labels: ['Shuttle Unreliability', 'Shuttle Overcrowding', 'Parking Issues', 'Walking Distance/Hills'],
  datasets: [{
    label: 'Number of Mentions',
    data: [3, 2, 1, 1],
    backgroundColor: [
      'rgba(220, 53, 69, 0.7)',
      'rgba(220, 53, 69, 0.5)',
      'rgba(255, 193, 7, 0.7)',
      'rgba(255, 193, 7, 0.5)'
    ],
    borderColor: [
      'rgba(220, 53, 69, 1)',
      'rgba(220, 53, 69, 1)',
      'rgba(255, 193, 7, 1)',
      'rgba(255, 193, 7, 1)'
    ],
    borderWidth: 1
  }]
};

const commuteData = {
  labels: ['Shuttle', 'Walking', 'Car'],
  datasets: [{
    label: 'Number of Users',
    data: [3, 1, 1],
    backgroundColor: [
      'rgba(153, 102, 255, 0.7)',
      'rgba(199, 199, 199, 0.7)',
      'rgba(255, 159, 64, 0.7)'
    ],
    borderColor: [
      'rgba(153, 102, 255, 1)',
      'rgba(199, 199, 199, 1)',
      'rgba(255, 159, 64, 1)'
    ],
    borderWidth: 1
  }]
};

const techData = {
  labels: ['Real-time Updates', 'Parking Info', 'Alternative Transport'],
  datasets: [{
    label: 'Number of Requests',
    data: [3, 1, 1],
    backgroundColor: [
      'rgba(40, 167, 69, 0.7)',
      'rgba(40, 167, 69, 0.5)',
      'rgba(40, 167, 69, 0.3)'
    ],
    borderColor: [
      'rgba(40, 167, 69, 1)',
      'rgba(40, 167, 69, 1)',
      'rgba(40, 167, 69, 1)'
    ],
    borderWidth: 1
  }]
};

// Chart theme configuration
function getThemeOptions(isDarkMode) {
  const textColor = isDarkMode ? '#f0f0f0' : '#333';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
  const tickColor = isDarkMode ? '#f0f0f0' : '#666';

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
          font: { size: 14 }
        }
      },
      title: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: tickColor,
          font: { size: 12 }
        },
        grid: { color: gridColor }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0,
          color: tickColor,
          font: { size: 12 }
        },
        grid: { color: gridColor }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
          font: { size: 14 }
        }
      },
      title: { display: false }
    }
  };

  return { barOptions, doughnutOptions };
}

function updateChartTheme() {
  const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
  const { barOptions, doughnutOptions } = getThemeOptions(isDarkMode);

  if (window.problemsChart) {
    window.problemsChart.options = barOptions;
    window.problemsChart.update();
  }
  if (window.commuteChart) {
    window.commuteChart.options = doughnutOptions;
    window.commuteChart.update();
  }
  if (window.techChart) {
    window.techChart.options = barOptions;
    window.techChart.update();
  }
}

function initCharts() {
  const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
  const { barOptions, doughnutOptions } = getThemeOptions(isDarkMode);

  if (document.getElementById('problemsChart')) {
    window.problemsChart = new Chart(
      document.getElementById('problemsChart').getContext('2d'),
      {
        type: 'bar',
        data: problemsData,
        options: barOptions
      }
    );
  }

  if (document.getElementById('commuteChart')) {
    window.commuteChart = new Chart(
      document.getElementById('commuteChart').getContext('2d'),
      {
        type: 'doughnut',
        data: commuteData,
        options: doughnutOptions
      }
    );
  }

  if (document.getElementById('techChart')) {
    window.techChart = new Chart(
      document.getElementById('techChart').getContext('2d'),
      {
        type: 'bar',
        data: techData,
        options: barOptions
      }
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Fancybox
  Fancybox.bind(
    '[data-fancybox="smartshuttle-outline-1"], [data-fancybox="smartshuttle-outline-2"], [data-fancybox="smartshuttle-outline-3"]',
    {
      Carousel: {
        Toolbar: {
          display: {
            left: ["counter"],
            right: ["zoomIn", "zoomOut", "autoplay", "thumbs", "close"]
          }
        }
      }
    }
  );

  // Initialize SmartShuttle video
  const video = document.getElementById('smartshuttle-video');
  if (video) {
    video.muted = true;
    video.play().catch(e => console.log('SmartShuttle video autoplay failed:', e));
  }

  // Initialize charts
  initCharts();

  // Watch for theme changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        updateChartTheme();
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
});
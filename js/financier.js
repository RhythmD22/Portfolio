function getThemeOptions(isDarkMode) {
  const textColor = isDarkMode ? '#f0f0f0' : '#333';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
  const tickColor = isDarkMode ? '#f0f0f0' : '#666';

  return {
    barOptions: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top',
          labels: { color: textColor, font: { size: 14 } }
        },
        title: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1, color: tickColor, font: { size: 12 } },
          grid: { color: gridColor }
        },
        x: {
          ticks: { maxRotation: 45, minRotation: 0, color: tickColor, font: { size: 12 } },
          grid: { color: gridColor }
        }
      }
    },
    pieOptions: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top',
          labels: { color: textColor, font: { size: 14 } }
        },
        title: { display: false }
      }
    },
    horizontalBarOptions: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top',
          labels: { color: textColor, font: { size: 14 } }
        },
        title: { display: false }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { stepSize: 1, color: tickColor, font: { size: 12 } },
          grid: { color: gridColor }
        },
        y: {
          ticks: { color: tickColor, font: { size: 12 } },
          grid: { color: gridColor }
        }
      }
    },
    stackedBarOptions: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top',
          labels: { color: textColor, font: { size: 14 } }
        },
        title: { display: false }
      },
      scales: {
        x: {
          stacked: true,
          ticks: { color: tickColor, font: { size: 12 } },
          grid: { color: gridColor }
        },
        y: {
          stacked: true,
          min: 0,
          max: 4,
          ticks: { color: tickColor, font: { size: 12 } },
          grid: { color: gridColor },
          title: {
            display: true,
            text: 'Relative Emphasis (1–3 scale)',
            color: textColor
          }
        }
      }
    }
  };
}

function updateChartTheme() {
  const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
  const { barOptions, pieOptions, horizontalBarOptions, stackedBarOptions } = getThemeOptions(isDarkMode);

  if (window.mealPlanChart) {
    window.mealPlanChart.options = pieOptions;
    window.mealPlanChart.update();
  }
  if (window.employmentChart) {
    window.employmentChart.options = barOptions;
    window.employmentChart.update();
  }
  if (window.expensesChart) {
    window.expensesChart.options = horizontalBarOptions;
    window.expensesChart.update();
  }
  if (window.livingSpendingChart) {
    window.livingSpendingChart.options = stackedBarOptions;
    window.livingSpendingChart.update();
  }
}

function initCharts() {
  const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
  const { barOptions, pieOptions, horizontalBarOptions, stackedBarOptions } = getThemeOptions(isDarkMode);

  if (document.getElementById('mealPlanChart')) {
    window.mealPlanChart = new Chart(
      document.getElementById('mealPlanChart').getContext('2d'),
      {
        type: 'pie',
        data: {
          labels: ['Have Meal Plan', 'No Meal Plan'],
          datasets: [{
            data: [5, 5],
            backgroundColor: ['rgba(40, 167, 69, 0.7)', 'rgba(108, 117, 125, 0.7)'],
            borderColor: ['rgba(40, 167, 69, 1)', 'rgba(108, 117, 125, 1)'],
            borderWidth: 1
          }]
        },
        options: pieOptions
      }
    );
  }

  if (document.getElementById('employmentChart')) {
    window.employmentChart = new Chart(
      document.getElementById('employmentChart').getContext('2d'),
      {
        type: 'bar',
        data: {
          labels: ['No Job/Income', 'Has Income Source'],
          datasets: [{
            label: 'Number of Students',
            data: [7, 3],
            backgroundColor: ['rgba(220, 53, 69, 0.7)', 'rgba(40, 167, 69, 0.7)'],
            borderColor: ['rgba(220, 53, 69, 1)', 'rgba(40, 167, 69, 1)'],
            borderWidth: 1
          }]
        },
        options: barOptions
      }
    );
  }

  if (document.getElementById('expensesChart')) {
    window.expensesChart = new Chart(
      document.getElementById('expensesChart').getContext('2d'),
      {
        type: 'bar',
        data: {
          labels: ['Food/Snacks', 'Entertainment', 'Video Games', 'Tech/Supplies', 'Transportation'],
          datasets: [{
            label: 'Number of Students Mentioning Expense',
            data: [10, 8, 6, 5, 4],
            backgroundColor: 'rgba(59, 134, 247, 0.7)',
            borderColor: 'rgba(59, 134, 247, 1)',
            borderWidth: 1
          }]
        },
        options: horizontalBarOptions
      }
    );
  }

  if (document.getElementById('livingSpendingChart')) {
    window.livingSpendingChart = new Chart(
      document.getElementById('livingSpendingChart').getContext('2d'),
      {
        type: 'bar',
        data: {
          labels: ['On-Campus (w/ Meal Plan)', 'Off-Campus (No Meal Plan)'],
          datasets: [
            {
              label: 'Discretionary Spending',
              data: [2.6, 1.4],
              backgroundColor: 'rgba(255, 193, 7, 0.7)',
              borderColor: 'rgba(255, 193, 7, 1)',
              borderWidth: 1
            },
            {
              label: 'Essential Spending',
              data: [1.2, 2.8],
              backgroundColor: 'rgba(0, 123, 255, 0.7)',
              borderColor: 'rgba(0, 123, 255, 1)',
              borderWidth: 1
            }
          ]
        },
        options: stackedBarOptions
      }
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof Fancybox !== 'undefined') {
    Fancybox.bind(
      '[data-fancybox="financier-outline"], [data-fancybox="financier-mockup"], [data-fancybox="iGrad"], [data-fancybox="moneyhelper-voya"]',
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
  }

  document.querySelectorAll('.feature-video').forEach(video => {
    video.controls = false;
    video.addEventListener('loadeddata', () => {
      video.play().catch(() => {
        video.muted = true;
        video.play().catch(e => console.log('Autoplay failed:', e));
      });
    });
  });

  initCharts();

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
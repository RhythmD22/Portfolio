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
    pie: base,
    horizontal: {
      ...base,
      indexAxis: 'y',
      scales: {
        x: { beginAtZero: true, ticks: { stepSize: 1, color: tickColor, font: { size: 12 } }, grid: { color: gridColor } },
        y: { ticks: { color: tickColor, font: { size: 12 } }, grid: { color: gridColor } }
      }
    },
    stacked: {
      ...base,
      scales: {
        x: { stacked: true, ticks: { color: tickColor, font: { size: 12 } }, grid: { color: gridColor } },
        y: {
          stacked: true, min: 0, max: 4, ticks: { color: tickColor, font: { size: 12 } }, grid: { color: gridColor },
          title: { display: true, text: 'Relative Emphasis (1–3 scale)', color: textColor }
        }
      }
    }
  };
};

function updateCharts() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const opts = getChartOptions(isDark);
  if (window.mealPlanChart) { window.mealPlanChart.options = opts.pie; window.mealPlanChart.update(); }
  if (window.employmentChart) { window.employmentChart.options = opts.bar; window.employmentChart.update(); }
  if (window.expensesChart) { window.expensesChart.options = opts.horizontal; window.expensesChart.update(); }
  if (window.livingSpendingChart) { window.livingSpendingChart.options = opts.stacked; window.livingSpendingChart.update(); }
}

function initCharts() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const opts = getChartOptions(isDark);

  const createChart = (id, type, data, options) => {
    const el = document.getElementById(id);
    if (el) return new Chart(el.getContext('2d'), { type, data, options });
  };

  window.mealPlanChart = createChart('mealPlanChart', 'pie', {
    labels: ['Have Meal Plan', 'No Meal Plan'],
    datasets: [{
      data: [5, 5],
      backgroundColor: ['rgba(40, 167, 69, 0.7)', 'rgba(108, 117, 125, 0.7)'],
      borderColor: ['rgba(40, 167, 69, 1)', 'rgba(108, 117, 125, 1)'],
      borderWidth: 1
    }]
  }, opts.pie);

  window.employmentChart = createChart('employmentChart', 'bar', {
    labels: ['No Job/Income', 'Has Income Source'],
    datasets: [{
      label: 'Number of Students',
      data: [7, 3],
      backgroundColor: ['rgba(220, 53, 69, 0.7)', 'rgba(40, 167, 69, 0.7)'],
      borderColor: ['rgba(220, 53, 69, 1)', 'rgba(40, 167, 69, 1)'],
      borderWidth: 1
    }]
  }, opts.bar);

  window.expensesChart = createChart('expensesChart', 'bar', {
    labels: ['Food/Snacks', 'Entertainment', 'Video Games', 'Tech/Supplies', 'Transportation'],
    datasets: [{
      label: 'Number of Students Mentioning Expense',
      data: [10, 8, 6, 5, 4],
      backgroundColor: 'rgba(59, 134, 247, 0.7)',
      borderColor: 'rgba(59, 134, 247, 1)',
      borderWidth: 1
    }]
  }, opts.horizontal);

  window.livingSpendingChart = createChart('livingSpendingChart', 'bar', {
    labels: ['On-Campus (w/ Meal Plan)', 'Off-Campus (No Meal Plan)'],
    datasets: [
      { label: 'Discretionary Spending', data: [2.6, 1.4], backgroundColor: 'rgba(255, 193, 7, 0.7)', borderColor: 'rgba(255, 193, 7, 1)', borderWidth: 1 },
      { label: 'Essential Spending', data: [1.2, 2.8], backgroundColor: 'rgba(0, 123, 255, 0.7)', borderColor: 'rgba(0, 123, 255, 1)', borderWidth: 1 }
    ]
  }, opts.stacked);
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof Fancybox !== 'undefined') {
    Fancybox.bind('[data-fancybox="financier-outline"], [data-fancybox="financier-mockup"], [data-fancybox="iGrad"], [data-fancybox="moneyhelper-voya"]', {
      Carousel: { Toolbar: { display: { left: ["counter"], right: ["zoomIn", "zoomOut", "autoplay", "thumbs", "close"] } } }
    });
  }

  document.querySelectorAll('.feature-video').forEach(video => {
    video.controls = false;
    video.addEventListener('loadeddata', () => video.play().catch(() => {
      video.muted = true;
      video.play().catch(e => console.log('Autoplay failed:', e));
    }));
  });

  initCharts();

  new MutationObserver(mutations => {
    if (mutations.some(m => m.attributeName === 'data-theme')) updateCharts();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
});
function updateCharts() {
  const isDark = isDarkMode();
  const opts = getChartOptions(isDark);
  if (window.mealPlanChart) { window.mealPlanChart.options = opts.pie; window.mealPlanChart.update(); }
  if (window.employmentChart) { window.employmentChart.options = opts.bar; window.employmentChart.update(); }
  if (window.expensesChart) { window.expensesChart.options = opts.horizontal; window.expensesChart.update(); }
  if (window.livingSpendingChart) { window.livingSpendingChart.options = opts.stacked; window.livingSpendingChart.update(); }
}

function initCharts() {
  const isDark = isDarkMode();
  const opts = getChartOptions(isDark);

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

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const video = entry.target;
      videoObserver.unobserve(video);
      video.load();
      video.play().catch(() => { });
    });
  }, { rootMargin: '200px' });

  document.querySelectorAll('.feature-video').forEach(video => {
    videoObserver.observe(video);
  });

  initCharts();
  observeThemeChanges(updateCharts);
});
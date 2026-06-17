function getChartOptions(isDark) {
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
          title: { display: true, text: 'Relative Emphasis (1\u20133 scale)', color: textColor }
        }
      }
    }
  };
}

function createChart(id, type, data, options) {
  const el = document.getElementById(id);
  if (el) return new Chart(el.getContext('2d'), { type, data, options });
}

function observeThemeChanges(updateFn) {
  const observer = new MutationObserver(mutations => {
    if (mutations.some(m => m.attributeName === 'data-theme')) updateFn();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  window.addEventListener('beforeunload', () => observer.disconnect());
}
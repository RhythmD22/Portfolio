// Function to get theme-specific options (following SmartShuttle pattern)
function getThemeOptions(isDarkMode) {
  // Base colors (will be adjusted based on theme)
  const textColor = isDarkMode ? '#f0f0f0' : '#333';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
  const tickColor = isDarkMode ? '#f0f0f0' : '#666';

  // Configuration options for bar charts
  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor, // Legend text color
          font: {
            size: 14 // Increased font size for legend
          }
        }
      },
      title: {
        display: false // Titles are handled by HTML headings
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: tickColor, // Y-axis tick color
          font: {
            size: 12 // Increased font size for Y-axis labels
          }
        },
        grid: {
          color: gridColor // Y-axis grid lines
        }
      },
      x: { // Ensure x-axis labels are readable
        ticks: {
          maxRotation: 45,
          minRotation: 0,
          color: tickColor, // X-axis tick color
          font: {
            size: 12 // Increased font size for X-axis labels
          }
        },
        grid: {
          color: gridColor // X-axis grid lines
        }
      }
    }
  };

  // Configuration options for pie chart (without y-axis grid for pie charts)
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor, // Legend text color
          font: {
            size: 14 // Increased font size for legend
          }
        }
      },
      title: {
        display: false // Titles are handled by HTML headings
      }
    }
  };

  // Configuration options for horizontal bar chart
  const horizontalBarOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor, // Legend text color
          font: {
            size: 14 // Increased font size for legend
          }
        }
      },
      title: {
        display: false // Titles are handled by HTML headings
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: tickColor, // X-axis tick color
          font: {
            size: 12 // Increased font size for X-axis labels
          }
        },
        grid: {
          color: gridColor // X-axis grid lines
        }
      },
      y: { // Y-axis for horizontal bar chart
        ticks: {
          color: tickColor, // Y-axis tick color
          font: {
            size: 12 // Increased font size for Y-axis labels
          }
        },
        grid: {
          color: gridColor // Y-axis grid lines
        }
      }
    }
  };

  // Configuration options for stacked bar chart
  const stackedBarOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor, // Legend text color
          font: {
            size: 14 // Increased font size for legend
          }
        }
      },
      title: {
        display: false // Titles are handled by HTML headings
      }
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: tickColor, // X-axis tick color
          font: {
            size: 12 // Increased font size for X-axis labels
          }
        },
        grid: {
          color: gridColor // X-axis grid lines
        }
      },
      y: {
        stacked: true,
        min: 0,
        max: 4,
        ticks: {
          color: tickColor, // Y-axis tick color
          font: {
            size: 12 // Increased font size for Y-axis labels
          }
        },
        grid: {
          color: gridColor // Y-axis grid lines
        },
        title: {
          display: true,
          text: 'Relative Emphasis (1–3 scale)',
          color: textColor // Title color
        }
      }
    }
  };

  return { barOptions, pieOptions, horizontalBarOptions, stackedBarOptions };
}

// Function to update chart options based on current theme
function updateChartTheme() {
  const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
  const { barOptions, pieOptions, horizontalBarOptions, stackedBarOptions } = getThemeOptions(isDarkMode);

  // Update chart options
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

// Function to initialize the charts when the page loads
document.addEventListener('DOMContentLoaded', function () {
  // Initial options based on current theme
  const initialTheme = document.documentElement.getAttribute('data-theme') === 'dark';
  const { barOptions, pieOptions, horizontalBarOptions, stackedBarOptions } = getThemeOptions(initialTheme);

  // Meal Plan Status Chart (Pie)
  if (document.getElementById('mealPlanChart')) {
    const mealPlanCtx = document.getElementById('mealPlanChart').getContext('2d');
    window.mealPlanChart = new Chart(mealPlanCtx, {
      type: 'pie',
      data: {
        labels: ['Have Meal Plan', 'No Meal Plan'],
        datasets: [{
          data: [5, 5],
          backgroundColor: [
            'rgba(40, 167, 69, 0.7)',    // Green for "Have Meal Plan"
            'rgba(108, 117, 125, 0.7)'    // Gray for "No Meal Plan"
          ],
          borderColor: [
            'rgba(40, 167, 69, 1)',
            'rgba(108, 117, 125, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: pieOptions
    });
  }

  // Student Employment Status Chart (Bar)
  if (document.getElementById('employmentChart')) {
    const empCtx = document.getElementById('employmentChart').getContext('2d');
    window.employmentChart = new Chart(empCtx, {
      type: 'bar',
      data: {
        labels: ['No Job/Income', 'Has Income Source'],
        datasets: [{
          label: 'Number of Students',
          data: [7, 3],
          backgroundColor: [
            'rgba(220, 53, 69, 0.7)',    // Red for "No Job/Income"
            'rgba(40, 167, 69, 0.7)'     // Green for "Has Income Source"
          ],
          borderColor: [
            'rgba(220, 53, 69, 1)',
            'rgba(40, 167, 69, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: barOptions
    });
  }

  // Most Common Student Expenses Chart (Horizontal Bar)
  if (document.getElementById('expensesChart')) {
    const expCtx = document.getElementById('expensesChart').getContext('2d');
    window.expensesChart = new Chart(expCtx, {
      type: 'bar',
      data: {
        labels: ['Food/Snacks', 'Entertainment', 'Video Games', 'Tech/Supplies', 'Transportation'],
        datasets: [{
          label: 'Number of Students Mentioning Expense',
          data: [10, 8, 6, 5, 4],
          backgroundColor: 'rgba(59, 134, 247, 0.7)',   // #3b86f7 with transparency
          borderColor: 'rgba(59, 134, 247, 1)',
          borderWidth: 1
        }]
      },
      options: horizontalBarOptions
    });
  }

  // Spending Emphasis by Living Situation Chart (Stacked Bar)
  if (document.getElementById('livingSpendingChart')) {
    const liveCtx = document.getElementById('livingSpendingChart').getContext('2d');
    window.livingSpendingChart = new Chart(liveCtx, {
      type: 'bar',
      data: {
        labels: ['On-Campus (w/ Meal Plan)', 'Off-Campus (No Meal Plan)'],
        datasets: [
          {
            label: 'Discretionary Spending',
            data: [2.6, 1.4],
            backgroundColor: 'rgba(255, 193, 7, 0.7)',      // Gold for discretionary spending
            borderColor: 'rgba(255, 193, 7, 1)',
            borderWidth: 1
          },
          {
            label: 'Essential Spending',
            data: [1.2, 2.8],
            backgroundColor: 'rgba(0, 123, 255, 0.7)',      // Blue for essential spending
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1
          }
        ]
      },
      options: stackedBarOptions
    });
  }

  // Listen for theme changes by monitoring the data-theme attribute
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
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
// Data for Problems Chart (Top Right)
const problemsData = {
    labels: ['Shuttle Unreliability', 'Shuttle Overcrowding', 'Parking Issues', 'Walking Distance/Hills'],
    datasets: [{
        label: 'Number of Mentions',
        data: [3, 2, 1, 1], // Jackson, Alex, Steven, (Jackson/Alex/Steven) mentioned unreliability; Jackson, Steven mentioned overcrowding; George mentioned parking; Summit mentioned walking
        backgroundColor: [
            'rgba(220, 53, 69, 0.7)',    // Red for the most common problem
            'rgba(220, 53, 69, 0.5)',    // Lighter red for second most common
            'rgba(255, 193, 7, 0.7)',    // Yellow for third
            'rgba(255, 193, 7, 0.5)'     // Lighter yellow for least common
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

// Data for Commute Methods Chart (Bottom Left)
const commuteData = {
    labels: ['Shuttle', 'Walking', 'Car'],
    datasets: [{
        label: 'Number of Users',
        data: [3, 1, 1], // Jackson, Alex, Steven use shuttle; Summit walks; George drives
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

// Data for Technology Features Chart (Bottom Right)
const techData = {
    labels: ['Real-time Updates', 'Parking Info', 'Alternative Transport'],
    datasets: [{
        label: 'Number of Requests',
        data: [3, 1, 1], // Jackson, Alex, Steven want updates/parking; Summit wants alt transport
        backgroundColor: [
            'rgba(40, 167, 69, 0.7)',     // Green for the most requested feature
            'rgba(40, 167, 69, 0.5)',     // Lighter green for other features
            'rgba(40, 167, 69, 0.3)'      // Even lighter green for least requested
        ],
        borderColor: [
            'rgba(40, 167, 69, 1)',
            'rgba(40, 167, 69, 1)',
            'rgba(40, 167, 69, 1)'
        ],
        borderWidth: 1
    }]
};

// Function to get theme-specific options
function getThemeOptions(isDarkMode) {
    // Base colors (will be adjusted based on theme)
    const textColor = isDarkMode ? '#f0f0f0' : '#333';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
    const tickColor = isDarkMode ? '#f0f0f0' : '#666';

    // Configuration options for bar charts
    const barOptions = {
        responsive: true,
        maintainAspectRatio: true, // Maintain the aspect ratio
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

    // Configuration options for doughnut chart (without axes)
    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: true, // Maintain the aspect ratio
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
        // No scales property for doughnut chart (removes axes)
    };

    return { barOptions, doughnutOptions };
}

// Initial options based on current theme
const initialTheme = document.documentElement.getAttribute('data-theme') === 'dark';
const { barOptions, doughnutOptions } = getThemeOptions(initialTheme);

// Function to update chart options based on current theme
function updateChartTheme() {
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    const { barOptions, doughnutOptions } = getThemeOptions(isDarkMode);

    // Update chart options
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

// Function to initialize the charts when the page loads
document.addEventListener('DOMContentLoaded', function () {
    // Create the charts only if their containers exist on the page
    if (document.getElementById('problemsChart')) {
        const ctx1 = document.getElementById('problemsChart').getContext('2d');
        window.problemsChart = new Chart(ctx1, {
            type: 'bar',
            data: problemsData,
            options: barOptions
        });
    }

    if (document.getElementById('commuteChart')) {
        const ctx2 = document.getElementById('commuteChart').getContext('2d');
        window.commuteChart = new Chart(ctx2, {
            type: 'doughnut',
            data: commuteData,
            options: doughnutOptions
        });
    }

    if (document.getElementById('techChart')) {
        const ctx3 = document.getElementById('techChart').getContext('2d');
        window.techChart = new Chart(ctx3, {
            type: 'bar',
            data: techData,
            options: barOptions
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
// Dashboard data
const dashboardData = {
  canteen_stats: {
    total_clients: 1247,
    daily_average: 180,
    average_check: 320,
    satisfaction_index: 4.2,
    weekly_visits: [120, 165, 178, 195, 201, 85, 45],
    hourly_visits: [5, 2, 8, 15, 25, 45, 85, 95, 120, 145, 180, 220, 280, 195, 165, 145, 125, 95, 75, 45, 25, 15, 8, 3]
  },
  menu_analysis: {
    categories: {
      "Первые блюда": 25,
      "Вторые блюда": 35, 
      "Салаты": 20,
      "Напитки": 15,
      "Десерты": 5
    },
    top_dishes: [
      {"name": "Борщ украинский", "orders": 156, "rating": 4.6},
      {"name": "Куриная котлета с гарниром", "orders": 143, "rating": 4.4},
      {"name": "Салат Цезарь", "orders": 128, "rating": 4.3},
      {"name": "Плов узбекский", "orders": 112, "rating": 4.5},
      {"name": "Компот из сухофруктов", "orders": 98, "rating": 4.1}
    ],
    profitability: [
      {"dish": "Борщ украинский", "cost": 85, "price": 150, "popularity": 95, "margin": 76.7},
      {"dish": "Куриная котлета", "cost": 120, "price": 220, "popularity": 88, "margin": 83.3},
      {"dish": "Салат Цезарь", "cost": 95, "price": 180, "popularity": 78, "margin": 89.5},
      {"dish": "Плов узбекский", "cost": 110, "price": 200, "popularity": 68, "margin": 81.8}
    ]
  },
  ai_recommendations: [
    {
      "type": "Новое блюдо",
      "title": "Добавить веганский бургер",
      "description": "Анализ показывает рост интереса к веганским блюдам (+23% за месяц)",
      "confidence": 87
    },
    {
      "type": "Удалить блюдо", 
      "title": "Исключить рыбные котлеты",
      "description": "Низкая популярность (12 заказов за месяц) и отрицательные отзывы",
      "confidence": 92
    },
    {
      "type": "Ценообразование",
      "title": "Снизить цену на супы на 10%",
      "description": "Поможет увеличить заказы первых блюд на 18-25%",
      "confidence": 78
    }
  ],
  trends: {
    monthly_trends: [
      {"month": "Январь", "soups": 45, "mains": 65, "salads": 35},
      {"month": "Февраль", "soups": 52, "mains": 68, "salads": 38},
      {"month": "Март", "soups": 48, "mains": 72, "salads": 42}
    ],
    forecast: [
      {"day": "Понедельник", "predicted": 195, "confidence": 85},
      {"day": "Вторник", "predicted": 210, "confidence": 88},
      {"day": "Среда", "predicted": 205, "confidence": 82},
      {"day": "Четверг", "predicted": 225, "confidence": 90},
      {"day": "Пятница", "predicted": 235, "confidence": 87}
    ]
  },
  demographics: {
    age_groups: {
      "20-30": 35,
      "31-40": 28, 
      "41-50": 22,
      "51-60": 15
    },
    departments: {
      "IT-отдел": 32,
      "Бухгалтерия": 18,
      "Менеджмент": 15,
      "Производство": 25,
      "HR": 10
    },
    loyalty_segments: {
      "Постоянные клиенты": 45,
      "Регулярные": 30,
      "Случайные": 25
    }
  }
};

// Chart colors from design system
const chartColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];

// Global chart instances
let charts = {};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard initializing...');
    initializeNavigation();
    initializeCharts();
    initializeInteractions();
    console.log('Dashboard initialized successfully');
});

// Navigation functionality
function initializeNavigation() {
    console.log('Initializing navigation...');
    const sidebarItems = document.querySelectorAll('.sidebar__item');
    
    sidebarItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.dataset.tab;
            console.log('Switching to tab:', tabId);
            switchTab(tabId);
        });
    });
}

function switchTab(tabId) {
    console.log('Switching to tab:', tabId);
    
    // Remove active class from all sidebar items and tab contents
    const sidebarItems = document.querySelectorAll('.sidebar__item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    sidebarItems.forEach(item => item.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to selected items
    const activeItem = document.querySelector(`[data-tab="${tabId}"]`);
    const activeTab = document.getElementById(`${tabId}-tab`);
    
    if (activeItem && activeTab) {
        activeItem.classList.add('active');
        activeTab.classList.add('active');
        
        // Initialize charts for the current tab if needed
        setTimeout(() => {
            initializeTabCharts(tabId);
        }, 100);
    } else {
        console.error('Could not find tab elements for:', tabId);
    }
}

function initializeTabCharts(tabId) {
    console.log('Initializing charts for tab:', tabId);
    
    switch(tabId) {
        case 'stats':
            if (!charts.weeklyChart) createWeeklyChart();
            if (!charts.hourlyChart) createHourlyChart();
            break;
        case 'menu':
            if (!charts.categoriesChart) createCategoriesChart();
            break;
        case 'trends':
            if (!charts.trendsChart) createTrendsChart();
            if (!charts.forecastChart) createForecastChart();
            break;
        case 'demographics':
            if (!charts.ageChart) createAgeChart();
            if (!charts.departmentsChart) createDepartmentsChart();
            if (!charts.loyaltyChart) createLoyaltyChart();
            break;
    }
}

// Initialize all charts
function initializeCharts() {
    console.log('Initializing default charts...');
    // Initialize charts for the default active tab
    createWeeklyChart();
    createHourlyChart();
}

// Weekly visits chart
function createWeeklyChart() {
    const ctx = document.getElementById('weeklyChart');
    if (!ctx) {
        console.error('Weekly chart canvas not found');
        return;
    }
    
    console.log('Creating weekly chart...');
    charts.weeklyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
            datasets: [{
                label: 'Посещения',
                data: dashboardData.canteen_stats.weekly_visits,
                backgroundColor: chartColors[0],
                borderColor: chartColors[0],
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Посещений: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Hourly visits chart
function createHourlyChart() {
    const ctx = document.getElementById('hourlyChart');
    if (!ctx) {
        console.error('Hourly chart canvas not found');
        return;
    }
    
    const hours = Array.from({length: 24}, (_, i) => `${i}:00`);
    
    charts.hourlyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Посещения по часам',
                data: dashboardData.canteen_stats.hourly_visits,
                borderColor: chartColors[1],
                backgroundColor: chartColors[1] + '20',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: chartColors[1],
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Посещений: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Categories chart
function createCategoriesChart() {
    const ctx = document.getElementById('categoriesChart');
    if (!ctx) return;
    
    const categories = dashboardData.menu_analysis.categories;
    
    charts.categoriesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: chartColors.slice(0, Object.keys(categories).length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
}

// Trends chart
function createTrendsChart() {
    const ctx = document.getElementById('trendsChart');
    if (!ctx) return;
    
    const trends = dashboardData.trends.monthly_trends;
    const months = trends.map(t => t.month);
    
    charts.trendsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Супы',
                data: trends.map(t => t.soups),
                borderColor: chartColors[0],
                backgroundColor: chartColors[0] + '20',
                tension: 0.4
            }, {
                label: 'Основные блюда',
                data: trends.map(t => t.mains),
                borderColor: chartColors[1],
                backgroundColor: chartColors[1] + '20',
                tension: 0.4
            }, {
                label: 'Салаты',
                data: trends.map(t => t.salads),
                borderColor: chartColors[2],
                backgroundColor: chartColors[2] + '20',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Forecast chart
function createForecastChart() {
    const ctx = document.getElementById('forecastChart');
    if (!ctx) return;
    
    const forecast = dashboardData.trends.forecast;
    
    charts.forecastChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: forecast.map(f => f.day),
            datasets: [{
                label: 'Прогноз посещений',
                data: forecast.map(f => f.predicted),
                backgroundColor: forecast.map((f, i) => {
                    const alpha = f.confidence / 100;
                    return chartColors[3] + Math.round(alpha * 255).toString(16).padStart(2, '0');
                }),
                borderColor: chartColors[3],
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const confidence = forecast[context.dataIndex].confidence;
                            return [
                                `Прогноз: ${context.raw} посещений`,
                                `Уверенность: ${confidence}%`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Age groups chart
function createAgeChart() {
    const ctx = document.getElementById('ageChart');
    if (!ctx) return;
    
    const ageGroups = dashboardData.demographics.age_groups;
    
    charts.ageChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(ageGroups),
            datasets: [{
                data: Object.values(ageGroups),
                backgroundColor: chartColors.slice(0, Object.keys(ageGroups).length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
}

// Departments chart
function createDepartmentsChart() {
    const ctx = document.getElementById('departmentsChart');
    if (!ctx) return;
    
    const departments = dashboardData.demographics.departments;
    
    charts.departmentsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(departments),
            datasets: [{
                label: 'Посещения по отделам',
                data: Object.values(departments),
                backgroundColor: chartColors[4],
                borderColor: chartColors[4],
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.raw}% сотрудников`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Loyalty chart
function createLoyaltyChart() {
    const ctx = document.getElementById('loyaltyChart');
    if (!ctx) return;
    
    const loyalty = dashboardData.demographics.loyalty_segments;
    
    charts.loyaltyChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(loyalty),
            datasets: [{
                data: Object.values(loyalty),
                backgroundColor: [chartColors[5], chartColors[6], chartColors[7]],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
}

// Initialize interactions
function initializeInteractions() {
    console.log('Initializing interactions...');
    
    // Get DOM elements
    const modal = document.getElementById('notification-modal');
    const modalMessage = document.getElementById('modal-message');
    const closeModalBtn = document.getElementById('closeModal');
    const confirmBtn = document.getElementById('confirmBtn');
    const exportBtn = document.getElementById('exportBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const applyBtns = document.querySelectorAll('.apply-btn');
    
    if (!modal) {
        console.error('Modal not found');
        return;
    }
    
    // Export button
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            showModal('Функция экспорта данных', 'Данные будут экспортированы в формате Excel. Выберите период и категории для экспорта.');
        });
    }
    
    // Settings button
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            showModal('Настройки дашборда', 'Здесь вы можете настроить параметры отображения данных, выбрать временные интервалы и настроить уведомления.');
        });
    }
    
    // Apply recommendation buttons
    applyBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            console.log('Apply button clicked:', index);
            const recommendation = dashboardData.ai_recommendations[index];
            if (recommendation) {
                showModal(
                    'Применение рекомендации', 
                    `Рекомендация "${recommendation.title}" будет применена. Система автоматически внесет изменения в меню и ценообразование.`
                );
            }
        });
    });
    
    // Modal close handlers
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideModal);
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', hideModal);
    }
    
    // Close modal on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideModal();
        }
    });
    
    // Filter change handlers
    const dateFilter = document.getElementById('dateFilter');
    const departmentFilter = document.getElementById('departmentFilter');
    
    if (dateFilter) {
        dateFilter.addEventListener('change', function() {
            console.log('Date filter changed:', this.value);
            updateChartsWithFilters();
        });
    }
    
    if (departmentFilter) {
        departmentFilter.addEventListener('change', function() {
            console.log('Department filter changed:', this.value);
            updateChartsWithFilters();
        });
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            hideModal();
        }
    });
    
    // Add dish item click handlers
    addDishClickHandlers();
}

// Modal functions
function showModal(title, message) {
    console.log('Showing modal:', title);
    const modal = document.getElementById('notification-modal');
    const modalMessage = document.getElementById('modal-message');
    
    if (modal && modalMessage) {
        modalMessage.innerHTML = `
            <h4>${title}</h4>
            <p>${message}</p>
        `;
        modal.classList.remove('hidden');
    } else {
        console.error('Modal elements not found');
    }
}

function hideModal() {
    console.log('Hiding modal');
    const modal = document.getElementById('notification-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Update charts with filters
function updateChartsWithFilters() {
    const dateFilter = document.getElementById('dateFilter');
    const departmentFilter = document.getElementById('departmentFilter');
    
    const dateValue = dateFilter ? dateFilter.value : 'month';
    const departmentValue = departmentFilter ? departmentFilter.value : 'all';
    
    // Add loading animation
    document.querySelectorAll('.chart-container').forEach(container => {
        container.classList.add('loading');
    });
    
    // Simulate data loading
    setTimeout(() => {
        document.querySelectorAll('.chart-container').forEach(container => {
            container.classList.remove('loading');
        });
        
        showModal(
            'Фильтры применены',
            `Данные обновлены для периода: ${getFilterLabel(dateValue)} и отдела: ${getDepartmentLabel(departmentValue)}`
        );
    }, 1000);
}

function getFilterLabel(value) {
    const labels = {
        'week': 'За неделю',
        'month': 'За месяц',
        'quarter': 'За квартал'
    };
    return labels[value] || 'Все периоды';
}

function getDepartmentLabel(value) {
    const labels = {
        'all': 'Все отделы',
        'it': 'IT-отдел',
        'accounting': 'Бухгалтерия',
        'management': 'Менеджмент',
        'production': 'Производство',
        'hr': 'HR'
    };
    return labels[value] || 'Все отделы';
}

// Add dish click handlers
function addDishClickHandlers() {
    const dishItems = document.querySelectorAll('.dish-item');
    dishItems.forEach(item => {
        item.addEventListener('click', function() {
            const dishName = this.querySelector('.dish-name');
            if (dishName) {
                const name = dishName.textContent;
                showModal(
                    'Информация о блюде',
                    `Подробная аналитика для "${name}" включает данные о предпочтениях клиентов, сезонности, прибыльности и отзывах.`
                );
            }
        });
        
        item.style.cursor = 'pointer';
    });
}

// Add hover effects for metric cards
function addHoverEffects() {
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Add chart click handlers for detailed view
function addChartClickHandlers() {
    const chartContainers = document.querySelectorAll('.chart-container');
    chartContainers.forEach(container => {
        container.addEventListener('dblclick', function() {
            showModal(
                'Детальный анализ',
                'Здесь будет отображен детальный анализ данных с возможностью экспорта и дополнительными фильтрами.'
            );
        });
    });
}

// Initialize additional features after DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        addHoverEffects();
        addChartClickHandlers();
    }, 500);
});

// Utility function to format numbers
function formatNumber(num) {
    return new Intl.NumberFormat('ru-RU').format(num);
}
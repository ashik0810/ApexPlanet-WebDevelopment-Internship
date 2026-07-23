let expenses = [];
let settings = {};

function updateSummaryCards() {
  const totalExpense = getTotalExpense();

  const highestExpense = getHighestExpense();

  const averageExpense = getAverageExpense();

  const transactionCount = expenses.length;

  setText("analyticsTotal", settings.currency + totalExpense.toFixed(2));

  setText("highestExpense", settings.currency + highestExpense.toFixed(2));

  setText("averageExpense", settings.currency + averageExpense.toFixed(2));

  setText("analyticsTransactions", transactionCount);
}

function getTotalExpense() {
  return expenses.reduce((sum, expense) => {
    return sum + Number(expense.amount);
  }, 0);
}

function getHighestExpense() {
  if (expenses.length === 0) {
    return 0;
  }

  return Math.max(...expenses.map((expense) => Number(expense.amount)));
}

function getAverageExpense() {
  if (expenses.length === 0) {
    return 0;
  }

  return getTotalExpense() / expenses.length;
}

function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}

let categoryChart;

function createCategoryChart() {
  const canvas = document.getElementById("categoryChart");

  if (!canvas) {
    return;
  }

  if (categoryChart) {
    categoryChart.destroy();
  }

  const year = document.getElementById("pieFilter").value;

  const filteredExpenses = expenses.filter((expense) => {
    return new Date(expense.date).getFullYear() == year;
  });

  const categoryTotals = {};

  filteredExpenses.forEach((expense) => {
    if (!categoryTotals[expense.category]) {
      categoryTotals[expense.category] = 0;
    }

    categoryTotals[expense.category] += Number(expense.amount);
  });

  categoryChart = new Chart(canvas, {
    type: "pie",

    data: {
      labels: Object.keys(categoryTotals),

      datasets: [
        {
          data: Object.values(categoryTotals),

          backgroundColor: [
            "#19C463",
            "#3B82F6",
            "#F59E0B",
            "#8B5CF6",
            "#EF4444",
            "#06B6D4",
            "#14B8A6",
            "#F97316",
            "#EC4899",
          ],

          borderWidth: 2,

          borderColor: "#ffffff",
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      plugins: {
        legend: {
          position: "bottom",

          labels: {
            padding: 20,

            usePointStyle: true,

            pointStyle: "circle",

            font: {
              family: "Poppins",

              size: 13,
            },
          },
        },

        tooltip: {
          callbacks: {
            label: function (context) {
              return settings.currency + context.raw.toFixed(2);
            },
          },
        },
      },
    },
  });
}

let monthlyChart;

function createMonthlyChart() {
  const canvas = document.getElementById("monthlyChart");

  if (!canvas) return;

  if (monthlyChart) {
    monthlyChart.destroy();
  }

  const year = document.getElementById("barFilter").value;

  const filteredExpenses = expenses.filter((expense) => {
    return new Date(expense.date).getFullYear() == year;
  });

  const monthlyTotals = {};

  filteredExpenses.forEach((expense) => {
    const month = new Date(expense.date).toLocaleString("default", {
      month: "short",
    });

    if (!monthlyTotals[month]) {
      monthlyTotals[month] = 0;
    }

    monthlyTotals[month] += Number(expense.amount);
  });

  monthlyChart = new Chart(canvas, {
    type: "bar",

    data: {
      labels: Object.keys(monthlyTotals),

      datasets: [
        {
          label: "Expenses",

          data: Object.values(monthlyTotals),

          backgroundColor: "#19C463",

          borderRadius: 8,
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

let lineChart;

function createLineChart() {
  const canvas = document.getElementById("lineChart");

  if (!canvas) return;

  if (lineChart) {
    lineChart.destroy();
  }

  const months = Number(document.getElementById("lineFilter").value);

  const today = new Date();

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);

    const diffMonths =
      (today.getFullYear() - expenseDate.getFullYear()) * 12 +
      (today.getMonth() - expenseDate.getMonth());

    return diffMonths < months;
  });

  const sortedExpenses = filteredExpenses.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  lineChart = new Chart(canvas, {
    type: "line",

    data: {
      labels: sortedExpenses.map((expense) => expense.date),

      datasets: [
        {
          label: "Expense Trend",

          data: sortedExpenses.map((expense) => Number(expense.amount)),

          fill: false,

          borderColor: "#3B82F6",

          backgroundColor: "#3B82F6",

          tension: 0.35,
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function updateAnalyticsCards() {
  updateTopCategory();

  updateHighestMonth();

  updateSavings();

  updateBudgetStatus();
}

function updateTopCategory() {
  const categoryTotals = {};

  expenses.forEach((expense) => {
    if (!categoryTotals[expense.category]) {
      categoryTotals[expense.category] = 0;
    }

    categoryTotals[expense.category] += Number(expense.amount);
  });

  let topCategory = "-";

  let highestAmount = 0;

  for (const category in categoryTotals) {
    if (categoryTotals[category] > highestAmount) {
      highestAmount = categoryTotals[category];

      topCategory = category;
    }
  }

  setText("topCategoryName", topCategory);

  setText("topCategoryAmount", settings.currency + highestAmount.toFixed(2));
}

function updateHighestMonth() {
  const monthlyTotals = {};

  expenses.forEach((expense) => {
    const month = new Date(expense.date).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    if (!monthlyTotals[month]) {
      monthlyTotals[month] = 0;
    }

    monthlyTotals[month] += Number(expense.amount);
  });

  let highestMonth = "-";

  let highestAmount = 0;

  for (const month in monthlyTotals) {
    if (monthlyTotals[month] > highestAmount) {
      highestAmount = monthlyTotals[month];

      highestMonth = month;
    }
  }

  setText("highestMonth", highestMonth);

  setText("highestMonthAmount", settings.currency + highestAmount.toFixed(2));
}

function updateSavings() {
  const savings = settings.budget - getTotalExpense();

  setText("analyticsSavings", settings.currency + savings.toFixed(2));
}

function updateBudgetStatus() {
  if (settings.budget <= 0) {
    setText("budgetStatus", "0%");

    return;
  }

  const percentage = (
    ((settings.budget - getTotalExpense()) / settings.budget) *
    100
  ).toFixed(1);

  setText("budgetStatus", percentage + "%");
}

function refreshAnalytics() {
  expenses = getExpenses();

  settings = getSettings();

  populateYearFilters();

  updateSummaryCards();

  updateAnalyticsCards();

  createCategoryChart();

  createMonthlyChart();

  createLineChart();
}

function checkEmptyState() {
  if (expenses.length !== 0) {
    return;
  }

  setText("analyticsTotal", settings.currency + "0.00");

  setText("highestExpense", settings.currency + "0.00");

  setText("averageExpense", settings.currency + "0.00");

  setText("analyticsTransactions", 0);

  setText("topCategoryName", "-");

  setText("topCategoryAmount", settings.currency + "0.00");

  setText("highestMonth", "-");

  setText("highestMonthAmount", settings.currency + "0.00");

  setText(
    "analyticsSavings",
    settings.currency + Number(settings.budget).toFixed(2),
  );

  setText("budgetStatus", "100%");
}

window.addEventListener("storage", () => {
  refreshAnalytics();
});

document.addEventListener("DOMContentLoaded", () => {
  refreshAnalytics();

  checkEmptyState();

  document
    .getElementById("pieFilter")
    ?.addEventListener("change", createCategoryChart);

  document
    .getElementById("barFilter")
    ?.addEventListener("change", createMonthlyChart);

  document
    .getElementById("lineFilter")
    ?.addEventListener("change", createLineChart);
});

function populateYearFilters() {

    const years = [
        ...new Set(
            expenses.map(expense =>
                new Date(expense.date).getFullYear()
            )
        )
    ].sort((a, b) => b - a);

    const pieFilter = document.getElementById("pieFilter");
    const barFilter = document.getElementById("barFilter");

    pieFilter.innerHTML = "";
    barFilter.innerHTML = "";

    years.forEach(year => {

        pieFilter.innerHTML += `<option value="${year}">${year}</option>`;

        barFilter.innerHTML += `<option value="${year}">${year}</option>`;

    });

}
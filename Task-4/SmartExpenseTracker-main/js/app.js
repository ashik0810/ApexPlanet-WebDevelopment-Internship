const totalExpensesElement = document.getElementById("totalExpenses");

const monthlyBudgetElement = document.getElementById("monthlyBudget");

const remainingBudgetElement = document.getElementById("remainingBudget");

const transactionCountElement = document.getElementById("transactionCount");

let pieChart = null;

let barChart = null;

const ITEMS_PER_LOAD = 5;
let visibleCount = ITEMS_PER_LOAD;

document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
  document
    .getElementById("pieFilter")
    ?.addEventListener("change", createPieChart);

  document
    .getElementById("barFilter")
    ?.addEventListener("change", createBarChart);
});

function loadDashboard() {
  updateCards();

  populateYearFilters();

  loadTopCategories();

  loadRecentExpenses();

  createPieChart();

  createBarChart();
}

function updateCards() {
  const settings = getSettings();

  totalExpensesElement.textContent =
    settings.currency + getTotalExpenses().toLocaleString();

  monthlyBudgetElement.textContent =
    settings.currency + Number(settings.budget).toLocaleString();

  remainingBudgetElement.textContent =
    settings.currency + getRemainingBudget().toLocaleString();

  transactionCountElement.textContent = getTransactionCount();
}

function loadTopCategories() {
  const totals = getCategoryTotals();

  const totalExpense = getTotalExpenses();

  updateCategory(
    "Food",
    totals["Food"] || 0,
    totalExpense,
    "foodAmount",
    "foodProgress",
  );

  updateCategory(
    "Transport",
    totals["Transport"] || 0,
    totalExpense,
    "transportAmount",
    "transportProgress",
  );

  updateCategory(
    "Shopping",
    totals["Shopping"] || 0,
    totalExpense,
    "shoppingAmount",
    "shoppingProgress",
  );

  updateCategory(
    "Bills",
    totals["Bills"] || 0,
    totalExpense,
    "billsAmount",
    "billsProgress",
  );
}

function updateCategory(category, amount, totalExpense, amountId, progressId) {
  const amountElement = document.getElementById(amountId);

  const progressElement = document.getElementById(progressId);

  if (!amountElement || !progressElement) return;

  const percentage =
    totalExpense === 0 ? 0 : Math.round((amount / totalExpense) * 100);

  const currency = getSettings().currency;

  amountElement.textContent = `${currency}${amount.toLocaleString()}(${percentage}%)`;

  progressElement.style.width = percentage + "%";
}

function renderRecentExpenses(expenseList) {
  const tableBody = document.getElementById("recentExpenseTable");

  if (!tableBody) return;

  tableBody.innerHTML = "";

  if (expenseList.length === 0) {
    tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="no-data">
                    No expenses found.
                </td>
            </tr>
        `;

    return;
  }

  const recentExpenses = [...expenseList].sort((a, b) => b.id - a.id);

  recentExpenses.forEach((expense) => {
    tableBody.innerHTML += `
            <tr>

                <td>${formatDate(expense.date)}</td>

                <td>${expense.name}</td>

                <td>
                    <span class="category-badge ${expense.category.toLowerCase()}">
                        ${expense.category}
                    </span>
                </td>

                <td>
                    ${getSettings().currency}${Number(expense.amount).toLocaleString()}
                </td>

                <td>${expense.payment}</td>

            </tr>
        `;
  });
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function createPieChart() {
  const canvas = document.getElementById("pieChart");

  if (!canvas) return;

  const year = document.getElementById("pieFilter").value;

  const totals = getCategoryTotalsByYear(year);

  const labels = Object.keys(totals);

  const values = Object.values(totals);

  if (pieChart) {
    pieChart.destroy();
  }

  pieChart = new Chart(canvas, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            "#19C463",
            "#3B82F6",
            "#F59E0B",
            "#8B5CF6",
            "#EF4444",
            "#06B6D4",
            "#EC4899",
            "#84CC16",
            "#F97316",
          ],
          borderWidth: 0,
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
            font: {
              family: "Poppins",
              size: 13,
            },
          },
        },
      },
    },
  });
}

function createBarChart() {
  const canvas = document.getElementById("barChart");

  if (!canvas) return;

  const year = document.getElementById("barFilter").value;

  const monthly = getMonthlyExpensesByYear(year);

  const labels = Object.keys(monthly);

  const values = Object.values(monthly);

  if (barChart) {
    barChart.destroy();
  }

  barChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Expenses",
          data: values,
          borderRadius: 10,
          backgroundColor: "#19C463",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "#EEEEEE",
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}

function loadRecentExpenses() {
  const expenses = getExpenses();

  renderRecentExpenses(expenses.slice(0, visibleCount));

  const loadMore = document.querySelector(".load-more");

  if (expenses.length <= ITEMS_PER_LOAD) {
    loadMore.style.display = "none";
  } else {
    loadMore.style.display = "flex";
  }
}

const loadMoreBtn = document.querySelector(".load-more button");

if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", () => {
    const expenses = getExpenses();

    visibleCount += ITEMS_PER_LOAD;

    renderRecentExpenses(expenses.slice(0, visibleCount));

    if (visibleCount >= expenses.length) {
      document.querySelector(".load-more").style.display = "none";
    }
  });
}

function populateYearFilters() {
  const expenses = getExpenses();

  const years = [
    ...new Set(expenses.map((expense) => new Date(expense.date).getFullYear())),
  ].sort((a, b) => b - a);

  const pieFilter = document.getElementById("pieFilter");
  const barFilter = document.getElementById("barFilter");

  pieFilter.innerHTML = "";
  barFilter.innerHTML = "";

  years.forEach((year) => {
    pieFilter.innerHTML += `<option value="${year}">${year}</option>`;

    barFilter.innerHTML += `<option value="${year}">${year}</option>`;
  });
}

const viewAllBtn = document.getElementById("viewBtn");

if (viewAllBtn) {
  viewAllBtn.addEventListener("click", () => {
    window.location.href = "expenses.html";
  });
}

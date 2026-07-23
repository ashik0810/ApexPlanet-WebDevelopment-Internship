const EXPENSE_KEY = "expenses";
const SETTINGS_KEY = "settings";

function getExpenses() {
  const data = localStorage.getItem(EXPENSE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveExpenses(expenses) {
  localStorage.setItem(EXPENSE_KEY, JSON.stringify(expenses));
}

function addExpense(expense) {
  const expenses = getExpenses();
  expense.id = Date.now();
  expenses.push(expense);
  saveExpenses(expenses);
}

function updateExpense(id, updatedExpense) {
  const expenses = getExpenses();
  const updated = expenses.map((expense) => {
    if (expense.id === id) {
      return {
        ...expense,
        ...updatedExpense,
      };
    }

    return expense;
  });

  saveExpenses(updated);
}

function deleteExpense(id) {
  const expenses = getExpenses();
  const filtered = expenses.filter((expense) => expense.id !== id);
  saveExpenses(filtered);
}

function getExpenseById(id) {
  const expenses = getExpenses();
  return expenses.find((expense) => expense.id === id);
}

function clearExpenses() {
  localStorage.removeItem(EXPENSE_KEY);
}

function getSettings() {
  const data = localStorage.getItem(SETTINGS_KEY);

  if (data) {
    return JSON.parse(data);
  }

  return {
    username: "John Doe",
    currency: "₹",
    budget: 20000,
    theme: "light",
    notifications: true,
  };
}

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  location.reload();
}

function clearSettings() {
  localStorage.removeItem(SETTINGS_KEY);
}

function getTotalExpenses() {
  return getExpenses().reduce(
    (total, expense) => total + Number(expense.amount),
    0,
  );
}

function getTransactionCount() {
  return getExpenses().length;
}

function getRemainingBudget() {
  const settings = getSettings();
  return settings.budget - getCurrentMonthExpenses();
}

function getCategoryTotals() {
  const totals = {};
  getExpenses().forEach((expense) => {
    if (!totals[expense.category]) {
      totals[expense.category] = 0;
    }

    totals[expense.category] += Number(expense.amount);
  });

  return totals;
}

function getMonthlyExpenses() {
  const monthly = {};

  getExpenses().forEach((expense) => {
    const date = new Date(expense.date);

    const month = date.toLocaleString("default", {
      month: "short",
    });

    if (!monthly[month]) {
      monthly[month] = 0;
    }

    monthly[month] += Number(expense.amount);
  });

  return monthly;
}

function exportData() {
  return JSON.stringify({
    expenses: getExpenses(),
    settings: getSettings(),
  });
}

function importData(json) {
  const data = JSON.parse(json);

  if (data.expenses) {
    saveExpenses(data.expenses);
  }

  if (data.settings) {
    saveSettings(data.settings);
  }
}

function resetApplication() {
  localStorage.removeItem(EXPENSE_KEY);
  localStorage.removeItem(SETTINGS_KEY);
}

function getCategoryTotalsByYear(year) {
  const totals = {};

  getExpenses().forEach((expense) => {
    const expenseYear = new Date(expense.date).getFullYear();

    if (String(expenseYear) !== String(year)) return;

    if (!totals[expense.category]) {
      totals[expense.category] = 0;
    }

    totals[expense.category] += Number(expense.amount);
  });

  return totals;
}

function getMonthlyExpensesByYear(year) {
  const months = {
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
  };

  getExpenses().forEach((expense) => {
    const date = new Date(expense.date);

    if (date.getFullYear() != year) return;

    const month = date.toLocaleString("default", {
      month: "short",
    });

    months[month] += Number(expense.amount);
  });

  return months;
}

function getExpensesByMonths(monthCount) {
  const data = {};

  const today = new Date();

  for (let i = monthCount - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);

    const label = date.toLocaleString("default", {
      month: "short",
    });

    data[label] = 0;
  }

  getExpenses().forEach((expense) => {
    const date = new Date(expense.date);

    const label = date.toLocaleString("default", {
      month: "short",
    });

    if (label in data) {
      data[label] += Number(expense.amount);
    }
  });

  return data;
}

function getCurrentMonthExpenses() {
  const expenses = getExpenses();

  const today = new Date();

  return expenses.reduce((total, expense) => {
    const expenseDate = new Date(expense.date);

    if (
      expenseDate.getMonth() === today.getMonth() &&
      expenseDate.getFullYear() === today.getFullYear()
    ) {
      total += Number(expense.amount);
    }

    return total;
  }, 0);
}
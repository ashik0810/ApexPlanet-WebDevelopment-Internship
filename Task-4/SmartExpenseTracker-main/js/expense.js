const expenseTableBody = document.getElementById("expenseTableBody");

let expenses = [];

const ITEMS_PER_PAGE = 5;

let currentPage = 1;

document.addEventListener("DOMContentLoaded", () => {
  loadExpenses();
});

function loadExpenses() {
  expenses = getExpenses();

  showPage(currentPage);
}

function displayExpenses(expenseList) {
  expenseTableBody.innerHTML = "";

  if (expenseList.length === 0) {
    expenseTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="no-data">
                    No expenses found.
                </td>
            </tr>

        `;
    return;
  }

  expenseList.forEach((expense) => {
    expenseTableBody.innerHTML += `
        <tr>
            <td>${formatDate(expense.date)}</td>
            <td>${expense.name}</td>
            <td>
                <span class="category-badge ${expense.category.toLowerCase()}" >
                    ${expense.category}
                </span>
            </td>
            <td>${getSettings().currency}${Number(expense.amount).toLocaleString()}</td>
            <td>${expense.payment}</td>
            <td>
                <span class="paid">
                    Paid
                </span>
            </td>
            <td>
                <button class="edit-btn" data-id="${expense.id}">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button class="delete-btn" data-id="${expense.id}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
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

document.addEventListener("click", function (e) {
  if (e.target.closest(".delete-btn")) {
    const id = Number(e.target.closest(".delete-btn").dataset.id);
    deleteExpenseHandler(id);
  }

  if (e.target.closest(".edit-btn")) {
    const id = Number(e.target.closest(".edit-btn").dataset.id);
    editExpenseHandler(id);
  }
});

function deleteExpenseHandler(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this expense?",
  );

  if (!confirmDelete) return;

  deleteExpense(id);

  expenses = getExpenses();

  const totalPages = Math.ceil(expenses.length / ITEMS_PER_PAGE) || 1;

  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  showPage(currentPage);
}

function editExpenseHandler(id) {
  localStorage.setItem("editExpenseId", id);

  window.location.href = "add-expense.html";
}

function showPage(page) {
  const start = (page - 1) * ITEMS_PER_PAGE;

  const end = start + ITEMS_PER_PAGE;

  displayExpenses(expenses.slice(start, end));

  updatePagination();
}

document.getElementById("nextPage").addEventListener("click", () => {
  if (currentPage * ITEMS_PER_PAGE < expenses.length) {
    currentPage++;

    showPage(currentPage);
  }
});

document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;

    showPage(currentPage);
  }
});

function updatePagination() {
  const prevBtn = document.getElementById("prevPage");

  const nextBtn = document.getElementById("nextPage");

  const pageInfo = document.getElementById("pageInfo");

  const totalPages = Math.ceil(expenses.length / ITEMS_PER_PAGE) || 1;

  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

  if (totalPages <= 1) {
    prevBtn.style.display = "none";

    nextBtn.style.display = "none";
  } else {
    prevBtn.style.display = "inline-flex";

    nextBtn.style.display = "inline-flex";
  }

  prevBtn.disabled = currentPage === 1;

  nextBtn.disabled = currentPage === totalPages;
}

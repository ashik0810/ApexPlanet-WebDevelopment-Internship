const expenseForm = document.getElementById("expenseForm");
let editExpenseId = null;
let existingReceipt = "";

if (expenseForm) {
  expenseForm.addEventListener("submit", function (e) {
    e.preventDefault();
    saveExpense();
  });
}

function saveExpense() {
  const name = document.getElementById("expenseName").value.trim();

  const amount = Number(document.getElementById("amount").value);

  const category = document.getElementById("category").value;

  const date = document.getElementById("expenseDate").value;

  const notes = document.getElementById("notes").value.trim();

  const payment = document.getElementById("payment")
    ? document.getElementById("payment").value
    : "UPI";

  const receiptInput = document.getElementById("receipt");

  if (name === "" || amount <= 0 || date === "") {
    alert("Please Fill all the required fields.");
    return;
  }

  if (receiptInput && receiptInput.files.length > 0) {
    const reader = new FileReader();

    reader.onload = function () {
      createExpense(reader.result);
    };

    reader.readAsDataURL(receiptInput.files[0]);
  } else {
    createExpense("");
  }

  function createExpense(receipt) {
    const expense = {
      name,
      amount,
      category,
      payment,
      date,
      notes,
      receipt,
    };

    if (editExpenseId) {
      expense.id = editExpenseId;

      if (receipt === "") {
        expense.receipt = existingReceipt;
      }

      updateExpense(editExpenseId, expense);

      localStorage.removeItem("editExpenseId");

      alert("Expense Updated Successfully!");
    } else {
      addExpense(expense);

      alert("Expense Added Successfully!");
    }

    expenseForm.reset();

    setTimeout(() => {
      window.location.href = "expenses.html";
    }, 500);
  }
}

function loadExpenseForEdit() {
  const id = localStorage.getItem("editExpenseId");

  if (!id) return;

  editExpenseId = Number(id);

  const expense = getExpenseById(editExpenseId);

  if (!expense) return;

  document.getElementById("expenseName").value = expense.name;

  document.getElementById("amount").value = expense.amount;

  document.getElementById("category").value = expense.category;

  document.getElementById("payment").value = expense.payment;

  document.getElementById("expenseDate").value = expense.date;

  document.getElementById("notes").value = expense.notes;

  existingReceipt = expense.receipt;

  document.querySelector(".save-btn").textContent = "Update Expense";
}

const dateInput = document.getElementById("expenseDate");

document.addEventListener("DOMContentLoaded", () => {
  if (dateInput) {
    dateInput.valueAsDate = new Date();
  }

  loadExpenseForEdit();
});

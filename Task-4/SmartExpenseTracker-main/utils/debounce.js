const DEBOUNCE_DELAY = 400;

function debounce(callback, delay = DEBOUNCE_DELAY) {
  let timer;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  initializeDebounce();
});

function initializeDebounce() {
  const searchInputs = document.querySelectorAll('input[type="search"]');
  if (searchInputs.length === 0) return;
  searchInputs.forEach((input) => {
    input.addEventListener(
      "input",
      debounce(function () {
        performSearch(this);
      }),
    );
  });
}

function performSearch(input) {
  const keyword = input.value.trim().toLowerCase();

  const tableRows = document.querySelectorAll("tbody tr");

  if (tableRows.length > 0) {
    tableRows.forEach((row) => {
      const rowText = row.textContent.toLowerCase();

      row.style.display = rowText.includes(keyword) ? "" : "none";
    });
  }

  const cards = document.querySelectorAll(".card");

  if (cards.length > 0 && tableRows.length === 0) {
    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(keyword) ? "" : "none";
    });
  }

  const analyticsCards = document.querySelectorAll(".analytics-card");
  analyticsCards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(keyword) ? "" : "none";
  });

  const settingsCards = document.querySelectorAll(".settings-card");
  settingsCards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(keyword) ? "" : "none";
  });
}

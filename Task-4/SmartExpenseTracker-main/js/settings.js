const settingsForm = document.getElementById("settingsForm");

document.addEventListener("DOMContentLoaded", () => {
  loadSettings();
});

function loadSettings() {
  const settings = getSettings();

  if (document.getElementById("username")) {
    document.getElementById("username").value = settings.username;
  }

  if (document.getElementById("budget")) {
    document.getElementById("budget").value = settings.budget;
  }

  if (document.getElementById("currency")) {
    document.getElementById("currency").value = settings.currency;
  }

  if (document.getElementById("notifications")) {
    document.getElementById("notifications").checked = settings.notifications;
  }
}

if (settingsForm) {
  settingsForm.addEventListener("submit", saveUserSettings);
}

function saveUserSettings(e) {
  e.preventDefault();

  const settings = {
    username: document.getElementById("username").value,

    budget: Number(document.getElementById("budget").value),

    currency: document.getElementById("currency").value,

    notifications: document.getElementById("notifications").checked,

    theme: getSettings().theme,
  };

  saveSettings(settings);

  alert("Settings Saved Successfully.");
}

const exportBtn = document.getElementById("exportBtn");

if (exportBtn) {
  exportBtn.addEventListener("click", exportApplicationData);
}

function exportApplicationData() {
  const data = exportData();

  const blob = new Blob([data], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = "ExpenseTrackerBackup.json";

  a.click();

  URL.revokeObjectURL(url);
}

const importInput = document.getElementById("importFile");

if (importInput) {
  importInput.addEventListener("change", importApplicationData);
}

function importApplicationData(e) {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function () {
    importData(reader.result);

    alert("Data Imported Successfully.");

    location.reload();
  };

  reader.readAsText(file);
}

const resetBtn = document.getElementById("resetBtn");

if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    if (confirm("Delete all expenses?")) {
      resetApplication();

      location.reload();
    }
  });
}

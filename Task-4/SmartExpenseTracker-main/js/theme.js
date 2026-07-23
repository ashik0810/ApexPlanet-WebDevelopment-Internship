const themeBtn = document.getElementById("themeBtn");

document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();
});

function initializeTheme() {
  const settings = getSettings();

  if (settings.theme === "dark") {
    document.body.classList.add("dark");

    if (themeBtn) {
      themeBtn.innerHTML = `
            <i class="fa-solid fa-sun"></i>
        `;
    }
  }
}

if (themeBtn) {
  themeBtn.addEventListener("click", toggleTheme);
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  const settings = getSettings();

  if (document.body.classList.contains("dark")) {
    settings.theme = "dark";

    themeBtn.innerHTML = `
            <i class="fa-solid fa-sun"></i>
        `;
  } else {
    settings.theme = "light";

    themeBtn.innerHTML = `
            <i class="fa-solid fa-moon"></i>
        `;
  }

  saveSettings(settings);
}

document.addEventListener("DOMContentLoaded", () => {
  const profileName = document.getElementById("profileName");

  if (profileName) {
    const settings = getSettings();
    profileName.textContent = settings.username;
  }
});

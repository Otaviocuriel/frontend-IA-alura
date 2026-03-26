const THEME_STORAGE_KEY = "site-theme";

function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);

  const themeButtons = document.querySelectorAll(".theme-button");
  themeButtons.forEach((button) => {
    const isActive = button.dataset.theme === theme;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function initThemeSwitcher() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const initialTheme = savedTheme === "light" ? "light" : "dark";

  applyTheme(initialTheme);

  const themeButtons = document.querySelectorAll(".theme-button");
  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedTheme = button.dataset.theme;
      if (!selectedTheme) {
        return;
      }

      applyTheme(selectedTheme);
      localStorage.setItem(THEME_STORAGE_KEY, selectedTheme);
    });
  });
}

initThemeSwitcher();

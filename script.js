const THEME_STORAGE_KEY = "site-theme";
const PROFILE_NAME_STORAGE_KEY = "perfilAtivoNome";
const PROFILE_IMAGE_STORAGE_KEY = "perfilAtivoImagem";

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

function initProfileSelection() {
  const profileLinks = document.querySelectorAll(
    ".profile:not(.add-profile) .profile-link"
  );

  profileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const profileName = link.querySelector("span")?.textContent?.trim();
      const profileImage = link.querySelector("img")?.getAttribute("src");

      if (profileName) {
        localStorage.setItem(PROFILE_NAME_STORAGE_KEY, profileName);
      }

      if (profileImage) {
        localStorage.setItem(PROFILE_IMAGE_STORAGE_KEY, profileImage);
      }
    });
  });
}

function showWelcomeMessage() {
  alert("Bem-vindo(a) a Netflix!");
}

initThemeSwitcher();
initProfileSelection();
showWelcomeMessage();

const themeStorageKey = "krypto-theme";

function applyTheme(theme) {
    const normalizedTheme = ["dark", "cyber"].includes(theme) ? theme : "light";
    document.body.classList.toggle("dark-mode", normalizedTheme === "dark");
    document.body.classList.toggle("cyber-mode", normalizedTheme === "cyber");
    document.documentElement.setAttribute("data-theme", normalizedTheme);
    localStorage.setItem(themeStorageKey, normalizedTheme);

    document.querySelectorAll(".theme-button").forEach((button) => {
        const isActive = button.dataset.theme === normalizedTheme;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}

function createThemeChoice() {
    const nav = document.querySelector(".topnav");
    if (!nav || document.getElementById("theme-choice")) {
        return;
    }

    const wrapper = document.createElement("span");
    wrapper.className = "theme-choice";
    wrapper.id = "theme-choice";

    const label = document.createElement("span");
    label.className = "theme-label";
    label.textContent = "Ansicht:";

    const lightButton = document.createElement("button");
    lightButton.type = "button";
    lightButton.className = "theme-button";
    lightButton.dataset.theme = "light";
    lightButton.textContent = "Hell";
    lightButton.setAttribute("aria-pressed", "false");

    const darkButton = document.createElement("button");
    darkButton.type = "button";
    darkButton.className = "theme-button";
    darkButton.dataset.theme = "dark";
    darkButton.textContent = "Dunkel";
    darkButton.setAttribute("aria-pressed", "false");

    const cyberButton = document.createElement("button");
    cyberButton.type = "button";
    cyberButton.className = "theme-button";
    cyberButton.dataset.theme = "cyber";
    cyberButton.textContent = "Cyber";
    cyberButton.setAttribute("aria-pressed", "false");

    lightButton.addEventListener("click", () => applyTheme("light"));
    darkButton.addEventListener("click", () => applyTheme("dark"));
    cyberButton.addEventListener("click", () => applyTheme("cyber"));

    wrapper.appendChild(label);
    wrapper.appendChild(lightButton);
    wrapper.appendChild(darkButton);
    wrapper.appendChild(cyberButton);
    nav.appendChild(wrapper);

    const savedTheme = localStorage.getItem(themeStorageKey) || "light";
    applyTheme(savedTheme);
}

createThemeChoice();


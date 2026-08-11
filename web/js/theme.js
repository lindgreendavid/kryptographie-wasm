const themeStorageKey = "krypto-theme";

function applyTheme(theme) {
    const normalizedTheme = theme === "dark" ? "dark" : "light";
    document.body.classList.toggle("dark-mode", normalizedTheme === "dark");
    document.documentElement.setAttribute("data-theme", normalizedTheme);
    localStorage.setItem(themeStorageKey, normalizedTheme);
}

function createThemeChoice() {
    const nav = document.querySelector(".topnav");
    if (!nav || document.getElementById("theme-choice")) {
        return;
    }

    const wrapper = document.createElement("span");
    wrapper.className = "theme-choice";

    const label = document.createElement("label");
    label.setAttribute("for", "theme-choice");
    label.textContent = "Ansicht:";

    const select = document.createElement("select");
    select.id = "theme-choice";
    select.innerHTML = '<option value="light">Hell</option><option value="dark">Dunkel</option>';

    const savedTheme = localStorage.getItem(themeStorageKey) || "light";
    select.value = savedTheme === "dark" ? "dark" : "light";
    applyTheme(select.value);

    select.addEventListener("change", () => applyTheme(select.value));

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    nav.appendChild(wrapper);
}

createThemeChoice();


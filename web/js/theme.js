const themeStorageKey = "krypto-theme";

/**
 * Speichert die gewählte Ansicht, sofern Web Storage verfügbar ist.

 * @param {string} theme - Name der Ansicht.
 * @returns {void}
 */
function saveTheme(theme) {
    try {
        localStorage.setItem(themeStorageKey, theme);
    } catch {
        // Die Ansicht funktioniert auch, wenn der Browser Speicher blockiert.
    }
}

function loadTheme() {
    try {
        return localStorage.getItem(themeStorageKey) || "light";
    } catch {
        return "light";
    }
}

/**
 * Aktiviert eine geprüfte Ansicht und synchronisiert die Schaltflächen.

 * @param {string} theme - Gewünschte Ansicht.
 * @returns {void}
 */
function applyTheme(theme) {
    const normalizedTheme = ["dark", "cyber"].includes(theme) ? theme : "light";
    document.body.classList.toggle("dark-mode", normalizedTheme === "dark");
    document.body.classList.toggle("cyber-mode", normalizedTheme === "cyber");
    document.documentElement.setAttribute("data-theme", normalizedTheme);
    saveTheme(normalizedTheme);

    document.querySelectorAll(".theme-button").forEach((button) => {
        if (!(button instanceof HTMLButtonElement)) {
            return;
        }
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

    applyTheme(loadTheme());
}

createThemeChoice();

function markActiveNavigation() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".topnav a").forEach((link) => {
        const linkPage = link.getAttribute("href");
        const isActive = linkPage === currentPage;
        link.classList.toggle("active", isActive);
        if (isActive) {
            link.setAttribute("aria-current", "page");
        }
    });
}

function createProjectFooter() {
    const site = document.querySelector(".site");
    if (!site || document.querySelector(".site-footer")) {
        return;
    }

    const footer = document.createElement("footer");
    footer.className = "site-footer";

    const title = document.createElement("strong");
    title.textContent = "Kryptographie-Projekt";

    const description = document.createElement("span");
    description.textContent = "Rust + WebAssembly + nachvollziehbare Fachlogik.";

    footer.appendChild(title);
    footer.appendChild(description);
    site.appendChild(footer);
}

markActiveNavigation();
createProjectFooter();

import init, { skytale_decrypt, skytale_encrypt, skytale_table } from "../pkg/krypto_wasm.js";
import { element, setDisabled, setText, setValue, showMessage, value } from "./dom.js";

function columns() {
    return Number.parseInt(value("skytale-columns"), 10);
}

/**
 * Rendert die aus Rust gelieferte Skytale-Matrix.

 * @param {Array<Array<string | null>>} rows - Zeilen und optionale Leerzellen.
 * @returns {void}
 */
function renderTable(rows) {
    const target = element("skytale-table");
    target.innerHTML = "";

    const table = document.createElement("table");
    table.className = "classic-table";
    const tbody = document.createElement("tbody");

    rows.forEach((row) => {
        const tr = document.createElement("tr");
        row.forEach((cell) => {
            const td = document.createElement("td");
            td.textContent = cell || "";
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    target.appendChild(table);
}

/**
 * Berechnet und aktualisiert die didaktische Tabellenansicht.

 * @param {string} input - Darzustellender Klartext.
 * @returns {void}
 */
function updateTable(input) {
    const rows = /** @type {Array<Array<string | null>>} */ (
        JSON.parse(skytale_table(input, columns()))
    );
    renderTable(rows);
}

async function start() {
    await init();
    updateTable("");

    element("skytale-encrypt").addEventListener("click", () => {
        try {
            const result = skytale_encrypt(value("skytale-plain"), columns());
            setText("skytale-cipher-output", result);
            setValue("skytale-cipher", result);
            updateTable(value("skytale-plain"));
            showMessage("skytale-message", "");
        } catch (error) {
            showMessage("skytale-message", String(error));
        }
    });

    element("skytale-decrypt").addEventListener("click", () => {
        try {
            const result = skytale_decrypt(value("skytale-cipher"), columns());
            setText("skytale-plain-output", result);
            updateTable(result);
            showMessage("skytale-message", "");
        } catch (error) {
            showMessage("skytale-message", String(error));
        }
    });

    setDisabled("skytale-encrypt", false);
    setDisabled("skytale-decrypt", false);
    showMessage("skytale-message", "");
}

start().catch((error) =>
    showMessage("skytale-message", `WASM konnte nicht geladen werden: ${error}`),
);

import init, { skytale_decrypt, skytale_encrypt, skytale_table } from "../pkg/krypto_wasm.js";
import { element, setText, showMessage, value } from "./dom.js";

function columns() {
    return Number.parseInt(value("skytale-columns"), 10);
}

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

function updateTable(input) {
    renderTable(JSON.parse(skytale_table(input, columns())));
}

async function start() {
    await init();
    updateTable("");

    element("skytale-encrypt").addEventListener("click", () => {
        try {
            const result = skytale_encrypt(value("skytale-plain"), columns());
            setText("skytale-cipher-output", result);
            element("skytale-cipher").value = result;
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
}

start().catch((error) => showMessage("skytale-message", `WASM konnte nicht geladen werden: ${error}`));

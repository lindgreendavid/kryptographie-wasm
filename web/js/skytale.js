import init, { skytale_decrypt, skytale_encrypt, skytale_table } from "../pkg/krypto_wasm.js";

function value(id) {
    return document.getElementById(id).value;
}

function columns() {
    return Number.parseInt(value("skytale-columns"), 10);
}

function setText(id, text) {
    document.getElementById(id).textContent = text;
}

function showError(message) {
    setText("skytale-message", message || "");
}

function renderTable(rows) {
    const target = document.getElementById("skytale-table");
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

    document.getElementById("skytale-encrypt").addEventListener("click", () => {
        try {
            const result = skytale_encrypt(value("skytale-plain"), columns());
            setText("skytale-cipher-output", result);
            document.getElementById("skytale-cipher").value = result;
            updateTable(value("skytale-plain"));
            showError("");
        } catch (error) {
            showError(String(error));
        }
    });

    document.getElementById("skytale-decrypt").addEventListener("click", () => {
        try {
            const result = skytale_decrypt(value("skytale-cipher"), columns());
            setText("skytale-plain-output", result);
            updateTable(result);
            showError("");
        } catch (error) {
            showError(String(error));
        }
    });
}

start().catch((error) => showError(`WASM konnte nicht geladen werden: ${error}`));


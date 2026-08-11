import init, {
    substitution_decrypt,
    substitution_encrypt,
    substitution_random_alphabet,
    substitution_validate,
} from "../pkg/krypto_wasm.js";

const normalAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const exampleAlphabet = "QWERTZUIOPASDFGHJKLYXCVBNM";

function value(id) {
    return document.getElementById(id).value;
}

function setText(id, text) {
    document.getElementById(id).textContent = text;
}

function showError(message) {
    setText("substitution-message", message || "");
}

function renderAlphabetTable(secret) {
    const target = document.getElementById("substitution-table");
    target.innerHTML = "";

    const table = document.createElement("table");
    table.className = "classic-table";

    const normalRow = document.createElement("tr");
    const secretRow = document.createElement("tr");

    const normalHeader = document.createElement("th");
    normalHeader.textContent = "Normalalphabet";
    normalRow.appendChild(normalHeader);

    const secretHeader = document.createElement("th");
    secretHeader.textContent = "Geheimalphabet";
    secretRow.appendChild(secretHeader);

    for (let index = 0; index < normalAlphabet.length; index += 1) {
        const normalCell = document.createElement("td");
        normalCell.textContent = normalAlphabet[index];
        normalRow.appendChild(normalCell);

        const secretCell = document.createElement("td");
        secretCell.textContent = secret[index] || "";
        secretRow.appendChild(secretCell);
    }

    table.appendChild(normalRow);
    table.appendChild(secretRow);
    target.appendChild(table);
}

function alphabet() {
    return value("substitution-alphabet").trim().toUpperCase();
}

async function start() {
    await init();
    document.getElementById("substitution-alphabet").value = exampleAlphabet;
    renderAlphabetTable(exampleAlphabet);

    document.getElementById("substitution-example").addEventListener("click", () => {
        document.getElementById("substitution-alphabet").value = exampleAlphabet;
        renderAlphabetTable(exampleAlphabet);
        showError("");
    });

    document.getElementById("substitution-random").addEventListener("click", () => {
        const generated = substitution_random_alphabet();
        document.getElementById("substitution-alphabet").value = generated;
        renderAlphabetTable(generated);
        showError("");
    });

    document.getElementById("substitution-alphabet").addEventListener("input", () => {
        renderAlphabetTable(alphabet());
    });

    document.getElementById("substitution-encrypt").addEventListener("click", () => {
        try {
            substitution_validate(alphabet());
            const result = substitution_encrypt(value("substitution-plain"), alphabet());
            setText("substitution-cipher-output", result);
            document.getElementById("substitution-cipher").value = result;
            renderAlphabetTable(alphabet());
            showError("");
        } catch (error) {
            showError(String(error));
        }
    });

    document.getElementById("substitution-decrypt").addEventListener("click", () => {
        try {
            substitution_validate(alphabet());
            setText("substitution-plain-output", substitution_decrypt(value("substitution-cipher"), alphabet()));
            renderAlphabetTable(alphabet());
            showError("");
        } catch (error) {
            showError(String(error));
        }
    });
}

start().catch((error) => showError(`WASM konnte nicht geladen werden: ${error}`));


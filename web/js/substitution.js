import init, {
    substitution_decrypt,
    substitution_encrypt,
    substitution_random_alphabet,
    substitution_validate,
} from "../pkg/krypto_wasm.js";
import { element, setDisabled, setText, setValue, showMessage, value } from "./dom.js";

const normalAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const exampleAlphabet = "QWERTZUIOPASDFGHJKLYXCVBNM";

/**
 * Zeigt Normal- und Geheimalphabet als Zuordnungstabelle.
 *
 * @param {string} secret - Geheimalphabet oder aktuelle Teileingabe.
 * @returns {void}
 */
function renderAlphabetTable(secret) {
    const target = element("substitution-table");
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
        normalCell.textContent = normalAlphabet[index] ?? "";
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
    setValue("substitution-alphabet", exampleAlphabet);
    renderAlphabetTable(exampleAlphabet);

    element("substitution-example").addEventListener("click", () => {
        setValue("substitution-alphabet", exampleAlphabet);
        renderAlphabetTable(exampleAlphabet);
        showMessage("substitution-message", "");
    });

    element("substitution-random").addEventListener("click", () => {
        try {
            const generated = substitution_random_alphabet();
            setValue("substitution-alphabet", generated);
            renderAlphabetTable(generated);
            showMessage("substitution-message", "");
        } catch (error) {
            showMessage("substitution-message", String(error));
        }
    });

    element("substitution-alphabet").addEventListener("input", () => {
        renderAlphabetTable(alphabet());
    });

    element("substitution-encrypt").addEventListener("click", () => {
        try {
            substitution_validate(alphabet());
            const result = substitution_encrypt(value("substitution-plain"), alphabet());
            setText("substitution-cipher-output", result);
            setValue("substitution-cipher", result);
            renderAlphabetTable(alphabet());
            showMessage("substitution-message", "");
        } catch (error) {
            showMessage("substitution-message", String(error));
        }
    });

    element("substitution-decrypt").addEventListener("click", () => {
        try {
            substitution_validate(alphabet());
            setText(
                "substitution-plain-output",
                substitution_decrypt(value("substitution-cipher"), alphabet()),
            );
            renderAlphabetTable(alphabet());
            showMessage("substitution-message", "");
        } catch (error) {
            showMessage("substitution-message", String(error));
        }
    });

    [
        "substitution-example",
        "substitution-random",
        "substitution-encrypt",
        "substitution-decrypt",
    ].forEach((id) => setDisabled(id, false));
    showMessage("substitution-message", "");
}

start().catch((error) =>
    showMessage("substitution-message", `WASM konnte nicht geladen werden: ${error}`),
);

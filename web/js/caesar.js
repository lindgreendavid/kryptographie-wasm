import init, {
    caesar_decrypt,
    caesar_encrypt,
    caesar_shifted_alphabet,
} from "../pkg/krypto_wasm.js";

const normalAlphabet = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z";

function value(id) {
    return document.getElementById(id).value;
}

function setText(id, text) {
    document.getElementById(id).textContent = text;
}

function shift() {
    return Number.parseInt(value("caesar-shift"), 10);
}

function showError(message) {
    setText("caesar-message", message || "");
}

function refreshAlphabet() {
    try {
        setText("caesar-normal-alphabet", normalAlphabet);
        setText("caesar-shifted-alphabet", caesar_shifted_alphabet(shift()));
        showError("");
    } catch (error) {
        showError(String(error));
    }
}

async function start() {
    await init();
    refreshAlphabet();

    document.getElementById("caesar-shift").addEventListener("change", refreshAlphabet);
    document.getElementById("caesar-encrypt").addEventListener("click", () => {
        try {
            const result = caesar_encrypt(value("caesar-plain"), shift());
            setText("caesar-cipher-output", result);
            document.getElementById("caesar-cipher").value = result;
            showError("");
            refreshAlphabet();
        } catch (error) {
            showError(String(error));
        }
    });

    document.getElementById("caesar-decrypt").addEventListener("click", () => {
        try {
            setText("caesar-plain-output", caesar_decrypt(value("caesar-cipher"), shift()));
            showError("");
            refreshAlphabet();
        } catch (error) {
            showError(String(error));
        }
    });
}

start().catch((error) => showError(`WASM konnte nicht geladen werden: ${error}`));


import init, {
    caesar_decrypt,
    caesar_encrypt,
    caesar_shifted_alphabet,
} from "../pkg/krypto_wasm.js";
import { element, setText, showMessage, value } from "./dom.js";

const normalAlphabet = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z";

function shift() {
    return Number.parseInt(value("caesar-shift"), 10);
}

function refreshAlphabet() {
    try {
        setText("caesar-normal-alphabet", normalAlphabet);
        setText("caesar-shifted-alphabet", caesar_shifted_alphabet(shift()));
        showMessage("caesar-message", "");
    } catch (error) {
        showMessage("caesar-message", String(error));
    }
}

async function start() {
    await init();
    refreshAlphabet();

    element("caesar-shift").addEventListener("change", refreshAlphabet);
    element("caesar-encrypt").addEventListener("click", () => {
        try {
            const result = caesar_encrypt(value("caesar-plain"), shift());
            setText("caesar-cipher-output", result);
            element("caesar-cipher").value = result;
            showMessage("caesar-message", "");
            refreshAlphabet();
        } catch (error) {
            showMessage("caesar-message", String(error));
        }
    });

    element("caesar-decrypt").addEventListener("click", () => {
        try {
            setText("caesar-plain-output", caesar_decrypt(value("caesar-cipher"), shift()));
            showMessage("caesar-message", "");
            refreshAlphabet();
        } catch (error) {
            showMessage("caesar-message", String(error));
        }
    });
}

start().catch((error) => showMessage("caesar-message", `WASM konnte nicht geladen werden: ${error}`));

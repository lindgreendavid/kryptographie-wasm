import init, {
    chacha_decrypt,
    chacha_encrypt,
    chacha_generate_key,
} from "../pkg/krypto_wasm.js";

function value(id) {
    return document.getElementById(id).value;
}

function setValue(id, text) {
    document.getElementById(id).value = text;
}

function setText(id, text) {
    document.getElementById(id).textContent = text;
}

function showError(message) {
    setText("chacha-message", message || "");
}

async function start() {
    await init();

    document.getElementById("chacha-generate-key").addEventListener("click", () => {
        try {
            const key = chacha_generate_key();
            setValue("chacha-key", key);
            setValue("chacha-key-decrypt", key);
            showError("");
        } catch (error) {
            showError(String(error));
        }
    });

    document.getElementById("chacha-encrypt-button").addEventListener("click", () => {
        try {
            const result = JSON.parse(chacha_encrypt(value("chacha-plain"), value("chacha-key")));
            setText("chacha-cipher-output", result.ciphertext);
            setText("chacha-nonce-output", result.nonce);
            setText("chacha-tag-output", result.tag);
            setValue("chacha-cipher", result.ciphertext);
            setValue("chacha-nonce", result.nonce);
            setValue("chacha-tag", result.tag);
            setValue("chacha-key-decrypt", value("chacha-key"));
            showError("");
        } catch (error) {
            showError(String(error));
        }
    });

    document.getElementById("chacha-decrypt-button").addEventListener("click", () => {
        try {
            setText(
                "chacha-plain-output",
                chacha_decrypt(
                    value("chacha-cipher"),
                    value("chacha-key-decrypt"),
                    value("chacha-nonce"),
                    value("chacha-tag"),
                ),
            );
            showError("");
        } catch (error) {
            setText("chacha-plain-output", "");
            showError(String(error));
        }
    });
}

start().catch((error) => showError(`WASM konnte nicht geladen werden: ${error}`));


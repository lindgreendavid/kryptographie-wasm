import init, { aes_decrypt, aes_encrypt, aes_generate_key } from "../pkg/krypto_wasm.js";

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
    setText("aes-message", message || "");
}

async function start() {
    await init();

    document.getElementById("aes-generate-key").addEventListener("click", () => {
        try {
            const key = aes_generate_key();
            setValue("aes-key", key);
            setValue("aes-key-decrypt", key);
            showError("");
        } catch (error) {
            showError(String(error));
        }
    });

    document.getElementById("aes-encrypt-button").addEventListener("click", () => {
        try {
            const result = JSON.parse(aes_encrypt(value("aes-plain"), value("aes-key")));
            setText("aes-cipher-output", result.ciphertext);
            setText("aes-nonce-output", result.nonce);
            setText("aes-tag-output", result.tag);
            setValue("aes-cipher", result.ciphertext);
            setValue("aes-nonce", result.nonce);
            setValue("aes-tag", result.tag);
            setValue("aes-key-decrypt", value("aes-key"));
            showError("");
        } catch (error) {
            showError(String(error));
        }
    });

    document.getElementById("aes-decrypt-button").addEventListener("click", () => {
        try {
            setText(
                "aes-plain-output",
                aes_decrypt(value("aes-cipher"), value("aes-key-decrypt"), value("aes-nonce"), value("aes-tag")),
            );
            showError("");
        } catch (error) {
            setText("aes-plain-output", "");
            showError(String(error));
        }
    });
}

start().catch((error) => showError(`WASM konnte nicht geladen werden: ${error}`));


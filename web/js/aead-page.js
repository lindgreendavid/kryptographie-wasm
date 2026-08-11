import { element, setText, setValue, showMessage, value } from "./dom.js";

/// Bindet eine AEAD-Seite an ihre WASM-Funktionen, ohne AES und ChaCha
/// in der fachlichen Rust-Schicht gleichzusetzen.
export function startAeadPage({ prefix, initWasm, generateKey, encrypt, decrypt }) {
    const messageId = `${prefix}-message`;

    async function start() {
        await initWasm();

        element(`${prefix}-generate-key`).addEventListener("click", () => {
            try {
                const key = generateKey();
                setValue(`${prefix}-key`, key);
                setValue(`${prefix}-key-decrypt`, key);
                showMessage(messageId, "");
            } catch (error) {
                showMessage(messageId, String(error));
            }
        });

        element(`${prefix}-encrypt-button`).addEventListener("click", () => {
            try {
                const result = encrypt(value(`${prefix}-plain`), value(`${prefix}-key`));
                setText(`${prefix}-cipher-output`, result.ciphertext);
                setText(`${prefix}-nonce-output`, result.nonce);
                setText(`${prefix}-tag-output`, result.tag);
                setValue(`${prefix}-cipher`, result.ciphertext);
                setValue(`${prefix}-nonce`, result.nonce);
                setValue(`${prefix}-tag`, result.tag);
                setValue(`${prefix}-key-decrypt`, value(`${prefix}-key`));
                showMessage(messageId, "");
            } catch (error) {
                showMessage(messageId, String(error));
            }
        });

        element(`${prefix}-decrypt-button`).addEventListener("click", () => {
            try {
                const plaintext = decrypt(
                    value(`${prefix}-cipher`),
                    value(`${prefix}-key-decrypt`),
                    value(`${prefix}-nonce`),
                    value(`${prefix}-tag`),
                );
                setText(`${prefix}-plain-output`, plaintext);
                showMessage(messageId, "");
            } catch (error) {
                setText(`${prefix}-plain-output`, "");
                showMessage(messageId, String(error));
            }
        });
    }

    start().catch((error) => {
        showMessage(messageId, `WASM konnte nicht geladen werden: ${error}`);
    });
}

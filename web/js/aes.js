import init, { aes_decrypt, aes_encrypt, aes_generate_key } from "../pkg/krypto_wasm.js";
import { startAeadPage } from "./aead-page.js";

startAeadPage({
    prefix: "aes",
    initWasm: init,
    generateKey: aes_generate_key,
    encrypt: aes_encrypt,
    decrypt: aes_decrypt,
});

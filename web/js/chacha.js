import init, {
    chacha_decrypt,
    chacha_encrypt,
    chacha_generate_key,
} from "../pkg/krypto_wasm.js";
import { startAeadPage } from "./aead-page.js";

startAeadPage({
    prefix: "chacha",
    initWasm: init,
    generateKey: chacha_generate_key,
    encrypt: chacha_encrypt,
    decrypt: chacha_decrypt,
});

//! WebAssembly-Schnittstelle der Kryptographie-Anwendung.

pub mod crypto;

use wasm_bindgen::prelude::*;

/// Wandelt interne, deutschsprachige Fehlermeldungen in JavaScript-Fehler um.
fn to_js_error(message: String) -> JsValue {
    JsValue::from_str(&message)
}

#[wasm_bindgen]
pub fn caesar_encrypt(input: &str, shift: u8) -> Result<String, JsValue> {
    crypto::caesar::encrypt(input, shift).map_err(to_js_error)
}

#[wasm_bindgen]
pub fn caesar_decrypt(input: &str, shift: u8) -> Result<String, JsValue> {
    crypto::caesar::decrypt(input, shift).map_err(to_js_error)
}

#[wasm_bindgen]
pub fn caesar_shifted_alphabet(shift: u8) -> Result<String, JsValue> {
    crypto::caesar::shifted_alphabet(shift).map_err(to_js_error)
}

#[wasm_bindgen]
pub fn skytale_encrypt(input: &str, columns: usize) -> Result<String, JsValue> {
    crypto::skytale::encrypt(input, columns).map_err(to_js_error)
}

#[wasm_bindgen]
pub fn skytale_decrypt(input: &str, columns: usize) -> Result<String, JsValue> {
    crypto::skytale::decrypt(input, columns).map_err(to_js_error)
}

#[wasm_bindgen]
pub fn skytale_table(input: &str, columns: usize) -> Result<String, JsValue> {
    let table = crypto::skytale::table_rows(input, columns).map_err(to_js_error)?;
    serde_json::to_string(&table)
        .map_err(|_| JsValue::from_str("Die Tabelle konnte nicht erzeugt werden."))
}

#[wasm_bindgen]
pub fn substitution_encrypt(input: &str, secret_alphabet: &str) -> Result<String, JsValue> {
    crypto::substitution::encrypt(input, secret_alphabet).map_err(to_js_error)
}

#[wasm_bindgen]
pub fn substitution_decrypt(input: &str, secret_alphabet: &str) -> Result<String, JsValue> {
    crypto::substitution::decrypt(input, secret_alphabet).map_err(to_js_error)
}

#[wasm_bindgen]
pub fn substitution_validate(secret_alphabet: &str) -> Result<String, JsValue> {
    crypto::substitution::validate_secret_alphabet(secret_alphabet)
        .map(|_| "Das Geheimalphabet ist gültig.".to_string())
        .map_err(to_js_error)
}

#[wasm_bindgen]
pub fn substitution_random_alphabet() -> String {
    crypto::substitution::random_alphabet()
}

#[wasm_bindgen]
pub fn aes_generate_key() -> Result<String, JsValue> {
    crypto::aes::generate_key().map_err(to_js_error)
}

#[wasm_bindgen]
pub fn aes_encrypt(plaintext: &str, key_base64: &str) -> Result<String, JsValue> {
    let result = crypto::aes::encrypt(plaintext, key_base64).map_err(to_js_error)?;
    serde_json::to_string(&result)
        .map_err(|_| JsValue::from_str("Das AES-Ergebnis konnte nicht serialisiert werden."))
}

#[wasm_bindgen]
pub fn aes_decrypt(
    ciphertext_base64: &str,
    key_base64: &str,
    nonce_base64: &str,
    tag_base64: &str,
) -> Result<String, JsValue> {
    crypto::aes::decrypt(ciphertext_base64, key_base64, nonce_base64, tag_base64)
        .map_err(to_js_error)
}

#[wasm_bindgen]
pub fn chacha_generate_key() -> Result<String, JsValue> {
    crypto::chacha::generate_key().map_err(to_js_error)
}

#[wasm_bindgen]
pub fn chacha_encrypt(plaintext: &str, key_base64: &str) -> Result<String, JsValue> {
    let result = crypto::chacha::encrypt(plaintext, key_base64).map_err(to_js_error)?;
    serde_json::to_string(&result).map_err(|_| {
        JsValue::from_str("Das ChaCha20-Poly1305-Ergebnis konnte nicht serialisiert werden.")
    })
}

#[wasm_bindgen]
pub fn chacha_decrypt(
    ciphertext_base64: &str,
    key_base64: &str,
    nonce_base64: &str,
    tag_base64: &str,
) -> Result<String, JsValue> {
    crypto::chacha::decrypt(ciphertext_base64, key_base64, nonce_base64, tag_base64)
        .map_err(to_js_error)
}

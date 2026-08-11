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

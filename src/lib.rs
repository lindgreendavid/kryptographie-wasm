//! WebAssembly-Schnittstelle der Kryptographie-Anwendung.
//!
//! Die eigentliche Fachlogik bleibt in [`crypto`]. Dieses Modul übersetzt
//! ausschließlich zwischen Rust-Typen und der JavaScript-Oberfläche.

#![forbid(unsafe_code)]
#![deny(missing_docs)]

pub mod crypto;

use wasm_bindgen::prelude::*;

/// Wandelt interne, deutschsprachige Fehlermeldungen in JavaScript-Fehler um.
fn to_js_error(error: crypto::CryptoError) -> JsValue {
    JsValue::from_str(&error.to_string())
}

/// Typisiertes AEAD-Ergebnis für JavaScript ohne JSON-Zwischenschritt.
#[wasm_bindgen]
pub struct WasmAeadResult {
    ciphertext: String,
    nonce: String,
    tag: String,
}

#[wasm_bindgen]
impl WasmAeadResult {
    /// Liefert den Base64-kodierten Geheimtext ohne den getrennten Tag.
    #[wasm_bindgen(getter)]
    pub fn ciphertext(&self) -> String {
        self.ciphertext.clone()
    }

    /// Liefert die zufällig erzeugte 96-Bit-Nonce als Base64.
    #[wasm_bindgen(getter)]
    pub fn nonce(&self) -> String {
        self.nonce.clone()
    }

    /// Liefert den 128-Bit-Authentifizierungstag als Base64.
    #[wasm_bindgen(getter)]
    pub fn tag(&self) -> String {
        self.tag.clone()
    }
}

impl From<crypto::aead::AeadEncryptionResult> for WasmAeadResult {
    fn from(result: crypto::aead::AeadEncryptionResult) -> Self {
        Self {
            ciphertext: result.ciphertext,
            nonce: result.nonce,
            tag: result.tag,
        }
    }
}

#[wasm_bindgen]
/// Verschlüsselt Text mit der Caesar-Chiffre.
pub fn caesar_encrypt(input: &str, shift: u8) -> Result<String, JsValue> {
    crypto::caesar::encrypt(input, shift).map_err(to_js_error)
}

#[wasm_bindgen]
/// Entschlüsselt einen Caesar-Geheimtext.
pub fn caesar_decrypt(input: &str, shift: u8) -> Result<String, JsValue> {
    crypto::caesar::decrypt(input, shift).map_err(to_js_error)
}

#[wasm_bindgen]
/// Liefert das verschobene Alphabet für die Visualisierung.
pub fn caesar_shifted_alphabet(shift: u8) -> Result<String, JsValue> {
    crypto::caesar::shifted_alphabet(shift).map_err(to_js_error)
}

#[wasm_bindgen]
/// Verschlüsselt Text mit der Skytale-Transposition.
pub fn skytale_encrypt(input: &str, columns: usize) -> Result<String, JsValue> {
    crypto::skytale::encrypt(input, columns).map_err(to_js_error)
}

#[wasm_bindgen]
/// Entschlüsselt einen Skytale-Geheimtext.
pub fn skytale_decrypt(input: &str, columns: usize) -> Result<String, JsValue> {
    crypto::skytale::decrypt(input, columns).map_err(to_js_error)
}

#[wasm_bindgen]
/// Serialisiert die Skytale-Tabelle für die Browserdarstellung als JSON.
pub fn skytale_table(input: &str, columns: usize) -> Result<String, JsValue> {
    let table = crypto::skytale::table_rows(input, columns).map_err(to_js_error)?;
    serde_json::to_string(&table)
        .map_err(|_| JsValue::from_str("Die Tabelle konnte nicht erzeugt werden."))
}

#[wasm_bindgen]
/// Verschlüsselt Text anhand eines monoalphabetischen Geheimalphabets.
pub fn substitution_encrypt(input: &str, secret_alphabet: &str) -> Result<String, JsValue> {
    crypto::substitution::encrypt(input, secret_alphabet).map_err(to_js_error)
}

#[wasm_bindgen]
/// Entschlüsselt Text anhand eines monoalphabetischen Geheimalphabets.
pub fn substitution_decrypt(input: &str, secret_alphabet: &str) -> Result<String, JsValue> {
    crypto::substitution::decrypt(input, secret_alphabet).map_err(to_js_error)
}

#[wasm_bindgen]
/// Prüft, ob das Geheimalphabet eine vollständige Permutation von A bis Z ist.
pub fn substitution_validate(secret_alphabet: &str) -> Result<String, JsValue> {
    crypto::substitution::validate_secret_alphabet(secret_alphabet)
        .map(|_| "Das Geheimalphabet ist gültig.".to_string())
        .map_err(to_js_error)
}

#[wasm_bindgen]
/// Erzeugt ein zufälliges, gültiges Geheimalphabet.
pub fn substitution_random_alphabet() -> Result<String, JsValue> {
    crypto::substitution::random_alphabet().map_err(to_js_error)
}

#[wasm_bindgen]
/// Erzeugt einen zufälligen AES-256-Schlüssel als Base64.
pub fn aes_generate_key() -> Result<String, JsValue> {
    crypto::aes::generate_key().map_err(to_js_error)
}

#[wasm_bindgen]
/// Verschlüsselt Text mit AES-256-GCM und liefert ein typisiertes Ergebnis.
pub fn aes_encrypt(plaintext: &str, key_base64: &str) -> Result<WasmAeadResult, JsValue> {
    crypto::aes::encrypt(plaintext, key_base64)
        .map(WasmAeadResult::from)
        .map_err(to_js_error)
}

#[wasm_bindgen]
/// Authentifiziert und entschlüsselt ein AES-256-GCM-Ergebnis.
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
/// Erzeugt einen zufälligen ChaCha20-Schlüssel als Base64.
pub fn chacha_generate_key() -> Result<String, JsValue> {
    crypto::chacha::generate_key().map_err(to_js_error)
}

#[wasm_bindgen]
/// Verschlüsselt Text mit ChaCha20-Poly1305 und liefert ein typisiertes Ergebnis.
pub fn chacha_encrypt(plaintext: &str, key_base64: &str) -> Result<WasmAeadResult, JsValue> {
    crypto::chacha::encrypt(plaintext, key_base64)
        .map(WasmAeadResult::from)
        .map_err(to_js_error)
}

#[wasm_bindgen]
/// Authentifiziert und entschlüsselt ein ChaCha20-Poly1305-Ergebnis.
pub fn chacha_decrypt(
    ciphertext_base64: &str,
    key_base64: &str,
    nonce_base64: &str,
    tag_base64: &str,
) -> Result<String, JsValue> {
    crypto::chacha::decrypt(ciphertext_base64, key_base64, nonce_base64, tag_base64)
        .map_err(to_js_error)
}

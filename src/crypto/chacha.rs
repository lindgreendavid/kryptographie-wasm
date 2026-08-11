use base64::engine::general_purpose::STANDARD;
use base64::Engine;
use chacha20poly1305::aead::Aead;
use chacha20poly1305::{ChaCha20Poly1305, KeyInit, Nonce};
use getrandom::getrandom;
use serde::Serialize;

const KEY_SIZE: usize = 32;
const NONCE_SIZE: usize = 12;
const TAG_SIZE: usize = 16;

#[derive(Debug, Clone, Serialize)]
pub struct ChachaEncryptionResult {
    pub ciphertext: String,
    pub nonce: String,
    pub tag: String,
}

pub fn generate_key() -> Result<String, String> {
    let mut key = [0_u8; KEY_SIZE];
    getrandom(&mut key)
        .map_err(|_| "Der ChaCha20-Poly1305-Schluessel konnte nicht erzeugt werden.".to_string())?;
    Ok(STANDARD.encode(key))
}

pub fn encrypt(plaintext: &str, key_base64: &str) -> Result<ChachaEncryptionResult, String> {
    let key = decode_key(key_base64)?;
    let cipher = ChaCha20Poly1305::new_from_slice(&key)
        .map_err(|_| "Der ChaCha20-Poly1305-Schluessel ist ungueltig.".to_string())?;

    let mut nonce_bytes = [0_u8; NONCE_SIZE];
    getrandom(&mut nonce_bytes)
        .map_err(|_| "Die Nonce konnte nicht erzeugt werden.".to_string())?;

    // AEAD liefert Geheimtext und Poly1305-Tag gemeinsam zurück. Die UI
    // zeigt beide Teile getrennt, damit ihre Aufgaben sichtbar bleiben.
    let encrypted = cipher
        .encrypt(Nonce::from_slice(&nonce_bytes), plaintext.as_bytes())
        .map_err(|_| "Die Daten konnten nicht verschluesselt werden.".to_string())?;

    if encrypted.len() < TAG_SIZE {
        return Err("Das ChaCha20-Poly1305-Ergebnis ist unvollstaendig.".to_string());
    }

    let split_at = encrypted.len() - TAG_SIZE;
    let (ciphertext, tag) = encrypted.split_at(split_at);

    Ok(ChachaEncryptionResult {
        ciphertext: STANDARD.encode(ciphertext),
        nonce: STANDARD.encode(nonce_bytes),
        tag: STANDARD.encode(tag),
    })
}

pub fn decrypt(
    ciphertext_base64: &str,
    key_base64: &str,
    nonce_base64: &str,
    tag_base64: &str,
) -> Result<String, String> {
    let key = decode_key(key_base64)?;
    let nonce = decode_exact(
        nonce_base64,
        NONCE_SIZE,
        "Die Nonce muss 12 Byte lang sein.",
    )?;
    let tag = decode_exact(
        tag_base64,
        TAG_SIZE,
        "Der Authentifizierungstag muss 16 Byte lang sein.",
    )?;
    let ciphertext = STANDARD
        .decode(ciphertext_base64.trim())
        .map_err(|_| "Der Geheimtext ist kein gueltiges Base64.".to_string())?;

    let cipher = ChaCha20Poly1305::new_from_slice(&key)
        .map_err(|_| "Der ChaCha20-Poly1305-Schluessel ist ungueltig.".to_string())?;

    // Zur Authentifizierung erwartet RustCrypto wieder Geheimtext || Tag.
    let mut combined = ciphertext;
    combined.extend_from_slice(&tag);

    let plaintext = cipher
        .decrypt(Nonce::from_slice(&nonce), combined.as_ref())
        .map_err(|_| "Die Daten konnten nicht authentifiziert werden.".to_string())?;

    String::from_utf8(plaintext)
        .map_err(|_| "Der entschluesselte Text ist kein gueltiges UTF-8.".to_string())
}

fn decode_key(key_base64: &str) -> Result<Vec<u8>, String> {
    decode_exact(
        key_base64,
        KEY_SIZE,
        "Der ChaCha20-Poly1305-Schluessel muss Base64-kodiert sein und 32 Byte enthalten.",
    )
}

fn decode_exact(input: &str, expected_len: usize, message: &str) -> Result<Vec<u8>, String> {
    let bytes = STANDARD
        .decode(input.trim())
        .map_err(|_| message.to_string())?;

    if bytes.len() == expected_len {
        Ok(bytes)
    } else {
        Err(message.to_string())
    }
}

use aes_gcm::aead::{Aead, Payload};
use aes_gcm::{Aes256Gcm, KeyInit, Nonce as AesNonce};

use super::types::{
    combine, decode_ciphertext, encode_result, split_encrypted, AeadEncryptionResult, AuthTag16,
    Key32, Nonce12,
};
use crate::crypto::{CryptoError, CryptoResult};

/// Erzeugt einen kryptographisch zufälligen 256-Bit-Schlüssel als Base64.
pub fn generate_key() -> CryptoResult<String> {
    Key32::random().map(|key| key.to_base64())
}

/// Verschlüsselt und authentifiziert UTF-8-Text mit einer frischen Nonce.
pub fn encrypt(plaintext: &str, key_base64: &str) -> CryptoResult<AeadEncryptionResult> {
    let key = Key32::from_base64(key_base64)?;
    let nonce = Nonce12::random()?;
    let (ciphertext, tag) = encrypt_raw(plaintext.as_bytes(), &[], &key, &nonce)?;
    Ok(encode_result(&ciphertext, &nonce, &tag))
}

/// Prüft den Tag und gibt nur bei erfolgreicher Authentifizierung Klartext zurück.
pub fn decrypt(
    ciphertext_base64: &str,
    key_base64: &str,
    nonce_base64: &str,
    tag_base64: &str,
) -> CryptoResult<String> {
    let key = Key32::from_base64(key_base64)?;
    let nonce = Nonce12::from_base64(nonce_base64)?;
    let tag = AuthTag16::from_base64(tag_base64)?;
    let ciphertext = decode_ciphertext(ciphertext_base64)?;
    let cipher = Aes256Gcm::new_from_slice(key.as_bytes()).map_err(|_| CryptoError::InvalidKey)?;
    let combined = combine(ciphertext, &tag);

    let plaintext = cipher
        .decrypt(
            AesNonce::from_slice(nonce.as_bytes()),
            Payload {
                msg: &combined,
                aad: &[],
            },
        )
        .map_err(|_| CryptoError::AuthenticationFailed)?;

    String::from_utf8(plaintext).map_err(|_| CryptoError::InvalidUtf8)
}

fn encrypt_raw(
    plaintext: &[u8],
    aad: &[u8],
    key: &Key32,
    nonce: &Nonce12,
) -> CryptoResult<(Vec<u8>, AuthTag16)> {
    let cipher = Aes256Gcm::new_from_slice(key.as_bytes()).map_err(|_| CryptoError::InvalidKey)?;
    let encrypted = cipher
        .encrypt(
            AesNonce::from_slice(nonce.as_bytes()),
            Payload {
                msg: plaintext,
                aad,
            },
        )
        .map_err(|_| CryptoError::EncryptionFailed)?;

    split_encrypted(encrypted)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn entspricht_nist_aes_256_gcm_testvektor() {
        // NIST SP 800-38D/CAVP: 256-Bit-Nullschlüssel, 96-Bit-Null-IV,
        // leerer Klartext und leere zusätzliche authentifizierte Daten.
        let key = Key32::from_bytes([0_u8; 32]);
        let nonce = Nonce12::from_bytes([0_u8; 12]);
        let (ciphertext, tag) = encrypt_raw(&[], &[], &key, &nonce).unwrap();

        assert!(ciphertext.is_empty());
        assert_eq!(
            tag.as_bytes(),
            &[
                0x53, 0x0f, 0x8a, 0xfb, 0xc7, 0x45, 0x36, 0xb9, 0xa9, 0x63, 0xb4, 0xf1, 0xc4, 0xcb,
                0x73, 0x8b,
            ]
        );
    }
}

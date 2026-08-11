use chacha20poly1305::aead::{Aead, Payload};
use chacha20poly1305::{ChaCha20Poly1305, KeyInit, Nonce as ChachaNonce};

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
    let cipher =
        ChaCha20Poly1305::new_from_slice(key.as_bytes()).map_err(|_| CryptoError::InvalidKey)?;
    let combined = combine(ciphertext, &tag);

    let plaintext = cipher
        .decrypt(
            ChachaNonce::from_slice(nonce.as_bytes()),
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
    let cipher =
        ChaCha20Poly1305::new_from_slice(key.as_bytes()).map_err(|_| CryptoError::InvalidKey)?;
    let encrypted = cipher
        .encrypt(
            ChachaNonce::from_slice(nonce.as_bytes()),
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

    fn decode_hex(value: &str) -> Vec<u8> {
        value
            .as_bytes()
            .chunks_exact(2)
            .map(|pair| {
                let text = std::str::from_utf8(pair).unwrap();
                u8::from_str_radix(text, 16).unwrap()
            })
            .collect()
    }

    #[test]
    fn entspricht_rfc_8439_abschnitt_2_8_2() {
        let key = Key32::from_bytes(
            decode_hex("808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9f")
                .try_into()
                .unwrap(),
        );
        let nonce = Nonce12::from_bytes(decode_hex("070000004041424344454647").try_into().unwrap());
        let aad = decode_hex("50515253c0c1c2c3c4c5c6c7");
        let plaintext = decode_hex(concat!(
            "4c616469657320616e642047656e746c",
            "656d656e206f662074686520636c6173",
            "73206f66202739393a20496620492063",
            "6f756c64206f6666657220796f75206f",
            "6e6c79206f6e652074697020666f7220",
            "746865206675747572652c2073756e73",
            "637265656e20776f756c642062652069",
            "742e",
        ));
        let expected_ciphertext = decode_hex(concat!(
            "d31a8d34648e60db7b86afbc53ef7ec2",
            "a4aded51296e08fea9e2b5a736ee62d6",
            "3dbea45e8ca9671282fafb69da92728b",
            "1a71de0a9e060b2905d6a5b67ecd3b36",
            "92ddbd7f2d778b8c9803aee328091b58",
            "fab324e4fad675945585808b4831d7bc",
            "3ff4def08e4b7a9de576d26586cec64b",
            "6116",
        ));
        let expected_tag = decode_hex("1ae10b594f09e26a7e902ecbd0600691");

        let (ciphertext, tag) = encrypt_raw(&plaintext, &aad, &key, &nonce).unwrap();

        assert_eq!(ciphertext, expected_ciphertext);
        assert_eq!(tag.as_bytes(), expected_tag.as_slice());
    }
}

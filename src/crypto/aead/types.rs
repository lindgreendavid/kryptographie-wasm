use base64::engine::general_purpose::STANDARD;
use base64::Engine;
use getrandom::getrandom;

use crate::crypto::{CryptoError, CryptoResult};

const KEY_SIZE: usize = 32;
const NONCE_SIZE: usize = 12;
pub(super) const TAG_SIZE: usize = 16;

/// 256-Bit-Schlüssel, dessen Länge nach der Konstruktion garantiert ist.
#[derive(Debug, Clone, PartialEq, Eq)]
pub(super) struct Key32([u8; KEY_SIZE]);

impl Key32 {
    pub(super) fn random() -> CryptoResult<Self> {
        let mut bytes = [0_u8; KEY_SIZE];
        getrandom(&mut bytes).map_err(|_| CryptoError::RandomKeyUnavailable)?;
        Ok(Self(bytes))
    }

    pub(super) fn from_base64(input: &str) -> CryptoResult<Self> {
        decode_exact(input, CryptoError::InvalidKey).map(Self)
    }

    #[cfg(test)]
    pub(super) const fn from_bytes(bytes: [u8; KEY_SIZE]) -> Self {
        Self(bytes)
    }

    pub(super) fn as_bytes(&self) -> &[u8; KEY_SIZE] {
        &self.0
    }

    pub(super) fn to_base64(&self) -> String {
        STANDARD.encode(self.0)
    }
}

/// 96-Bit-Nonce, deren Länge nach der Konstruktion garantiert ist.
#[derive(Debug, Clone, PartialEq, Eq)]
pub(super) struct Nonce12([u8; NONCE_SIZE]);

impl Nonce12 {
    pub(super) fn random() -> CryptoResult<Self> {
        let mut bytes = [0_u8; NONCE_SIZE];
        getrandom(&mut bytes).map_err(|_| CryptoError::RandomNonceUnavailable)?;
        Ok(Self(bytes))
    }

    pub(super) fn from_base64(input: &str) -> CryptoResult<Self> {
        decode_exact(input, CryptoError::InvalidNonce).map(Self)
    }

    #[cfg(test)]
    pub(super) const fn from_bytes(bytes: [u8; NONCE_SIZE]) -> Self {
        Self(bytes)
    }

    pub(super) fn as_bytes(&self) -> &[u8; NONCE_SIZE] {
        &self.0
    }

    fn to_base64(&self) -> String {
        STANDARD.encode(self.0)
    }
}

/// 128-Bit-Authentifizierungstag mit garantierter Länge.
#[derive(Debug, Clone, PartialEq, Eq)]
pub(super) struct AuthTag16([u8; TAG_SIZE]);

impl AuthTag16 {
    pub(super) fn from_base64(input: &str) -> CryptoResult<Self> {
        decode_exact(input, CryptoError::InvalidTag).map(Self)
    }

    pub(super) fn as_bytes(&self) -> &[u8; TAG_SIZE] {
        &self.0
    }

    fn to_base64(&self) -> String {
        STANDARD.encode(self.0)
    }
}

/// Verfahrenunabhängiges Ergebnis für die Lernoberfläche.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AeadEncryptionResult {
    /// Base64-kodierter Geheimtext ohne den getrennten Authentifizierungstag.
    pub ciphertext: String,
    /// Base64-kodierte, zufällig erzeugte 96-Bit-Nonce.
    pub nonce: String,
    /// Base64-kodierter 128-Bit-Authentifizierungstag.
    pub tag: String,
}

pub(super) fn decode_ciphertext(input: &str) -> CryptoResult<Vec<u8>> {
    STANDARD
        .decode(input.trim())
        .map_err(|_| CryptoError::InvalidCiphertextBase64)
}

pub(super) fn split_encrypted(mut encrypted: Vec<u8>) -> CryptoResult<(Vec<u8>, AuthTag16)> {
    if encrypted.len() < TAG_SIZE {
        return Err(CryptoError::IncompleteEncryptionResult);
    }

    let tag = encrypted.split_off(encrypted.len() - TAG_SIZE);
    let tag = tag
        .try_into()
        .map(AuthTag16)
        .map_err(|_| CryptoError::IncompleteEncryptionResult)?;
    Ok((encrypted, tag))
}

pub(super) fn combine(ciphertext: Vec<u8>, tag: &AuthTag16) -> Vec<u8> {
    let mut combined = ciphertext;
    combined.extend_from_slice(tag.as_bytes());
    combined
}

pub(super) fn encode_result(
    ciphertext: &[u8],
    nonce: &Nonce12,
    tag: &AuthTag16,
) -> AeadEncryptionResult {
    AeadEncryptionResult {
        ciphertext: STANDARD.encode(ciphertext),
        nonce: nonce.to_base64(),
        tag: tag.to_base64(),
    }
}

fn decode_exact<const SIZE: usize>(input: &str, error: CryptoError) -> CryptoResult<[u8; SIZE]> {
    let bytes = STANDARD.decode(input.trim()).map_err(|_| error)?;
    bytes.try_into().map_err(|_| error)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn unvollstaendiges_aead_ergebnis_wird_abgelehnt() {
        assert_eq!(
            split_encrypted(vec![0_u8; TAG_SIZE - 1]),
            Err(CryptoError::IncompleteEncryptionResult)
        );
    }

    #[test]
    fn ciphertext_decoder_unterscheidet_ungueltiges_base64() {
        assert_eq!(
            decode_ciphertext("kein-base64!"),
            Err(CryptoError::InvalidCiphertextBase64)
        );
    }
}

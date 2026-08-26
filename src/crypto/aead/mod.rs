//! Gemeinsame Infrastruktur für authentifizierte Verschlüsselung.

/// AES-256-GCM mit getrennt ausgegebenem Ciphertext, Nonce und Tag.
pub mod aes_gcm;
/// ChaCha20-Poly1305 mit getrennt ausgegebenem Ciphertext, Nonce und Tag.
pub mod chacha20_poly1305;
mod types;

pub use types::AeadEncryptionResult;

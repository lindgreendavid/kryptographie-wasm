//! Gemeinsame Infrastruktur für authentifizierte Verschlüsselung.

pub mod aes_gcm;
pub mod chacha20_poly1305;
mod types;

pub use types::AeadEncryptionResult;

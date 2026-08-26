//! Fachlogik der demonstrierten Kryptographieverfahren.

/// Gemeinsame Typen und Implementierungen für authentifizierte Verschlüsselung.
pub mod aead;
/// Caesar-Chiffre für die didaktische Buchstabenverschiebung.
pub mod caesar;
/// Strukturierte Fehler und Ergebnisaliasse der Fachlogik.
pub mod error;
/// Skytale-Transposition und ihre Matrixdarstellung.
pub mod skytale;
/// Monoalphabetische Substitution und sichere Alphabeterzeugung.
pub mod substitution;

pub use aead::aes_gcm as aes;
pub use aead::chacha20_poly1305 as chacha;
pub use error::{CryptoError, CryptoResult};

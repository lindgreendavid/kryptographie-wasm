//! Fachlogik der demonstrierten Kryptographieverfahren.

pub mod aead;
pub mod caesar;
pub mod error;
pub mod skytale;
pub mod substitution;

pub use aead::aes_gcm as aes;
pub use aead::chacha20_poly1305 as chacha;
pub use error::{CryptoError, CryptoResult};

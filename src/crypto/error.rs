use std::fmt;

/// Strukturierte Fehler der Kryptographie-Domäne.
///
/// Die Fachlogik liefert stabile Varianten. Erst die Darstellung über
/// [`fmt::Display`] erzeugt die deutschsprachigen Texte für die Oberfläche.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CryptoError {
    InvalidCaesarShift,
    InvalidSkytaleColumns,
    InvalidAlphabetLength,
    InvalidAlphabetCharacter,
    DuplicateAlphabetLetter(char),
    MissingAlphabetLetter(char),
    RandomAlphabetUnavailable,
    RandomKeyUnavailable,
    RandomNonceUnavailable,
    InvalidKey,
    InvalidNonce,
    InvalidTag,
    InvalidCiphertextBase64,
    EncryptionFailed,
    IncompleteEncryptionResult,
    AuthenticationFailed,
    InvalidUtf8,
}

pub type CryptoResult<T> = Result<T, CryptoError>;

impl fmt::Display for CryptoError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::InvalidCaesarShift => {
                formatter.write_str("Der Caesar-Schlüssel muss zwischen 1 und 25 liegen.")
            }
            Self::InvalidSkytaleColumns => {
                formatter.write_str("Die Spaltenzahl muss zwischen 2 und 30 liegen.")
            }
            Self::InvalidAlphabetLength => formatter
                .write_str("Das Geheimalphabet muss genau 26 Buchstaben enthalten."),
            Self::InvalidAlphabetCharacter => formatter
                .write_str("Das Geheimalphabet darf nur die Buchstaben A bis Z enthalten."),
            Self::DuplicateAlphabetLetter(letter) => {
                write!(formatter, "Der Buchstabe {letter} kommt mehrfach vor.")
            }
            Self::MissingAlphabetLetter(letter) => {
                write!(formatter, "Der Buchstabe {letter} fehlt im Geheimalphabet.")
            }
            Self::RandomAlphabetUnavailable => formatter
                .write_str("Das zufällige Geheimalphabet konnte nicht erzeugt werden."),
            Self::RandomKeyUnavailable => {
                formatter.write_str("Der Schlüssel konnte nicht sicher erzeugt werden.")
            }
            Self::RandomNonceUnavailable => {
                formatter.write_str("Die Nonce konnte nicht sicher erzeugt werden.")
            }
            Self::InvalidKey => formatter
                .write_str("Der Schlüssel muss Base64-kodiert sein und 32 Byte enthalten."),
            Self::InvalidNonce => formatter
                .write_str("Die Nonce muss Base64-kodiert sein und 12 Byte enthalten."),
            Self::InvalidTag => formatter.write_str(
                "Der Authentifizierungstag muss Base64-kodiert sein und 16 Byte enthalten.",
            ),
            Self::InvalidCiphertextBase64 => {
                formatter.write_str("Der Geheimtext ist kein gültiges Base64.")
            }
            Self::EncryptionFailed => {
                formatter.write_str("Die Daten konnten nicht verschlüsselt werden.")
            }
            Self::IncompleteEncryptionResult => {
                formatter.write_str("Das Verschlüsselungsergebnis ist unvollständig.")
            }
            Self::AuthenticationFailed => {
                formatter.write_str("Die Daten konnten nicht authentifiziert werden.")
            }
            Self::InvalidUtf8 => {
                formatter.write_str("Der entschlüsselte Text ist kein gültiges UTF-8.")
            }
        }
    }
}

impl std::error::Error for CryptoError {}

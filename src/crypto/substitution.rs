use getrandom::getrandom;

use super::{CryptoError, CryptoResult};

const NORMAL_ALPHABET: &str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/// Ersetzt jeden lateinischen Buchstaben anhand eines geprüften Geheimalphabets.
pub fn encrypt(input: &str, secret_alphabet: &str) -> CryptoResult<String> {
    let secret = validate_secret_alphabet(secret_alphabet)?;
    Ok(input
        .chars()
        .map(|ch| substitute_char(ch, NORMAL_ALPHABET, &secret))
        .collect())
}

/// Kehrt die monoalphabetische Substitution um.
pub fn decrypt(input: &str, secret_alphabet: &str) -> CryptoResult<String> {
    let secret = validate_secret_alphabet(secret_alphabet)?;
    Ok(input
        .chars()
        .map(|ch| substitute_char(ch, &secret, NORMAL_ALPHABET))
        .collect())
}

/// Normalisiert und validiert eine Permutation der 26 ASCII-Großbuchstaben.
pub fn validate_secret_alphabet(secret_alphabet: &str) -> CryptoResult<String> {
    let normalized = secret_alphabet.trim().to_ascii_uppercase();

    if normalized.chars().count() != 26 {
        return Err(CryptoError::InvalidAlphabetLength);
    }

    if !normalized.chars().all(|ch| ch.is_ascii_uppercase()) {
        return Err(CryptoError::InvalidAlphabetCharacter);
    }

    // Eine gültige Substitution ist eine Permutation: jeder Buchstabe
    // muss genau einmal vorkommen.
    for letter in NORMAL_ALPHABET.chars() {
        let count = normalized
            .chars()
            .filter(|candidate| *candidate == letter)
            .count();
        if count > 1 {
            return Err(CryptoError::DuplicateAlphabetLetter(letter));
        }
        if count == 0 {
            return Err(CryptoError::MissingAlphabetLetter(letter));
        }
    }

    Ok(normalized)
}

/// Erzeugt mittels Fisher-Yates eine zufällige Permutation von A bis Z.
pub fn random_alphabet() -> CryptoResult<String> {
    let mut letters: Vec<char> = NORMAL_ALPHABET.chars().collect();

    // Rejection Sampling vermeidet den kleinen Modulo-Bias, der entstehen
    // würde, wenn 256 nicht ohne Rest durch die jeweilige Bereichsgröße teilbar ist.
    for index in (1..letters.len()).rev() {
        let random_index = random_index_inclusive(index)?;
        letters.swap(index, random_index);
    }

    Ok(letters.into_iter().collect())
}

fn random_index_inclusive(max: usize) -> CryptoResult<usize> {
    let range = max + 1;
    let acceptance_limit = 256 - (256 % range);

    loop {
        let mut byte = [0_u8; 1];
        getrandom(&mut byte).map_err(|_| CryptoError::RandomAlphabetUnavailable)?;

        let candidate = byte[0] as usize;
        if candidate < acceptance_limit {
            return Ok(candidate % range);
        }
    }
}

fn substitute_char(ch: char, source: &str, target: &str) -> char {
    let uppercase = ch.to_ascii_uppercase();
    if !uppercase.is_ascii_uppercase() {
        return ch;
    }

    let Some(index) = source.chars().position(|candidate| candidate == uppercase) else {
        return ch;
    };

    let replacement = target.chars().nth(index).unwrap_or(ch);
    if ch.is_ascii_lowercase() {
        replacement.to_ascii_lowercase()
    } else {
        replacement
    }
}

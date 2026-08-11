use getrandom::getrandom;

const NORMAL_ALPHABET: &str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/// Ersetzt jeden lateinischen Buchstaben anhand eines geprüften Geheimalphabets.
pub fn encrypt(input: &str, secret_alphabet: &str) -> Result<String, String> {
    let secret = validate_secret_alphabet(secret_alphabet)?;
    Ok(input
        .chars()
        .map(|ch| substitute_char(ch, NORMAL_ALPHABET, &secret))
        .collect())
}

/// Kehrt die monoalphabetische Substitution um.
pub fn decrypt(input: &str, secret_alphabet: &str) -> Result<String, String> {
    let secret = validate_secret_alphabet(secret_alphabet)?;
    Ok(input
        .chars()
        .map(|ch| substitute_char(ch, &secret, NORMAL_ALPHABET))
        .collect())
}

/// Normalisiert und validiert eine Permutation der 26 ASCII-Großbuchstaben.
pub fn validate_secret_alphabet(secret_alphabet: &str) -> Result<String, String> {
    let normalized = secret_alphabet.trim().to_ascii_uppercase();

    if normalized.chars().count() != 26 {
        return Err("Das Geheimalphabet muss genau 26 Buchstaben enthalten.".to_string());
    }

    if !normalized.chars().all(|ch| ch.is_ascii_uppercase()) {
        return Err("Das Geheimalphabet darf nur die Buchstaben A bis Z enthalten.".to_string());
    }

    // Eine gültige Substitution ist eine Permutation: jeder Buchstabe
    // muss genau einmal vorkommen.
    for letter in NORMAL_ALPHABET.chars() {
        let count = normalized
            .chars()
            .filter(|candidate| *candidate == letter)
            .count();
        if count > 1 {
            return Err(format!("Der Buchstabe {letter} kommt mehrfach vor."));
        }
        if count == 0 {
            return Err(format!("Der Buchstabe {letter} fehlt im Geheimalphabet."));
        }
    }

    Ok(normalized)
}

/// Erzeugt mittels Fisher-Yates eine zufällige Permutation von A bis Z.
pub fn random_alphabet() -> Result<String, String> {
    let mut letters: Vec<char> = NORMAL_ALPHABET.chars().collect();

    // Rejection Sampling vermeidet den kleinen Modulo-Bias, der entstehen
    // würde, wenn 256 nicht ohne Rest durch die jeweilige Bereichsgröße teilbar ist.
    for index in (1..letters.len()).rev() {
        let random_index = random_index_inclusive(index)?;
        letters.swap(index, random_index);
    }

    Ok(letters.into_iter().collect())
}

fn random_index_inclusive(max: usize) -> Result<usize, String> {
    let range = max + 1;
    let acceptance_limit = 256 - (256 % range);

    loop {
        let mut byte = [0_u8; 1];
        getrandom(&mut byte)
            .map_err(|_| "Das zufällige Geheimalphabet konnte nicht erzeugt werden.".to_string())?;

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

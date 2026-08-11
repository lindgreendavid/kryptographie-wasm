use getrandom::getrandom;

const NORMAL_ALPHABET: &str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const EXAMPLE_ALPHABET: &str = "QWERTZUIOPASDFGHJKLYXCVBNM";

/// Ersetzt jeden lateinischen Buchstaben anhand eines geprüften Geheimalphabets.
pub fn encrypt(input: &str, secret_alphabet: &str) -> Result<String, String> {
    let secret = validate_secret_alphabet(secret_alphabet)?;
    Ok(input
        .chars()
        .map(|ch| substitute_char(ch, NORMAL_ALPHABET, &secret))
        .collect())
}

pub fn decrypt(input: &str, secret_alphabet: &str) -> Result<String, String> {
    let secret = validate_secret_alphabet(secret_alphabet)?;
    Ok(input
        .chars()
        .map(|ch| substitute_char(ch, &secret, NORMAL_ALPHABET))
        .collect())
}

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

pub fn random_alphabet() -> String {
    let mut letters: Vec<char> = NORMAL_ALPHABET.chars().collect();
    let mut random_bytes = [0_u8; 64];

    if getrandom(&mut random_bytes).is_err() {
        return EXAMPLE_ALPHABET.to_string();
    }

    // Fisher-Yates-Mischung: Nach jedem Schritt ist die Restmenge kleiner.
    for index in (1..letters.len()).rev() {
        let random_index = random_bytes[index % random_bytes.len()] as usize % (index + 1);
        letters.swap(index, random_index);
    }

    letters.into_iter().collect()
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

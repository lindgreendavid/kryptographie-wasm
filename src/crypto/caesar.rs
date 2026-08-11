const ALPHABET: &str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/// Verschiebt lateinische Buchstaben um `shift` Positionen.
/// Andere Unicode-Zeichen bleiben unverändert.
pub fn encrypt(input: &str, shift: u8) -> Result<String, String> {
    validate_shift(shift)?;
    Ok(input.chars().map(|ch| shift_char(ch, shift)).collect())
}

pub fn decrypt(input: &str, shift: u8) -> Result<String, String> {
    validate_shift(shift)?;
    Ok(input
        .chars()
        .map(|ch| shift_char(ch, 26 - (shift % 26)))
        .collect())
}

pub fn shifted_alphabet(shift: u8) -> Result<String, String> {
    validate_shift(shift)?;
    Ok(ALPHABET
        .chars()
        .map(|ch| shift_char(ch, shift))
        .collect::<Vec<char>>()
        .into_iter()
        .map(|ch| ch.to_string())
        .collect::<Vec<String>>()
        .join(" "))
}

fn validate_shift(shift: u8) -> Result<(), String> {
    if (1..=25).contains(&shift) {
        Ok(())
    } else {
        Err("Der Caesar-Schluessel muss zwischen 1 und 25 liegen.".to_string())
    }
}

fn shift_char(ch: char, shift: u8) -> char {
    match ch {
        'A'..='Z' => rotate(ch, b'A', shift),
        'a'..='z' => rotate(ch, b'a', shift),
        _ => ch,
    }
}

fn rotate(ch: char, base: u8, shift: u8) -> char {
    // Der Modulo-Operator führt nach Z wieder zu A zurück.
    let offset = ch as u8 - base;
    (base + ((offset + shift) % 26)) as char
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn shifts_uppercase_letters() {
        assert_eq!(encrypt("ABC", 3).unwrap(), "DEF");
        assert_eq!(decrypt("DEF", 3).unwrap(), "ABC");
    }
}

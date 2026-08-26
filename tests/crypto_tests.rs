use base64::engine::general_purpose::STANDARD;
use base64::Engine;
use krypto_wasm::crypto;
use krypto_wasm::crypto::aead::AeadEncryptionResult;
use krypto_wasm::crypto::{CryptoError, CryptoResult};

type GenerateKey = fn() -> CryptoResult<String>;
type EncryptAead = fn(&str, &str) -> CryptoResult<AeadEncryptionResult>;
type DecryptAead = fn(&str, &str, &str, &str) -> CryptoResult<String>;

/// Ändert ein Byte, ohne Base64-Format oder Länge zu zerstören.
/// So prüfen die AEAD-Tests tatsächlich die Authentifizierung und nicht nur
/// die Eingabevalidierung des Base64-Decoders.
fn manipulate_base64(value: &str) -> String {
    let mut bytes = STANDARD.decode(value).unwrap();
    bytes[0] ^= 0b0000_0001;
    STANDARD.encode(bytes)
}

fn assert_aead_roundtrips(generate_key: GenerateKey, encrypt: EncryptAead, decrypt: DecryptAead) {
    let key = generate_key().unwrap();
    let cases = [
        "",
        "   ",
        "Grüße, Straße und Café",
        "Zeile 1\nZeile 2\nZeile 3",
        "🔐 Rust + WebAssembly 🚀",
    ];

    for plaintext in cases {
        let encrypted = encrypt(plaintext, &key).unwrap();
        let decrypted = decrypt(
            &encrypted.ciphertext,
            &key,
            &encrypted.nonce,
            &encrypted.tag,
        )
        .unwrap();
        assert_eq!(decrypted, plaintext);
    }

    let long_text = "Langer Testtext mit Unicode 🔐 und Zeilenumbruch.\n".repeat(512);
    let encrypted = encrypt(&long_text, &key).unwrap();
    let decrypted = decrypt(
        &encrypted.ciphertext,
        &key,
        &encrypted.nonce,
        &encrypted.tag,
    )
    .unwrap();
    assert_eq!(decrypted, long_text);
}

fn assert_aead_rejects_invalid_inputs(
    generate_key: GenerateKey,
    encrypt: EncryptAead,
    decrypt: DecryptAead,
) {
    let key = generate_key().unwrap();
    let encrypted = encrypt("Validierungsfall", &key).unwrap();

    assert_eq!(
        decrypt(
            &encrypted.ciphertext,
            "kein-base64!",
            &encrypted.nonce,
            &encrypted.tag,
        ),
        Err(CryptoError::InvalidKey)
    );
    assert_eq!(
        decrypt(
            &encrypted.ciphertext,
            &key,
            &STANDARD.encode([0_u8; 11]),
            &encrypted.tag,
        ),
        Err(CryptoError::InvalidNonce)
    );
    assert_eq!(
        decrypt(
            &encrypted.ciphertext,
            &key,
            &encrypted.nonce,
            &STANDARD.encode([0_u8; 15]),
        ),
        Err(CryptoError::InvalidTag)
    );
    assert_eq!(
        decrypt("kein-base64!", &key, &encrypted.nonce, &encrypted.tag),
        Err(CryptoError::InvalidCiphertextBase64)
    );
    assert_eq!(
        decrypt("", &key, &encrypted.nonce, &encrypted.tag),
        Err(CryptoError::AuthenticationFailed)
    );
}

#[test]
fn caesar_verwendet_bekanntes_beispiel() {
    assert_eq!(crypto::caesar::encrypt("ABC", 3).unwrap(), "DEF");
    assert_eq!(crypto::caesar::decrypt("DEF", 3).unwrap(), "ABC");
    assert_eq!(
        crypto::caesar::shifted_alphabet(3).unwrap(),
        "D E F G H I J K L M N O P Q R S T U V W X Y Z A B C"
    );
}

#[test]
fn caesar_roundtrip_erhaelt_den_text() {
    let text = "Hallo Welt! A-Z bleiben prüfbar.";
    let encrypted = crypto::caesar::encrypt(text, 7).unwrap();
    let decrypted = crypto::caesar::decrypt(&encrypted, 7).unwrap();
    assert_eq!(decrypted, text);
}

#[test]
fn caesar_erhaelt_leere_und_unicode_eingaben() {
    for text in ["", "   ", "ÄÖÜ äöü ß 🔐", "Zeile 1\nZeile 2"] {
        for shift in [1, 13, 25] {
            let encrypted = crypto::caesar::encrypt(text, shift).unwrap();
            assert_eq!(crypto::caesar::decrypt(&encrypted, shift).unwrap(), text);
        }
    }
}

#[test]
fn caesar_lehnt_ungueltige_schluessel_ab() {
    assert_eq!(
        crypto::caesar::encrypt("ABC", 0),
        Err(CryptoError::InvalidCaesarShift)
    );
    assert_eq!(
        crypto::caesar::encrypt("ABC", 26),
        Err(CryptoError::InvalidCaesarShift)
    );
}

#[test]
fn skytale_verschluesselt_und_entschluesselt() {
    assert_eq!(
        crypto::skytale::encrypt("HALLO WELT", 4).unwrap(),
        "HOLA TLWLE"
    );

    for columns in [2, 3, 4, 7] {
        let text = "SKYTALE TEST MIT RESTZEILE";
        let encrypted = crypto::skytale::encrypt(text, columns).unwrap();
        assert_eq!(crypto::skytale::decrypt(&encrypted, columns).unwrap(), text);
    }
}

#[test]
fn skytale_lehnt_ungueltige_spaltenzahlen_ab() {
    assert_eq!(
        crypto::skytale::encrypt("ABC", 1),
        Err(CryptoError::InvalidSkytaleColumns)
    );
    assert_eq!(
        crypto::skytale::decrypt("ABC", 31),
        Err(CryptoError::InvalidSkytaleColumns)
    );
}

#[test]
fn skytale_erhaelt_leere_unicode_und_kurze_eingaben() {
    for text in ["", "A", "ÄÖÜ ß 🔐", "Zeile 1\nZeile 2"] {
        for columns in [2, 7, 30] {
            let encrypted = crypto::skytale::encrypt(text, columns).unwrap();
            assert_eq!(crypto::skytale::decrypt(&encrypted, columns).unwrap(), text);
        }
    }
}

#[test]
fn substitution_validiert_das_geheimalphabet() {
    assert!(crypto::substitution::validate_secret_alphabet("QWERTZUIOPASDFGHJKLYXCVBNM").is_ok());
    assert_eq!(
        crypto::substitution::validate_secret_alphabet("ABC"),
        Err(CryptoError::InvalidAlphabetLength)
    );
    assert_eq!(
        crypto::substitution::validate_secret_alphabet("AAAAAAAAAAAAAAAAAAAAAAAAAA"),
        Err(CryptoError::DuplicateAlphabetLetter('A'))
    );
    assert_eq!(
        crypto::substitution::validate_secret_alphabet("BBCDEFGHIJKLMNOPQRSTUVWXYZ"),
        Err(CryptoError::MissingAlphabetLetter('A'))
    );
    assert_eq!(
        crypto::substitution::validate_secret_alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYÄ"),
        Err(CryptoError::InvalidAlphabetCharacter)
    );
    assert_eq!(
        crypto::substitution::validate_secret_alphabet(" qwertzuiopasdfghjklyxcvbnm "),
        Ok("QWERTZUIOPASDFGHJKLYXCVBNM".to_string())
    );
}

#[test]
fn substitution_roundtrip_erhaelt_den_text() {
    let alphabet = "QWERTZUIOPASDFGHJKLYXCVBNM";
    let text = "Angriff um 12 Uhr!";
    let encrypted = crypto::substitution::encrypt(text, alphabet).unwrap();
    assert_eq!(
        crypto::substitution::decrypt(&encrypted, alphabet).unwrap(),
        text
    );
}

#[test]
fn substitution_erhaelt_leere_und_unicode_eingaben() {
    let alphabet = "QWERTZUIOPASDFGHJKLYXCVBNM";
    for text in ["", "   ", "ÄÖÜ äöü ß 🔐", "Zeile 1\nZeile 2"] {
        let encrypted = crypto::substitution::encrypt(text, alphabet).unwrap();
        assert_eq!(
            crypto::substitution::decrypt(&encrypted, alphabet).unwrap(),
            text
        );
    }
}

#[test]
fn substitution_erzeugt_ein_gueltiges_zufallsalphabet() {
    let alphabet = crypto::substitution::random_alphabet().unwrap();
    assert!(crypto::substitution::validate_secret_alphabet(&alphabet).is_ok());
}

#[test]
fn aes_gcm_roundtrip_erhaelt_den_text() {
    let key = crypto::aes::generate_key().unwrap();
    let encrypted = crypto::aes::encrypt("Geheimer Text", &key).unwrap();
    let decrypted = crypto::aes::decrypt(
        &encrypted.ciphertext,
        &key,
        &encrypted.nonce,
        &encrypted.tag,
    )
    .unwrap();

    assert_eq!(decrypted, "Geheimer Text");
    assert_eq!(STANDARD.decode(&key).unwrap().len(), 32);
    assert_eq!(STANDARD.decode(&encrypted.nonce).unwrap().len(), 12);
    assert_eq!(STANDARD.decode(&encrypted.tag).unwrap().len(), 16);
}

#[test]
fn aes_gcm_erhaelt_alle_relevanten_textklassen() {
    assert_aead_roundtrips(
        crypto::aes::generate_key,
        crypto::aes::encrypt,
        crypto::aes::decrypt,
    );
}

#[test]
fn aes_gcm_validiert_base64_und_laengen() {
    assert_aead_rejects_invalid_inputs(
        crypto::aes::generate_key,
        crypto::aes::encrypt,
        crypto::aes::decrypt,
    );
}

#[test]
fn aes_gcm_erkennt_falschen_schluessel_und_manipulation() {
    let key = crypto::aes::generate_key().unwrap();
    let wrong_key = manipulate_base64(&key);
    let encrypted = crypto::aes::encrypt("Manipulationstest", &key).unwrap();

    assert_eq!(
        crypto::aes::decrypt(
            &encrypted.ciphertext,
            &wrong_key,
            &encrypted.nonce,
            &encrypted.tag,
        ),
        Err(CryptoError::AuthenticationFailed)
    );

    assert_eq!(
        crypto::aes::decrypt(&encrypted.ciphertext, &key, "abc", &encrypted.tag),
        Err(CryptoError::InvalidNonce)
    );

    let tampered_ciphertext = manipulate_base64(&encrypted.ciphertext);
    assert_eq!(
        crypto::aes::decrypt(&tampered_ciphertext, &key, &encrypted.nonce, &encrypted.tag,),
        Err(CryptoError::AuthenticationFailed)
    );

    let tampered_nonce = manipulate_base64(&encrypted.nonce);
    assert_eq!(
        crypto::aes::decrypt(&encrypted.ciphertext, &key, &tampered_nonce, &encrypted.tag,),
        Err(CryptoError::AuthenticationFailed)
    );

    let tampered_tag = manipulate_base64(&encrypted.tag);
    assert_eq!(
        crypto::aes::decrypt(&encrypted.ciphertext, &key, &encrypted.nonce, &tampered_tag,),
        Err(CryptoError::AuthenticationFailed)
    );
}

#[test]
fn chacha20_poly1305_roundtrip_erhaelt_den_text() {
    let key = crypto::chacha::generate_key().unwrap();
    let encrypted = crypto::chacha::encrypt("Schneller Geheimtext", &key).unwrap();
    let decrypted = crypto::chacha::decrypt(
        &encrypted.ciphertext,
        &key,
        &encrypted.nonce,
        &encrypted.tag,
    )
    .unwrap();

    assert_eq!(decrypted, "Schneller Geheimtext");
    assert_eq!(STANDARD.decode(&key).unwrap().len(), 32);
    assert_eq!(STANDARD.decode(&encrypted.nonce).unwrap().len(), 12);
    assert_eq!(STANDARD.decode(&encrypted.tag).unwrap().len(), 16);
}

#[test]
fn chacha20_poly1305_erhaelt_alle_relevanten_textklassen() {
    assert_aead_roundtrips(
        crypto::chacha::generate_key,
        crypto::chacha::encrypt,
        crypto::chacha::decrypt,
    );
}

#[test]
fn chacha20_poly1305_validiert_base64_und_laengen() {
    assert_aead_rejects_invalid_inputs(
        crypto::chacha::generate_key,
        crypto::chacha::encrypt,
        crypto::chacha::decrypt,
    );
}

#[test]
fn chacha20_poly1305_erkennt_falschen_schluessel_und_manipulation() {
    let key = crypto::chacha::generate_key().unwrap();
    let wrong_key = manipulate_base64(&key);
    let encrypted = crypto::chacha::encrypt("Manipulationstest", &key).unwrap();

    assert_eq!(
        crypto::chacha::decrypt(
            &encrypted.ciphertext,
            &wrong_key,
            &encrypted.nonce,
            &encrypted.tag,
        ),
        Err(CryptoError::AuthenticationFailed)
    );

    assert_eq!(
        crypto::chacha::decrypt(&encrypted.ciphertext, &key, "abc", &encrypted.tag),
        Err(CryptoError::InvalidNonce)
    );

    let tampered_ciphertext = manipulate_base64(&encrypted.ciphertext);
    assert_eq!(
        crypto::chacha::decrypt(&tampered_ciphertext, &key, &encrypted.nonce, &encrypted.tag,),
        Err(CryptoError::AuthenticationFailed)
    );

    let tampered_nonce = manipulate_base64(&encrypted.nonce);
    assert_eq!(
        crypto::chacha::decrypt(&encrypted.ciphertext, &key, &tampered_nonce, &encrypted.tag,),
        Err(CryptoError::AuthenticationFailed)
    );

    let tampered_tag = manipulate_base64(&encrypted.tag);
    assert_eq!(
        crypto::chacha::decrypt(&encrypted.ciphertext, &key, &encrypted.nonce, &tampered_tag,),
        Err(CryptoError::AuthenticationFailed)
    );
}

#[test]
fn alle_fehler_besitzen_verstaendliche_meldungen() {
    let errors = [
        CryptoError::InvalidCaesarShift,
        CryptoError::InvalidSkytaleColumns,
        CryptoError::InvalidAlphabetLength,
        CryptoError::InvalidAlphabetCharacter,
        CryptoError::DuplicateAlphabetLetter('A'),
        CryptoError::MissingAlphabetLetter('Z'),
        CryptoError::RandomAlphabetUnavailable,
        CryptoError::RandomKeyUnavailable,
        CryptoError::RandomNonceUnavailable,
        CryptoError::InvalidKey,
        CryptoError::InvalidNonce,
        CryptoError::InvalidTag,
        CryptoError::InvalidCiphertextBase64,
        CryptoError::EncryptionFailed,
        CryptoError::IncompleteEncryptionResult,
        CryptoError::AuthenticationFailed,
        CryptoError::InvalidUtf8,
    ];

    for error in errors {
        let message = error.to_string();
        assert!(!message.trim().is_empty());
        assert!(message.ends_with('.'));
    }
}

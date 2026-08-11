use base64::engine::general_purpose::STANDARD;
use base64::Engine;
use krypto_wasm::crypto;
use krypto_wasm::crypto::CryptoError;

/// Ändert ein Byte, ohne Base64-Format oder Länge zu zerstören.
/// So prüfen die AEAD-Tests tatsächlich die Authentifizierung und nicht nur
/// die Eingabevalidierung des Base64-Decoders.
fn manipulate_base64(value: &str) -> String {
    let mut bytes = STANDARD.decode(value).unwrap();
    bytes[0] ^= 0b0000_0001;
    STANDARD.encode(bytes)
}

#[test]
fn caesar_verwendet_bekanntes_beispiel() {
    assert_eq!(crypto::caesar::encrypt("ABC", 3).unwrap(), "DEF");
    assert_eq!(crypto::caesar::decrypt("DEF", 3).unwrap(), "ABC");
}

#[test]
fn caesar_roundtrip_erhaelt_den_text() {
    let text = "Hallo Welt! A-Z bleiben prüfbar.";
    let encrypted = crypto::caesar::encrypt(text, 7).unwrap();
    let decrypted = crypto::caesar::decrypt(&encrypted, 7).unwrap();
    assert_eq!(decrypted, text);
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

use krypto_wasm::crypto;

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
    assert!(crypto::caesar::encrypt("ABC", 0).is_err());
    assert!(crypto::caesar::encrypt("ABC", 26).is_err());
}

#[test]
fn skytale_verschluesselt_und_entschluesselt() {
    assert_eq!(crypto::skytale::encrypt("HALLO WELT", 4).unwrap(), "HOLA TLWLE");

    for columns in [2, 3, 4, 7] {
        let text = "SKYTALE TEST MIT RESTZEILE";
        let encrypted = crypto::skytale::encrypt(text, columns).unwrap();
        assert_eq!(crypto::skytale::decrypt(&encrypted, columns).unwrap(), text);
    }
}

#[test]
fn skytale_lehnt_ungueltige_spaltenzahlen_ab() {
    assert!(crypto::skytale::encrypt("ABC", 1).is_err());
    assert!(crypto::skytale::decrypt("ABC", 31).is_err());
}

#[test]
fn substitution_validiert_das_geheimalphabet() {
    assert!(crypto::substitution::validate_secret_alphabet("QWERTZUIOPASDFGHJKLYXCVBNM").is_ok());
    assert!(crypto::substitution::validate_secret_alphabet("ABC").is_err());
    assert!(crypto::substitution::validate_secret_alphabet("AAAAAAAAAAAAAAAAAAAAAAAAAA").is_err());
}

#[test]
fn substitution_roundtrip_erhaelt_den_text() {
    let alphabet = "QWERTZUIOPASDFGHJKLYXCVBNM";
    let text = "Angriff um 12 Uhr!";
    let encrypted = crypto::substitution::encrypt(text, alphabet).unwrap();
    assert_eq!(crypto::substitution::decrypt(&encrypted, alphabet).unwrap(), text);
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
}

#[test]
fn aes_gcm_erkennt_falschen_schluessel_und_manipulation() {
    let key = crypto::aes::generate_key().unwrap();
    let wrong_key = crypto::aes::generate_key().unwrap();
    let encrypted = crypto::aes::encrypt("Manipulationstest", &key).unwrap();

    assert!(crypto::aes::decrypt(
        &encrypted.ciphertext,
        &wrong_key,
        &encrypted.nonce,
        &encrypted.tag,
    )
    .is_err());

    let mut tampered = encrypted.ciphertext.clone();
    tampered.push('A');
    assert!(crypto::aes::decrypt(&tampered, &key, &encrypted.nonce, &encrypted.tag).is_err());
}

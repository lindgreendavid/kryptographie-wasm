use krypto_wasm::{
    aes_decrypt, aes_encrypt, aes_generate_key, caesar_decrypt, caesar_encrypt,
    caesar_shifted_alphabet, chacha_decrypt, chacha_encrypt, chacha_generate_key, skytale_decrypt,
    skytale_encrypt, skytale_table, substitution_decrypt, substitution_encrypt,
    substitution_random_alphabet, substitution_validate,
};

#[test]
fn klassische_wasm_exports_liefern_erwartete_ergebnisse() {
    assert_eq!(caesar_encrypt("Abc", 3).unwrap(), "Def");
    assert_eq!(caesar_decrypt("Def", 3).unwrap(), "Abc");
    assert!(caesar_shifted_alphabet(3).unwrap().starts_with("D E F"));

    let skytale = skytale_encrypt("WASM Grenze", 4).unwrap();
    assert_eq!(skytale_decrypt(&skytale, 4).unwrap(), "WASM Grenze");
    let table = skytale_table("ABCD", 2).unwrap();
    assert_eq!(table, "[[\"A\",\"B\"],[\"C\",\"D\"]]");

    let alphabet = substitution_random_alphabet().unwrap();
    assert_eq!(
        substitution_validate(&alphabet).unwrap(),
        "Das Geheimalphabet ist gültig."
    );
    let substituted = substitution_encrypt("Abc!", &alphabet).unwrap();
    assert_eq!(
        substitution_decrypt(&substituted, &alphabet).unwrap(),
        "Abc!"
    );
}

#[test]
fn moderne_wasm_exports_bilden_typisierte_aead_ergebnisse_ab() {
    let plaintext = "WASM 🔐 Roundtrip";

    let aes_key = aes_generate_key().unwrap();
    let aes_result = aes_encrypt(plaintext, &aes_key).unwrap();
    assert_eq!(
        aes_decrypt(
            &aes_result.ciphertext(),
            &aes_key,
            &aes_result.nonce(),
            &aes_result.tag(),
        )
        .unwrap(),
        plaintext
    );

    let chacha_key = chacha_generate_key().unwrap();
    let chacha_result = chacha_encrypt(plaintext, &chacha_key).unwrap();
    assert_eq!(
        chacha_decrypt(
            &chacha_result.ciphertext(),
            &chacha_key,
            &chacha_result.nonce(),
            &chacha_result.tag(),
        )
        .unwrap(),
        plaintext
    );
}

/**
 * Liefert ein zwingend vorhandenes DOM-Element.
 *
 * @param {string} id - Eindeutige ID des Elements.
 * @returns {HTMLElement} Das gefundene Element.
 */
export function element(id) {
    const target = document.getElementById(id);
    if (!target) {
        throw new Error(`Erwartetes Seitenelement fehlt: ${id}`);
    }
    return target;
}

/**
 * Liest den Wert eines Formularfelds.

 * @param {string} id - ID des Eingabefelds.
 * @returns {string} Aktueller Feldwert.
 */
export function value(id) {
    const target = element(id);
    if (!(
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
    )) {
        throw new TypeError(`Erwartetes Formularfeld fehlt: ${id}`);
    }
    return target.value;
}

/**
 * Setzt den Wert eines Formularfelds.

 * @param {string} id - ID des Eingabefelds.
 * @param {string} text - Neuer Feldwert.
 * @returns {void}
 */
export function setValue(id, text) {
    const target = element(id);
    if (!(
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
    )) {
        throw new TypeError(`Erwartetes Formularfeld fehlt: ${id}`);
    }
    target.value = text;
}

/**
 * Schreibt Text sicher in ein Ausgabeelement.

 * @param {string} id - ID des Ausgabeelements.
 * @param {string} text - Anzuzeigender Text.
 * @returns {void}
 */
export function setText(id, text) {
    element(id).textContent = text;
}

/**
 * Aktiviert oder deaktiviert eine Schaltfläche während der Initialisierung.
 *
 * @param {string} id - ID der Schaltfläche.
 * @param {boolean} disabled - Gewünschter Deaktivierungszustand.
 * @returns {void}
 */
export function setDisabled(id, disabled) {
    const target = element(id);
    if (!(target instanceof HTMLButtonElement)) {
        throw new TypeError(`Erwartete Schaltfläche fehlt: ${id}`);
    }
    target.disabled = disabled;
}

/**
 * Aktualisiert eine Status- oder Fehlermeldung.

 * @param {string} id - ID des Meldungselements.
 * @param {string} message - Anzuzeigende Meldung.
 * @returns {void}
 */
export function showMessage(id, message) {
    setText(id, message || "");
}

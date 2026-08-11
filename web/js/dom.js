/// Kleine, zentrale DOM-Helfer für alle Verfahrensseiten.

export function element(id) {
    const target = document.getElementById(id);
    if (!target) {
        throw new Error(`Erwartetes Seitenelement fehlt: ${id}`);
    }
    return target;
}

export function value(id) {
    return element(id).value;
}

export function setValue(id, text) {
    element(id).value = text;
}

export function setText(id, text) {
    element(id).textContent = text;
}

export function showMessage(id, message) {
    setText(id, message || "");
}

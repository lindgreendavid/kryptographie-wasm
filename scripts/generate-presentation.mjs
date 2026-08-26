import fs from "node:fs/promises";
import path from "node:path";

const artifactToolSpecifier = process.env.ARTIFACT_TOOL_MODULE ?? "@oai/artifact-tool";
const { Presentation, PresentationFile } = await import(artifactToolSpecifier);

const ROOT = process.env.PROJECT_ROOT
    ? path.resolve(process.env.PROJECT_ROOT)
    : process.cwd();
const OUTPUT = process.env.PRESENTATION_OUTPUT_DIR
    ? path.resolve(process.env.PRESENTATION_OUTPUT_DIR)
    : path.join(ROOT, "docs", "abgabe");
const QA = process.env.PRESENTATION_QA_DIR
    ? path.resolve(process.env.PRESENTATION_QA_DIR)
    : path.join(ROOT, "reports", "presentation", "rendered");
const ASSETS = path.join(ROOT, "reports", "presentation", "screenshots");

const W = 1280;
const H = 720;
const C = {
    bg: "#07111F",
    bg2: "#0C1A2C",
    panel: "#10243A",
    panel2: "#142B44",
    text: "#F7FAFC",
    muted: "#9CB0C5",
    cyan: "#2DD4BF",
    cyanSoft: "#153F45",
    pink: "#F43F8A",
    pinkSoft: "#4B1735",
    amber: "#FBBF24",
    green: "#34D399",
    red: "#FB7185",
    line: "#29435F",
    white: "#FFFFFF",
};

async function writeBlob(filePath, blob) {
    await fs.writeFile(filePath, new Uint8Array(await blob.arrayBuffer()));
}

function box(slide, name, x, y, width, height, options = {}) {
    const geometry = options.geometry ?? "roundRect";
    return slide.shapes.add({
        geometry,
        name,
        position: { left: x, top: y, width, height },
        fill: options.fill ?? C.panel,
        line: {
            style: options.lineStyle ?? "solid",
            fill: options.line ?? C.line,
            width: options.lineWidth ?? 1,
        },
        ...(["rect", "textbox", "roundRect"].includes(geometry)
            ? { borderRadius: options.radius ?? "rounded-xl" }
            : {}),
        ...(options.shadow ? { shadow: options.shadow } : {}),
    });
}

function text(slide, name, value, x, y, width, height, options = {}) {
    const shape = slide.shapes.add({
        geometry: "textbox",
        name,
        position: { left: x, top: y, width, height },
        fill: "none",
        line: { style: "solid", fill: "none", width: 0 },
    });
    shape.text = value;
    shape.text.style = {
        typeface: options.typeface ?? "Aptos",
        fontSize: options.size ?? 24,
        color: options.color ?? C.text,
        bold: options.bold ?? false,
        alignment: options.align ?? "left",
        verticalAlignment: options.valign ?? "top",
        autoFit: options.autoFit ?? "shrinkText",
        wrap: "square",
        lineSpacing: options.lineSpacing ?? 1.05,
        insets: options.insets ?? { top: 0, right: 0, bottom: 0, left: 0 },
    };
    return shape;
}

function pill(slide, name, label, x, y, width, options = {}) {
    const shape = box(slide, name, x, y, width, 34, {
        fill: options.fill ?? C.cyanSoft,
        line: options.line ?? C.cyan,
        radius: "rounded-full",
    });
    shape.text = label;
    shape.text.style = {
        typeface: "Aptos",
        fontSize: options.size ?? 13,
        color: options.color ?? C.cyan,
        bold: true,
        alignment: "center",
        verticalAlignment: "middle",
        autoFit: "shrinkText",
        insets: { top: 0, right: 8, bottom: 0, left: 8 },
    };
    return shape;
}

function accentRule(slide, x, y, width, color = C.cyan) {
    return slide.shapes.add({
        geometry: "line",
        position: { left: x, top: y, width, height: 0 },
        fill: "none",
        line: { style: "solid", fill: color, width: 3 },
    });
}

function addChrome(slide, index, section) {
    slide.background.fill = C.bg;
    pill(slide, `section-${index}`, section.toUpperCase(), 64, 42, 190, {
        size: 12,
    });
    text(slide, `index-${index}`, String(index).padStart(2, "0"), 1170, 44, 46, 24, {
        size: 13,
        color: C.muted,
        bold: true,
        align: "right",
    });
    accentRule(slide, 64, 675, 1152, C.line);
    text(
        slide,
        `footer-${index}`,
        "Kryptographie · Rust + WebAssembly · SoSe 2026",
        64,
        684,
        760,
        18,
        { size: 11, color: C.muted },
    );
}

function heading(slide, index, titleValue, subtitle) {
    text(slide, `title-${index}`, titleValue, 64, 98, 1000, 62, {
        size: 38,
        bold: true,
    });
    if (subtitle) {
        text(slide, `subtitle-${index}`, subtitle, 64, 158, 1080, 42, {
            size: 18,
            color: C.muted,
        });
    }
}

function bullet(slide, name, label, x, y, width, options = {}) {
    slide.shapes.add({
        geometry: "ellipse",
        name: `${name}-dot`,
        position: { left: x, top: y + 8, width: 10, height: 10 },
        fill: options.color ?? C.cyan,
        line: { style: "solid", fill: options.color ?? C.cyan, width: 0 },
    });
    return text(slide, name, label, x + 22, y, width - 22, options.height ?? 44, {
        size: options.size ?? 18,
        color: options.textColor ?? C.text,
        bold: options.bold ?? false,
    });
}

function metricCard(slide, name, value, label, x, y, color) {
    box(slide, `${name}-card`, x, y, 258, 154, {
        fill: C.panel,
        line: color,
        lineWidth: 2,
        shadow: "shadow-sm",
    });
    text(slide, `${name}-value`, value, x + 20, y + 24, 218, 58, {
        size: 38,
        bold: true,
        color,
        align: "center",
    });
    text(slide, `${name}-label`, label, x + 20, y + 92, 218, 40, {
        size: 16,
        color: C.muted,
        align: "center",
    });
}

function addNotes(slide, lines) {
    slide.speakerNotes.textFrame.setText(lines);
    slide.speakerNotes.setVisible(true);
}

async function addImage(slide, fileName, alt, x, y, width, height) {
    const filePath = path.join(ASSETS, fileName);
    const bytes = await fs.readFile(filePath);
    box(slide, `${fileName}-frame`, x - 7, y - 7, width + 14, height + 14, {
        fill: C.panel2,
        line: C.cyan,
        lineWidth: 2,
        radius: "rounded-xl",
        shadow: "shadow-lg",
    });
    slide.images.add({
        blob: bytes,
        contentType: "image/png",
        alt,
        fit: "cover",
        position: { left: x, top: y, width, height },
        geometry: "roundRect",
        borderRadius: "rounded-lg",
    });
}

function addArrow(slide, from, to, options = {}) {
    return slide.shapes.connect(from, to, {
        kind: options.kind ?? "straight",
        fromSide: options.fromSide ?? "right",
        toSide: options.toSide ?? "left",
        line: {
            style: options.style ?? "solid",
            fill: options.color ?? C.cyan,
            width: options.width ?? 2,
        },
        tail: { type: "triangle", width: "sm", length: "sm" },
    });
}

function algorithmCard(slide, name, titleValue, era, x, y, width, color) {
    const card = box(slide, name, x, y, width, 92, {
        fill: C.panel,
        line: color,
        lineWidth: 2,
    });
    text(slide, `${name}-title`, titleValue, x + 18, y + 17, width - 36, 32, {
        size: 22,
        bold: true,
    });
    text(slide, `${name}-era`, era, x + 18, y + 55, width - 36, 20, {
        size: 13,
        color,
        bold: true,
    });
    return card;
}

async function buildDeck() {
    await fs.mkdir(OUTPUT, { recursive: true });
    await fs.mkdir(QA, { recursive: true });

    const presentation = Presentation.create({
        slideSize: { width: W, height: H },
    });
    presentation.theme.colorScheme = {
        name: "Kryptographie Cyber",
        themeColors: {
            accent1: C.cyan,
            accent2: C.pink,
            accent3: C.amber,
            accent4: C.green,
            accent5: "#8B5CF6",
            accent6: C.red,
            bg1: C.bg,
            bg2: C.bg2,
            tx1: C.text,
            tx2: C.muted,
            dk1: "#000000",
            dk2: C.panel,
            lt1: C.white,
            lt2: "#E2E8F0",
            hlink: C.cyan,
            folHlink: C.pink,
        },
    };

    // 1 — Cover
    {
        const slide = presentation.slides.add();
        slide.background.fill = C.bg;
        pill(slide, "cover-course", "FORTGESCHRITTENE PROGRAMMIERUNG", 64, 54, 300);
        text(slide, "cover-title", "Kryptographie\nim Browser", 64, 142, 630, 178, {
            size: 56,
            bold: true,
            lineSpacing: 0.9,
        });
        accentRule(slide, 64, 342, 180, C.pink);
        text(
            slide,
            "cover-subtitle",
            "Fünf Verfahren. Eine Rust-Fachlogik.\nEine kleine WebAssembly-Grenze.",
            64,
            372,
            590,
            88,
            { size: 24, color: C.muted, lineSpacing: 1.08 },
        );

        box(slide, "cover-orbit", 790, 106, 360, 360, {
            geometry: "ellipse",
            fill: C.bg2,
            line: C.cyan,
            lineWidth: 3,
            radius: 0,
        });
        box(slide, "cover-orbit-inner", 856, 172, 228, 228, {
            geometry: "ellipse",
            fill: C.panel,
            line: C.pink,
            lineWidth: 3,
            radius: 0,
        });
        text(slide, "cover-wasm", "WASM", 876, 246, 188, 64, {
            size: 42,
            bold: true,
            color: C.cyan,
            align: "center",
            valign: "middle",
        });
        text(slide, "cover-rust", "RUST", 900, 321, 140, 26, {
            size: 16,
            bold: true,
            color: C.pink,
            align: "center",
        });
        pill(slide, "cover-algos-1", "CAESAR", 738, 492, 120, {
            fill: C.pinkSoft,
            line: C.pink,
            color: C.pink,
        });
        pill(slide, "cover-algos-2", "SKYTALE", 866, 492, 120);
        pill(slide, "cover-algos-3", "AES-GCM", 994, 492, 120, {
            fill: C.pinkSoft,
            line: C.pink,
            color: C.pink,
        });
        pill(slide, "cover-algos-4", "SUBSTITUTION", 802, 540, 150);
        pill(slide, "cover-algos-5", "CHACHA20", 962, 540, 150, {
            fill: C.pinkSoft,
            line: C.pink,
            color: C.pink,
        });
        accentRule(slide, 64, 628, 1152, C.line);
        text(slide, "cover-team", "David Lindgreen · Viktor Edelmann", 64, 648, 540, 24, {
            size: 15,
            color: C.text,
            bold: true,
        });
        text(slide, "cover-meta", "Version 1.2.0 · 23.08.2026", 786, 648, 430, 24, {
            size: 15,
            color: C.muted,
            align: "right",
        });
        addNotes(slide, [
            "In einem Satz: Wir zeigen Kryptographie als interaktive Lernanwendung, deren gesamte Fachlogik in Rust läuft.",
            "Ziel der Präsentation: Architektur, zwei Demo-Flows und messbare Qualität.",
            "Zeit: 0:00–0:35.",
        ]);
    }

    // 2 — Scope
    {
        const slide = presentation.slides.add();
        addChrome(slide, 2, "Problem & Umfang");
        heading(
            slide,
            2,
            "Historische Ideen treffen moderne Integrität",
            "Die Oberfläche macht Unterschiede sichtbar; Rust hält Regeln und Fehler konsistent.",
        );
        text(slide, "scope-historical", "HISTORISCHE LERNVERFAHREN", 64, 224, 520, 28, {
            size: 15,
            bold: true,
            color: C.pink,
        });
        algorithmCard(
            slide,
            "scope-caesar",
            "Caesar",
            "Buchstabenverschiebung",
            64,
            268,
            160,
            C.pink,
        );
        algorithmCard(slide, "scope-skytale", "Skytale", "Transposition", 238, 268, 160, C.pink);
        algorithmCard(
            slide,
            "scope-substitution",
            "Substitution",
            "Permutation",
            412,
            268,
            178,
            C.pink,
        );
        text(slide, "scope-modern", "MODERNE AEAD-VERFAHREN", 676, 224, 520, 28, {
            size: 15,
            bold: true,
            color: C.cyan,
        });
        algorithmCard(
            slide,
            "scope-aes",
            "AES-256-GCM",
            "Verschlüsselung + Authentifizierung",
            676,
            268,
            240,
            C.cyan,
        );
        algorithmCard(slide, "scope-chacha", "ChaCha20", "Poly1305-Tag", 934, 268, 240, C.cyan);

        box(slide, "scope-goal", 64, 420, 1110, 164, {
            fill: C.bg2,
            line: C.line,
            lineWidth: 1,
        });
        pill(slide, "scope-goal-pill", "LERNZIEL", 88, 444, 112, {
            fill: C.cyanSoft,
            line: C.cyan,
            color: C.cyan,
        });
        text(
            slide,
            "scope-goal-text",
            "Ver- und Entschlüsseln nachvollziehen, Eingaben sicher validieren und bei modernen Verfahren Manipulation zuverlässig erkennen.",
            88,
            494,
            1020,
            58,
            { size: 24, bold: true },
        );
        pill(
            slide,
            "scope-boundary",
            "KEIN BACKEND · KEINE DATENBANK · LOKALE VERARBEITUNG",
            730,
            596,
            444,
            {
                fill: C.pinkSoft,
                line: C.pink,
                color: C.pink,
                size: 12,
            },
        );
        addNotes(slide, [
            "Drei historische Verfahren sind bewusst didaktisch und nicht sicher.",
            "AES-GCM und ChaCha20-Poly1305 zeigen zusätzlich Integrität: Manipulation muss scheitern.",
            "Die App arbeitet statisch und lokal im Browser; produktives Schlüsselmanagement ist nicht Teil des Scopes.",
            "Zeit: 0:35–1:10.",
        ]);
    }

    // 3 — Architecture
    {
        const slide = presentation.slides.add();
        addChrome(slide, 3, "Architektur");
        heading(
            slide,
            3,
            "Eine Richtung, eine Fachlogik",
            "Die Browseroberfläche bleibt austauschbar; Rust bleibt nativ testbar.",
        );
        const labels = [
            ["Benutzer", "Eingabe & Aktion", C.pink],
            ["HTML / CSS", "Semantik & UX", C.pink],
            ["JavaScript", "DOM & Zustände", C.amber],
            ["WASM", "16 Exports", C.cyan],
            ["RustCrypto", "Fachlogik", C.cyan],
        ];
        const cards = [];
        labels.forEach(([titleValue, detail, color], i) => {
            const x = 64 + i * 226;
            const card = box(slide, `arch-card-${i}`, x, 250, 186, 126, {
                fill: C.panel,
                line: color,
                lineWidth: 2,
            });
            text(slide, `arch-card-title-${i}`, titleValue, x + 14, 272, 158, 34, {
                size: 21,
                bold: true,
                align: "center",
            });
            text(slide, `arch-card-detail-${i}`, detail, x + 14, 320, 158, 26, {
                size: 14,
                color,
                align: "center",
                bold: true,
            });
            cards.push(card);
        });
        for (let i = 0; i < cards.length - 1; i += 1) {
            addArrow(slide, cards[i], cards[i + 1], {
                color: i < 2 ? C.pink : C.cyan,
            });
        }
        box(slide, "arch-principle", 64, 430, 1090, 132, {
            fill: C.bg2,
            line: C.line,
        });
        bullet(
            slide,
            "arch-bullet-1",
            "JavaScript orchestriert – es implementiert keine Kryptographie doppelt.",
            94,
            456,
            510,
            {
                color: C.amber,
                size: 17,
            },
        );
        bullet(
            slide,
            "arch-bullet-2",
            "Rust validiert Typen, Schlüsselgrößen, Nonces und Tags.",
            94,
            506,
            510,
            {
                color: C.cyan,
                size: 17,
            },
        );
        bullet(
            slide,
            "arch-bullet-3",
            "RustCrypto liefert geprüfte moderne Primitive.",
            626,
            456,
            480,
            {
                color: C.cyan,
                size: 17,
            },
        );
        bullet(
            slide,
            "arch-bullet-4",
            "Fehler werden an der WASM-Grenze verständlich übersetzt.",
            626,
            506,
            480,
            {
                color: C.pink,
                size: 17,
            },
        );
        pill(slide, "arch-tag", "KEIN MOCK IM E2E-PFAD", 922, 584, 232, {
            fill: C.cyanSoft,
            line: C.cyan,
            color: C.cyan,
        });
        addNotes(slide, [
            "Die Abhängigkeit zeigt nur in eine Richtung: UI, JS-Brücke, WASM-Exports, Rust-Domäne.",
            "Der Browser kennt die Implementierung nicht; Rust kennt den DOM nicht.",
            "Dadurch laufen dieselben Regeln nativ in Rust-Tests und im echten Browser-E2E-Pfad.",
            "Zeit: 1:10–1:45.",
        ]);
    }

    // 4 — Demo start
    {
        const slide = presentation.slides.add();
        addChrome(slide, 4, "Live-Demo I");
        heading(
            slide,
            4,
            "Vom Lernverfahren zur modernen Chiffre",
            "Erst einen einfachen Roundtrip zeigen, dann die zusätzliche Sicherheitsdimension.",
        );
        box(slide, "demo1-panel", 64, 230, 316, 350, {
            fill: C.bg2,
            line: C.pink,
            lineWidth: 2,
        });
        pill(slide, "demo1-step", "01 · CAESAR", 88, 254, 140, {
            fill: C.pinkSoft,
            line: C.pink,
            color: C.pink,
        });
        text(slide, "demo1-input", "ABC äöü", 88, 318, 250, 40, {
            size: 28,
            bold: true,
        });
        text(slide, "demo1-arrow", "↓  Schlüssel 3", 88, 372, 250, 32, {
            size: 17,
            color: C.muted,
        });
        text(slide, "demo1-output", "DEF äöü", 88, 422, 250, 40, {
            size: 28,
            bold: true,
            color: C.pink,
        });
        bullet(slide, "demo1-note-1", "ASCII verschiebt sich", 88, 486, 250, {
            color: C.pink,
            size: 16,
            height: 28,
        });
        bullet(slide, "demo1-note-2", "Unicode bleibt erhalten", 88, 524, 250, {
            color: C.cyan,
            size: 16,
            height: 28,
        });
        await addImage(
            slide,
            "startseite.png",
            "Startseite der Kryptographie-Lernanwendung im Cyber-Design",
            420,
            226,
            754,
            424,
        );
        pill(slide, "demo1-live", "LIVE: 35 SEKUNDEN", 944, 610, 210, {
            fill: C.pinkSoft,
            line: C.pink,
            color: C.pink,
        });
        addNotes(slide, [
            "Live zur Caesar-Seite wechseln: Schlüssel 3, Eingabe ABC äöü, verschlüsseln und zurück.",
            "Kurz erklären: Nicht-ASCII-Zeichen bleiben laut dokumentierter Regel unverändert.",
            "Danach direkt AES öffnen; Skytale und Substitution nicht live zeigen.",
            "Zeit: 1:45–2:20.",
        ]);
    }

    // 5 — AES
    {
        const slide = presentation.slides.add();
        addChrome(slide, 5, "Live-Demo II");
        heading(
            slide,
            5,
            "AES-GCM schützt Inhalt und Integrität",
            "Geheimtext, Nonce und Tag werden getrennt sichtbar – die Authentifizierung bleibt gemeinsam.",
        );
        box(slide, "aes-steps", 64, 222, 350, 360, {
            fill: C.bg2,
            line: C.cyan,
            lineWidth: 2,
        });
        const aesSteps = [
            ["1", "32-Byte-Schlüssel erzeugen", C.cyan],
            ["2", "Unicode-Text verschlüsseln", C.cyan],
            ["3", "Roundtrip exakt prüfen", C.green],
            ["4", "Tag verändern → Fehler", C.pink],
        ];
        aesSteps.forEach(([number, label, color], i) => {
            const y = 250 + i * 72;
            box(slide, `aes-step-${i}`, 88, y, 44, 44, {
                geometry: "ellipse",
                fill: color === C.pink ? C.pinkSoft : C.cyanSoft,
                line: color,
                lineWidth: 2,
                radius: 0,
            });
            text(slide, `aes-step-number-${i}`, number, 88, y, 44, 44, {
                size: 19,
                bold: true,
                color,
                align: "center",
                valign: "middle",
            });
            text(slide, `aes-step-label-${i}`, label, 152, y + 8, 226, 34, {
                size: 17,
                bold: true,
            });
        });
        pill(slide, "aes-rule", "MANIPULATION ⇒ KEIN KLARTEXT", 88, 538, 280, {
            fill: C.pinkSoft,
            line: C.pink,
            color: C.pink,
            size: 12,
        });
        await addImage(
            slide,
            "aes-verschluesselt.png",
            "AES-GCM-Verschlüsselungszustand mit Geheimtext, Nonce und Authentifizierungstag",
            456,
            226,
            718,
            404,
        );
        text(
            slide,
            "aes-caption",
            "Echter lokaler Browserlauf · kein Mock · Konsole fehlerfrei",
            456,
            642,
            718,
            22,
            {
                size: 13,
                color: C.muted,
                align: "right",
            },
        );
        addNotes(slide, [
            "Live: Schlüssel erzeugen, vorbereiteten Unicode-/Mehrzeilentext verschlüsseln und entschlüsseln.",
            "Nonce ist pro Verschlüsselung nötig; der Tag prüft Integrität und Authentizität.",
            "Dann ein Zeichen im Tag ändern. Erwartung: verständlicher Fehler und keine Klartextausgabe.",
            "Screenshot ist der geprüfte Offline-Fallback.",
            "Zeit: 2:20–3:50.",
        ]);
    }

    // 6 — Rust/WASM design
    {
        const slide = presentation.slides.add();
        addChrome(slide, 6, "Rust / WASM");
        heading(
            slide,
            6,
            "Typen machen die Grenze explizit",
            "Validierung geschieht einmal in der Domäne; die UI erhält Wertobjekt oder verständlichen Fehler.",
        );
        const types = [
            ["Key32", "32 Byte", C.cyan],
            ["Nonce12", "12 Byte", C.amber],
            ["AuthTag16", "16 Byte", C.pink],
        ];
        const typeCards = [];
        types.forEach(([typeName, size, color], i) => {
            const x = 64 + i * 250;
            const card = box(slide, `type-${i}`, x, 246, 216, 118, {
                fill: C.panel,
                line: color,
                lineWidth: 2,
            });
            text(slide, `type-name-${i}`, typeName, x + 18, 266, 180, 36, {
                size: 24,
                bold: true,
                color,
                align: "center",
            });
            text(slide, `type-size-${i}`, size, x + 18, 316, 180, 24, {
                size: 16,
                color: C.muted,
                align: "center",
            });
            typeCards.push(card);
        });
        const errorCard = box(slide, "type-error", 864, 246, 310, 118, {
            fill: C.pinkSoft,
            line: C.pink,
            lineWidth: 2,
        });
        text(slide, "type-error-title", "CryptoError", 888, 266, 262, 36, {
            size: 24,
            bold: true,
            color: C.pink,
            align: "center",
        });
        text(slide, "type-error-detail", "Parameter · Base64 · UTF-8 · Auth", 888, 316, 262, 24, {
            size: 14,
            color: C.text,
            align: "center",
        });
        addArrow(slide, typeCards[2], errorCard, { color: C.pink });

        box(slide, "rust-code", 64, 424, 704, 162, {
            fill: "#06101B",
            line: C.line,
        });
        text(
            slide,
            "rust-code-text",
            "#![forbid(unsafe_code)]\n#![deny(missing_docs)]\n\nWasmAeadResult { ciphertext, nonce, tag }",
            90,
            446,
            650,
            122,
            { size: 19, typeface: "Cascadia Mono", color: C.cyan, lineSpacing: 1.06 },
        );
        box(slide, "rust-facts", 800, 424, 374, 162, {
            fill: C.bg2,
            line: C.cyan,
        });
        bullet(slide, "rust-fact-1", "16 dokumentierte WASM-Exports", 824, 448, 320, {
            color: C.cyan,
            size: 16,
            height: 28,
        });
        bullet(slide, "rust-fact-2", "RustCrypto statt eigener Primitive", 824, 492, 320, {
            color: C.green,
            size: 16,
            height: 28,
        });
        bullet(slide, "rust-fact-3", "Base64 nur als Darstellung", 824, 536, 320, {
            color: C.amber,
            size: 16,
            height: 28,
        });
        addNotes(slide, [
            "Key32, Nonce12 und AuthTag16 kapseln Größenprüfungen und verhindern verteilte Stringvalidierung.",
            "CryptoError trennt Eingabe-, Encoding- und Authentifizierungsfehler.",
            "Moderne Primitive werden nicht selbst implementiert; NIST- und RFC-Vektoren prüfen die Einbindung.",
            "Zeit: 3:50–4:40.",
        ]);
    }

    // 7 — Quality
    {
        const slide = presentation.slides.add();
        addChrome(slide, 7, "Qualität");
        heading(
            slide,
            7,
            "Qualität ist ein ausführbarer Nachweis",
            "Der finale Stand wurde lokal als Release-Build und im echten Browser geprüft.",
        );
        metricCard(slide, "metric-rust", "27 / 27", "Rust-Tests", 64, 236, C.cyan);
        metricCard(slide, "metric-e2e", "18 / 18", "Browser + WCAG", 350, 236, C.pink);
        metricCard(slide, "metric-coverage", "98,82 %", "Rust Lines", 636, 236, C.green);
        metricCard(slide, "metric-lighthouse", "100 × 4", "Lighthouse", 922, 236, C.amber);

        box(slide, "quality-gates", 64, 432, 1116, 142, {
            fill: C.bg2,
            line: C.line,
        });
        text(slide, "quality-gates-title", "FINALER QUALITÄTSPFAD", 90, 454, 260, 24, {
            size: 14,
            bold: true,
            color: C.muted,
        });
        const gates = [
            "rustfmt",
            "Clippy",
            "Rustdoc",
            "Coverage",
            "Prettier",
            "ESLint",
            "Typecheck",
            "WASM",
            "E2E",
            "axe",
            "Lighthouse",
            "audit",
        ];
        gates.forEach((gate, i) => {
            const row = i < 6 ? 0 : 1;
            const col = i % 6;
            pill(slide, `gate-${i}`, `✓ ${gate}`, 90 + col * 170, 492 + row * 44, 148, {
                fill: C.cyanSoft,
                line: C.green,
                color: C.green,
                size: 12,
            });
        });
        pill(slide, "quality-zero", "0 bekannte npm-Schwachstellen", 874, 600, 306, {
            fill: C.cyanSoft,
            line: C.green,
            color: C.green,
        });
        addNotes(slide, [
            "Nicht nur Tests nennen, sondern die Testebenen erklären: bekannte Vektoren, Negativfälle, reale Browserflows und WCAG.",
            "Coverage ist hoch, aber kein Sicherheitsbeweis; sie ergänzt die fachlich gewählten Fälle.",
            "Lighthouse erreichte auf Startseite und AES jeweils 100 in allen vier Kategorien.",
            "Zeit: 4:40–5:30.",
        ]);
    }

    // 8 — Process and limits
    {
        const slide = presentation.slides.add();
        addChrome(slide, 8, "Prozess & Grenzen");
        heading(
            slide,
            8,
            "Vorschläge werden erst durch Gates zu Ergebnissen",
            "Specs und messbare Akzeptanzkriterien halten Code, Dokumentation und KI-Nutzung überprüfbar.",
        );
        const stages = ["Anforderung", "Spec", "Test", "Implementierung", "Gate"];
        const stageCards = stages.map((stage, i) => {
            const x = 64 + i * 226;
            const card = box(slide, `process-${i}`, x, 234, 186, 72, {
                fill: i === 4 ? C.cyanSoft : C.panel,
                line: i === 4 ? C.green : C.line,
                lineWidth: i === 4 ? 2 : 1,
            });
            text(slide, `process-label-${i}`, stage, x + 12, 252, 162, 36, {
                size: 17,
                bold: true,
                color: i === 4 ? C.green : C.text,
                align: "center",
                valign: "middle",
            });
            return card;
        });
        for (let i = 0; i < stageCards.length - 1; i += 1) {
            addArrow(slide, stageCards[i], stageCards[i + 1], {
                color: i === 3 ? C.green : C.cyan,
            });
        }

        box(slide, "process-ai", 64, 360, 536, 236, {
            fill: C.bg2,
            line: C.cyan,
            lineWidth: 2,
        });
        pill(slide, "process-ai-pill", "KI KONTROLLIERT", 88, 384, 170);
        bullet(
            slide,
            "process-ai-1",
            "wasm-pack 0.15 scheiterte → 0.14 reproduzierbar gepinnt",
            88,
            438,
            476,
            {
                color: C.cyan,
                size: 16,
                height: 44,
            },
        );
        bullet(
            slide,
            "process-ai-2",
            "ARM-Coveragefehler → dokumentierter x86_64-Fallback",
            88,
            492,
            476,
            {
                color: C.green,
                size: 16,
                height: 44,
            },
        );
        bullet(
            slide,
            "process-ai-3",
            "Lighthouse-Paket mit Auditfunden → direkter Runner",
            88,
            546,
            476,
            {
                color: C.amber,
                size: 16,
                height: 36,
            },
        );

        box(slide, "process-limits", 638, 360, 536, 236, {
            fill: C.bg2,
            line: C.pink,
            lineWidth: 2,
        });
        pill(slide, "process-limits-pill", "BEWUSSTE GRENZEN", 662, 384, 186, {
            fill: C.pinkSoft,
            line: C.pink,
            color: C.pink,
        });
        bullet(
            slide,
            "process-limit-1",
            "Lehrdemo, kein produktives Schlüsselmanagement",
            662,
            438,
            476,
            {
                color: C.pink,
                size: 16,
                height: 40,
            },
        );
        bullet(
            slide,
            "process-limit-2",
            "historische Verfahren sind ausdrücklich unsicher",
            662,
            490,
            476,
            {
                color: C.pink,
                size: 16,
                height: 40,
            },
        );
        bullet(
            slide,
            "process-limit-3",
            "kein vollständiges Sicherheitsaudit oder Backend",
            662,
            542,
            476,
            {
                color: C.pink,
                size: 16,
                height: 40,
            },
        );
        addNotes(slide, [
            "KI half bei Struktur, Reviews, Tests und Dokumentation, aber Vorschläge wurden nie ungeprüft übernommen.",
            "Zwei konkrete Korrekturen nennen: Toolchain-Pin und Coverage-Fallback oder Lighthouse-Runner.",
            "Grenzen offen benennen: Lehrdemo, sichtbare Schlüssel, keine Persistenz, kein Sicherheitsaudit.",
            "Zeit: 5:30–6:45.",
        ]);
    }

    // 9 — Close
    {
        const slide = presentation.slides.add();
        slide.background.fill = C.bg;
        pill(slide, "close-pill", "FAZIT", 64, 52, 112);
        text(
            slide,
            "close-title",
            "Eine Fachlogik.\nKleine Grenze.\nMessbare Qualität.",
            64,
            138,
            660,
            220,
            {
                size: 50,
                bold: true,
                lineSpacing: 0.92,
            },
        );
        accentRule(slide, 64, 390, 180, C.pink);
        text(
            slide,
            "close-subtitle",
            "Rust + WebAssembly machen die Kryptographie im Browser nachvollziehbar – und testbar.",
            64,
            424,
            650,
            84,
            {
                size: 23,
                color: C.muted,
                lineSpacing: 1.05,
            },
        );

        const pillars = [
            ["01", "Fachlich", "5 Verfahren", C.pink],
            ["02", "Architektonisch", "16 WASM-Exports", C.cyan],
            ["03", "Nachgewiesen", "45 grüne Tests", C.green],
        ];
        pillars.forEach(([number, titleValue, detail, color], i) => {
            const y = 136 + i * 142;
            box(slide, `close-card-${i}`, 798, y, 376, 112, {
                fill: C.panel,
                line: color,
                lineWidth: 2,
            });
            text(slide, `close-number-${i}`, number, 820, y + 24, 52, 38, {
                size: 20,
                bold: true,
                color,
            });
            text(slide, `close-card-title-${i}`, titleValue, 884, y + 20, 254, 32, {
                size: 22,
                bold: true,
            });
            text(slide, `close-card-detail-${i}`, detail, 884, y + 60, 254, 25, {
                size: 15,
                color: C.muted,
            });
        });
        pill(slide, "close-questions", "FRAGEN?", 934, 586, 240, {
            fill: C.pinkSoft,
            line: C.pink,
            color: C.pink,
            size: 18,
        });
        accentRule(slide, 64, 640, 1110, C.line);
        text(
            slide,
            "close-repo",
            "github.com/lindgreendavid/kryptographie-wasm",
            64,
            654,
            700,
            24,
            {
                size: 14,
                color: C.cyan,
            },
        );
        text(slide, "close-thanks", "Vielen Dank", 930, 654, 244, 24, {
            size: 14,
            color: C.text,
            bold: true,
            align: "right",
        });
        addNotes(slide, [
            "Schlusssatz: Eine einzige Fachlogik, eine kleine WASM-Grenze und ausführbare Qualitätsnachweise machen das Projekt nachvollziehbar.",
            "Zur Fragerunde überleiten.",
            "Zeit: 6:45–7:00.",
        ]);
    }

    for (const [index, slide] of presentation.slides.items.entries()) {
        const stem = `slide-${String(index + 1).padStart(2, "0")}`;
        await writeBlob(
            path.join(QA, `${stem}.png`),
            await presentation.export({ slide, format: "png", scale: 1 }),
        );
        const layout = await slide.export({ format: "layout" });
        await fs.writeFile(path.join(QA, `${stem}.layout.json`), await layout.text());
    }

    await writeBlob(
        path.join(QA, "montage.webp"),
        await presentation.export({
            format: "webp",
            montage: true,
            scale: 1,
        }),
    );

    const snapshot = await presentation.inspect({
        kind: "slide,textbox,shape,image,notes",
        maxChars: 20000,
    });
    await fs.writeFile(path.join(QA, "deck-inspect.ndjson"), snapshot.ndjson);

    const pptxPath = path.join(OUTPUT, "Praesentation-Kryptographie-WASM.pptx");
    const pptx = await PresentationFile.exportPptx(presentation);
    await pptx.save(pptxPath);
    const adapterInspectPath = `${pptxPath}.inspect.ndjson`;
    const qaInspectPath = path.join(QA, "powerpoint-export-inspect.ndjson");
    try {
        await fs.rm(qaInspectPath, { force: true });
        await fs.rename(adapterInspectPath, qaInspectPath);
    } catch (error) {
        if (error?.code !== "ENOENT") {
            throw error;
        }
    }

    return {
        pptxPath,
        montagePath: path.join(QA, "montage.webp"),
        slideCount: presentation.slides.items.length,
    };
}

export const presentationResult = await buildDeck();

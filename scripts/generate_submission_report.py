"""Erzeugt den finalen Projektbericht konsistent als DOCX und PDF."""

from __future__ import annotations

from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfgen import canvas as pdf_canvas
from reportlab.platypus import (
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


PROJECT_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = PROJECT_ROOT / "docs" / "abgabe"
DOCX_PATH = OUTPUT_DIR / "Projektbericht-Kryptographie-WASM.docx"
PDF_PATH = OUTPUT_DIR / "Projektbericht-Kryptographie-WASM.pdf"

NAVY = "17324D"
BLUE = "16697A"
TEAL = "38A3A5"
LIGHT_BLUE = "E8F3F5"
PALE = "F4F7F9"
DARK = "1F2933"
MUTED = "5C6773"
WHITE = "FFFFFF"
GREEN = "2E7D32"
AMBER = "8A5A00"


PAGES = [
    {
        "title": "Anforderungen & Ziele",
        "kicker": "01 · Themensteckbrief",
        "lead": (
            "Die Webanwendung macht drei historische und zwei moderne Kryptographieverfahren "
            "direkt vergleichbar. Jede Seite führt Klartext → Geheimtext → Klartext über dieselbe "
            "Rust-Fachlogik aus."
        ),
        "table": {
            "headers": ["Aspekt", "Finaler Stand"],
            "rows": [
                ["Zielgruppe", "Studierende und Lehrende mit Bedarf an einer interaktiven Lernansicht"],
                ["Kernumfang", "Caesar, Skytale, Substitution, AES-256-GCM, ChaCha20-Poly1305"],
                ["Fokus", "Rust/WASM, klare Schichten, Barrierefreiheit und messbare Qualität"],
                ["Betrieb", "statische Mehrseiten-App; kein Backend, keine Datenbank, keine Konten"],
                ["Erfolg", "alle fünf Roundtrips über reales WASM; vollständiger Quality Gate grün"],
            ],
            "widths": [1.35, 5.15],
        },
        "bullets_title": "Qualitätsziele",
        "bullets": [
            "Korrektheit durch bekannte Beispiele, offizielle Vektoren und Negativtests.",
            "Wartbarkeit durch Format, Lint, Typecheck, Clippy und fehlende Rustdoc als Fehler.",
            "Rust-Zeilenabdeckung mindestens 85 %; gemessen wurden 98,82 %.",
            "Automatisierbare WCAG-A/AA-Regeln auf 6 Seiten × 3 Ansichten ohne Verstoß.",
        ],
        "callout": (
            "Scope-Entscheidung: lieber fünf Verfahren vollständig und nachweisbar als zusätzliche "
            "Features ohne belastbare Tests, Dokumentation und Demozeit."
        ),
    },
    {
        "title": "Systemarchitektur",
        "kicker": "02 · Bausteinsicht",
        "lead": (
            "Die Architektur trennt Browserdarstellung, Integrationscode und Fachlogik. "
            "JavaScript implementiert kein Kryptographieverfahren; Rust greift nicht auf den DOM zu."
        ),
        "flow": ["HTML / CSS", "ES-Module", "wasm-bindgen", "Rust-Domäne", "RustCrypto"],
        "table": {
            "headers": ["Baustein", "Verantwortung", "Bewusste Grenze"],
            "rows": [
                ["web/*.html", "Semantik, Eingaben, Ausgaben, Navigation", "keine Kryptoregeln"],
                ["web/js/*.js", "WASM laden, DOM binden, Status anzeigen", "keine Algorithmen"],
                ["src/lib.rs", "16 dokumentierte Exports, Fehlermapping", "kein DOM"],
                ["src/crypto/", "Verfahren, Validierung, Fehlerdomäne", "keine Darstellung"],
                ["tests/ + e2e/", "Core-, API-, Browser- und WCAG-Nachweis", "kein Security-Audit"],
            ],
            "widths": [1.25, 3.25, 2.0],
        },
        "callout": (
            "Architekturgewinn: Eine fachliche Quelle verhindert widersprüchliche JavaScript- und "
            "Rust-Implementierungen und hält die WASM-Grenze erklärbar."
        ),
    },
    {
        "title": "Frontend & User Experience",
        "kicker": "03 · Sechs direkt adressierbare Seiten",
        "lead": (
            "Normale Links ersetzen bewusst ein SPA-Routing. Das kleine Frontend bleibt ohne "
            "Framework lesbar, robust und zugänglich; ausschließlich die Ansicht wird lokal gespeichert."
        ),
        "bullets_title": "Bedien- und Zustandskonzept",
        "bullets": [
            "Hell, Dunkel und Cyber werden fehlertolerant über localStorage persistiert.",
            "Verfahrensbuttons sind bis zum erfolgreichen WASM-Start deaktiviert.",
            "Lade- und Fehlermeldungen erscheinen in Live-Regionen; Fehler bleiben sichtbar.",
            "Alle Eingabe- und Ausgabefelder besitzen sichtbare Labels.",
            "Sprunglink, aria-current, Fokusrahmen und semantische main/output-Elemente.",
        ],
        "table": {
            "headers": ["Prüfung", "Scope", "Ergebnis"],
            "rows": [
                ["Responsive", "alle 6 Seiten bei 390 px", "kein horizontaler Dokument-Overflow"],
                ["Tastatur", "Navigation und Sprunglink", "Fokus erreicht Hauptinhalt"],
                ["WCAG", "6 Seiten × 3 Ansichten", "0 automatisierbare A/AA-Verstöße"],
                ["Console", "alle Seiten", "0 Fehler"],
                ["Lighthouse", "Startseite + AES, Desktop", "je 100 / 100 / 100 / 100"],
            ],
            "widths": [1.35, 2.4, 2.75],
        },
        "callout": (
            "Transparente Grenze: Axe ersetzt keine vollständige Screenreader- oder Mehrbrowserprüfung."
        ),
    },
    {
        "title": "Rust-Fachlogik & Kryptographie",
        "kicker": "04 · Eine getestete Domäne",
        "lead": (
            "Historische Verfahren werden didaktisch selbst formuliert. Moderne Primitive werden "
            "nicht selbst entwickelt, sondern aus RustCrypto eingebunden und mit offiziellen Vektoren geprüft."
        ),
        "table": {
            "headers": ["Verfahren", "Kernregel", "Sicherheitsstatus"],
            "rows": [
                ["Caesar", "ASCII-Buchstaben verschieben; andere Zeichen erhalten", "historisch"],
                ["Skytale", "Unicode-Zeichen transponieren; Restzeilen rekonstruieren", "historisch"],
                ["Substitution", "Permutation von genau 26 eindeutigen A–Z", "historisch"],
                ["AES-256-GCM", "32-B-Key, 12-B-Nonce, 16-B-Tag", "modernes AEAD"],
                ["ChaCha20-Poly1305", "32-B-Key, 12-B-Nonce, 16-B-Tag", "modernes AEAD"],
            ],
            "widths": [1.55, 3.65, 1.3],
        },
        "bullets_title": "Domänenhärtung",
        "bullets": [
            "Key32, Nonce12 und AuthTag16 validieren binäre Größen an einer zentralen Grenze.",
            "CryptoError trennt Parameter-, Base64-, UTF-8- und Authentifizierungsfehler.",
            "Bei falschem Schlüssel oder Manipulation wird kein Klartext freigegeben.",
            "#![forbid(unsafe_code)] und #![deny(missing_docs)] erzwingen überprüfbare Regeln.",
            "NIST AES-256-GCM und RFC 8439 ChaCha20-Poly1305 dienen als Known-Answer-Tests.",
        ],
        "callout": (
            "Sicherheitsgrenze: Die Demo zeigt Schlüssel im Browser und besitzt kein produktives "
            "Key-Management oder garantiertes Nonce-Register."
        ),
    },
    {
        "title": "WASM-Integration",
        "kicker": "05 · Frontend ↔ Systemnah",
        "lead": (
            "wasm-bindgen bildet die kleine öffentliche API ab. Strings passieren die Grenze als "
            "UTF-8; AEAD-Ergebnisse besitzen typisierte Felder für Geheimtext, Nonce und Tag."
        ),
        "flow": ["Eingabe", "JS-Ereignis", "WASM-Export", "Rust Result", "Ausgabe / Fehler"],
        "table": {
            "headers": ["Grenzobjekt", "Form", "Begründung"],
            "rows": [
                ["Text", "UTF-8 String", "erhält Umlaute, ß, Emoji und Zeilenumbrüche"],
                ["AEAD-Schlüssel", "Base64 String → Key32", "binär transportierbar, Größe in Rust geprüft"],
                ["Nonce / Tag", "Base64 → Nonce12 / AuthTag16", "Rollen sichtbar und eindeutig"],
                ["Ergebnis", "WasmAeadResult", "keine untypisierte JSON-Zwischenlösung"],
                ["Fehler", "CryptoError → JS Error", "fachlich strukturiert, deutsch dargestellt"],
            ],
            "widths": [1.45, 2.0, 3.05],
        },
        "bullets_title": "Integrationsnachweis",
        "bullets": [
            "Playwright verwendet das reale Release-WASM und keine Mocks.",
            "Roundtrips aller fünf Verfahren laufen durch DOM, Bindings und Rust zurück.",
            "Tagmanipulation wird bei AES und ChaCha im Browser als Authentifizierungsfehler sichtbar.",
        ],
    },
    {
        "title": "Tooling, Build & CI/CD",
        "kicker": "06 · Reproduzierbarer Qualitätsweg",
        "lead": (
            "Lockfiles und feste Toolversionen verbinden lokale Skripte mit GitHub Actions. "
            "Der Pages-Workflow baut dasselbe statische web/-Artefakt, das lokal geprüft wird."
        ),
        "flow": ["Format / Lint", "Rust Test / Docs", "Coverage", "WASM Build", "E2E / Lighthouse"],
        "table": {
            "headers": ["Gate", "Befehl", "Abbruchkriterium"],
            "rows": [
                ["Webqualität", "format:check · lint · typecheck", "jeder Fehler blockiert"],
                ["Rustqualität", "fmt · clippy -D warnings · rustdoc", "jeder Fehler blockiert"],
                ["Coretests", "cargo test --locked", "27 Tests müssen bestehen"],
                ["Coverage", "coverage:rust:check", "Lines ≥ 85 %"],
                ["Integration", "build · verify:web · test:e2e", "Build / 18 Tests müssen bestehen"],
                ["Audit", "lighthouse", "P/A/BP/SEO ≥ 90; A = 100"],
            ],
            "widths": [1.3, 2.65, 2.55],
        },
        "callout": (
            "Release-Automation ist absichtlich manuell: Sie taggt nur den aktuellen geprüften Stand "
            "und erzeugt keine künstlichen historischen Tags."
        ),
    },
    {
        "title": "Tests & Messergebnisse",
        "kicker": "07 · Finaler lokaler Lauf · 23.08.2026",
        "lead": (
            "Die Testpyramide kombiniert günstige native Coretests mit wenigen, aber vollständigen "
            "Browserflows. Prozentwerte werden nur zusammen mit Testinhalt und Messbedingung bewertet."
        ),
        "metrics": [
            ("27/27", "Rust-Tests"),
            ("18/18", "Browser/WCAG"),
            ("98,82 %", "Lines Coverage"),
            ("100", "Lighthouse A11y"),
        ],
        "table": {
            "headers": ["Ebene", "Schwerpunkte", "Ergebnis"],
            "rows": [
                ["Rust Unit/Integration", "Beispiele, Roundtrips, Grenzen, Manipulation", "27 bestanden"],
                ["Known-Answer", "NIST AES-256-GCM, RFC 8439", "bytegenau bestanden"],
                ["WASM/API", "16 Exports und typisierte AEAD-Felder", "bestanden"],
                ["Playwright", "5 Roundtrips, Fehler, State, Mobile, Console", "18 bestanden"],
                ["axe", "6 Seiten × 3 Themes, WCAG A/AA", "0 Verstöße"],
                ["Lighthouse Desktop", "Startseite und AES", "zweimal 100/100/100/100"],
            ],
            "widths": [1.35, 3.45, 1.7],
        },
        "callout": (
            "Coverage: 95,99 % Regions · 97,62 % Functions · 98,82 % Lines. "
            "Windows ARM nutzt wegen eines LLVM-Profilfehlers einen dokumentierten x86_64-Mess-Fallback."
        ),
    },
    {
        "title": "Quellcode, Artefakte & Sicherheit",
        "kicker": "08 · Messbarer Scope",
        "lead": (
            "Die Metriken trennen Produktionscode, Tests und generierte Artefakte. "
            "node_modules, target und web/pkg werden nicht als Eigenleistung gezählt."
        ),
        "table": {
            "headers": ["Kennzahl", "Wert", "Einordnung"],
            "rows": [
                ["Rust src", "10 Dateien / 937 Zeilen", "Fachlogik und modulnahe Tests"],
                ["Rust Integration", "2 Dateien / 468 Zeilen", "öffentliche API und Fehlerfälle"],
                ["JavaScript", "9 Dateien / 589 Zeilen", "DOM, Theme und WASM-Brücke"],
                ["E2E", "1 Datei / 170 Zeilen", "reale Browser-/WCAG-Flows"],
                ["WASM-API", "16 Exports / 0 unsafe", "kleine kontrollierte Grenze"],
                ["WASM Release", "87.993 B roh / 35.663 B gzip", "opt-level s + LTO + wasm-opt"],
                ["JS-Bindings", "26.535 B roh / 4.583 B gzip", "generierter Glue Code"],
            ],
            "widths": [1.45, 1.75, 3.3],
        },
        "bullets_title": "Sicherheitsmaßnahmen",
        "bullets": [
            "RustCrypto statt eigener moderner Primitive; NIST-/RFC-Nachweis.",
            "Cargo-/npm-Lockfiles, npm audit ohne bekannte Schwachstellen.",
            "RustSec, Dependabot und SHA-gepinnte GitHub Actions.",
            "Keine Secrets, keine Persistenz von Texten oder Schlüsseln, kein Backendtransfer.",
        ],
    },
    {
        "title": "Prozess, KI & Kapazität",
        "kicker": "09 · Spec-driven und transparent",
        "lead": (
            "Der Prozess folgt Verstehen → Spezifizieren → Implementieren → Testen → Dokumentieren. "
            "KI-Vorschläge wurden als Hypothesen behandelt und mussten ausführbare Gates bestehen."
        ),
        "table": {
            "headers": ["Arbeitspaket", "Plan Team-h", "Ist"],
            "rows": [
                ["Anforderungen, Specs und Planung", "10", "durch Team ergänzen"],
                ["Frontend und UX", "16", "durch Team ergänzen"],
                ["Rust-/WASM-Fachlogik", "24", "durch Team ergänzen"],
                ["Integration und Fehlerbehandlung", "10", "durch Team ergänzen"],
                ["Tests, Tooling und CI", "12", "durch Team ergänzen"],
                ["Dokumentation und Präsentation", "8", "durch Team ergänzen"],
                ["Gesamt", "80", "nicht nachträglich erfunden"],
            ],
            "widths": [3.45, 1.15, 1.9],
        },
        "bullets_title": "Belegte KI-Korrekturen",
        "bullets": [
            "verwundbares Zusatzpaket entfernt; direkter Lighthouse-Runner eingesetzt;",
            "nicht installierbares wasm-pack 0.15 verworfen; funktionierende 0.14.0 gepinnt;",
            "ARM-Coveragefehler über dokumentierten x86_64-Fallback gekapselt;",
            "Playwright-Parallelität reduziert und echte WASM-Ladezustände ergänzt.",
        ],
        "callout": (
            "Offener Eigentümerpunkt: David und Viktor müssen reale Ist-Stunden aus ihren "
            "Aufzeichnungen ergänzen. Datei- oder Git-Zeitstempel wären kein seriöser Ersatz."
        ),
    },
    {
        "title": "Fazit, Grenzen & Abgabe",
        "kicker": "10 · Konsistenter finaler Stand",
        "lead": (
            "Der technische Scope ist vollständig umgesetzt und durch unabhängige Ebenen belegt. "
            "Die Architektur bleibt klein genug, um in der siebenminütigen Präsentation erklärt zu werden."
        ),
        "table": {
            "headers": ["Prüffrage", "Status"],
            "rows": [
                ["Alle Muss-Anforderungen umgesetzt?", "Ja · Anforderungs- und Nachweismatrix"],
                ["Dokument passt zum Code?", "Ja · Messstand 23.08.2026"],
                ["Build und Start reproduzierbar?", "Ja · npm/Cargo-Lockfiles und Skripte"],
                ["Linter, Tests, Coverage, E2E grün?", "Ja · lokale Reports und CI-Gates"],
                ["WASM real im Browser getestet?", "Ja · Playwright ohne Mocks"],
                ["Einschränkungen transparent?", "Ja · Scope, Bedrohungsmodell, offene Ist-Zeiten"],
            ],
            "widths": [3.5, 3.0],
        },
        "bullets_title": "Vor dem Upload noch durch das Team",
        "bullets": [
            "reale Ist-Stunden ergänzen und Bericht erneut erzeugen;",
            "finalen Commit/Tag und Deployment-Stand eintragen;",
            "Working-Code-ZIP ohne Dependencies/Buildverzeichnisse testweise neu bauen;",
            "zwei gestoppte Präsentationsproben und Technik-Check durchführen;",
            "Bericht, Code und Präsentation bis 26.08.2026, 14:30 Uhr hochladen.",
        ],
        "callout": (
            "Kernaussage: fünf Verfahren, eine Rust-Fachlogik, eine kleine WASM-Grenze und "
            "nachweisbare Qualität statt unbelegter Vollständigkeitsbehauptungen."
        ),
    },
]


def set_cell_shading(cell, fill: str) -> None:
    """Setzt die Hintergrundfarbe einer DOCX-Tabellenzelle."""
    properties = cell._tc.get_or_add_tcPr()
    shading = properties.find(qn("w:shd"))
    if shading is None:
        shading = OxmlElement("w:shd")
        properties.append(shading)
    shading.set(qn("w:fill"), fill)


def set_cell_margins(cell, top=80, start=100, bottom=80, end=100) -> None:
    """Setzt kompakte, einheitliche Zellränder in Twips."""
    properties = cell._tc.get_or_add_tcPr()
    margins = properties.first_child_found_in("w:tcMar")
    if margins is None:
        margins = OxmlElement("w:tcMar")
        properties.append(margins)
    for name, value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = margins.find(qn(f"w:{name}"))
        if node is None:
            node = OxmlElement(f"w:{name}")
            margins.append(node)
        node.set(qn("w:w"), str(value))
        node.set(qn("w:type"), "dxa")


def set_repeat_table_header(row) -> None:
    """Markiert eine Tabellenzeile als wiederholte Kopfzeile."""
    properties = row._tr.get_or_add_trPr()
    repeat = OxmlElement("w:tblHeader")
    repeat.set(qn("w:val"), "true")
    properties.append(repeat)


def add_page_number(paragraph) -> None:
    """Fügt ein dynamisches PAGE-Feld ein."""
    paragraph.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run = paragraph.add_run("Seite ")
    run.font.size = Pt(8)
    begin = OxmlElement("w:fldChar")
    begin.set(qn("w:fldCharType"), "begin")
    instruction = OxmlElement("w:instrText")
    instruction.set(qn("xml:space"), "preserve")
    instruction.text = " PAGE "
    end = OxmlElement("w:fldChar")
    end.set(qn("w:fldCharType"), "end")
    run._r.append(begin)
    run._r.append(instruction)
    run._r.append(end)


def add_docx_table(document: Document, specification: dict) -> None:
    """Erzeugt eine formatierte Tabelle aus einer Spezifikation."""
    headers = specification["headers"]
    rows = specification["rows"]
    widths = specification["widths"]
    table = document.add_table(rows=1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    table.style = "Table Grid"
    for index, header in enumerate(headers):
        cell = table.rows[0].cells[index]
        cell.width = Inches(widths[index])
        cell.text = header
        set_cell_shading(cell, NAVY)
        set_cell_margins(cell)
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        paragraph = cell.paragraphs[0]
        paragraph.paragraph_format.space_after = Pt(0)
        for run in paragraph.runs:
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)
            run.font.size = Pt(8.5)
    set_repeat_table_header(table.rows[0])

    for row_index, values in enumerate(rows):
        cells = table.add_row().cells
        for index, value in enumerate(values):
            cells[index].width = Inches(widths[index])
            cells[index].text = str(value)
            cells[index].vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            set_cell_margins(cells[index])
            if row_index % 2:
                set_cell_shading(cells[index], PALE)
            paragraph = cells[index].paragraphs[0]
            paragraph.paragraph_format.space_after = Pt(0)
            paragraph.paragraph_format.line_spacing = 1.0
            for run in paragraph.runs:
                run.font.size = Pt(8.3)
                run.font.color.rgb = RGBColor.from_string(DARK)
    document.add_paragraph().paragraph_format.space_after = Pt(0)


def add_docx_flow(document: Document, labels: list[str]) -> None:
    """Rendert einen kompakten Prozessfluss als einzeilige Tabelle."""
    table = document.add_table(rows=1, cols=len(labels) * 2 - 1)
    set_repeat_table_header(table.rows[0])
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    for index, label in enumerate(labels):
        cell = table.cell(0, index * 2)
        cell.width = Inches(1.05)
        cell.text = label
        set_cell_shading(cell, LIGHT_BLUE if index % 2 == 0 else "D7ECEE")
        set_cell_margins(cell, 100, 70, 100, 70)
        paragraph = cell.paragraphs[0]
        paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
        paragraph.paragraph_format.space_after = Pt(0)
        for run in paragraph.runs:
            run.font.bold = True
            run.font.size = Pt(7.8)
            run.font.color.rgb = RGBColor.from_string(NAVY)
        if index < len(labels) - 1:
            arrow = table.cell(0, index * 2 + 1)
            arrow.width = Inches(0.25)
            arrow.text = "→"
            arrow.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
            arrow.paragraphs[0].paragraph_format.space_after = Pt(0)
            for run in arrow.paragraphs[0].runs:
                run.font.bold = True
                run.font.color.rgb = RGBColor.from_string(TEAL)
    document.add_paragraph().paragraph_format.space_after = Pt(0)


def add_docx_metrics(document: Document, metrics: list[tuple[str, str]]) -> None:
    """Erzeugt eine Reihe aus vier Kennzahlen."""
    table = document.add_table(rows=1, cols=len(metrics))
    set_repeat_table_header(table.rows[0])
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    for index, (value, label) in enumerate(metrics):
        cell = table.cell(0, index)
        cell.width = Inches(1.6)
        set_cell_shading(cell, LIGHT_BLUE if index % 2 == 0 else "D7ECEE")
        set_cell_margins(cell, 120, 80, 120, 80)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_after = Pt(1)
        value_run = p.add_run(value)
        value_run.bold = True
        value_run.font.size = Pt(14)
        value_run.font.color.rgb = RGBColor.from_string(BLUE)
        label_run = p.add_run(f"\n{label}")
        label_run.font.size = Pt(7.5)
        label_run.font.color.rgb = RGBColor.from_string(MUTED)
    document.add_paragraph().paragraph_format.space_after = Pt(0)


def add_docx_callout(document: Document, text: str) -> None:
    """Fügt eine hervorgehobene Schlussfolgerung ein."""
    table = document.add_table(rows=1, cols=1)
    set_repeat_table_header(table.rows[0])
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.cell(0, 0)
    set_cell_shading(cell, LIGHT_BLUE)
    set_cell_margins(cell, 120, 140, 120, 140)
    paragraph = cell.paragraphs[0]
    paragraph.paragraph_format.space_after = Pt(0)
    run = paragraph.add_run(text)
    run.bold = True
    run.font.size = Pt(9)
    run.font.color.rgb = RGBColor.from_string(NAVY)


def build_docx() -> None:
    """Baut den Bericht als Word-Dokument."""
    document = Document()
    document.core_properties.title = "Projekt- & Architekturdokumentation – Kryptographie"
    document.core_properties.subject = "Fortgeschrittene Programmierung SoSe 2026"
    document.core_properties.author = "David Lindgreen; Viktor Edelmann"
    document.core_properties.keywords = "Rust, WebAssembly, Kryptographie, Projektbericht"

    section = document.sections[0]
    section.page_width = Inches(8.5)
    section.page_height = Inches(11)
    section.top_margin = Inches(0.82)
    section.bottom_margin = Inches(0.72)
    section.left_margin = Inches(1)
    section.right_margin = Inches(1)
    section.different_first_page_header_footer = True

    normal = document.styles["Normal"]
    normal.font.name = "Calibri"
    normal.font.size = Pt(10.2)
    normal.font.color.rgb = RGBColor.from_string(DARK)
    normal.paragraph_format.space_after = Pt(5)
    normal.paragraph_format.line_spacing = 1.04

    for style_name, size, color in (
        ("Title", 28, NAVY),
        ("Heading 1", 17, NAVY),
        ("Heading 2", 11.5, BLUE),
        ("Subtitle", 11, MUTED),
    ):
        style = document.styles[style_name]
        style.font.name = "Calibri"
        style.font.size = Pt(size)
        style.font.color.rgb = RGBColor.from_string(color)
    document.styles["Heading 1"].font.bold = True
    document.styles["Heading 1"].paragraph_format.space_before = Pt(0)
    document.styles["Heading 1"].paragraph_format.space_after = Pt(7)
    document.styles["Heading 2"].font.bold = True
    document.styles["Heading 2"].paragraph_format.space_before = Pt(6)
    document.styles["Heading 2"].paragraph_format.space_after = Pt(3)

    header = section.header
    header_table = header.add_table(rows=1, cols=2, width=Inches(6.5))
    set_repeat_table_header(header_table.rows[0])
    header_table.autofit = False
    header_table.columns[0].width = Inches(2.5)
    header_table.columns[1].width = Inches(4)
    left = header_table.cell(0, 0).paragraphs[0]
    left.text = "KRYPTOGRAPHIE · RUST/WASM"
    right = header_table.cell(0, 1).paragraphs[0]
    right.text = "PROJEKT- & ARCHITEKTURDOKUMENTATION"
    right.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    for paragraph in (left, right):
        paragraph.paragraph_format.space_after = Pt(0)
        for run in paragraph.runs:
            run.font.size = Pt(7)
            run.font.bold = True
            run.font.color.rgb = RGBColor.from_string(BLUE)
    footer = section.footer
    footer_line = footer.paragraphs[0]
    footer_line.text = "Provadis Hochschule · Fortgeschrittene Programmierung · SoSe 2026"
    footer_line.alignment = WD_ALIGN_PARAGRAPH.LEFT
    for run in footer_line.runs:
        run.font.size = Pt(7.5)
        run.font.color.rgb = RGBColor.from_string(MUTED)
    add_page_number(footer.add_paragraph())

    # Cover – editorial_cover pattern.
    top_rule = document.add_table(rows=1, cols=1)
    set_repeat_table_header(top_rule.rows[0])
    top_rule.cell(0, 0).text = "ALTERNATIVE PRÜFUNGSLEISTUNG · VERSION 1.2.0"
    set_cell_shading(top_rule.cell(0, 0), TEAL)
    set_cell_margins(top_rule.cell(0, 0), 110, 130, 110, 130)
    for run in top_rule.cell(0, 0).paragraphs[0].runs:
        run.font.bold = True
        run.font.size = Pt(9)
        run.font.color.rgb = RGBColor.from_string(WHITE)

    document.add_paragraph().paragraph_format.space_after = Pt(38)
    title = document.add_paragraph(style="Title")
    title.alignment = WD_ALIGN_PARAGRAPH.LEFT
    title.add_run("Kryptographie\nmit Rust & WebAssembly")
    subtitle = document.add_paragraph(style="Subtitle")
    subtitle.add_run("Projekt- & Architekturdokumentation")
    subtitle.paragraph_format.space_after = Pt(16)
    statement = document.add_paragraph()
    statement.add_run(
        "Fünf Verfahren. Eine Rust-Fachlogik. Eine kleine WASM-Grenze. "
        "Qualität wird durch ausführbare Nachweise statt durch Behauptungen belegt."
    ).bold = True
    statement.paragraph_format.space_after = Pt(28)

    cover_table = document.add_table(rows=7, cols=2)
    cover_table.alignment = WD_TABLE_ALIGNMENT.LEFT
    cover_table.autofit = False
    cover_rows = [
        ("Team", "David Lindgreen (E039) · Viktor Edelmann (E045)"),
        ("Kurs", "Fortgeschrittene Programmierung · SoSe 2026"),
        ("Prüfer", "Prof. Dr. Olaf Grebner"),
        ("Repository", "github.com/lindgreendavid/kryptographie-wasm"),
        ("Deployment", "lindgreendavid.github.io/kryptographie-wasm/"),
        ("Messstand", "23.08.2026 · lokaler Release-Build"),
    ]
    cover_table.cell(0, 0).text = "Angabe"
    cover_table.cell(0, 1).text = "Wert"
    set_repeat_table_header(cover_table.rows[0])
    for cell in cover_table.rows[0].cells:
        set_cell_shading(cell, NAVY)
        set_cell_margins(cell, 80, 105, 80, 105)
        for run in cell.paragraphs[0].runs:
            run.bold = True
            run.font.size = Pt(8)
            run.font.color.rgb = RGBColor.from_string(WHITE)
    for row_index, (key, value) in enumerate(cover_rows, start=1):
        key_cell, value_cell = cover_table.rows[row_index].cells
        key_cell.width = Inches(1.25)
        value_cell.width = Inches(5.25)
        key_cell.text = key
        value_cell.text = value
        set_cell_shading(key_cell, LIGHT_BLUE)
        for cell in (key_cell, value_cell):
            set_cell_margins(cell, 95, 105, 95, 105)
            cell.paragraphs[0].paragraph_format.space_after = Pt(0)
            for run in cell.paragraphs[0].runs:
                run.font.size = Pt(9)
        for run in key_cell.paragraphs[0].runs:
            run.bold = True
            run.font.color.rgb = RGBColor.from_string(NAVY)

    document.add_paragraph().paragraph_format.space_after = Pt(18)
    contents = document.add_paragraph()
    contents.add_run(
        "Inhalt · Anforderungen · Architektur · Frontend · Rust/Kryptographie · WASM-Integration · "
        "Tooling/CI · Tests/Metriken · Prozess/KI/Kapazität · Fazit"
    )
    for run in contents.runs:
        run.font.size = Pt(8.5)
        run.font.color.rgb = RGBColor.from_string(MUTED)

    for page_index, page in enumerate(PAGES, start=1):
        document.add_page_break()
        kicker = document.add_paragraph()
        kicker.paragraph_format.space_after = Pt(2)
        run = kicker.add_run(page["kicker"].upper())
        run.bold = True
        run.font.size = Pt(8)
        run.font.color.rgb = RGBColor.from_string(TEAL)
        document.add_heading(page["title"], level=1)
        lead = document.add_paragraph(page["lead"])
        lead.paragraph_format.space_after = Pt(8)
        for run in lead.runs:
            run.font.size = Pt(10.2)
            run.font.color.rgb = RGBColor.from_string(DARK)

        if "metrics" in page:
            add_docx_metrics(document, page["metrics"])
        if "flow" in page:
            add_docx_flow(document, page["flow"])
        if "table" in page:
            add_docx_table(document, page["table"])
        if "bullets" in page:
            document.add_heading(page["bullets_title"], level=2)
            for item in page["bullets"]:
                paragraph = document.add_paragraph(style="List Bullet")
                paragraph.paragraph_format.space_after = Pt(2)
                paragraph.paragraph_format.line_spacing = 1.0
                run = paragraph.add_run(item)
                run.font.size = Pt(9.2)
        if "callout" in page:
            document.add_paragraph().paragraph_format.space_after = Pt(1)
            add_docx_callout(document, page["callout"])

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    document.save(DOCX_PATH)


def register_pdf_fonts() -> tuple[str, str]:
    """Registriert Calibri, wenn vorhanden, sonst Helvetica."""
    font_dir = Path("C:/Windows/Fonts")
    regular = font_dir / "calibri.ttf"
    bold = font_dir / "calibrib.ttf"
    if regular.exists() and bold.exists():
        pdfmetrics.registerFont(TTFont("Calibri", str(regular)))
        pdfmetrics.registerFont(TTFont("Calibri-Bold", str(bold)))
        return "Calibri", "Calibri-Bold"
    return "Helvetica", "Helvetica-Bold"


PDF_FONT, PDF_FONT_BOLD = register_pdf_fonts()


def pdf_styles():
    """Definiert die PDF-Typografie."""
    sample = getSampleStyleSheet()
    return {
        "h1": ParagraphStyle(
            "ReportH1",
            parent=sample["Heading1"],
            fontName=PDF_FONT_BOLD,
            fontSize=17,
            leading=19,
            textColor=colors.HexColor(f"#{NAVY}"),
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "ReportH2",
            parent=sample["Heading2"],
            fontName=PDF_FONT_BOLD,
            fontSize=10.5,
            leading=12,
            textColor=colors.HexColor(f"#{BLUE}"),
            spaceBefore=5,
            spaceAfter=3,
        ),
        "body": ParagraphStyle(
            "ReportBody",
            parent=sample["BodyText"],
            fontName=PDF_FONT,
            fontSize=9.2,
            leading=11.4,
            textColor=colors.HexColor(f"#{DARK}"),
            spaceAfter=5,
        ),
        "small": ParagraphStyle(
            "ReportSmall",
            parent=sample["BodyText"],
            fontName=PDF_FONT,
            fontSize=7.7,
            leading=9.1,
            textColor=colors.HexColor(f"#{DARK}"),
        ),
        "small_bold": ParagraphStyle(
            "ReportSmallBold",
            parent=sample["BodyText"],
            fontName=PDF_FONT_BOLD,
            fontSize=7.7,
            leading=9.1,
            textColor=colors.HexColor(f"#{NAVY}"),
        ),
        "small_header": ParagraphStyle(
            "ReportSmallHeader",
            parent=sample["BodyText"],
            fontName=PDF_FONT_BOLD,
            fontSize=7.7,
            leading=9.1,
            textColor=colors.white,
        ),
        "kicker": ParagraphStyle(
            "ReportKicker",
            parent=sample["BodyText"],
            fontName=PDF_FONT_BOLD,
            fontSize=7.2,
            leading=8,
            textColor=colors.HexColor(f"#{TEAL}"),
            spaceAfter=2,
        ),
        "bullet": ParagraphStyle(
            "ReportBullet",
            parent=sample["BodyText"],
            fontName=PDF_FONT,
            fontSize=8.5,
            leading=10.1,
            leftIndent=12,
            firstLineIndent=-7,
            bulletIndent=2,
            textColor=colors.HexColor(f"#{DARK}"),
            spaceAfter=2,
        ),
        "callout": ParagraphStyle(
            "ReportCallout",
            parent=sample["BodyText"],
            fontName=PDF_FONT_BOLD,
            fontSize=8.4,
            leading=10.1,
            textColor=colors.HexColor(f"#{NAVY}"),
            leftIndent=3,
            rightIndent=3,
        ),
        "cover_title": ParagraphStyle(
            "CoverTitle",
            parent=sample["Title"],
            fontName=PDF_FONT_BOLD,
            fontSize=29,
            leading=31,
            alignment=TA_LEFT,
            textColor=colors.HexColor(f"#{NAVY}"),
            spaceAfter=10,
        ),
        "cover_subtitle": ParagraphStyle(
            "CoverSubtitle",
            parent=sample["BodyText"],
            fontName=PDF_FONT,
            fontSize=13,
            leading=16,
            textColor=colors.HexColor(f"#{MUTED}"),
            spaceAfter=18,
        ),
        "metric_value": ParagraphStyle(
            "MetricValue",
            parent=sample["BodyText"],
            fontName=PDF_FONT_BOLD,
            fontSize=14,
            leading=15,
            alignment=TA_CENTER,
            textColor=colors.HexColor(f"#{BLUE}"),
        ),
        "metric_label": ParagraphStyle(
            "MetricLabel",
            parent=sample["BodyText"],
            fontName=PDF_FONT,
            fontSize=7,
            leading=8,
            alignment=TA_CENTER,
            textColor=colors.HexColor(f"#{MUTED}"),
        ),
    }


STYLES = pdf_styles()


class ReportCanvas(pdf_canvas.Canvas):
    """Zeichnet Kopf- und Fußzeilen nach dem Seiteninhalt."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):  # noqa: N802 - ReportLab-API
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self._draw_decorations()
            super().showPage()
        super().save()

    def _draw_decorations(self) -> None:
        page_number = self.getPageNumber()
        if page_number == 1:
            return
        self.saveState()
        self.setFont(PDF_FONT, 7.2)
        self.setFillColor(colors.HexColor(f"#{MUTED}"))
        self.drawString(72, 35, "Provadis Hochschule · Fortgeschrittene Programmierung · SoSe 2026")
        self.drawRightString(540, 35, f"Seite {page_number}")
        self.restoreState()


def pdf_table(specification: dict) -> Table:
    """Erzeugt eine PDF-Tabelle mit festen Spaltenbreiten."""
    data = [
        [Paragraph(str(value), STYLES["small_header"]) for value in specification["headers"]]
    ]
    for values in specification["rows"]:
        data.append([Paragraph(str(value), STYLES["small"]) for value in values])
    table = Table(data, colWidths=[inch * value for value in specification["widths"]], repeatRows=1)
    commands = [
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(f"#{NAVY}")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), PDF_FONT_BOLD),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#B8C3CC")),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]
    for row_index in range(2, len(data), 2):
        commands.append(("BACKGROUND", (0, row_index), (-1, row_index), colors.HexColor(f"#{PALE}")))
    table.setStyle(TableStyle(commands))
    return table


def pdf_flow(labels: list[str]) -> Table:
    """Erzeugt eine Prozessdarstellung als Tabelle."""
    cells = []
    widths = []
    for index, label in enumerate(labels):
        cells.append(Paragraph(label, STYLES["small_bold"]))
        widths.append(1.05 * inch)
        if index < len(labels) - 1:
            cells.append(Paragraph("→", STYLES["small_bold"]))
            widths.append(0.25 * inch)
    table = Table([cells], colWidths=widths, hAlign="CENTER")
    commands = [
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]
    for index in range(len(cells)):
        if index % 2 == 0:
            commands.extend(
                [
                    ("BACKGROUND", (index, 0), (index, 0), colors.HexColor(f"#{LIGHT_BLUE}")),
                    ("BOX", (index, 0), (index, 0), 0.5, colors.HexColor(f"#{TEAL}")),
                ]
            )
    table.setStyle(TableStyle(commands))
    return table


def pdf_metrics(metrics: list[tuple[str, str]]) -> Table:
    """Erzeugt vier kompakte Metrikkarten."""
    cells = []
    for value, label in metrics:
        cells.append(
            [
                [Paragraph(value, STYLES["metric_value"])],
                [Paragraph(label, STYLES["metric_label"])],
            ]
        )
    data = [[Table(cell, colWidths=[1.52 * inch]) for cell in cells]]
    table = Table(data, colWidths=[1.6 * inch] * len(metrics), hAlign="CENTER")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor(f"#{LIGHT_BLUE}")),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor(f"#{TEAL}")),
                ("INNERGRID", (0, 0), (-1, -1), 4, colors.white),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    return table


def pdf_callout(text: str) -> Table:
    """Erzeugt einen hervorgehobenen PDF-Hinweis."""
    table = Table([[Paragraph(text, STYLES["callout"])]], colWidths=[6.5 * inch])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor(f"#{LIGHT_BLUE}")),
                ("LINEBEFORE", (0, 0), (0, -1), 4, colors.HexColor(f"#{TEAL}")),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
                ("LEFTPADDING", (0, 0), (-1, -1), 9),
                ("RIGHTPADDING", (0, 0), (-1, -1), 9),
            ]
        )
    )
    return table


def build_pdf() -> None:
    """Baut den Bericht als PDF mit zehn Inhaltsseiten plus Cover."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    document = SimpleDocTemplate(
        str(PDF_PATH),
        pagesize=letter,
        leftMargin=inch,
        rightMargin=inch,
        topMargin=0.72 * inch,
        bottomMargin=0.62 * inch,
        title="Projekt- & Architekturdokumentation – Kryptographie",
        author="David Lindgreen; Viktor Edelmann",
        subject="Fortgeschrittene Programmierung SoSe 2026",
    )
    story = []
    cover_rule = Table(
        [[Paragraph("ALTERNATIVE PRÜFUNGSLEISTUNG · VERSION 1.2.0", STYLES["small_bold"])]],
        colWidths=[6.5 * inch],
    )
    cover_rule.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor(f"#{TEAL}")),
                ("TEXTCOLOR", (0, 0), (-1, -1), colors.white),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("LEFTPADDING", (0, 0), (-1, -1), 9),
            ]
        )
    )
    story.extend(
        [
            cover_rule,
            Spacer(1, 0.62 * inch),
            Paragraph("Kryptographie<br/>mit Rust &amp; WebAssembly", STYLES["cover_title"]),
            Paragraph("Projekt- &amp; Architekturdokumentation", STYLES["cover_subtitle"]),
            Paragraph(
                "<b>Fünf Verfahren. Eine Rust-Fachlogik. Eine kleine WASM-Grenze.</b><br/>"
                "Qualität wird durch ausführbare Nachweise statt durch Behauptungen belegt.",
                STYLES["body"],
            ),
            Spacer(1, 0.28 * inch),
        ]
    )
    cover_spec = {
        "headers": ["Angabe", "Wert"],
        "rows": [
            ["Team", "David Lindgreen (E039) · Viktor Edelmann (E045)"],
            ["Kurs", "Fortgeschrittene Programmierung · SoSe 2026"],
            ["Prüfer", "Prof. Dr. Olaf Grebner"],
            ["Repository", "github.com/lindgreendavid/kryptographie-wasm"],
            ["Deployment", "lindgreendavid.github.io/kryptographie-wasm/"],
            ["Messstand", "23.08.2026 · lokaler Release-Build"],
        ],
        "widths": [1.25, 5.25],
    }
    story.append(pdf_table(cover_spec))
    story.extend(
        [
            Spacer(1, 0.28 * inch),
            Paragraph(
                "<b>Inhalt</b> · Anforderungen · Architektur · Frontend · Rust/Kryptographie · "
                "WASM-Integration · Tooling/CI · Tests/Metriken · Prozess/KI/Kapazität · Fazit",
                STYLES["small"],
            ),
        ]
    )

    for page in PAGES:
        story.append(PageBreak())
        story.append(Paragraph(page["kicker"].upper(), STYLES["kicker"]))
        story.append(Paragraph(page["title"], STYLES["h1"]))
        story.append(Paragraph(page["lead"], STYLES["body"]))
        if "metrics" in page:
            story.extend([pdf_metrics(page["metrics"]), Spacer(1, 8)])
        if "flow" in page:
            story.extend([pdf_flow(page["flow"]), Spacer(1, 9)])
        if "table" in page:
            story.extend([pdf_table(page["table"]), Spacer(1, 6)])
        if "bullets" in page:
            story.append(Paragraph(page["bullets_title"], STYLES["h2"]))
            bullet_group = []
            for item in page["bullets"]:
                bullet_group.append(Paragraph(f"• {item}", STYLES["bullet"]))
            story.append(KeepTogether(bullet_group))
            story.append(Spacer(1, 4))
        if "callout" in page:
            story.append(pdf_callout(page["callout"]))

    document.build(story, canvasmaker=ReportCanvas)


if __name__ == "__main__":
    build_docx()
    build_pdf()
    print(f"DOCX: {DOCX_PATH}")
    print(f"PDF:  {PDF_PATH}")

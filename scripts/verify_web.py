#!/usr/bin/env python3
"""Prüft die statische Webstruktur ohne zusätzliche Abhängigkeiten."""

from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
import re
import sys
from urllib.parse import urlsplit


PROJECT_ROOT = Path(__file__).resolve().parent.parent
WEB_ROOT = PROJECT_ROOT / "web"


class PageParser(HTMLParser):
    """Sammelt die für strukturelle Qualitätsregeln benötigten HTML-Daten."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.references: list[str] = []
        self.html_language: str | None = None
        self.h1_count = 0
        self.main_count = 0
        self.label_targets: list[str] = []
        self.labels_without_target = 0
        self.form_controls: list[tuple[str, str | None]] = []
        self.in_title = False
        self.title_parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        if tag == "html":
            self.html_language = attributes.get("lang")
        if tag == "h1":
            self.h1_count += 1
        if tag == "main":
            self.main_count += 1
        if tag == "label":
            if label_target := attributes.get("for"):
                self.label_targets.append(label_target)
            else:
                self.labels_without_target += 1
        if tag in {"input", "textarea", "select", "output"}:
            self.form_controls.append((tag, attributes.get("id")))
        if tag == "title":
            self.in_title = True
        if element_id := attributes.get("id"):
            self.ids.append(element_id)
        for attribute in ("href", "src"):
            if reference := attributes.get(attribute):
                self.references.append(reference)

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self.in_title = False

    def handle_data(self, data: str) -> None:
        if self.in_title:
            self.title_parts.append(data)


def is_local_reference(reference: str) -> bool:
    parts = urlsplit(reference)
    return not parts.scheme and not parts.netloc and bool(parts.path)


def verify_html(path: Path) -> list[str]:
    parser = PageParser()
    parser.feed(path.read_text(encoding="utf-8"))
    errors: list[str] = []

    if parser.html_language != "de":
        errors.append("Das Wurzelelement benötigt lang=\"de\".")
    if not "".join(parser.title_parts).strip():
        errors.append("Der Seitentitel fehlt.")
    if parser.h1_count != 1:
        errors.append(f"Erwartet wird genau eine H1, gefunden: {parser.h1_count}.")
    if parser.main_count != 1:
        errors.append(f"Erwartet wird genau ein main-Element, gefunden: {parser.main_count}.")

    duplicates = sorted({item for item in parser.ids if parser.ids.count(item) > 1})
    if duplicates:
        errors.append(f"Doppelte IDs: {', '.join(duplicates)}.")

    if parser.labels_without_target:
        errors.append(f"Label ohne for-Attribut: {parser.labels_without_target}.")

    for tag, control_id in parser.form_controls:
        if not control_id:
            errors.append(f"{tag}-Element ohne ID.")
        elif control_id not in parser.label_targets:
            errors.append(f"{tag}#{control_id} besitzt kein zugeordnetes Label.")

    for target in parser.label_targets:
        if target not in parser.ids:
            errors.append(f"Label verweist auf fehlende ID: {target}.")

    for reference in parser.references:
        parts = urlsplit(reference)
        if not parts.path and parts.fragment and parts.fragment not in parser.ids:
            errors.append(f"Sprungziel fehlt: #{parts.fragment}.")
        if not is_local_reference(reference):
            continue
        target = (path.parent / parts.path).resolve()
        if WEB_ROOT.resolve() not in target.parents and target != WEB_ROOT.resolve():
            errors.append(f"Verweis verlässt web/: {reference}.")
        elif not target.exists():
            errors.append(f"Fehlendes Verweisziel: {reference}.")

    return errors


def verify_javascript_imports(path: Path) -> list[str]:
    errors: list[str] = []
    source = path.read_text(encoding="utf-8")
    for reference in re.findall(r"\bfrom\s+[\"']([^\"']+)[\"']", source):
        target = (path.parent / reference).resolve()
        if "web/pkg" in target.as_posix():
            continue  # entsteht reproduzierbar durch wasm-pack
        if not target.exists():
            errors.append(f"Fehlendes Importziel: {reference}.")
    return errors


def main() -> int:
    failures: list[str] = []

    for page in sorted(WEB_ROOT.glob("*.html")):
        failures.extend(f"{page.relative_to(PROJECT_ROOT)}: {error}" for error in verify_html(page))

    for script in sorted((WEB_ROOT / "js").glob("*.js")):
        failures.extend(
            f"{script.relative_to(PROJECT_ROOT)}: {error}"
            for error in verify_javascript_imports(script)
        )

    if len(list(WEB_ROOT.glob("*.html"))) != 6:
        failures.append("web/: Erwartet werden genau sechs HTML-Seiten.")

    joined_html = "\n".join(path.read_text(encoding="utf-8") for path in WEB_ROOT.glob("*.html"))
    if "Vier Verfahren" in joined_html:
        failures.append("web/: Veraltete Angabe 'Vier Verfahren' gefunden.")

    if failures:
        print("Webprüfung fehlgeschlagen:", file=sys.stderr)
        for failure in failures:
            print(f"- {failure}", file=sys.stderr)
        return 1

    print("Webprüfung erfolgreich: sechs Seiten, gültige Verweise und eindeutige IDs.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

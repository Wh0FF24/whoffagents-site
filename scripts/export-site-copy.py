"""Export prerendered public page copy for review without publishing internal notes."""
from html.parser import HTMLParser
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
ROUTES = ["/", "/capabilities", "/research", "/research/persona-fleet", "/about", "/contact"]


VOID = {"area", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}


class MainText(HTMLParser):
    """Collect visible copy inside <main>, skipping decorative (aria-hidden) layers."""

    def __init__(self):
        super().__init__()
        self.active = False
        self.stack = []
        self.parts = []

    @property
    def hidden(self):
        return any(flag for _, flag in self.stack)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "main":
            self.active = True
        if not self.active:
            return
        conceal = tag in ("svg", "style", "script") or attrs.get("aria-hidden") == "true"
        if tag not in VOID:
            self.stack.append((tag, conceal))
        if self.hidden or conceal:
            return
        if tag in ("h1", "h2", "h3", "p", "div", "section", "li", "br", "dt", "dd"):
            self.parts.append("\n" if tag == "br" else "\n\n")
        if tag in ("h1", "h2", "h3"):
            self.parts.append("#" * (int(tag[1]) + 1) + " ")
        if tag == "li":
            self.parts.append("- ")

    def handle_endtag(self, tag):
        if not self.active:
            return
        visible = not self.hidden
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                del self.stack[index:]
                break
        if visible and tag == "span":
            self.parts.append(" ")
        if visible and tag in ("h1", "h2", "h3", "p", "small"):
            self.parts.append("\n\n")
        if tag == "main":
            self.active = False

    def handle_data(self, data):
        if self.active and not self.hidden:
            self.parts.append(data)


sections = ["# Public website copy\n\nExported from the built private preview. Original service, product, legal, and article copy remains in its preserved routes; the migration report records corrections. This file is a review artifact, not a public route."]
for route in ROUTES:
    file = ROOT / "dist" / route.lstrip("/") / "index.html"
    parser = MainText()
    parser.feed(file.read_text(encoding="utf-8"))
    text = re.sub(r"\n{3,}", "\n\n", "".join(parser.parts)).strip()
    sections.append(f"# Page: {route}\n\n{text}")
target = ROOT / "docs" / "public-page-copy.md"
target.write_text("\n\n---\n\n".join(sections) + "\n", encoding="utf-8")
print(f"Exported {len(ROUTES)} pages to {target}")

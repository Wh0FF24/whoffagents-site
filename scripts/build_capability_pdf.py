"""Build and verify the public capability statement from its Markdown source.

Run with the Codex bundled Python runtime (ReportLab, pypdf, and pypdfium2).
The sole public output is public/downloads/whoff-capabilities.pdf. Rendered
review output and validation metadata stay under ignored test-results/pdf-qa.
"""

from __future__ import annotations

import html
import json
import os
from pathlib import Path
import re

from pypdf import PdfReader
import pypdfium2 as pdfium
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/downloads/whoff-capabilities.md"
OUTPUT = ROOT / "public/downloads/whoff-capabilities.pdf"
QA = ROOT / "test-results/pdf-qa"
LOGO = ROOT / "public/brand/whoff-engineering-logo.png"

PAPER = colors.HexColor("#f1f0e9")
INK = colors.HexColor("#18201f")
MUTED = colors.HexColor("#515a54")
LINE = colors.HexColor("#c7cbc1")
CRIMSON = colors.HexColor("#970921")
BLUE = colors.HexColor("#0442ae")
GOLD = colors.HexColor("#b78a4f")


def register_fonts() -> tuple[str, str, str]:
    """Embed available local typefaces; keep a portable built-in fallback."""
    font_dir = Path(os.environ.get("WINDIR", "C:/Windows")) / "Fonts"
    regular = font_dir / "segoeui.ttf"
    bold = font_dir / "segoeuib.ttf"
    display = font_dir / "bahnschrift.ttf"
    if regular.exists() and bold.exists() and display.exists():
        pdfmetrics.registerFont(TTFont("WhoffText", str(regular)))
        pdfmetrics.registerFont(TTFont("WhoffTextBold", str(bold)))
        pdfmetrics.registerFont(TTFont("WhoffDisplay", str(display)))
        pdfmetrics.registerFontFamily(
            "WhoffText", normal="WhoffText", bold="WhoffTextBold",
            italic="WhoffText", boldItalic="WhoffTextBold",
        )
        return "WhoffText", "WhoffTextBold", "WhoffDisplay"
    return "Helvetica", "Helvetica-Bold", "Helvetica-Bold"


def read_sections(markdown: str) -> dict[str, list[str]]:
    sections: dict[str, list[str]] = {"intro": []}
    current = "intro"
    for block in re.split(r"\n\s*\n", markdown.strip()):
        block = block.strip()
        if block.startswith("## "):
            current = block[3:]
            sections[current] = []
        elif not block.startswith("# "):
            if block.startswith("- "):
                sections[current].extend(
                    line[2:].strip() for line in block.splitlines() if line.startswith("- ")
                )
            else:
                sections[current].append(block)
    return sections


def rich_text(text: str) -> str:
    escaped = html.escape(text)
    escaped = re.sub(r"\*\*(.*?)\*\*", r"<b>\1</b>", escaped)
    escaped = re.sub(
        r"(?<![\w@])will@whoffagents\.com",
        '<link href="mailto:will@whoffagents.com" color="#0442ae">will@whoffagents.com</link>',
        escaped,
    )
    escaped = re.sub(
        r"(?<![@\w/])whoffagents\.com(?:/(?:capabilities|research))?",
        lambda match: f'<link href="https://{match.group(0)}" color="#0442ae">{match.group(0)}</link>',
        escaped,
    )
    return escaped


def normalized(text: str) -> str:
    return " ".join(text.replace("\u00ad", "").split())


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    QA.mkdir(parents=True, exist_ok=True)
    markdown = SOURCE.read_text(encoding="utf-8")
    sections = read_sections(markdown)
    regular, bold, display = register_fonts()
    body = ParagraphStyle(
        "body", fontName=regular, fontSize=8.9, leading=12.4,
        textColor=INK, alignment=TA_LEFT, spaceAfter=0,
    )
    small = ParagraphStyle(
        "small", parent=body, fontSize=7.7, leading=10.6, textColor=MUTED,
    )
    intro_style = ParagraphStyle(
        "intro", parent=body, fontSize=9.4, leading=13.5, textColor=MUTED,
    )
    footer_style = ParagraphStyle(
        "footer", parent=body, fontSize=8.3, leading=12.2,
    )
    width, height = letter
    margin = 42
    usable = width - 2 * margin
    pdf = canvas.Canvas(
        str(OUTPUT), pagesize=letter, pageCompression=1, invariant=1,
    )
    pdf.setTitle("Whoff Agents LLC | Capability Statement")
    pdf.setAuthor("Whoff Agents LLC")
    pdf.setSubject("Software engineering, AI automation, systems integration, and research")
    pdf.setCreator("Whoff Agents LLC")
    pdf.setFillColor(PAPER)
    pdf.rect(0, 0, width, height, stroke=0, fill=1)

    def paragraph(text: str, x: float, top: float, max_width: float, style=body) -> float:
        item = Paragraph(rich_text(text), style)
        _, used_height = item.wrap(max_width, height)
        item.drawOn(pdf, x, top - used_height)
        return top - used_height

    def section_title(number: str, title: str, x: float, top: float, max_width: float) -> float:
        pdf.setFillColor(CRIMSON)
        pdf.setFont("Courier", 7)
        pdf.drawString(x, top - 8, number)
        pdf.setFillColor(INK)
        pdf.setFont(bold, 11.3)
        pdf.drawString(x + 22, top - 8, title)
        pdf.setStrokeColor(LINE)
        pdf.setLineWidth(0.5)
        pdf.line(x, top - 17, x + max_width, top - 17)
        return top - 28

    # Brand and introduction.
    pdf.drawImage(str(LOGO), margin, height - margin - 40, width=139, height=40, mask="auto")
    pdf.setFillColor(MUTED)
    pdf.setFont("Courier", 7.4)
    pdf.drawRightString(width - margin, height - margin - 11, "CAPABILITY STATEMENT")
    pdf.setFont(regular, 8.1)
    pdf.drawRightString(width - margin, height - margin - 29, "Whoff Agents LLC")
    tagline = sections["intro"][0].strip("*")
    headline, subtitle = tagline.split(". ", 1)
    pdf.setFillColor(INK)
    pdf.setFont(display, 28)
    pdf.drawString(margin - 1, 675, headline + ".")
    pdf.setFont(regular, 12.2)
    pdf.drawString(margin, 653, subtitle)
    intro_bottom = paragraph(sections["intro"][1], margin, 634, usable, intro_style)
    pdf.setStrokeColor(INK)
    pdf.setLineWidth(0.8)
    rule_y = intro_bottom - 20
    pdf.line(margin, rule_y, width - margin, rule_y)
    pdf.setStrokeColor(CRIMSON)
    pdf.setLineWidth(2)
    pdf.line(margin, rule_y, margin + 29, rule_y)

    # The document reads down each of two balanced columns.
    gutter = 27
    column_width = (usable - gutter) / 2
    right_x = margin + column_width + gutter
    body_top = rule_y - 24
    left_y = section_title("01", "Core capabilities", margin, body_top, column_width)
    for item in sections["Core capabilities"]:
        left_y = paragraph(item, margin, left_y, column_width) - 10

    left_y = section_title("02", "How we work", margin, left_y - 13, column_width)
    for item in sections["How we work"]:
        left_y = paragraph(item, margin, left_y, column_width) - 12

    right_y = section_title("03", "Current research", right_x, body_top, column_width)
    for item in sections["Current research"]:
        right_y = paragraph(item, right_x, right_y, column_width) - 12
    right_y = section_title("04", "People and experience", right_x, right_y - 11, column_width)
    for index, item in enumerate(sections["People and experience"]):
        style = small if index == len(sections["People and experience"]) - 1 else body
        right_y = paragraph(item, right_x, right_y, column_width, style) - 10

    company_top = 192
    lowest_body = min(left_y, right_y)
    if lowest_body < company_top + 14:
        raise ValueError(f"Body collides with company footer: {lowest_body:.1f} < {company_top + 14}")

    # Company data stays together; all pending and role qualifiers remain in the source.
    pdf.setStrokeColor(INK)
    pdf.setLineWidth(0.6)
    pdf.line(margin, company_top, width - margin, company_top)
    pdf.setFillColor(GOLD)
    pdf.rect(margin, company_top - 23, 4, 4, stroke=0, fill=1)
    pdf.setFillColor(INK)
    pdf.setFont(bold, 11)
    pdf.drawString(margin + 13, company_top - 24, "Company information")
    company = sections["Company information"]
    company_bottom = paragraph(company[0], margin, company_top - 37, usable, footer_style)
    paragraph(company[1], margin, company_bottom - 7, usable, footer_style)
    paragraph(company[2], margin, company_bottom - 27, usable, footer_style)
    paragraph(company[3], margin, company_bottom - 48, usable, footer_style)
    paragraph(company[4], right_x, company_bottom - 27, column_width, small)
    paragraph(company[5], right_x, company_bottom - 48, column_width, small)

    pdf.setFillColor(MUTED)
    pdf.setFont("Courier", 6.7)
    pdf.drawString(margin, 25, "WHOFF AGENTS LLC")
    pdf.drawRightString(width - margin, 25, "01 / 01")
    pdf.showPage()
    pdf.save()

    # Reopen the artifact. Text checks complement, rather than replace, visual QA.
    reader = PdfReader(str(OUTPUT))
    if len(reader.pages) != 1:
        raise ValueError(f"Expected one page, got {len(reader.pages)}")
    extracted = reader.pages[0].extract_text()
    text = normalized(extracted)
    for section in sections.values():
        for block in section:
            plain = block.replace("**", "")
            if normalized(plain) not in text:
                # The tagline is intentionally separated into display lines.
                raise ValueError(f"Source content missing from PDF: {plain[:80]}")
    urls = [
        str(annotation.get_object().get("/A", {}).get("/URI", ""))
        for annotation in reader.pages[0].get("/Annots", [])
    ]
    expected_links = {
        "mailto:will@whoffagents.com", "https://whoffagents.com",
        "https://whoffagents.com/capabilities", "https://whoffagents.com/research",
    }
    if not expected_links.issubset(set(urls)):
        raise ValueError(f"Missing PDF links: {expected_links - set(urls)}")

    document = pdfium.PdfDocument(str(OUTPUT))
    page = document[0]
    bitmap = page.render(scale=2)
    image = bitmap.to_pil()
    render_path = QA / "whoff-capabilities-page-1.png"
    image.save(render_path)
    image.close()
    bitmap.close()
    page.close()
    document.close()
    (QA / "whoff-capabilities-extracted.txt").write_text(extracted, encoding="utf-8")
    result = {
        "output": str(OUTPUT.relative_to(ROOT)), "pages": len(reader.pages),
        "source_sections": list(sections), "all_source_copy_present": True,
        "link_destinations": sorted(set(urls)), "bytes": OUTPUT.stat().st_size,
        "lowest_body_point": round(lowest_body, 1),
        "render": str(render_path.relative_to(ROOT)),
    }
    (QA / "whoff-capabilities-checks.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()

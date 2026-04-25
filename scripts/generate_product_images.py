"""
Generate 3 product images for Ship Fast Skill Pack (Stripe + website).
Output: public/images/ship-fast-{01-hero,02-in-action,03-diff-stat}.png
"""

from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

# ── Brand tokens ──────────────────────────────────────────────────────────────
BG      = (10, 10, 10)
CARD    = (17, 17, 17)
BORDER  = (30, 30, 30)
GOLD    = (255, 184, 28)
BLUE    = (0, 98, 184)
RED     = (200, 16, 46)
TEXT    = (229, 229, 229)
MUTED   = (115, 115, 115)
GREEN   = (52, 211, 153)
WHITE   = (255, 255, 255)

W, H = 1200, 630

OUT = Path(__file__).parent.parent / "public" / "images"
OUT.mkdir(parents=True, exist_ok=True)

# ── Font helpers ───────────────────────────────────────────────────────────────
def font(size, mono=False):
    path = "/System/Library/Fonts/Monaco.ttf" if mono else "/System/Library/Fonts/Helvetica.ttc"
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def draw_rounded_rect(d, xy, radius, fill=None, outline=None, width=1):
    x1, y1, x2, y2 = xy
    r = radius
    if fill:
        d.rounded_rectangle([x1, y1, x2, y2], radius=r, fill=fill, outline=outline, width=width)
    else:
        d.rounded_rectangle([x1, y1, x2, y2], radius=r, outline=outline, width=width)


# ─────────────────────────────────────────────────────────────────────────────
# IMAGE 1 — Before / After skills directory
# ─────────────────────────────────────────────────────────────────────────────
def make_before_after():
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    # Header label
    d.text((W // 2, 32), "Ship Fast Skill Pack", fill=GOLD, font=font(22), anchor="mm")
    d.text((W // 2, 60), "10 Claude Code skills — installed in seconds", fill=MUTED, font=font(15), anchor="mm")

    panel_w = 530
    panel_h = 460
    top = 90

    # ── BEFORE panel ──────────────────────────────────────────────────────────
    bx1, by1 = 40, top
    bx2, by2 = bx1 + panel_w, by1 + panel_h
    draw_rounded_rect(d, [bx1, by1, bx2, by2], 8, fill=CARD, outline=BORDER, width=1)

    # Window chrome dots
    for xi, col in enumerate([(200, 16, 46), (255, 184, 28), (52, 211, 153)]):
        d.ellipse([bx1 + 14 + xi * 20, by1 + 14, bx1 + 24 + xi * 20, by1 + 24], fill=col)

    d.text((bx1 + panel_w // 2, by1 + 18), "BEFORE", fill=MUTED, font=font(11), anchor="mm")

    # File tree — empty project
    lines_before = [
        ("~/my-saas/", TEXT, False),
        ("  ├── src/", MUTED, False),
        ("  │   ├── auth.ts          (from scratch)", RED, False),
        ("  │   ├── stripe.ts        (from scratch)", RED, False),
        ("  │   ├── db.ts            (from scratch)", RED, False),
        ("  │   ├── email.ts         (from scratch)", RED, False),
        ("  │   └── deploy.sh        (from scratch)", RED, False),
        ("  ├── tests/               (missing CI)", MUTED, False),
        ("  └── package.json", MUTED, False),
        ("", MUTED, False),
        ("  847 lines written by hand", RED, False),
        ("  ~40 hours of setup time", RED, False),
        ("  3 Stack Overflow tabs open", RED, False),
    ]

    cy = by1 + 48
    for text_str, color, bold in lines_before:
        d.text((bx1 + 20, cy), text_str, fill=color, font=font(13, mono=True))
        cy += 28

    # X badge
    d.rounded_rectangle([bx1 + panel_w // 2 - 110, by2 - 60, bx1 + panel_w // 2 + 110, by2 - 38], radius=4, fill=(40, 8, 8))
    d.text((bx1 + panel_w // 2, by2 - 50), "847 lines. 40 hours.", fill=RED, font=font(15), anchor="mm")

    # ── AFTER panel ───────────────────────────────────────────────────────────
    ax1, ay1 = W - 40 - panel_w, top
    ax2, ay2 = ax1 + panel_w, ay1 + panel_h
    draw_rounded_rect(d, [ax1, ay1, ax2, ay2], 8, fill=CARD, outline=BLUE, width=2)

    for xi, col in enumerate([(200, 16, 46), (255, 184, 28), (52, 211, 153)]):
        d.ellipse([ax1 + 14 + xi * 20, ay1 + 14, ax1 + 24 + xi * 20, ay1 + 24], fill=col)

    d.text((ax1 + panel_w // 2, ay1 + 18), "AFTER", fill=GREEN, font=font(11), anchor="mm")

    skills = [
        "auth-setup",
        "stripe-payments",
        "api-builder",
        "database-setup",
        "deploy-config",
        "testing-suite",
        "email-system",
        "monitoring",
        "seo-meta",
        "ui-components",
    ]

    cy = ay1 + 48
    d.text((ax1 + 20, cy), "~/.claude/skills/ship-fast/", fill=TEXT, font=font(13, mono=True))
    cy += 32
    for i, sk in enumerate(skills):
        prefix = "└──" if i == len(skills) - 1 else "├──"
        d.text((ax1 + 20, cy), f"  {prefix} {sk}/", fill=GREEN, font=font(13, mono=True))
        cy += 24

    cy += 12
    d.text((ax1 + 20, cy), "  41 lines in CLAUDE.md", fill=TEXT, font=font(13, mono=True))
    cy += 24
    d.text((ax1 + 20, cy), "  /auth setup  -> runs in Claude Code", fill=GOLD, font=font(13, mono=True))

    d.rounded_rectangle([ax1 + panel_w // 2 - 120, ay2 - 60, ax1 + panel_w // 2 + 120, ay2 - 38], radius=4, fill=(8, 30, 20))
    d.text((ax1 + panel_w // 2, ay2 - 50), "10 skills. Ship day one.", fill=GREEN, font=font(15), anchor="mm")

    # Arrow between panels (drawn, no unicode)
    mid_x = (bx2 + ax1) // 2
    mid_y = top + panel_h // 2
    # shaft
    d.rectangle([mid_x - 18, mid_y - 3, mid_x + 10, mid_y + 3], fill=GOLD)
    # arrowhead
    d.polygon([(mid_x + 10, mid_y - 10), (mid_x + 26, mid_y), (mid_x + 10, mid_y + 10)], fill=GOLD)

    img.save(OUT / "ship-fast-01-hero.png", optimize=True)
    print(f"  ✓ ship-fast-01-hero.png")


# ─────────────────────────────────────────────────────────────────────────────
# IMAGE 2 — In-action: /auth setup skill run
# ─────────────────────────────────────────────────────────────────────────────
def make_in_action():
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    # Header
    d.text((W // 2, 32), "Ship Fast in Action", fill=GOLD, font=font(22), anchor="mm")
    d.text((W // 2, 60), "Type one command. Get production-ready auth.", fill=MUTED, font=font(15), anchor="mm")

    # Terminal window
    tx1, ty1, tx2, ty2 = 60, 88, W - 60, H - 40
    draw_rounded_rect(d, [tx1, ty1, tx2, ty2], 10, fill=CARD, outline=BORDER, width=1)

    # Window chrome
    for xi, col in enumerate([(200, 16, 46), (255, 184, 28), (52, 211, 153)]):
        d.ellipse([tx1 + 14 + xi * 20, ty1 + 14, tx1 + 24 + xi * 20, ty1 + 24], fill=col)
    d.text(((tx1 + tx2) // 2, ty1 + 18), "Claude Code — my-saas", fill=MUTED, font=font(11), anchor="mm")

    # Terminal content
    # (indicator, text, color)  indicator: '+' = green dot, '' = plain
    lines = [
        ('',  "$ claude", TEXT),
        ('',  "", TEXT),
        ('',  "> /auth setup", GOLD),
        ('',  "", TEXT),
        ('',  "  Running skill: auth-setup", MUTED),
        ('',  "  " + "-" * 44, BORDER),
        ('',  "", TEXT),
        ('+', "  Creating src/lib/auth.ts", GREEN),
        ('+', "  Wiring NextAuth v5 providers (Google, GitHub)", GREEN),
        ('+', "  Adding session middleware to app/api/", GREEN),
        ('+', "  Generating auth.config.ts with JWT strategy", GREEN),
        ('+', "  Adding protected route HOC", GREEN),
        ('+', "  Writing auth tests -> tests/auth.spec.ts", GREEN),
        ('+', "  Updating .env.example with required keys", GREEN),
        ('',  "", TEXT),
        ('',  "  Done in 0.8s  --  41 lines written", TEXT),
        ('',  "", TEXT),
        ('',  "  Next: run `npm run dev` -- auth is live.", GOLD),
    ]

    cy = ty1 + 48
    for indicator, text_str, color in lines:
        if indicator == '+':
            # Draw small green square as checkmark
            sq = 8
            d.rounded_rectangle([tx1 + 28, cy + 4, tx1 + 28 + sq, cy + 4 + sq], radius=2, fill=GREEN)
            d.text((tx1 + 28 + sq + 6, cy), text_str, fill=color, font=font(15, mono=True))
        else:
            d.text((tx1 + 28, cy), text_str, fill=color, font=font(15, mono=True))
        cy += 26

    # Cursor blink indicator
    d.rectangle([tx1 + 28, cy, tx1 + 38, cy + 18], fill=GOLD)

    # Stat badge bottom right
    bw, bh = 240, 52
    bx = tx2 - bw - 20
    by = ty2 - bh - 16
    draw_rounded_rect(d, [bx, by, bx + bw, by + bh], 8, fill=(20, 20, 20), outline=GOLD, width=1)
    d.text((bx + bw // 2, by + 14), "from 40 hours", fill=MUTED, font=font(11), anchor="mm")
    d.text((bx + bw // 2, by + 34), "to < 1 second", fill=GOLD, font=font(15), anchor="mm")

    img.save(OUT / "ship-fast-02-in-action.png", optimize=True)
    print(f"  ✓ ship-fast-02-in-action.png")


# ─────────────────────────────────────────────────────────────────────────────
# IMAGE 3 — Diff-stat: 800 LOC vs 40 LOC
# ─────────────────────────────────────────────────────────────────────────────
def make_diff_stat():
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    d.text((W // 2, 32), "Less code. Same result.", fill=GOLD, font=font(22), anchor="mm")
    d.text((W // 2, 60), "Ship Fast vs. writing auth from scratch", fill=MUTED, font=font(15), anchor="mm")

    panel_w = 520
    panel_h = 430
    top = 88
    gutter = W - 2 * panel_w - 80

    # ── Left panel: from scratch ───────────────────────────────────────────────
    lx1, ly1 = 40, top
    lx2, ly2 = lx1 + panel_w, ly1 + panel_h
    draw_rounded_rect(d, [lx1, ly1, lx2, ly2], 8, fill=CARD, outline=BORDER, width=1)

    d.text((lx1 + panel_w // 2, ly1 + 20), "Auth from scratch", fill=TEXT, font=font(15), anchor="mm")
    d.text((lx1 + panel_w // 2, ly1 + 42), "847 lines", fill=RED, font=font(28, mono=True), anchor="mm")

    # Simulated code block
    code_scratch = [
        "import NextAuth from 'next-auth'",
        "import GoogleProvider from 'next-auth/providers/google'",
        "import GithubProvider from 'next-auth/providers/github'",
        "import { PrismaAdapter } from '@auth/prisma-adapter'",
        "import { prisma } from '@/lib/prisma'",
        "",
        "export const authOptions = {",
        "  adapter: PrismaAdapter(prisma),",
        "  providers: [",
        "    GoogleProvider({",
        "      clientId: process.env.GOOGLE_CLIENT_ID!,",
        "      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,",
        "    }),",
        "    GithubProvider({",
        "      clientId: process.env.GITHUB_ID!,",
        "      clientSecret: process.env.GITHUB_SECRET!,",
        "    }),",
        "  ],",
        "  callbacks: {",
        "    async session({ session, user }) {",
        "      session.user.id = user.id",
        "      return session",
        "    },",
        "  },",
        "  pages: {",
        "    signIn: '/auth/signin',",
        "  },",
        "}",
        "                      ... 819 more lines",
    ]

    cy = ly1 + 68
    for line in code_scratch:
        color = MUTED if line.startswith("//") else (TEXT if line else BORDER)
        if "819 more lines" in line:
            color = RED
        d.text((lx1 + 12, cy), line, fill=color, font=font(10, mono=True))
        cy += 13
        if cy > ly2 - 30:
            break

    # Bar chart indicator
    bar_h = 14
    bar_w = panel_w - 24
    d.rounded_rectangle([lx1 + 12, ly2 - 30, lx1 + 12 + bar_w, ly2 - 16], radius=3, fill=RED)
    d.text((lx1 + panel_w // 2, ly2 - 8), "847 lines of auth boilerplate", fill=RED, font=font(11), anchor="mm")

    # ── Right panel: Ship Fast ─────────────────────────────────────────────────
    rx1 = W - 40 - panel_w
    ry1 = top
    rx2, ry2 = rx1 + panel_w, ry1 + panel_h
    draw_rounded_rect(d, [rx1, ry1, rx2, ry2], 8, fill=CARD, outline=BLUE, width=2)

    d.text((rx1 + panel_w // 2, ry1 + 20), "Ship Fast Skill Pack", fill=TEXT, font=font(15), anchor="mm")
    d.text((rx1 + panel_w // 2, ry1 + 42), "41 lines", fill=GREEN, font=font(28, mono=True), anchor="mm")

    code_sf = [
        "# CLAUDE.md",
        "",
        "## Auth",
        "Run: /auth setup",
        "",
        "This skill will:",
        "- Wire NextAuth v5 (Google + GitHub)",
        "- Add session middleware",
        "- Generate auth.config.ts",
        "- Add protected route HOC",
        "- Write auth tests",
        "- Update .env.example",
        "",
        "## Stripe",
        "Run: /stripe payments",
        "",
        "## Database",
        "Run: /database setup",
        "",
        "## Deploy",
        "Run: /deploy config",
        "",
        "# That's it.",
        "# 10 skills. One file.",
        "# Ship in a day.",
    ]

    cy = ry1 + 68
    for line in code_sf:
        if line.startswith("#"):
            color = GOLD
        elif line.startswith("Run:"):
            color = GREEN
        elif line.startswith("-"):
            color = TEXT
        elif line.startswith("##"):
            color = BLUE
        else:
            color = MUTED
        d.text((rx1 + 12, cy), line, fill=color, font=font(10, mono=True))
        cy += 13
        if cy > ry2 - 30:
            break

    # Short bar
    short_bar_w = int((panel_w - 24) * 41 / 847)
    d.rounded_rectangle([rx1 + 12, ry2 - 30, rx1 + 12 + short_bar_w, ry2 - 16], radius=3, fill=GREEN)
    d.text((rx1 + panel_w // 2, ry2 - 8), "41 lines total — 95% less code", fill=GREEN, font=font(11), anchor="mm")

    # VS badge in gutter
    mid_x = (lx2 + rx1) // 2
    mid_y = top + panel_h // 2
    vw = 54
    draw_rounded_rect(d, [mid_x - vw // 2, mid_y - 22, mid_x + vw // 2, mid_y + 22], 8, fill=(30, 30, 30), outline=BORDER, width=1)
    d.text((mid_x, mid_y), "vs", fill=MUTED, font=font(18), anchor="mm")

    # Bottom price
    d.text((W // 2, H - 18), "One-time $49 · Lifetime updates · MIT licensed", fill=MUTED, font=font(13), anchor="mm")

    img.save(OUT / "ship-fast-03-diff-stat.png", optimize=True)
    print(f"  ✓ ship-fast-03-diff-stat.png")


if __name__ == "__main__":
    print("Generating Ship Fast product images...")
    make_before_after()
    make_in_action()
    make_diff_stat()
    print(f"\nDone — saved to {OUT}")

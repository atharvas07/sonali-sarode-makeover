# Build Notes — Sonali Sarode Makeover (2026-10-19)

## What's placeholder
- **All 14 images** in `assets/images/` are branded placeholder SVGs
  (ivory→blush gradient, gold frame/arch, slot label). Real Instagram photos are
  being collected separately — see `IMAGE_MANIFEST.md` for the swap guide.
- **WhatsApp number**: `js/main.js` top has `const WHATSAPP_NUMBER = "91XXXXXXXXXX"`.
  Every WhatsApp link on the site (nav CTA, hero, all 6 service cards, contact
  card, floating button, enquiry form) is generated from this one constant.
  Replace with Sonali's real number (digits only, with country code, e.g.
  `"919876543210"`) before launch.
- **Copy**: About section uses only verified-safe statements (based in Nashik,
  travels for bookings; philosophy paragraphs are generic craft statements, not
  claims of experience/awards). No prices anywhere (per owner's "enquire for
  quote"). No testimonials section (no verified quotes yet).

## Deferred / not built
- **Video**: the "In Motion" section is a Ken Burns filmstrip of stills. If real
  video clips arrive, swap the `.filmstrip-track` for a muted autoplay `<video>`.
- **Form backend**: the enquiry form composes a pre-filled WhatsApp message and
  opens `wa.me` — no server, no storage (noted under the form). If a real inbox
  is ever wanted, add Formspree/Netlify Forms later.
- **Testimonials**: omitted entirely until real, permissioned client quotes exist.
- **SEO extras**: basic title/meta description are in place; no sitemap/OG image
  yet (add an OG image once real photos land).
- **Fonts**: Google Fonts (Cormorant Garamond + Jost) via `<link>`. If the site
  must work fully offline, self-host the woff2 files under `assets/fonts/`.

## Verification done
- `node --check js/main.js` — syntax OK.
- Asset-reference sweep: every `src` in `index.html` resolves to a file in
  `assets/images/` (checked via script).
- Rendered `index.html` headlessly and captured desktop + mobile screenshots;
  checked hero, nav, marquee, cards, grid, filmstrip, FAQ, form and footer for
  layout breakage (see QA notes in the delivery report).

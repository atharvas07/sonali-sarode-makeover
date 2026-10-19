REAL PHOTOS LIVE (2026-10-19): all 14 slots now use genuine Instagram photos from @sonalisarode_makeover (640px), bundled locally in assets/images/. Originals archived in assets/ig/. Verified bio facts added to About: 15+ years experience; Nashik/Pune/Mumbai.

# Image Manifest — Sonali Sarode Makeover

Every slot below currently holds a branded placeholder SVG in `assets/images/`.
When the real Instagram photos arrive, **replace the file contents in place**
(same filename) — the HTML references stay valid, no code changes needed.
Export web-ready JPGs (sRGB, quality ~80, max 1600px on the long edge) and
save them over the placeholder with the **same name but a `.jpg` extension is
NOT enough** — either keep `.svg`→replace with `.jpg` and update the two
`src` attributes in `index.html`, or simplest: keep the exact filenames and
let the real photos take the `.svg` name. Recommended: swap to `.jpg` and do a
find-replace of the filename in `index.html`.

| Slot file | Current size | Replace with | Guidance |
|---|---|---|---|
| `hero.svg` | 900×1200 (3:4) | Best bridal portrait, 3:4 or taller | The single strongest image: sharp eyes, glowing skin, soft background. This sits in the arch frame with a gold offset ring — vertical composition is essential. |
| `about.svg` | 960×1200 (4:5) | Warm portrait of Sonali (ideally at work or smiling) | Human, approachable. A behind-the-scenes shot of her doing makeup works beautifully here. |
| `work-01.svg` | 900×1200 (3:4) | Bridal look — soft glam | Grid hero tile (spans 2 rows on desktop). Pick a striking full-face bridal shot. |
| `work-02.svg` | 1200×1200 (1:1) | Engagement glow | Close crop, luminous skin. |
| `work-03.svg` | 960×1200 (4:5) | Classic bridal | Traditional red/maroon bridal look if available. |
| `work-04.svg` | 900×1200 (3:4) | Party look — evening | Grid tall tile. Smoky eye / evening glam. |
| `work-05.svg` | 1200×1200 (1:1) | Hairstyling detail | Back-of-head bun/braid detail shot. |
| `work-06.svg` | 960×1200 (4:5) | Pre-wedding editorial | Grid tall tile. Outdoor / editorial-style shot. |
| `work-07.svg` | 900×1200 (3:4) | Saree drape & finish | Full or 3/4 length showing drape + makeup. |
| `work-08.svg` | 1200×1200 (1:1) | Reception radiance | Grid tall tile. Happy, radiant reception look. |
| `film-01.svg` … `film-04.svg` | 1600×900 (16:9) | Wide cinematic shots | Used in the auto-scrolling "In Motion" filmstrip with Ken Burns zoom. Landscape orientation required; detail shots (brushes, jewellery, eye close-ups) work best. If real video clips become available later, this section can be upgraded to a `<video>` element. |

**Lightbox captions** live in `index.html` as `data-caption` on each `.work-item`
— update them to match the real photos (e.g. bride's first name + occasion, only
with permission).

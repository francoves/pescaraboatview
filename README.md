# Pescara Boat View 🚤

One-page site for handcrafted boat trips on the **Costa dei Trabocchi** (Abruzzo, Italy).
Departures from **Pescara** and **Francavilla al Mare**. Trilingual: 🇮🇹 IT · 🇬🇧 EN · 🇷🇺 RU.

Static site — pure HTML/CSS/JS, no build step. Deploys to Vercel as-is.

## ✏️ Things to edit before going live
All in **`js/app.js`**, top of file (`CONFIG`):
- `whatsapp` → your WhatsApp number, international format, digits only (e.g. `393331234567`).
- `email` → your contact email.

Other quick edits:
- Brand name "Pescara Boat View" → search/replace in `index.html`, `js/i18n.js`.
- Legal line (P.IVA / C.F.) → key `ft.legal` in `js/i18n.js` (3 languages).
- Replace stock media in `assets/` with your real boat photos/videos (keep the same filenames and they just work).

## Structure
```
index.html          markup (Italian inline + data-i18n keys)
css/styles.css       design system
js/i18n.js           IT/EN/RU dictionary
js/app.js            language switch, menu, animations, WhatsApp links
assets/img           photos + video posters (web-optimized)
assets/video         hero/background videos (web-optimized, muted, looped)
tools/               Freepik download + ffmpeg transcode scripts (dev only)
```

## Media
Stock media curated via the Freepik API and transcoded for web with ffmpeg.
The API key and the heavy 4K originals are **git-ignored** and never deployed.
Replace with real footage when available.

---
🤖 Built with [Claude Code](https://claude.com/claude-code)

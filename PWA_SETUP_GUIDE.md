# TradeJournal Pro — PWA Setup Guide

## Files You Need (keep all 3 together in one folder)
```
📁 TradeJournal/
  ├── trading_journal.html   ← Main app
  ├── manifest.json          ← App identity & icons config
  └── sw.js                  ← Service worker (offline support)
```

---

## STEP 1 — Add App Icons (Required)

The manifest references two icon files you need to create:
- `icon-192.png` (192×192 px)
- `icon-512.png` (512×512 px)

**Quick way:** Go to https://realfavicongenerator.net
- Upload any image (a chart icon, "TJ" text, etc.)
- Download the generated icons
- Rename them to `icon-192.png` and `icon-512.png`
- Put them in the same folder as your HTML

---

## STEP 2 — Host on GitHub Pages (Free, 5 minutes)

### 2a. Create a GitHub account
→ github.com (free)

### 2b. Create a new repository
- Click "New repository"
- Name it: `tradejournal`
- Set to **Public**
- Click "Create repository"

### 2c. Upload your files
- Click "uploading an existing file"
- Drag ALL files into the upload area:
  - trading_journal.html
  - manifest.json
  - sw.js
  - icon-192.png
  - icon-512.png
- Click "Commit changes"

### 2d. Enable GitHub Pages
- Go to Settings → Pages
- Source: "Deploy from a branch"
- Branch: main → / (root)
- Click Save

### 2e. Your app URL will be:
```
https://YOUR-USERNAME.github.io/tradejournal/trading_journal.html
```
(Takes 1-2 minutes to go live)

---

## STEP 3 — Install on Android Phone

1. Open Chrome on your Android phone
2. Go to your GitHub Pages URL
3. Wait for the page to fully load
4. You'll see a banner at the bottom: **"Add TradeJournal to Home screen"**
5. Tap **Install** (or tap ⋮ menu → "Add to Home screen")
6. Tap **Add**

✅ The app icon appears on your home screen
✅ Opens fullscreen like a native app
✅ Works completely offline
✅ All your trades saved on the device

---

## STEP 4 — Install on iPhone (iOS)

1. Open **Safari** (must be Safari, not Chrome)
2. Go to your GitHub Pages URL
3. Tap the **Share button** (box with arrow pointing up)
4. Scroll down → tap **"Add to Home Screen"**
5. Name it "TradeJournal" → tap **Add**

✅ App icon on home screen
✅ Opens fullscreen
✅ Works offline

---

## What Works Offline
- ✅ Logging new trades
- ✅ Viewing entire journal
- ✅ Analytics and stats
- ✅ Dark/light theme
- ✅ All data (saved in browser storage)
- ⚠️ Excel export needs internet first time (loads the xlsx library)
- ⚠️ Fonts load from cache after first visit

---

## Your Data
All trades are saved in **localStorage** on your device.
- Data persists between sessions
- Not synced to cloud (stays private on your phone)
- To backup: use the Export Excel button regularly

---

## Troubleshooting

**"Install" banner not showing?**
→ Must be served over HTTPS (GitHub Pages does this automatically)
→ localhost won't trigger install prompt

**App not working offline?**
→ Visit the page once while online to cache everything
→ Then it works offline forever

**Icons not showing?**
→ Make sure icon-192.png and icon-512.png are in the same folder
→ Clear browser cache and reload

---

## Alternative Hosting (if not GitHub)

| Platform | URL | Free |
|---|---|---|
| Netlify | netlify.com | ✅ Drag & drop folder |
| Vercel | vercel.com | ✅ |
| Cloudflare Pages | pages.cloudflare.com | ✅ |

Netlify is the easiest — just drag your folder into their dashboard.

# 🌱 KRISP

**Grow. Track. Harvest.**

KRISP is a personal hydroponic-garden management app for a home growing setup — an eight-foot hydroponic tower, two tabletop gardens, and a seed-starting tray. It turns the day-to-day of indoor growing into a single, beautiful dashboard: plan every pod, track planting waves, keep pH and EC in range, log maintenance, watch plants grow, and know exactly when it's time to harvest, replant, prune, or clean.

It runs as a single-page web app — no build step, no framework install. Open it in a browser and it works offline out of the box, with optional cloud sync and a public "read-only" garden page you can share.

---

## Table of contents

- [Highlights](#highlights)
- [The growing setup](#the-growing-setup)
- [App tour](#app-tour)
- [Quick start](#quick-start)
- [How it works](#how-it-works)
- [Cloud sync & sharing (optional)](#cloud-sync--sharing-optional)
- [Project structure](#project-structure)
- [Configuration](#configuration)
- [Data & privacy](#data--privacy)
- [Contributing](#contributing)

---

## Highlights

- 🗼 **Visual tower map** — see the whole 10-level, 80-pod tower at a glance, plus two tabletop gardens and a seed-starting tray. View it as an elevation, a top-down map, or by rows.
- 🌿 **Per-pod tracking** — every pod has a plant, a variety, a stage (seed → seedling → growing → fruiting → harvest), and a full history.
- 🧪 **Nutrient & water tools** — a nutrient calculator, a mixing checklist, and pH / EC / water-level / reservoir logging with trends over time.
- 📋 **Smart tasks** — succession-planting cadence, "coming up" reminders, and one-tap quick logging for waterings, top-offs, and problems.
- 🌾 **Harvest planning** — days-to-maturity estimates per crop tell you what's ready now and what's next.
- 📸 **Photo timeline & webcam** — attach a live camera stream and build a visual record of the tower over time.
- 🖼️ **150+ plant icons** — hand-picked art for lettuces, herbs, peppers, tomatoes, peas, berries, and more, with graceful fallbacks.
- 📴 **Offline-first** — everything lives in local storage by default; cloud sync is purely optional.

---

## The growing setup

KRISP is modeled around a real four-part indoor garden:

| System | Layout | Capacity | Notes |
| --- | --- | --- | --- |
| **Nutraponics Tower** | 10 levels × 8 pods | 80 pods | The centerpiece — planted in a slow spiral so something is always ready. Some pods are left open for airflow. |
| **Tabletop A** | 3 × 4 | 12 pods | Countertop garden |
| **Tabletop B** | 3 × 4 | 12 pods | Countertop garden |
| **Seed Starter Tray** | 5 × 12 | 60 cells | Nursery for starting seedlings before they move up |

The garden grows lettuce and greens, basil and herbs, scallions, snap and snow peas, cucumbers, sweet and hot peppers, cherry tomatoes, and strawberries — each with its own color, abbreviation, days-to-maturity range, and succession advice.

---

## App tour

The app is organized into a simple bottom-nav set of tabs:

- **Start** — first-run setup for a brand-new garden.
- **Today** — the home view: what needs doing, what's coming up, and the tower right now.
- **Tower** — the interactive map. Tap a pod to plant it, view its history, prune, harvest, or report a problem. Switch between elevation, top-down, and row views, and browse the tower photo timeline.
- **Plants** — what's growing, planting waves, succession cadence, and your seed & starter inventory.
- **Water** — reservoir health, pH / EC / temperature / level logging, the nutrient calculator, and the mixing checklist.
- **Tasks** — the running to-do list and recent activity log.
- **Harvest** — days-to-maturity tracking so you know what's ready and what's next.

There's also a **public landing page** ("A garden growing in the living room") that shows live tower stats, the webcam, and the current map to anyone with the link — without exposing edit access.

---

## Quick start

No build tools required — KRISP is plain HTML, CSS, and JavaScript.

### Option A — open the file

Just open `index.html` in a modern browser. The app runs entirely offline against local storage.

### Option B — serve locally (recommended)

Serving over `http://` (rather than `file://`) makes icons, fonts, and optional cloud sync behave consistently:

```bash
python3 -m http.server 8321
```

Then visit **http://localhost:8321/**.

> This matches the project's `.claude/launch.json` dev config, so the same command works with the in-editor preview.

---

## How it works

KRISP is a self-contained single-page app:

- **`index.html`** holds the entire UI and all garden logic — plant definitions, systems layout, pod state, tasks, and rendering — written against a small template runtime.
- **`support.js`** is that runtime: a generated helper bundle (custom `<x-dc>`, `<sc-if>`, `<sc-for>` elements) that powers the reactive templates. It's generated code — don't hand-edit it.
- **`icons/`** contains the plant artwork, organized into the base set, an `added/` set, and an `fp/` (fallback/extended) set, resolved by plant type and variety name.
- State is kept in the browser and persisted to local storage, so your garden survives refreshes with no server needed.

---

## Cloud sync & sharing (optional)

By default KRISP is 100% local. If you want your garden to sync across devices and expose a shareable public page, it can connect to a [Supabase](https://supabase.com) backend:

- **`config.js`** holds the backend URL and the **publishable** (client-safe) key.
- **`krisp-sync.js`** is the sync layer (`window.KrispSync`). It:
  - signs the owner in with a one-time **magic link** by email (passwordless),
  - loads and saves the whole garden as a single document,
  - and serves a **public, read-only** view to anyone visiting the link.

Security is enforced by **row-level security in the database**, not by hiding anything in the client. Only the authenticated owner can write; everyone else can read the public garden.

Until `config.js` is filled in, the app simply runs offline on local storage — sync is a no-op.

---

## Project structure

```
Krisp App/
├── index.html          # The entire app UI + garden logic
├── support.js          # Generated template runtime (do not edit by hand)
├── config.js           # Backend URL + publishable key (client-safe)
├── krisp-sync.js       # Optional Supabase sync layer (window.KrispSync)
├── icons/              # 150+ plant icons (base, added/, fp/ sets)
├── uploads/            # User-attached photos
├── .claude/            # Editor/dev launch config
└── README.md
```

---

## Configuration

Cloud sync is configured in [`config.js`](config.js):

```js
window.KRISP_CONFIG = {
  SUPABASE_URL: 'https://<your-project>.supabase.co',
  SUPABASE_KEY: 'sb_publishable_...',   // publishable / client-safe key only
};
```

> ⚠️ **Only ever put the publishable key here.** The `sb_secret_...` key bypasses all
> security and must never appear anywhere in the app. If you don't configure a
> backend, KRISP runs fully offline.

---

## Data & privacy

- **Offline by default** — your garden lives in your browser's local storage.
- **You own your data** — with sync enabled, the entire garden is a single row that only you (the authenticated owner) can edit.
- **Public sharing is opt-in and read-only** — the shareable landing page can display live stats, the tower map, and a webcam feed, but never grants edit access.

---

## Contributing

This is a personal project, but improvements are welcome:

1. Edit `index.html` for UI and garden logic.
2. **Don't hand-edit `support.js`** — it's generated from the `dc-runtime` source.
3. Add new plant art under `icons/` and register it in the icon maps in `index.html`.
4. Test by serving locally and checking the Today, Tower, Water, and Harvest tabs.

---

<div align="center">

🌱 **KRISP** — a garden growing in the living room.

</div>

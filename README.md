# 🍽️ Yaki — QR-Based Restaurant Ordering System

Yaki is a lightweight, real-time restaurant ordering system built as a Progressive Web App (PWA). Customers scan a QR code at their table to browse the menu, place orders, call staff, and pay — all from their own phone, no app install required. Staff manage everything through dedicated cashier, kitchen, and manager dashboards that update live.

The frontend is plain HTML/CSS/JavaScript (no framework). Data and authentication run on **Firebase Firestore**, server-side integrations run on **Cloudflare Workers**, and the app is hosted as a static site (Vercel + GitHub Pages compatible).

---

## ✨ Features

- **QR table ordering** — each table has a unique URL + session token, so orders are tied to the correct table.
- **Real-time sync** — orders, statuses, and staff calls update instantly across all dashboards via Firestore listeners.
- **Four role-based interfaces** — Customer, Cashier, Kitchen, and Manager.
- **Multilingual UI** — Vietnamese, English, Chinese (中文), Japanese (日本語), and Korean (한국어).
- **AI menu assistant** — a Google Gemini–powered chatbot recommends dishes based on customer preferences (built into the customer page).
- **Payments** — VietQR display + Casso webhook for automatic bank transfer confirmation, plus card/cash options.
- **Offline-capable PWA** — a service worker pre-caches the app shell and caches product images for fast loads.
- **Menu & category management** — managers can add/edit/delete products and categories, with AI-assisted name translation.

---

## 🏗️ Architecture

```
┌──────────────────────────┐        ┌──────────────────────────┐
│  Static PWA (browser)    │        │   Cloudflare Worker       │
│  HTML + CSS + JS          │        │   (food-order-at-table)   │
│                           │        │                           │
│  • customer.html          │  HTTPS │  POST /            → Gemini│
│  • cashier.html           ├───────►│  POST /webhook/casso → pay │
│  • kitchen.html           │        └────────────┬──────────────┘
│  • manager.html           │                     │
│  • index.html (landing)   │                     ▼
└────────────┬──────────────┘        ┌──────────────────────────┐
             │  Firebase SDK         │   Google Gemini API       │
             ▼                       │   + Casso bank webhook    │
┌──────────────────────────┐        └──────────────────────────┘
│  Firebase Firestore       │
│  • tables                 │
│  • products               │
│  • settings               │
│  • payments               │
└──────────────────────────┘
```

**Why HTML files live at the web root:** the app is deployed as a static site on Vercel and GitHub Pages, served directly from the root. The service worker ([`UX/sw.js`](UX/sw.js)) also pre-caches absolute paths like `/customer.html`. Moving the entry HTML files into a subfolder would break both deployment and offline caching, so they stay at the root while CSS and JS are organized into `css/` and `js/` subfolders.

---

## 📁 Project Structure

```
order_food_at_table/
├── package.json            # Root metadata + dev/deploy scripts
├── index.js                # Placeholder entry (not used by the app)
├── README.md               # This file
└── UX/                     # The deployable web root
    ├── index.html          # Landing page (links to the 4 interfaces)
    ├── customer.html        # Customer ordering page + AI chatbot
    ├── cashier.html         # Cashier dashboard
    ├── kitchen.html         # Kitchen display
    ├── manager.html         # Manager dashboard (menu/category/table admin)
    ├── seed-products.html   # One-off tool to seed sample products
    ├── sw.js                # Service worker (app shell + image cache)
    ├── manifest.json        # PWA manifest
    │
    ├── css/                 # Extracted stylesheets (one per page)
    │   ├── index.css
    │   ├── customer.css
    │   ├── cashier.css
    │   ├── kitchen.css
    │   ├── manager.css
    │   └── seed-products.css
    │
    ├── js/                  # Extracted page logic (one per page)
    │   ├── customer.js      # Ordering, cart, AI chatbot, service worker reg.
    │   ├── cashier.js
    │   ├── kitchen.js
    │   ├── manager.js
    │   └── seed-products.js
    │
    ├── icons/               # PWA icons (SVG)
    ├── docs/                # Setup guides (EN + VI)
    ├── archive/             # Legacy / unused code (see archive/README.md)
    │
    ├── worker/              # Cloudflare Worker (server-side integrations)
    │   ├── src/index.js     # Gemini proxy + Casso payment webhook
    │   ├── wrangler.toml     # Worker config (vars + secrets)
    │   └── package.json
    │
    ├── firebase.json        # Firebase config (Firestore rules ref)
    ├── firestore.rules      # Firestore security rules
    └── .firebaserc          # Firebase project alias
```

> **Note on structure:** All inline `<style>` and `<script>` blocks were originally crammed into each HTML file. They have been extracted into matching files under `css/` and `js/` so each page is split cleanly into structure (HTML), presentation (CSS), and behavior (JS). The Firebase SDK `<script src>` tags remain in the HTML `<head>` because the page scripts depend on the global `firebase` object being loaded first.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (only for local serving and the Worker tooling)
- A [Firebase](https://firebase.google.com/) project with Firestore enabled
- (Optional) A [Cloudflare](https://www.cloudflare.com/) account for the Worker
- (Optional) A [Google Gemini API](https://ai.google.dev/) key for the AI chatbot
- (Optional) A [Casso](https://casso.vn/) account for automatic payment confirmation

### 1. Run the frontend locally

From the project root:

```bash
npm start
```

This serves the `UX/` folder as a static site (via `npx serve`). Open the printed URL in your browser. The landing page links to all four interfaces.

### 2. Configure Firebase

The Firebase web config is embedded in the page scripts (e.g. [`UX/js/customer.js`](UX/js/customer.js)). Replace it with your own project's config:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  // ...
};
```

Deploy the Firestore security rules:

```bash
npm run deploy:rules
```

> ⚠️ **Security note:** the current [`UX/firestore.rules`](UX/firestore.rules) are permissive (open writes) to ease testing. Tighten them before any production use.

### 3. Seed sample data (optional)

Open `seed-products.html` in the browser and click **Seed All Products** to populate Firestore with 33 sample dishes across categories (grilled, hotpot, sides, drinks, appetizers, desserts).

### 4. Deploy the Cloudflare Worker (optional)

The Worker proxies Gemini API calls (keeping the API key server-side) and handles the Casso payment webhook.

```bash
npm run worker:install
npm run worker:dev      # local development
npm run worker:deploy   # deploy to Cloudflare
```

Configure variables and secrets in [`UX/worker/wrangler.toml`](UX/worker/wrangler.toml):

| Type   | Name                      | Purpose                                  |
|--------|---------------------------|------------------------------------------|
| var    | `FIREBASE_PROJECT_ID`     | Firestore project for webhook writes     |
| var    | `FIREBASE_API_KEY`        | Firebase Web API key                     |
| secret | `GEMINI_API_KEY`          | Google Gemini API key                    |
| secret | `CASSO_SECURE_TOKEN`      | Casso webhook verification token         |
| secret | `FIREBASE_ADMIN_EMAIL`    | Service account email for Firestore auth |
| secret | `FIREBASE_ADMIN_PASSWORD` | Service account password                 |

Set secrets with `wrangler secret put <NAME>` (run from `UX/worker/`).

---

## 📜 NPM Scripts

| Script                  | Description                                          |
|-------------------------|------------------------------------------------------|
| `npm start` / `npm run dev` | Serve the `UX/` folder locally via `npx serve`   |
| `npm run deploy:rules`  | Deploy Firestore security rules                      |
| `npm run worker:install`| Install Worker dependencies                          |
| `npm run worker:dev`    | Run the Worker locally with Wrangler                 |
| `npm run worker:deploy` | Deploy the Worker to Cloudflare                      |

---

## 🧩 The Four Interfaces

| Page             | Audience  | What it does                                                                 |
|------------------|-----------|------------------------------------------------------------------------------|
| `customer.html`  | Diners    | Browse menu, manage cart, place orders, call staff, pay, chat with AI assistant |
| `cashier.html`   | Cashier   | View tables, process payments, open/close table sessions                     |
| `kitchen.html`   | Kitchen   | See incoming orders, cycle item statuses (pending → cooking → done)          |
| `manager.html`   | Manager   | Everything cashier/kitchen can do + manage products, categories, table count |

All dashboards (cashier/kitchen/manager) are protected by a login panel and update in real time through Firestore listeners.

---

## 🔌 Cloudflare Worker Endpoints

The Worker ([`UX/worker/src/index.js`](UX/worker/src/index.js)) exposes:

- **`POST /`** — Gemini proxy. The frontend sends a prompt; the Worker forwards it to `gemini-2.5-flash` using the server-held API key and returns the response. This keeps the Gemini key out of the client.
- **`POST /webhook/casso`** — Casso payment webhook. When a bank transfer arrives, Casso calls this endpoint; the Worker verifies the token, matches the transaction to a table, and updates the `tables` and `payments` collections in Firestore.

---

## 🗄️ Firestore Collections

| Collection | Purpose                                                        |
|------------|----------------------------------------------------------------|
| `tables`   | Per-table state: current orders, session token, staff calls, payment status |
| `products` | Menu items (name, price, category, image)                      |
| `settings` | Global config such as table count and categories               |
| `payments` | Payment records created on successful transactions             |

---

## 🔐 Security Considerations

- **Firestore rules are currently open** for testing — restrict reads/writes per collection before production.
- **API keys:** the Gemini key is correctly proxied server-side via the Worker. The Firebase Web config is client-exposed by design (this is normal for Firebase), but security must be enforced through Firestore rules, not by hiding the config.
- **Session tokens:** customer sessions use a per-table token to prevent cross-table tampering, validated on load.

---

## 🔄 Service Worker & Cache Updates

The PWA caches assets through [`UX/sw.js`](UX/sw.js) using two strategies:

- **App shell (Network-first):** HTML, CSS, JS, manifest and icons listed in `APP_SHELL_FILES`. When online, the service worker always fetches the latest version from the network and refreshes the cache; it only falls back to the cache when offline. This means a normal redeploy is picked up automatically — users get the new version on their next online visit.
- **Product images (Cache-first):** images from the allowed domains are served from cache for speed, and can be cleared at runtime via the `clearImageCache` message.

**Releasing a new version:** all caches are tied to a single `SW_VERSION` constant at the top of [`UX/sw.js`](UX/sw.js). Bump that one value (e.g. `v3` → `v4`) whenever you change cached assets. The `activate` event then automatically deletes every older `yaki-*` cache, so users never get stuck on a stale build.

```js
// UX/sw.js
const SW_VERSION = 'v3'; // ← bump this on each release
```

> When you add a new page (new HTML/CSS/JS), remember to add its paths to `APP_SHELL_FILES` so it works offline, and bump `SW_VERSION`.

---

## 📚 Additional Documentation

- [`UX/docs/SETUP_GUIDE_EN.md`](UX/docs/SETUP_GUIDE_EN.md) — detailed setup guide (English)
- [`UX/docs/SETUP_GUIDE_VI.md`](UX/docs/SETUP_GUIDE_VI.md) — detailed setup guide (Vietnamese)
- [`UX/README_VI.md`](UX/README_VI.md) — Vietnamese project overview
- [`UX/technical_report.md`](UX/technical_report.md) — technical report
- [`UX/archive/README.md`](UX/archive/README.md) — notes on legacy/unused code

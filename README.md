# Personal Portfolio — Bayu Adjie Rossena

A lightweight personal portfolio focused on practical digital solutions for business operations.

## Selected work
- TITIPLO — SaaS platform for jastip businesses
- Loss of Sales Dashboard — inventory intelligence & sales-loss monitoring
- NFC Review System — NFC + QR activation and review routing
- E-commerce Automation — marketplace and commerce workflow automation
- Android Anti-Theft — mobile security experiment

## Stack
- HTML
- CSS
- Vanilla JavaScript

The site is intentionally dependency-free so it can be deployed directly to GitHub Pages or Cloudflare Pages with no build step.

## Local preview
Open `index.html` directly, or serve the folder with any static HTTP server.

## Deploy
For Cloudflare Pages:
- Framework preset: None
- Build command: leave empty
- Build output directory: `/`

For GitHub Pages:
- Deploy from branch: `main`
- Folder: `/ (root)`

---
Built as a living portfolio — project screenshots, contact channels, and deeper case-study detail can be added incrementally.


## CMS / Backend

Portfolio sekarang memiliki CMS ringan:

- Admin: `/admin/`
- Backend: Cloudflare Worker
- Storage: Cloudflare KV
- Fallback: `content/site.json`

### 1. Buat KV namespace

Di Cloudflare:

```
Workers & Pages
→ KV
→ Create namespace
```

Nama bebas, misalnya:

```
barsena-portfolio-content
```

Copy namespace ID lalu masukkan ke:

```
worker/wrangler.toml
```

Ganti:

```toml
id = "REPLACE_WITH_KV_NAMESPACE_ID"
```

### 2. Install dan deploy Worker

Dari folder `worker`:

```bash
npm install
npx wrangler login
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put SESSION_SECRET
npm run deploy
```

Untuk `SESSION_SECRET`, gunakan string acak panjang.

Contoh Worker URL setelah deploy:

```
https://barsena-portfolio-cms.<subdomain>.workers.dev
```

### 3. Hubungkan website

Edit:

```
config.js
```

Menjadi:

```js
window.PORTFOLIO_CONFIG = {
  apiUrl: "https://barsena-portfolio-cms.<subdomain>.workers.dev"
};
```

Commit ke branch `main`.

### 4. Masuk admin

Buka:

```
https://barilia1998.github.io/Personal-Webs/admin/
```

Masukkan Worker URL jika belum tersimpan, lalu login menggunakan `ADMIN_PASSWORD`.

Konten yang disimpan dari admin akan langsung dibaca website melalui Worker + KV. Jika API gagal, website otomatis menggunakan `content/site.json`.

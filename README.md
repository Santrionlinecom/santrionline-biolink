# SantriOnline Biolink

SvelteKit + Cloudflare biolink/shortlink analytics untuk `santrionline.my.id`.

Konsep produk mengikuti arah Librelinks: halaman bio yang bisa dikustom, dashboard admin, dan insight klik seperti profile views/clicks/source/device. Implementasi dibuat Cloudflare-native agar ringan dan hemat: SvelteKit, Cloudflare Pages, D1, dan endpoint redirect `/r/[slug]`.

## Fitur MVP

- Halaman publik bio/link hub di `/`
- Redirect tracking di `/r/[slug]`
- Dashboard admin di `/admin`
- Login admin sederhana via `ADMIN_PASSWORD`
- CRUD link: slug, title, URL, icon, kategori, urutan, status aktif
- Edit profil: nama, bio, lokasi, avatar, CTA utama
- Statistik klik total, 7 hari, per link, referrer/source
- Data geo/device/browser dari Cloudflare request metadata bila tersedia
- Fallback data agar halaman tetap tampil saat D1 belum tersambung

## Stack

- SvelteKit
- @sveltejs/adapter-cloudflare
- Cloudflare Pages/Workers runtime
- Cloudflare D1
- TypeScript
- CSS custom tanpa UI library berat

## Setup lokal

```bash
npm install
npm run check
npm run build
npm run preview
```

## Cloudflare D1

Buat database:

```bash
wrangler d1 create santrionline-biolink-db
```

Masukkan `database_id` ke `wrangler.toml`, lalu jalankan migrasi:

```bash
wrangler d1 migrations apply santrionline-biolink-db --remote
```

## Secrets / Environment Variables

Set di Cloudflare Pages dashboard:

```env
PUBLIC_SITE_URL=https://santrionline.my.id
PUBLIC_SITE_NAME=SantriOnline Links
ADMIN_EMAIL=masyogik@santrionline.com
ADMIN_PASSWORD=isi-password-kuat
ADMIN_SESSION_SECRET=isi-random-secret
```

Jangan commit `.env` atau password asli.

## Deploy

```bash
npm run deploy
```

Atau build command di Cloudflare Pages:

```bash
npm run build
```

Output directory:

```text
.svelte-kit/cloudflare
```

## Domain

Set custom domain Cloudflare Pages ke:

```text
santrionline.my.id
```

Jika domain masih terhubung ke Worker/Pages lama, lepas route/custom domain lama dulu setelah preview project baru sudah OK.

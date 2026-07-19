# Big Bear Little Bear Family Homestay Landing Page

Static landing page for a family homestay near Shanghai LEGOLAND Resort, optimized for international guests, SEO and GEO/AI search.

## Recommended domain

Use `bigbearlittlebear.islahser.com`.

It is shorter and less typo-prone than `bigbeearlittlebearhotel.islahser.com`, while keeping the memorable Big Bear Little Bear name.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The static site is generated in `dist/`.

## Cloudflare Pages

Use these settings:

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Environment variables: none required

After deployment, add the custom domain `bigbearlittlebear.islahser.com` in Cloudflare Pages and point the DNS record from `islahser.com` to the Pages project.

## SEO and GEO files

- `index.html`: title, meta description, Open Graph image and Hotel JSON-LD schema.
- `public/sitemap.xml`: canonical sitemap.
- `public/robots.txt`: crawler access and sitemap location.
- `public/llms.txt`: concise AI-search facts for language models and answer engines.
- `public/_headers`: caching and security headers for Cloudflare Pages.

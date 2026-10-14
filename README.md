# Telesphorepo website

The website and documentation for [Telesphorepo](https://github.com/Telesphorepo/Telesphorepo), at
https://telesphorepo.com. It is an [Astro](https://astro.build) site built with
[Starlight](https://starlight.astro.build).

## Develop

You need [bun](https://bun.sh).

```sh
bun install
bun run dev      # local dev server at http://localhost:4321
bun run build    # production build in dist/
bun run preview  # serve the production build
```

The pages are in `src/content/docs/<section>/<page>.md(x)`. The sidebar is in `astro.config.mjs`.
The theme is in `src/styles/custom.css`. The logo is in `src/assets/logo-mark.svg`,
`src/assets/logo-wordmark.svg` and `public/favicon.svg`. The landing page components are in
`src/components/landing/`. The diagrams are in `src/components/diagrams/`, and any docs page can
import them. Every page also has a Markdown copy at its URL with `.md` added, and the build writes
`llms.txt`. A diagram's Markdown copy is its summary.

## Deploy

Cloudflare builds and deploys the site from this repository. The Worker settings are in
`wrangler.jsonc`.

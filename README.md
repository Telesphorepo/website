# Telesphorepo website

The website and documentation for [Telesphorepo](https://github.com/Telesphorepo/Telesphorepo), at
https://docs.telesphorepo.com (the live demo of the app is https://telesphorepo.com). It is an [Astro](https://astro.build) site built with
[Starlight](https://starlight.astro.build).

## Develop

You need [bun](https://bun.sh).

```sh
bun install
bun run dev      # local dev server at http://localhost:4321
bun run build    # production build in dist/
bun run preview  # serve the production build
```

The pages are in `src/content/docs/<page>.mdx`. The sidebar, the redirects of moved pages and the
`llms.txt` sets are in `astro.config.mjs`. The sidebar opens with Overview (the landing page),
then four groups: Publish your packages, Use packages in your builds, Move from Nexus and Administration.
The theme is in `src/styles/custom.css`. The fonts are Geist, and Geist Mono for code, from
`@fontsource/geist` and `@fontsource/geist-mono`. The landing page components are in
`src/components/landing/`. The questions at the top of a page, such as "Where does the job run?"
and "Which build tool?" (`Choice.astro`), and the step blocks that they show (`Path.astro`) are in
`src/components/choice/`. The diagrams are in `src/components/diagrams/`, and any docs page can
import them. Every page also has a Markdown copy at its URL with `.md` added, and the build writes
`llms.txt`. A diagram's Markdown copy is its summary.

## Brand files

The source of the brand is the `branding/` folder of the Telesphorepo repository
(`C:\Users\telesphoreo\GolandProjects\Telesphorepo\branding` on the maintainer's machine). Its
README gives the construction, the colors and the use of each file. These files are copies of it:

- `src/assets/brand/`: the whole folder.
- `public/favicon.svg`: `favicon.svg`.
- `public/og-image.png`: `png/og-image.png`, the social card.
- `public/apple-touch-icon.png`: `png/favicon-256.png`.

Do not edit the copies. Change the source, then copy the files again. The header uses the flat
lockup and mark. The landing hero and the 404 page use `ticket-skeuomorphic.svg`.

## Deploy

Cloudflare builds and deploys the site from this repository. The Worker settings are in
`wrangler.jsonc`.

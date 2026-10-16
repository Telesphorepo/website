// @ts-check
import {defineConfig} from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator'
import starlightUtils from "@lorenzo_lewis/starlight-utils";
import starlightLlmsTxt from 'starlight-llms-txt';

const sidebar = [
    {label: 'Publish a package', link: '/publish'},
    {label: 'Set up a project', link: '/set-up'},
    {label: 'Download packages', link: '/download'},
    {label: 'Docker and Helm', link: '/docker'},
    {label: 'Run the server', link: '/run-the-server'},
    {
        label: 'Reference',
        collapsed: true,
        items: [
            {label: 'Move from Nexus', link: '/move-from-nexus'},
            {label: 'People and sign-in', link: '/people-and-sign-in'},
            {label: 'Run in production', link: '/production'},
            {label: 'Debian, raw and curl', link: '/debian-and-raw'},
            {label: 'Settings and commands', link: '/reference'},
        ]
    },
    // The header links. starlight-utils takes this group out of the sidebar. Starlight marks only the
    // first sidebar entry with the current page's path, so this group comes last: the sidebar entry
    // with the same path is then the one that shows as current.
    {
        label: "leadingNavLinks",
        items: [
            {label: "Docs", link: "/publish"},
            {label: "Reference", link: "/reference"},
        ]
    },
];

// The docs page ids in sidebar order, after the landing page. The header links are not docs pages.
const pageOrder = ['index', ...sidebar
    .filter((entry) => entry.label !== 'leadingNavLinks')
    .flatMap((entry) => 'items' in entry ? entry.items : [entry])
    .map((entry) => entry.link.slice(1))];

// https://astro.build/config
export default defineConfig({
    site: 'https://docs.telesphorepo.com',
    integrations: [starlight({
        title: 'Telesphorepo',
        description: 'A new, lean, self-hosted artifact repository for Maven, Gradle plugins, Docker images, Helm charts, Debian and raw files. One binary with SQLite inside, and short-lived publish sessions for every upload.',
        favicon: '/favicon.svg',
        social: [
            {icon: 'github', label: 'GitHub', href: 'https://github.com/Telesphorepo/Telesphorepo'},
        ],
        components: {
            Hero: './src/components/landing/Hero.astro',
            SiteTitle: './src/components/overrides/SiteTitle.astro',
            TableOfContents: './src/components/overrides/TableOfContents.astro',
            MobileTableOfContents: './src/components/overrides/MobileTableOfContents.astro',
            ThemeSelect: './src/components/overrides/ThemeSelect.astro',
        },
        customCss: [
            '@fontsource/geist/400.css',
            '@fontsource/geist/500.css',
            '@fontsource/geist/600.css',
            '@fontsource/geist/700.css',
            '@fontsource/geist-mono/400.css',
            '@fontsource/geist-mono/500.css',
            './src/styles/custom.css',
        ],
        expressiveCode: {
            themes: ['github-dark-default', 'github-light'],
            styleOverrides: {
                codeFontFamily: "'Geist Mono', ui-monospace, monospace",
                uiFontFamily: "'Geist', system-ui, sans-serif",
                borderRadius: '8px',
                borderColor: 'var(--tr-line)',
                codeBackground: 'var(--tr-surface)',
                frames: {
                    editorBackground: 'var(--tr-surface)',
                    terminalBackground: 'var(--tr-surface)',
                    editorTabBarBackground: 'var(--tr-page)',
                    terminalTitlebarBackground: 'var(--tr-page)',
                    editorActiveTabBackground: 'var(--tr-surface)',
                    shadowColor: 'transparent',
                },
            },
        },
        sidebar,
        lastUpdated: true,
        routeMiddleware: './src/components/qol/route-data.ts',
        editLink: {
            baseUrl: 'https://github.com/Telesphorepo/website/edit/main/',
        },
        head: [
            // The social card is the brand's og-image (src/assets/brand/png/og-image.png, copied to public/).
            {tag: 'meta', attrs: {property: 'og:image', content: 'https://docs.telesphorepo.com/og-image.png'}},
            {tag: 'meta', attrs: {property: 'og:image:width', content: '1200'}},
            {tag: 'meta', attrs: {property: 'og:image:height', content: '630'}},
            {tag: 'meta', attrs: {property: 'og:image:alt', content: 'The Telesphorepo gold ticket and wordmark on carbon blue'}},
            {tag: 'meta', attrs: {name: 'twitter:card', content: 'summary_large_image'}},
            {tag: 'meta', attrs: {name: 'twitter:image', content: 'https://docs.telesphorepo.com/og-image.png'}},
            {tag: 'link', attrs: {rel: 'apple-touch-icon', href: '/apple-touch-icon.png'}},
            // Dark is the default theme. A first visit stores 'dark'. A later choice in the theme menu
            // (Auto stores '') replaces it.
            {
                tag: 'script',
                content: "try{if(localStorage.getItem('starlight-theme')===null){localStorage.setItem('starlight-theme','dark');document.documentElement.dataset.theme='dark'}}catch(e){}",
            },
        ],
        plugins: [starlightUtils({
            navLinks: {
                leading: {useSidebarLabelled: "leadingNavLinks"}
            }
        }), starlightLinksValidator(), starlightLlmsTxt({
            projectName: 'Telesphorepo',
            description: 'Telesphorepo is a self-hosted repository for Maven and Gradle artifacts, Docker images and Helm charts, Debian packages and raw files. It runs as one Go binary with SQLite and stores files on local disk or in an S3-compatible bucket.',
            details: 'Every page has a Markdown copy at its URL with `.md` added, for example `/publish.md`. The Set up a project, Download packages and Run the server pages hold the steps for every choice, each under its own heading.',
            promote: pageOrder,
            exclude: ['404'],
            customSets: [
                {
                    label: 'Publishing',
                    paths: ['publish', 'set-up', 'docker', 'people-and-sign-in'],
                    description: 'The Telesphorepo CLI (setup, publish and the Docker credential helper), Docker and Helm pushes, CI for GitHub Actions and Jenkins, accounts and two-step verification',
                },
                {
                    label: 'Operations',
                    paths: ['run-the-server', 'production', 'move-from-nexus', 'reference'],
                    description: 'HTTPS, storage, backups, upgrades, the move from Nexus, commands, environment variables and settings',
                },
            ],
        })],
    }), sitemap()],
    vite: {
        plugins: [{
            // The worker bundle pulls in Starlight's Tabs, Steps and FileTree through the content collection,
            // but every page is prerendered. satteri has no build that runs in workerd, so the worker gets a stub.
            // Node prerenders the docs pages with the real satteri.
            // In dev nothing is tree-shaken: StarlightPage loads FileTree, which parses its SVG icons on import.
            // The stub gives those icons an empty tree and still fails any content parse.
            name: 'stub-satteri-in-worker',
            enforce: 'pre',
            applyToEnvironment: (environment) => environment.name === 'ssr',
            resolveId: (id) => id === 'satteri' ? '\0satteri-stub' : null,
            load: (id) => id === '\0satteri-stub'
                ? `export function htmlToHast(html, options) {
                    if (options?.space === 'svg') return {type: 'root', children: []};
                    throw new Error('satteri is not available in the worker');
                }`
                : null,
        }],
    },
    adapter: cloudflare({
        imageService: "compile",
        prerenderEnvironment: "node"
    }),
});

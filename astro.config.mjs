// @ts-check
import {defineConfig} from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator'
import starlightUtils from "@lorenzo_lewis/starlight-utils";
import starlightLlmsTxt from 'starlight-llms-txt';

// A page that is one step of a sequence carries its number. The sidebar shows it before the label
// (src/styles/custom.css, a[data-step]).
const step = (n) => ({attrs: {'data-step': String(n)}});

const sidebar = [
    {label: 'Overview', link: '/'},
    {
        label: 'Publish your packages',
        items: [
            {label: 'Install the CLI', link: '/install-cli', ...step(1)},
            {label: 'Publish from a project', link: '/publish-from-a-project', ...step(2)},
            {label: 'Publish from CI', link: '/publish-from-ci', ...step(3)},
        ]
    },
    {
        label: 'Use packages in your builds',
        items: [
            {label: 'Gradle and Maven', link: '/download'},
            {label: 'npm, pnpm, Yarn, Bun', link: '/npm'},
            {label: 'Python', link: '/python'},
            {label: 'Rust and Cargo', link: '/cargo'},
            {label: '.NET and NuGet', link: '/nuget'},
            {label: 'Docker and Helm', link: '/docker'},
            {label: 'Debian, raw and curl', link: '/debian-and-raw'},
        ]
    },
    {
        label: 'Move from Nexus',
        items: [
            {label: 'Copy your repositories', link: '/move-from-nexus', ...step(1)},
            {label: 'Move your projects by hand', link: '/move-projects-by-hand', ...step(2)},
            {label: 'Move your projects with an AI agent', link: '/move-projects-with-an-agent', ...step(3)},
        ]
    },
    {
        label: 'Administration',
        items: [
            {label: 'Run the server', link: '/run-the-server'},
            {label: 'Repositories and access', link: '/repositories-and-access'},
            {label: 'People and sign-in', link: '/people-and-sign-in'},
            {label: 'Commands and settings', link: '/commands-and-settings'},
        ]
    },
    // The header links. starlight-utils takes this group out of the sidebar. Starlight marks only the
    // first sidebar entry with the current page's path, so this group comes last: the sidebar entry
    // with the same path is then the one that shows as current.
    {
        label: "leadingNavLinks",
        items: [
            {label: "Publish", link: "/install-cli"},
            {label: "Use packages", link: "/download"},
            {label: "Administration", link: "/run-the-server"},
        ]
    },
];

// The docs page ids in sidebar order. The landing page is the Overview entry; the header links are
// not docs pages.
const pageOrder = sidebar
    .filter((entry) => entry.label !== 'leadingNavLinks')
    .flatMap((entry) => 'items' in entry ? entry.items : [entry])
    .map((entry) => entry.link === '/' ? 'index' : entry.link.slice(1));

// Pages that moved: the old address answers with a redirect to the new one. A fragment of the old
// address (such as /production/#back-up) stays on the new one, so the merged pages keep the old
// heading names.
const moved = {
    '/set-up': '/publish-from-a-project',
    '/publish': '/publish-from-a-project',
    '/production': '/run-the-server',
    '/reference': '/commands-and-settings',
    '/move-projects': '/move-projects-with-an-agent',
};
const redirects = Object.fromEntries(Object.entries(moved).flatMap(([from, to]) => [
    [`${from}/`, `${to}/`],
    [`${from}.md`, `${to}.md`],
]));

// https://astro.build/config
export default defineConfig({
    site: 'https://docs.telesphorepo.com',
    redirects,
    integrations: [starlight({
        title: 'Telesphorepo',
        description: 'A new, lean, self-hosted artifact repository for Maven, Gradle plugins, npm, Python, Cargo and NuGet packages, Docker images, Helm charts, Debian and raw files. One binary with SQLite inside, and short-lived publish sessions for every upload.',
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
            description: 'Telesphorepo is a self-hosted repository for Maven and Gradle artifacts, npm packages, Python packages, Rust crates, NuGet packages, Docker images and Helm charts, Debian packages and raw files. Each format has hosted repositories, and most also have proxies and groups. It runs as one Go binary with SQLite and stores files on local disk or in an S3-compatible bucket.',
            details: 'Every page has a Markdown copy at its URL with `.md` added, for example `/publish-from-a-project.md`. The Publish from a project, Publish from CI, Install the CLI, format, Move your projects and Run the server pages hold the steps for every choice, each under its own heading.',
            promote: pageOrder,
            exclude: ['404'],
            customSets: [
                {
                    label: 'Publishing',
                    paths: ['install-cli', 'publish-from-a-project', 'publish-from-ci'],
                    description: 'The Telesphorepo CLI (install, setup, publish and the Docker credential helper), the project file, CI for GitHub Actions and Jenkins',
                },
                {
                    label: 'Formats',
                    paths: ['download', 'npm', 'python', 'cargo', 'nuget', 'docker', 'debian-and-raw'],
                    description: 'Downloads in each format (Gradle and Maven, npm, Python, Cargo, NuGet, Docker and Helm, Debian and raw), with what is different when each one publishes',
                },
                {
                    label: 'Moving from Nexus',
                    paths: ['move-from-nexus', 'move-projects-by-hand', 'move-projects-with-an-agent'],
                    description: 'The copy of Nexus 3 repositories and the switch-over, each project moved by hand or with a coding agent, and the rehearsal of publishing',
                },
                {
                    label: 'Administration',
                    paths: ['run-the-server', 'repositories-and-access', 'people-and-sign-in', 'commands-and-settings'],
                    description: 'HTTPS, storage, backups, upgrades, repositories, proxies and groups, access, CI pipelines, network rules, people, two-step verification, single sign-on, commands, environment variables and settings',
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

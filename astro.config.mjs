// @ts-check
import {defineConfig} from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator'
import starlightLlmsTxt from 'starlight-llms-txt';

// Each group has one reader: the developer who publishes, the admin who runs the server, the
// people who leave Nexus, and the reference pages for both.
const sidebar = [
    {label: 'Quick start', link: '/quick-start'},
    {
        label: 'Publish and use packages',
        items: [
            {label: 'Install the CLI', link: '/install-cli'},
            {label: 'Publish from your computer', link: '/publish-from-a-project'},
            {label: 'Publish from CI', link: '/publish-from-ci'},
            {label: 'Use packages in your builds', link: '/use-packages'},
        ]
    },
    {
        label: 'Run the server',
        items: [
            {label: 'Production setup', link: '/run-the-server'},
            {label: 'Repositories and access', link: '/repositories-and-access'},
            {label: 'People and sign-in', link: '/people-and-sign-in'},
            {label: 'File storage', link: '/store-files-in-r2'},
            {label: 'Back up and restore', link: '/back-up-and-restore'},
            {label: 'Upgrade', link: '/upgrade'},
            {label: 'Large Docker images', link: '/push-large-images'},
        ]
    },
    {
        label: 'Move from Nexus',
        items: [
            {label: 'Copy your repositories', link: '/move-from-nexus'},
            {label: 'Move projects by hand', link: '/move-projects-by-hand'},
            {label: 'Move projects with an AI agent', link: '/move-projects-with-an-agent'},
        ]
    },
    {
        label: 'Reference',
        items: [
            {label: 'CLI and telesphorepo.toml', link: '/cli'},
            {label: 'Server commands and settings', link: '/server-reference'},
            {label: 'Repository addresses', link: '/repository-addresses'},
        ]
    },
];
// The docs page ids in sidebar order, after the landing page.
const pageOrder = ['index', ...sidebar
    .flatMap((entry) => 'items' in entry ? entry.items : [entry])
    .map((entry) => entry.link.slice(1))];

// Pages that moved: the old address answers with a redirect to the new one. A fragment of the old
// address (such as /production/#back-up) stays on the new one, so the merged pages keep the old
// heading names. The MovedAnchors block of the new page sends a fragment that moved again on.
const moved = {
    '/set-up': '/publish-from-a-project',
    '/publish': '/publish-from-a-project',
    '/production': '/run-the-server',
    '/reference': '/server-reference',
    '/commands-and-settings': '/server-reference',
    '/move-projects': '/move-projects-with-an-agent',
    '/download': '/use-packages',
    '/npm': '/use-packages',
    '/python': '/use-packages',
    '/cargo': '/use-packages',
    '/nuget': '/use-packages',
    '/docker': '/use-packages',
    '/debian-and-raw': '/use-packages',
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
        description: 'Telesphorepo is a self-hosted artifact repository that is delightfully simple to use, and quietly sophisticated: only the features you actually want, for Maven, Gradle, npm, Python, Cargo, NuGet, Docker, Helm, Debian, Arch, RPM and raw files. Free and open source.',
        favicon: '/favicon.svg',
        social: [
            {icon: 'github', label: 'GitHub', href: 'https://github.com/Telesphorepo/Telesphorepo'},
        ],
        components: {
            Hero: './src/components/landing/Hero.astro',
            SiteTitle: './src/components/overrides/SiteTitle.astro',
            MarkdownContent: './src/components/overrides/MarkdownContent.astro',
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
            './src/styles/tokens.css',
            './src/styles/docs.css',
            './src/styles/landing.css',
        ],
        expressiveCode: {
            themes: ['github-dark-default', 'github-light'],
            // Long lines wrap, so no command is cut at the edge of the column.
            defaultProps: {wrap: true, preserveIndent: true},
            styleOverrides: {
                codeFontFamily: "'Geist Mono', ui-monospace, monospace",
                codeFontSize: 'var(--tr-code-size)',
                codeLineHeight: '1.6',
                uiFontFamily: "'Geist', system-ui, sans-serif",
                uiFontSize: '0.8125rem',
                uiFontWeight: '500',
                borderRadius: '8px',
                borderColor: 'var(--tr-line)',
                codeBackground: 'var(--tr-surface)',
                frames: {
                    editorBackground: 'var(--tr-surface)',
                    terminalBackground: 'var(--tr-surface)',
                    editorTabBarBackground: 'var(--tr-surface)',
                    editorTabBarBorderBottomColor: 'var(--tr-line)',
                    terminalTitlebarBackground: 'var(--tr-surface)',
                    terminalTitlebarBorderBottomColor: 'var(--tr-line)',
                    terminalTitlebarForeground: 'var(--tr-muted)',
                    editorActiveTabBackground: 'transparent',
                    editorActiveTabBorderColor: 'transparent',
                    editorActiveTabForeground: 'var(--tr-muted)',
                    editorActiveTabIndicatorTopColor: 'transparent',
                    editorActiveTabIndicatorBottomColor: 'transparent',
                    shadowColor: 'transparent',
                },
            },
        },
        sidebar,
        // "On this page" lists the h2 headings only, so a long page keeps a short list. A reference
        // page sets maxHeadingLevel 3 in its frontmatter.
        tableOfContents: {minHeadingLevel: 2, maxHeadingLevel: 2},
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
        plugins: [starlightLinksValidator(), starlightLlmsTxt({
            projectName: 'Telesphorepo',
            description: 'Telesphorepo is a self-hosted repository for Maven and Gradle artifacts, npm packages, Python packages, Rust crates, NuGet packages, Docker images and Helm charts, Debian, Arch Linux and RPM packages, and raw files. Repositories are hosted, proxies or groups. It runs as one Go binary with SQLite and a web UI, and stores files on local disk or in an S3-compatible bucket.',
            details: 'Every page has a Markdown copy at its URL with `.md` added, for example `/publish-from-a-project.md`. The Install the CLI, Publish from your computer, Publish from CI, Set up a production server and Move your projects pages hold the steps for every choice, each under its own heading. Three reference pages hold the lookups: CLI and telesphorepo.toml, Server commands and settings, and Repository addresses. Each repository in the server shows the setup of its format on its Use this repository and Publish to this repository tabs.',
            promote: pageOrder,
            exclude: ['404'],
            customSets: [
                {
                    label: 'Publishing',
                    paths: ['quick-start', 'install-cli', 'publish-from-a-project', 'publish-from-ci', 'use-packages', 'cli'],
                    description: 'A first run from docker run to a published package, the Telesphorepo CLI (install, setup, publish and the Docker credential helper), the project file telesphorepo.toml, CI for GitHub Actions and Jenkins, and downloads with a read token',
                },
                {
                    label: 'Moving from Nexus',
                    paths: ['move-from-nexus', 'move-projects-by-hand', 'move-projects-with-an-agent'],
                    description: 'The copy of Nexus 3 repositories and the switch-over, each project moved by hand or with a coding agent, and the rehearsal of publishing',
                },
                {
                    label: 'Administration',
                    paths: ['run-the-server', 'repositories-and-access', 'people-and-sign-in', 'store-files-in-r2', 'back-up-and-restore', 'upgrade', 'push-large-images', 'server-reference', 'repository-addresses'],
                    description: 'HTTPS, storage, backups, upgrades, repositories, proxies and groups, access, CI pipelines, network rules, people, two-step verification, single sign-on, server commands, environment variables, settings and the address of each format',
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

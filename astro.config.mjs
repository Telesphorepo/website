// @ts-check
import {defineConfig} from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator'
import starlightUtils from "@lorenzo_lewis/starlight-utils";
import starlightLlmsTxt from 'starlight-llms-txt';

const sidebar = [
    {
        label: "leadingNavLinks",
        items: [
            {label: "Docs", link: "/getting-started/introduction"},
            {label: "Reference", link: "/reference/http-api"},
        ]
    },
    {
        label: 'Getting started',
        items: [
            {label: 'Introduction', link: '/getting-started/introduction'},
            {label: 'Install', link: '/getting-started/install'},
            {label: 'First run', link: '/getting-started/first-run'},
            {label: 'Configuration', link: '/getting-started/configuration'},
        ]
    },
    {
        label: 'Repositories',
        items: [
            {label: 'Maven and Gradle', link: '/repositories/maven-gradle'},
            {label: 'Debian', link: '/repositories/debian'},
            {label: 'Raw files', link: '/repositories/raw'},
            {label: 'Browsing and search', link: '/repositories/browsing-and-search'},
        ]
    },
    {
        label: 'Publishing',
        items: [
            {label: 'Overview', link: '/publishing/overview'},
            {label: 'Gradle plugin', link: '/publishing/gradle-plugin'},
            {label: 'Maven extension', link: '/publishing/maven-extension'},
            {label: 'GitHub Actions', link: '/publishing/github-actions'},
            {label: 'Jenkins', link: '/publishing/jenkins'},
            {label: 'Manual sessions', link: '/publishing/manual-sessions'},
        ]
    },
    {
        label: 'Security',
        items: [
            {label: 'Accounts and 2FA', link: '/security/accounts-and-2fa'},
            {label: 'Devices', link: '/security/devices'},
            {label: 'Read tokens', link: '/security/read-tokens'},
            {label: 'Trust policies', link: '/security/trust-policies'},
            {label: 'Single sign-on', link: '/security/sso'},
        ]
    },
    {
        label: 'Operations',
        items: [
            {label: 'Storage', link: '/operations/storage'},
            {label: 'Moving storage', link: '/operations/moving-storage'},
            {label: 'Nexus migration', link: '/operations/nexus-migration'},
            {label: 'Backups and data', link: '/operations/backups-and-data'},
            {label: 'Upgrading', link: '/operations/upgrading'},
        ]
    },
    {
        label: 'Reference',
        items: [
            {label: 'HTTP API', link: '/reference/http-api'},
            {label: 'Settings', link: '/reference/settings'},
            {label: 'CLI', link: '/reference/cli'},
            {label: 'Licensing', link: '/reference/licensing'},
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
    site: 'https://telesphorepo.com',
    integrations: [starlight({
        title: 'Telesphorepo',
        description: 'A new, lean, self-hosted artifact repository for Maven, Gradle plugins, Debian and raw files. One binary with SQLite inside, and short-lived publish sessions for every upload.',
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
            '@fontsource-variable/archivo/wdth.css',
            '@fontsource-variable/jetbrains-mono',
            './src/styles/custom.css',
        ],
        expressiveCode: {
            themes: ['github-dark-default', 'github-light'],
            styleOverrides: {
                codeFontFamily: "'JetBrains Mono Variable', ui-monospace, monospace",
                uiFontFamily: "'Archivo Variable', system-ui, sans-serif",
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
            description: 'Telesphorepo is a self-hosted repository for Maven and Gradle artifacts, Debian packages and raw files. It runs as one Go binary with SQLite and stores files on local disk or in an S3-compatible bucket.',
            details: 'Every page has a Markdown copy at its URL with `.md` added, for example `/getting-started/install.md`.',
            promote: pageOrder,
            exclude: ['404'],
            customSets: [
                {
                    label: 'Publishing',
                    paths: ['publishing/**', 'security/**'],
                    description: 'Publish sessions, the Gradle plugin, the Maven extension, CI trust policies, accounts and second factors',
                },
                {
                    label: 'Operations',
                    paths: ['operations/**', 'reference/**'],
                    description: 'Storage, storage moves, Nexus migration, backups, upgrades, the HTTP API, settings and the CLI',
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

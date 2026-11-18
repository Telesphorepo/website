import {defineRouteMiddleware} from '@astrojs/starlight/route-data';
import {hasMarkdownCopy, markdownPath} from './markdown-path';

export const onRequest = defineRouteMiddleware((context) => {
    const {starlightRoute} = context.locals;
    // "On this page" lists the sections only: Starlight's first entry, the page title (_top), goes.
    if (starlightRoute.toc) {
        starlightRoute.toc.items = starlightRoute.toc.items.filter((item) => item.slug !== '_top');
    }
    // Point to the Markdown copy of each docs page.
    if (!hasMarkdownCopy(starlightRoute.entry)) {
        return;
    }
    starlightRoute.head.push({
        tag: 'link',
        attrs: {rel: 'alternate', type: 'text/markdown', href: markdownPath(starlightRoute.id)},
    });
});

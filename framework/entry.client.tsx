import { use, type ReactNode } from 'react';
import { hydrateRoot } from 'react-dom/client';

import { rscStream } from 'rsc-html-stream/client';
import type { ReturnValue } from './types';
import { setCallback } from 'tinyrsc/client';
import * as ReactClient from '@vitejs/plugin-rsc/browser';


const jsx = ReactClient.createFromReadableStream<ReactNode>(rscStream);

function ClientRoot() {
    return use(jsx);
}


const root = hydrateRoot(
    document,
    <ClientRoot />
);


// Based on the @vitejs/plugin-rsc example at:
// https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-rsc/examples/basic/src/framework/entry.browser.tsx

ReactClient.setServerCallback(async (id, args) => {
    const url = new URL(window.location.href);
    url.pathname += "_.rsc";
    const action = {
        id,
        body: await ReactClient.encodeReply(args)
    };
    const headers = new Headers();
    headers.set('x-rsc-action', action.id);
    const renderRequest = new Request(url.toString(), {
        headers,
        method: 'POST',
        body: action.body
    });
    const payload = await ReactClient.createFromFetch<ReturnValue>(fetch(renderRequest));
    const { ok, data } = payload;
    if (!ok) throw data;
    return data;
});

export async function refreshCallback() {


    try {
        if (root !== null) {
            const tree = await ReactClient.createFromFetch<ReactNode>(fetch(window.location.href, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'x-no-ssr': '1'
                }
            }));
            root.render(tree);

        } else {
            console.error("cannot render tree - root is null");
        }
    } catch (e) {
        console.error('refresh(): Error', e);
    }
}

setCallback(refreshCallback);



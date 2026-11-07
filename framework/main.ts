
import { createServer, type ViteDevServer } from 'vite';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import react from '@vitejs/plugin-react';
import rsc from '@vitejs/plugin-rsc';
import type { RequestHandler, ConnectApp } from 'tinyrsc/server';

export async function createDevServer() {

    const root = process.cwd();

    const require = createRequire(resolve(root, "package.json"));

    const vite = await createServer({
        root: process.cwd(),
        server: { middlewareMode: true },
        configFile: false,
        plugins: [,
            react(),
            rsc({
                entries: {
                    rsc: require.resolve('tinyrsc/entry.rsc'),
                    ssr: require.resolve('tinyrsc/entry.ssr'),
                    client: require.resolve('tinyrsc/entry.client')
                }
            })
        ],
    });


    return vite;
}

export async function getRequestHandler(): Promise<RequestHandler> {
    if (process.env.NODE_ENV !== "production") {
        throw "Error: Can only use getRequestHandler() in production mode";
    }
    const handleRequest = (await import(resolve(process.cwd(), 'dist/rsc/index'))).default;
    return handleRequest;
}

export async function init(app?: ConnectApp): Promise<{viteServer: ViteDevServer | null, requestHandler: RequestHandler | null}> {
    if (process.env.NODE_ENV === 'development') {
        const viteServer = await createDevServer();
        app?.use(viteServer.middlewares);
        return { viteServer, requestHandler: null }
    } else {
        const requestHandler = await getRequestHandler();
        return { requestHandler, viteServer: null };
    }
}
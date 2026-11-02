
import { AsyncLocalStorage } from 'node:async_hooks';
import { ReactElement } from 'react';
import { Connect, ViteDevServer } from 'vite';

export type AppProps = { url: string, headers: Headers };
export type RscPayload = { root: ReactElement, data?: any };
export type ReturnValue = { ok: boolean, data: unknown }
export type RequestHandler = (request: Request) => Promise<Response>;
export type ConnectApp = { use: (middlewares: Connect.Server) => void };

export declare function init(app?: ConnectApp): Promise<{viteServer: ViteDevServer | null, requestHandler: RequestHandler | null}>;
export declare function createDevServer(): Promise<ViteDevServer>;
export declare function getRequestHandler(): RequestHandler;
export declare function getRequest(): Request | undefined;
export declare function getPendingResponseHeaders(): Headers | undefined;

declare module 'rsc-express/server' {
    const requestContext: AsyncLocalStorage<{request: Request, headers: Headers}>;
}


console.log('*** initialising server module');

import { AsyncLocalStorage } from 'node:async_hooks';

export const requestContext = new AsyncLocalStorage<{request: Request, headers: Headers}>();

export function getRequest() {
    const context = requestContext.getStore();
    return context?.request;
}


export function getPendingResponseHeaders() {
    const context = requestContext.getStore();
    return context?.headers;
}


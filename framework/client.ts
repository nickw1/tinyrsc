// A placeholder for any client-only functions we want to export from the package.
// Exporting client-only functions with the main export means clients then end up importing server-side code, which causes problems.


import { useEffect } from 'react';
import type { RefreshCallback } from './types/client';

let callback: RefreshCallback | null = null;

export function setCallback(cb: RefreshCallback) {
    callback = cb;
}

export async function refresh() {
    callback?.();
}

export function useRefresh<T>(dependencies?: Array<T>, postRefreshCallback?: () => void) {
    useEffect(() => {
        (async () => {
            await refresh();
            postRefreshCallback?.();
        })();
    }, dependencies);
}


export type RefreshCallback = () => Promise<void>;

export declare function refresh(): Promise<void>;
export declare function useRefresh<T>(dependencies?: Array<T>, postRefreshCallback?: () => void) : void;

export declare function setCallback(cb: RefreshCallback) :  Promise<void>;

import type { Express } from 'express';
import { ReactElement } from 'react';

export type AdditionalInfo = { [key: string] : any }; // e.g. for session data
export type AppProps = { url: string, headers: Headers, additionalInfo?: AdditionalInfo };
export type RscPayload = { root: ReactElement, data?: any };
export type ReturnValue = { ok: boolean, data: unknown }
export type RequestWithAdditionalInfo = Request & { additionalInfo?: AdditionalInfo };


export declare function createDevServer (app: Express) : Promise<((request: Request) => Promise<Response>)>;
export declare function getRequestHandler (app: Express) : Promise<((request: Request) => Promise<Response>)>;
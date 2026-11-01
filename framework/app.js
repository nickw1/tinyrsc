#!/usr/bin/env node
import { resolve } from 'node:path';
import { createBuilder, createServer } from "vite";
import react from '@vitejs/plugin-react';
import rsc from '@vitejs/plugin-rsc';
import { createRequire } from 'node:module';

const cwd = process.cwd();


const require = createRequire(resolve(cwd, 'package.json'));
const ssrFile = require.resolve('rsc-express/entry.ssr');
const rscFile = require.resolve('rsc-express/entry.rsc');
const clientFile = require.resolve('rsc-express/entry.client');


const builder = await createBuilder({
    root: cwd,

    plugins: [
        react(),
        rsc({
            entries: {
                rsc: rscFile,
                ssr: ssrFile,
                client: clientFile
            }
        })
    ],
    build: {
        minify: false,
    }
});
await builder.buildApp();


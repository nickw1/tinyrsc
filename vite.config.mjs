import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';


console.log(`In config, cwd is ${process.cwd()} dirname ${import.meta.dirname}`);

export default defineConfig({
    plugins: [
        react()
    ],
    build: {
        lib: {
            entry: { main: resolve(import.meta.dirname, 'framework/main.ts'), client: resolve(import.meta.dirname, 'framework/client.ts') },
            name: 'rsc-express',
            fileName: (format, entryName) => `rsc-express.${entryName == "main" ? "": `${entryName}.`}${format}.js`,
            formats: ["es"]
        },

        minify: false,
        rolldownOptions: {
            external: id => id.startsWith("node:") || id.startsWith("@vitejs/") || ['react', 'react-dom', 'vite', 'express'].indexOf(id) >= 0
        }
    },
});
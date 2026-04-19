import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => ({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    test: {
        name: 'node',
        environment: 'node',
        env: loadEnv(mode, process.cwd(), 'VITE_'),
        coverage: {
            provider: 'istanbul',
            reporter: 'html',
            include: ['src/**'],
            reportOnFailure: true
        }
    }
}));


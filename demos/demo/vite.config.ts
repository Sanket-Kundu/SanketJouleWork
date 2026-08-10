import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/ui/fx-components/',
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      '@sap-ui/fx-components': resolve(__dirname, '../../src/index.ts'),
      '@ui5/webcomponents-base/dist': resolve(__dirname, '../../node_modules/@ui5/webcomponents-base/dist'),
      '@ui5/webcomponents-localization/dist': resolve(__dirname, '../../node_modules/@ui5/webcomponents-localization/dist'),
      '@ui5/webcomponents-icons/dist': resolve(__dirname, '../../../icons/dist'),
    },
    dedupe: ['@ui5/webcomponents-base', '@ui5/webcomponents-localization'],
  },
});

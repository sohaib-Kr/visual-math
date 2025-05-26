// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import path from 'path';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
        alias: {
          '@': path.resolve('./src'), // Maps `@/` to `./src/`
          '~': path.resolve('./src'), // Optional: Alternative alias
        },
      },
      optimizeDeps: {
        include: ['@svgdotjs/svg.js', '@svgdotjs/svg.filter.js']
      }
  }
});
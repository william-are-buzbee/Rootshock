/// <reference types="vitest/config" />
import { defineConfig } from 'vite';

export default defineConfig({
  // relative paths, so the built game runs from any folder it is published to
  base: './',
  // three.js alone is about 600 kB; one chunk is fine for a game that loads once
  build: { chunkSizeWarningLimit: 1000 },
  test: { include: ['test/**/*.test.ts'] },
});

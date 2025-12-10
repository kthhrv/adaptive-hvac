import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/adaptive-hvac-card.ts',
      fileName: 'adaptive-hvac-card',
      formats: ['es'],
    },
  },
});

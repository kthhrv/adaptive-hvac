import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: {
        'adaptive-hvac-card': 'src/adaptive-hvac-card.ts',
        'adaptive-hvac-panel': 'src/adaptive-hvac-panel.ts',
      },
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
});

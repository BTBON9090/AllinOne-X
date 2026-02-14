import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'terser',
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      input: {
        ui: resolve(__dirname, 'src/ui.tsx'),
      },
      output: {
        entryFileNames: 'ui.js',
        assetFileNames: 'ui.[ext]',
        inlineDynamicImports: true,
      },
    },
  },
  plugins: [preact()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@types': resolve(__dirname, 'src/types'),
      '@panels': resolve(__dirname, 'src/panels'),
      '@styles': resolve(__dirname, 'src/styles'),
    },
  },
});

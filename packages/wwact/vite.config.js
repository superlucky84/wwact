import { resolve } from 'path';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import eslintPlugin from '@nabla/vite-plugin-eslint';
import wwxVitePlugin from '@wwact/vite-plugin-wwx';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    wwxVitePlugin(),
    checker({ typescript: true }),
    eslintPlugin({ eslintOptions: { cache: false } }),
    dts({
      outputDir: ['dist', 'types'],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      wwact: resolve(__dirname, './src/wwact'),
      'wwact/store': resolve(__dirname, './src/wwact/store.ts'),
    },
  },
  build: {
    minify: 'terser',
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/wwact'),
      name: 'wwact',
      fileName: 'wwact',
    },
  },
  server: {
    open: '/html/jsxExample.html',
  },
});

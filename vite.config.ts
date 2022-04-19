import { defineConfig } from 'vite'
// @ts-ignore
import { createVuePlugin } from 'vite-plugin-vue2';
// @ts-ignore
import tsconfigPaths from 'vite-tsconfig-paths';
export default defineConfig({
  plugins: [
    createVuePlugin(),
    tsconfigPaths(),
  ],
})

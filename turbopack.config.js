import { defineConfig } from '@vercel/turbopack';
import mdx from '@mdx-js/esbuild';

export default defineConfig({
  plugins: [
    mdx({
      providerImportSource: '@mdx-js/react',
    }),
  ],
}); 
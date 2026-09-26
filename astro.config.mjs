import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://data-ganeum.com',
  markdown: {
    shikiConfig: { theme: 'github-light' },
  },
});

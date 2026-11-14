import { defineConfig } from 'astro/config';
import koLinebreak from './integrations/ko-linebreak.mjs';

export default defineConfig({
  site: 'https://data-ganeum.com',
  integrations: [koLinebreak()],
  markdown: {
    shikiConfig: { theme: 'css-variables' },
  },
});

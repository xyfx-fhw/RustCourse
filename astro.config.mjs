// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://xyfx-fhw.github.io',
  base: '/RustCourse',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    mdx({
      remarkPlugins: [
        // GitHub Flavored Markdown
        (await import('remark-gfm')).default,
      ],
      rehypePlugins: [
        // Add IDs to headings
        (await import('rehype-slug')).default,
        // Add anchor links to headings
        [(await import('rehype-autolink-headings')).default, {
          behavior: 'wrap'
        }],
      ],
      syntaxHighlight: 'shiki',
      shikiConfig: {
        theme: 'github-dark',
        wrap: true,
      },
    }),
  ],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});

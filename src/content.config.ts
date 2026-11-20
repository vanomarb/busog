import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const article = z.object({ title: z.string(), description: z.string(), category: z.string(), image: z.string() });
const blog = defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/blog' }), schema: article });
const help = defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/help' }), schema: article });
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({ title: z.string(), description: z.string(), eyebrow: z.string(), kind: z.string() }),
});
export const collections = { blog, help, pages };

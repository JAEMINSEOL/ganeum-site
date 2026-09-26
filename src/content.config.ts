import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const schema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  author: z.string(),
  authorBio: z.string().optional(),
  // 공개 저장소에는 draft: false 인 글만 올린다
  draft: z.boolean().default(false),
});

// 게시된 칼럼 = 이 저장소의 src/content/columns/<slug>.md
const columns = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/columns' }),
  schema,
});

// 초안은 비공개 저장소(Ganeum/drafts/columns)에 둔다.
// 사이트가 Ganeum/apps/site 에 체크아웃돼 있을 때만 개발 서버에서 읽힌다.
const DRAFTS_DIR = '../../drafts/columns';
const hasDrafts = existsSync(resolve(process.cwd(), DRAFTS_DIR));

export const collections = hasDrafts
  ? { columns, drafts: defineCollection({ loader: glob({ pattern: '**/*.md', base: DRAFTS_DIR }), schema }) }
  : { columns };

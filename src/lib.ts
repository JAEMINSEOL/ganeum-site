import { getCollection, type CollectionEntry } from 'astro:content';

type Column = CollectionEntry<'columns'>;

export async function getColumns(): Promise<Column[]> {
  const published = await getCollection('columns', ({ data }) => !data.draft);
  let drafts: Column[] = [];
  if (import.meta.env.DEV) {
    try {
      // 비공개 초안 폴더가 있을 때만 (개발 서버 전용)
      drafts = (await getCollection('drafts' as 'columns')).map((d) => ({ ...d, data: { ...d.data, draft: true } }));
    } catch {
      drafts = [];
    }
  }
  return [...published, ...drafts].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function formatDate(d: Date) {
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

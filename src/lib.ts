import { getCollection, type CollectionEntry } from 'astro:content';

type Column = CollectionEntry<'columns'>;

export async function getColumns(): Promise<Column[]> {
  // 예약 게시: 게시일(date)이 아직 오지 않은 글은 배포 빌드에서 뺀다.
  // 매일 09:00 KST 예약 빌드(.github/workflows/deploy.yml)가 그날 시각이 된 글을 올린다.
  // BUILD_NOW 환경변수로 기준 시각을 바꿔 시험할 수 있다.
  const now = process.env.BUILD_NOW ? new Date(process.env.BUILD_NOW) : new Date();
  const published = await getCollection(
    'columns',
    ({ data }) => !data.draft && (import.meta.env.DEV || data.date.valueOf() <= now.valueOf()),
  );
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

// 빌드 서버(UTC)와 무관하게 한국 날짜로 표시
export function formatDate(d: Date) {
  const [y, m, day] = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' })
    .format(d).split('-');
  return `${y}.${m}.${day}`;
}

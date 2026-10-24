import type { APIRoute } from 'astro';
import { getColumns } from '../lib';

// 칼럼 RSS 2.0 피드 (네이버 서치어드바이저 RSS 제출·구독용)
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async ({ site }) => {
  const base = site!.href.replace(/\/$/, '');
  const columns = (await getColumns()).filter((c) => !c.data.draft);
  const items = columns
    .map((c) => {
      const url = `${base}/columns/${c.id}/`;
      return `    <item>
      <title>${esc(c.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${esc(c.data.description)}</description>
      <pubDate>${c.data.date.toUTCString()}</pubDate>
    </item>`;
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>가늠</title>
    <link>${base}/</link>
    <description>작은 팀을 위한 데이터 분석 칼럼</description>
    <language>ko</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};

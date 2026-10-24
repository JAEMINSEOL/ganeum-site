import type { APIRoute } from 'astro';
import { getColumns } from '../lib';

// 검색엔진 제출용 사이트맵 (네이버 서치어드바이저·Google Search Console)
const STATIC = ['/', '/columns/', '/about/', '/request/'];

export const GET: APIRoute = async ({ site }) => {
  const base = site!.href.replace(/\/$/, '');
  const columns = (await getColumns()).filter((c) => !c.data.draft);
  const urls = [
    ...STATIC.map((p) => `  <url><loc>${base}${p}</loc></url>`),
    ...columns.map(
      (c) => `  <url><loc>${base}/columns/${c.id}/</loc><lastmod>${c.data.date.toISOString()}</lastmod></url>`,
    ),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};

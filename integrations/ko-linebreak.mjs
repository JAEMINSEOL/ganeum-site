// 빌드 뒤 HTML 후처리: 한국어 모바일 줄바꿈 보정 (모바일 가독성 제안 2026-11-14의 1, 3, 8, 9번)
//
// 1. 닫는 괄호, %, 닫는 따옴표 바로 뒤에 한글 조사가 붙으면 그 사이에 U+2060(WORD JOINER)을 넣는다.
//    "95%는"이 "95% / 는"으로, "(쿠키)의"가 "(쿠키) / 의"로 갈라지지 않게 한다. 화면에는 보이지 않는다.
//    괄호와 조사가 다른 인라인 태그에 나뉜 경우("…)</a>이")도 태그를 건너 이어 본다.
//    복사할 때는 Base.astro 의 copy 처리기가 U+2060 을 지운다.
// 2. 비교 기호와 곱셈 기호("p = 0.05", "θ = 0.499", "2장 × 330원 = 660원")의
//    양옆 띄어쓰기를 줄바꿈 없는 공백(U+00A0)으로 바꾼다. 기호가 줄 첫머리나 끝에 홀로 남지 않는다.
// 3. 표 칸 가운데 숫자 칸(숫자, 부호, 단위 한 글자)에 class="num" 을 붙인다 (칼럼 표에서 한 줄로 묶는 데 쓴다).
// 4. thead 가 있는 표의 본문 칸에 data-label(머리글 이름)을 붙인다 (법적 문서 표를 좁은 화면에서 쌓아 보일 때 쓴다).
//
// head, script, style, pre, code, svg, textarea 안은 건드리지 않는다. 속성값도 건드리지 않는다.
// 비표시 문자는 소스에 그대로 적지 않고 String.fromCharCode 로만 만든다.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const WJ = String.fromCharCode(0x2060); // WORD JOINER
const NBSP = String.fromCharCode(0xa0); // 줄바꿈 없는 공백
const INVISIBLE = new RegExp(`[${WJ}${NBSP}]`, 'g');
const WJ_ALL = new RegExp(WJ, 'g');
const SKIP = new Set(['pre', 'code', 'svg', 'head']);
// 인라인 태그: 이 태그 경계를 넘어 앞 글자와 뒤 글자를 이어 본다
const INLINE = new Set(['a', 'span', 'strong', 'b', 'em', 'i', 'sup', 'sub', 'small', 'abbr', 'mark', 'time', 'u', 's', 'q', 'cite', 'dfn', 'kbd', 'var', 'data', 'bdi', 'bdo', 'wbr']);
const HANGUL_START = /^[가-힣]/;
const CLOSE_END = /[)\]%”’"]$/;
const PAREN_PARTICLE = /([)\]%”’"])(?=[가-힣])/g;
const TOKEN = /<!--[\s\S]*?-->|<(?:[^>"']|"[^"]*"|'[^']*')*>|[^<]+/g;

// 표 숫자 칸 판정: 24자 이하, 숫자가 하나 이상, 숫자와 부호와 단위 한 글자만
const NUM_CELL = /^[\s\d,.\-−+±%/~()×xX^:명원건회일주월년개배점분초시간천만억pP<>≤≥=→↑↓]+$/;

function fixText(s) {
  s = s.replace(PAREN_PARTICLE, `$1${WJ}`);
  // 한 글자 변수 + 비교 기호 (HTML 텍스트 안이므로 < > 는 &lt; &gt; 로 온다)
  s = s.replace(/(^|[\s(])([A-Za-zθρασμβ]) (=|&lt;|&gt;|≤|≥) (?=\S)/g, `$1$2${NBSP}$3${NBSP}`);
  // 그 밖의 비교 기호와 곱셈 기호: 양옆 낱말과 한 덩어리로 ("달력 ≤ 롤링", "2장 × 330원 = 660원")
  s = s.replace(/(\S) (=|&lt;|&gt;|≤|≥|×) (?=\S)/g, `$1${NBSP}$2${NBSP}`);
  s = s.replace(/(\d) (~) (?=\d)/g, `$1${NBSP}$2${NBSP}`);
  return s;
}

function decode(t) {
  return t
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, '&');
}

function tagName(tok) {
  const m = /^<\/?([a-zA-Z][a-zA-Z0-9-]*)/.exec(tok);
  return m ? m[1].toLowerCase() : null;
}

export function transformHtml(html) {
  // 1, 2: 텍스트 노드 치환
  const out = [];
  let skipDepth = 0;
  let prevChar = ''; // 직전 텍스트의 마지막 글자 (인라인 태그 경계를 넘어 유지)
  let inBody = false;
  TOKEN.lastIndex = 0;
  let m;
  while ((m = TOKEN.exec(html))) {
    const tok = m[0];
    // 원문 텍스트 요소(script, style, textarea, title)는 닫는 태그까지 통째로 넘긴다 (안의 < 를 태그로 읽지 않게)
    const raw = /^<(script|style|textarea|title)/i.exec(tok);
    if (raw && !tok.endsWith('/>')) {
      const end = html.toLowerCase().indexOf(`</${raw[1].toLowerCase()}`, TOKEN.lastIndex);
      const stop = end < 0 ? html.length : html.indexOf('>', end) + 1;
      out.push(html.slice(m.index, stop));
      TOKEN.lastIndex = stop;
      prevChar = '';
      continue;
    }
    if (tok.startsWith('<!--')) { out.push(tok); continue; }
    if (tok[0] === '<') {
      const name = tagName(tok);
      if (name) {
        const closing = tok[1] === '/';
        if (name === 'body') inBody = !closing;
        if (SKIP.has(name) && !tok.endsWith('/>')) {
          if (closing) { if (skipDepth) skipDepth--; } else skipDepth++;
        }
        if (!INLINE.has(name)) prevChar = '';
      }
      out.push(tok);
      continue;
    }
    if (!inBody || skipDepth) { out.push(tok); continue; }
    let t = fixText(tok);
    if (CLOSE_END.test(prevChar) && HANGUL_START.test(t)) t = WJ + t;
    const plain = decode(tok);
    if (plain.length) prevChar = /\s$/.test(plain) ? ' ' : plain.slice(-1);
    out.push(t);
  }
  html = out.join('');

  // 3: 숫자 칸에 class="num"
  html = html.replace(/<(td|th)((?:\s[^>]*)?)>([\s\S]*?)<\/\1>/g, (all, tag, attrs, inner) => {
    if (/<(td|th|table|br|p|div|ul|ol)\b/i.test(inner)) return all;
    const t = decode(inner.replace(/<[^>]*>/g, '')).replace(INVISIBLE, ' ').trim();
    if (!t || t.length > 24 || !/\d/.test(t) || !NUM_CELL.test(t)) return all;
    if (/\sclass="/.test(attrs)) {
      if (/\sclass="[^"]*\bnum\b/.test(attrs)) return all;
      attrs = attrs.replace(/\sclass="/, ' class="num ');
    } else attrs += ' class="num"';
    return `<${tag}${attrs}>${inner}</${tag}>`;
  });

  // 4: thead 가 있는 표의 tbody td 에 data-label
  html = html.replace(/<table\b[^>]*>[\s\S]*?<\/table>/g, (table) => {
    const head = /<thead\b[^>]*>([\s\S]*?)<\/thead>/.exec(table);
    if (!head) return table;
    const labels = [...head[1].matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/g)]
      .map((x) => decode(x[1].replace(/<[^>]*>/g, '')).replace(WJ_ALL, '').trim());
    if (!labels.length) return table;
    return table.replace(/<tbody\b[^>]*>[\s\S]*?<\/tbody>/g, (tbody) =>
      tbody.replace(/<tr\b[^>]*>[\s\S]*?<\/tr>/g, (tr) => {
        let i = 0;
        return tr.replace(/<td\b([^>]*)>/g, (td, attrs) => {
          const label = labels[i++] ?? '';
          if (/\sdata-label=/.test(attrs) || !label) return td;
          return `<td${attrs} data-label="${label.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}">`;
        });
      }));
  });
  return html;
}

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (e.name.endsWith('.html')) files.push(p);
  }
  return files;
}

export default function koLinebreak() {
  return {
    name: 'ko-linebreak',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        let n = 0;
        for (const f of walk(root)) {
          const src = fs.readFileSync(f, 'utf8');
          const res = transformHtml(src);
          if (res !== src) { fs.writeFileSync(f, res); n++; }
        }
        logger.info(`korean line-break fix applied to ${n} HTML files`);
      },
    },
  };
}

# ganeum-site

[data-ganeum.com](https://data-ganeum.com) — 가늠 분석 칼럼 사이트. Astro 정적 사이트, GitHub Pages로 배포.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/
```

- 칼럼: `src/content/columns/<slug>.md` (frontmatter 스키마: `src/content.config.ts`)
- `main`에 푸시하면 `.github/workflows/deploy.yml`이 빌드·배포한다
- 이 저장소는 공개다. 초안은 여기에 올리지 않는다

## 디자인 토큰 (청화 팔레트 + Wanted Sans, 2026-11)

- 색·글자 크기·모서리 변수는 `src/styles/global.css` 맨 위에만 정의한다. 다른 파일에 색상값(`#…`, `rgb()`)을 직접 적지 않는다
- 서체는 npm `wanted-sans` 패키지(가변 폰트, 분할 CSS)를 `src/layouts/Base.astro`에서 불러온다. 외부 폰트 서버를 쓰지 않는다
- 코드 강조는 shiki `css-variables` 테마 — `--astro-code-*` 변수를 팔레트 변수에 연결해 어두운 화면에서도 대비가 유지된다
- `public/og.png`·`favicon.svg`(글자는 윤곽선 path)·`favicon.ico`는 같은 색·서체로 만든 이미지다

검증 (빌드 후):

```bash
npm run build
# 이전 색·명조 서체·구글 폰트가 남아 있지 않아야 한다 (출력 없음이 정상)
grep -rliE "#(F7F4ED|141413|191919|A4442A|D8714F)\b" dist --include=*.css --include=*.js --include=*.svg --include=*.html
grep -rlE "Noto Serif KR|Nanum Myeongjo|Times New Roman|Georgia|fonts\.googleapis|fonts\.gstatic" dist
npm run preview   # 브라우저에서 밝은/어두운 화면, 390px 폭 확인
```

## 모바일 줄바꿈과 누름 영역 (2026-11-14)

- 빌드 뒤 `integrations/ko-linebreak.mjs`가 `dist/` HTML을 고친다. `npm run dev`에서는 돌지 않으므로 확인은 `npm run build` 후 `npm run preview`로 한다
  - 닫는 괄호, %, 닫는 따옴표 뒤 한글 조사 앞에 보이지 않는 연결 문자 U+2060을 넣는다 (복사할 때는 `Base.astro`의 copy 처리기가 지운다)
  - 비교 기호와 곱셈 기호 양옆 띄어쓰기를 줄바꿈 없는 공백으로 바꾼다
  - 표의 숫자 칸에 `class="num"`, thead가 있는 표의 칸에 `data-label`을 붙인다
  - `head`, `script`, `style`, `pre`, `code`, `svg` 안과 속성값은 건드리지 않는다
- 칼럼 표는 숫자 칸 한 줄, 글자 칸 최소 7em, 넘치면 가로로 밀어 보기(양옆 그림자). 600px 이하에서 칼럼 그림(SVG)은 600px 폭으로 두고 가로로 밀어 본다
- 개인정보처리방침 표는 520px 이하에서 행마다 쌓아 보인다
- 머리 메뉴, 바닥글 링크, 칼럼 끝 목록 링크, 검증 코드 펼치기는 누름 영역 44px 이상

검증:

```bash
npm run build
# 글자 내용은 그대로여야 한다: 빌드 결과에서 U+2060을 지우고 U+00A0을 공백으로 바꾸면 이전 빌드와 본문 텍스트가 같다
grep -c 'class="num"' dist/columns/srm-check/index.html   # 0보다 커야 한다
grep -c 'data-label=' dist/privacy/index.html              # 0보다 커야 한다
npm run preview  # 360px, 390px 폭, 밝은/어두운 화면에서 칼럼 표가 글자 단위로 쪼개지지 않는지, 표와 그림이 가로로 밀리는지 확인
```

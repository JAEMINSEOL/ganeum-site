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

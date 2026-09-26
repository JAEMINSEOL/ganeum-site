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

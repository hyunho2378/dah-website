# ROUTES.md — React Router v6

## 라우트 테이블

| path | element | 비고 |
|---|---|---|
| / | Home | |
| /about | About | |
| /tracks | Tracks | 앵커 #track-1 ~ #track-3, #codesharing |
| /people | People | |
| /achievements | Achievements | 쿼리 없이 내부 상태로 연도 필터 |
| /careers | Careers | |
| /news | News | |
| * | NotFound | |

## 구조

```jsx
// App.jsx
<BrowserRouter>
  <ScrollToTop />
  <Header />
  <main>
    <Routes>…위 테이블 그대로…</Routes>
  </main>
  <Footer />
</BrowserRouter>
```

- ScrollToTop.jsx: pathname 변경 시 window.scrollTo(0,0). hash 있으면 해당 id로 scrollIntoView({behavior 조건: reduced-motion이면 auto})
- 외부 링크(전시회, 인스타그램, 구글 사이트 공지 원문, 기업 홈페이지)는 라우터 밖 a 태그
- Vercel SPA 리라이트: vercel.json에 { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
- 페이지별 document.title 갱신: 커스텀 useTitle 훅("페이지명 — 한림대학교 디지털인문예술전공")
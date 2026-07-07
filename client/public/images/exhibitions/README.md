# exhibitions 포스터 (과거 아카이브용)

이 폴더에 포스터 이미지 파일을 두고, 시드/어드민에서 poster_url을 파일 경로로 참조한다.
예: /images/exhibitions/against-the-flow.jpg

Vercel이 public/을 정적 서빙하므로 프론트 <img src={poster_url}>가 그대로 로드한다(Blob 업로드와 병행 가능).

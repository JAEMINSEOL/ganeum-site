// 사이트 설정 — 공개 저장소이므로 비밀값을 두지 않는다.

// 조회수 집계: GoatCounter (쿠키 없음, 개인 식별 정보 미저장)
// https://www.goatcounter.com/help/visitor-counter
// 1) goatcounter.com 에서 사이트 코드를 만들고
// 2) 사이트 설정의 "Allow adding visitor counts on your website"를 켠 뒤
// 3) 아래에 코드(예: 'ganeum')를 넣으면 집계와 조회수 표시가 켜진다. 비어 있으면 둘 다 꺼진다.
// 개발 중 화면 확인용: 환경변수 PUBLIC_VIEWS_DEMO=1 이면 가짜 숫자를 보여 준다(배포 빌드에는 쓰지 말 것).
export const GOATCOUNTER_CODE = '';

// 가늠 서비스 앱 주소 — 홈의 "로그인하여 분석하기 / Google로 회원가입" 버튼이 이 앱의 로그인(POST /auth/login)으로 이어진다.
// 앱이 배포되기 전에는 비워 둔다(버튼 숨김). 배포 후: 'https://app.data-ganeum.com'
// 앱 쪽 apps/web 의 LOGIN_START_ORIGINS 에 이 사이트 주소(https://data-ganeum.com)가 들어 있어야 한다.
// 개발 확인용: 환경변수 PUBLIC_APP_URL=http://localhost:3000 으로 개발 서버를 띄우면 그 주소를 쓴다(개발 서버 전용).
export const APP_URL = '';

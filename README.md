# UWIN | United We Will Win

라스트 워: 서바이벌(Last War: Survival)의 UWIN 연맹을 위한 반응형 홈페이지입니다. UWIN은 **United We Will Win**의 줄임말이며, Vue 3, TypeScript, Vite로 구성했습니다. Google Identity Services를 이용한 OAuth 2.0 팝업 로그인 흐름도 포함합니다.

## 페이지 구성

- `/#/`: 연맹 소개 및 핵심 활동 안내
- `/#/about`: UWIN 연맹의 가치와 운영 방향
- `/#/notices`: 연맹 규칙, 포상, 패널티가 담긴 한·영 공지
- `/#/recruit`: 연맹원 모집 안내와 참여 과정
- `/#/login`: 개발용 가상 세션 또는 운영용 Google OAuth 2.0 로그인
- `/#/account`: 회원 등급, 연맹 등급, 직책 및 세션 정보
- `/#/admin`: 최고 관리자·관리자 전용 관리 메뉴

게임 시스템 참고 문서: [나무위키 - 라스트 워: 서바이벌](https://namu.wiki/w/%EB%9D%BC%EC%8A%A4%ED%8A%B8%20%EC%9B%8C:%20%EC%84%9C%EB%B0%94%EC%9D%B4%EB%B2%8C)

## 이미지 자산

`public/images/uwin`에 다음 최적화 이미지를 사용합니다.

- `uwin-recruit-notice.webp`: 모집·공지 페이지의 UWIN 공식 연맹 규칙 공지
- `uwin-banner.svg`: `index.html`에서 추출한 공지 페이지 상단 UWIN 배너 SVG
- `uwin-alliance-mark.png`: 연맹 슬로건 이미지에서 분리한 UWIN 연맹 마크

공지 상단 배너에는 원본 배너의 규칙·포상·패널티 텍스트 오버레이도 적용합니다. 최상단 언어 설정이 한국어일 때만 공지 전체를 한국어로 표시하고, English·العربية·日本語 선택 시 공지 내용은 영어로 표시합니다.

## 언어 설정

상단 언어 선택기에서 다음 언어를 사용할 수 있습니다.

- 한국어 (기본)
- English
- العربية (RTL)
- 日本語

선택한 언어는 `localStorage`의 `uwin-locale` 키에 저장되며, 새로고침 후에도 유지됩니다. 문서 `lang`과 `dir` 속성도 자동 갱신됩니다.

## 반응형 구성

- 280–320px 초소형 모바일부터 대형 데스크톱까지 가로 스크롤 없이 표시됩니다.
- 모바일에서는 헤더 내비게이션을 2행으로 재배치하고 모든 메뉴의 터치 영역을 44px 이상으로 유지합니다.
- 540px 이하에서는 제목, 버튼, 카드, 로그인 및 계정 화면을 1열로 재배치합니다.
- `100dvh`, `viewport-fit=cover`, `safe-area-inset-bottom`을 적용해 모바일 주소창과 노치 영역을 고려합니다.
- `prefers-reduced-motion`을 존중하며 hover 효과는 마우스를 지원하는 기기에서만 표시됩니다.

## 로컬 개발

```bash
npm install
npm run dev
```

개발 모드는 `.env.development`의 `VITE_AUTH_MODE=mock`을 사용합니다. 로그인 화면에서 회원 등급(최고 관리자·관리자·일반 회원), 연맹 등급(R1–R5), 직책(연맹 맹주·전쟁군주·모집관·여신·집사)을 선택해 가상 세션을 만들 수 있습니다. 가상 세션은 `import.meta.env.DEV`가 참일 때만 허용됩니다.

프로덕션 빌드 결과 확인:

```bash
npm run build
npm run build:production
npm run preview
```

## Google OAuth 2.0 설정

### 1. Google Cloud에서 OAuth 클라이언트 만들기

1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트를 선택하거나 만듭니다.
2. **APIs & Services → OAuth consent screen**에서 앱 정보와 필요한 범위를 설정합니다.
3. **Credentials → Create credentials → OAuth client ID**를 선택합니다.
4. Application type은 **Web application**으로 선택합니다.
5. Authorized JavaScript origins에 사용할 origin을 추가합니다.
   - 로컬: `http://localhost:5173`
   - GitHub Pages: `https://<github-user>.github.io`
   - 사용자 도메인을 사용하면 해당 도메인도 추가합니다.

이 구현은 팝업 Token UX를 사용하므로 별도 OAuth redirect URI는 필요하지 않습니다.

### 2. 로컬 Client ID 설정

운영 배포 환경에 Google에서 발급받은 Web Client ID를 입력합니다. 로컬에서 운영 모드를 확인할 때는 `.env.production.local`을 사용할 수 있습니다.

```dotenv
VITE_AUTH_MODE=google
VITE_GOOGLE_CLIENT_ID=000000000000-example.apps.googleusercontent.com
```

`.env.production.example`을 복사해 사용할 수도 있습니다.

```bash
Copy-Item .env.production.example .env.production.local
```

환경 변수를 추가한 뒤 개발 서버를 다시 시작합니다.

> `VITE_*` 값은 빌드 결과에 포함됩니다. OAuth Client ID는 공개 가능한 값이지만 **Client Secret은 절대 Vite 환경 변수로 추가하지 마세요.**

### 3. GitHub Actions 변수 설정

저장소의 **Settings → Secrets and variables → Actions → Variables**에서 다음 repository variable를 추가합니다.

- Name: `VITE_GOOGLE_CLIENT_ID`
- Value: Google OAuth Web Client ID
- Name: `VITE_SUPER_ADMIN_EMAILS`
- Value: 쉼표로 구분한 최고 관리자 이메일
- Name: `VITE_ADMIN_EMAILS`
- Value: 쉼표로 구분한 관리자 이메일

배포 워크플로는 위 값을 빌드 시 환경 변수로 전달합니다.

### 관리자 역할 설정

Google 사용자 이메일 allowlist로 최고 관리자와 관리자 메뉴를 활성화합니다. 쉼표로 여러 계정을 입력할 수 있습니다.

```dotenv
VITE_SUPER_ADMIN_EMAILS=owner@example.com
VITE_ADMIN_EMAILS=admin@example.com,ops@example.com
```

- `VITE_SUPER_ADMIN_EMAILS`: 최고 관리자
- `VITE_ADMIN_EMAILS`: 관리자
- 로그인 후 상단 **관리** 메뉴와 `/#/admin` 화면이 표시됩니다.
- 개발 환경에서는 로그인 화면의 mock role selector로 두 역할을 테스트할 수 있습니다.
- 정적 GitHub Pages의 이메일 allowlist는 화면 접근 제어용이며, 실제 운영 인가·권한 저장은 백엔드에서 검증해야 합니다.

## 로그인 동작

- `/#/login`에서 Google Identity Services 팝업을 엽니다.
- 요청 범위는 `openid email profile`입니다.
- Access Token으로 Google 사용자 정보 API를 호출해 이름, 이메일, 프로필 사진을 표시합니다.
- Token과 사용자 세션은 `localStorage`나 `sessionStorage`에 저장하지 않고 브라우저 메모리에만 유지합니다.
- 로그아웃 시 발급된 Token 폐기를 요청합니다.
- 새로고침하면 메모리 세션이 종료됩니다.

### 정적 사이트의 보안 한계

GitHub Pages만으로는 신뢰할 수 있는 서버측 인증 세션을 만들 수 없습니다. 이 구현은 OAuth 로그인 흐름을 보여주는 정적 데모입니다. 실제 서비스에서 사용자 신원을 신뢰해야 한다면 백엔드에서 ID Token을 검증하고, HTTP-only secure 세션 쿠키를 발급해야 합니다. 필요한 경우 Google API 권한은 최소화하고 민감한 범위는 백엔드에서만 처리해야 합니다.

## GitHub Pages 배포

1. 프로젝트를 GitHub 저장소의 `main` 브랜치에 푸시합니다.
2. 저장소에서 **Settings → Pages → Build and deployment → Source**를 선택합니다.
3. **GitHub Actions**를 선택하고 저장합니다.
4. 이후 `main`에 push할 때마다 `.github/workflows/deploy.yml`이 자동 실행됩니다.

수동 배포는 저장소의 **Actions → Deploy to GitHub Pages → Run workflow**에서 실행할 수 있습니다.

## 배포 경로 설정

- `vite.config.ts`의 `base: './'`는 `/<repository>/` 하위 경로와 사용자/조직 사이트, 사용자 도메인을 모두 지원합니다.
- Vue Router는 GitHub Pages의 SPA fallback 부재에 대비해 해시 모드(`/#/login`)를 사용합니다.
- `public/.nojekyll`은 Jekyll이 static asset을 무시하지 않도록 합니다.

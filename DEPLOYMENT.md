# 🚀 Youth Life 배포 가이드

이 문서는 Youth Life를 GitHub에 푸시하고 Vercel에 배포하는 방법을 설명합니다.

---

## 📋 사전 준비

### 1. 필요한 계정
- [GitHub](https://github.com) 계정
- [Vercel](https://vercel.com) 계정
- [Supabase](https://supabase.com) 계정
- [OpenAI](https://platform.openai.com) API 키 (선택)

---

## 📦 1단계: GitHub 저장소 생성 및 푸시

### 방법 1: GitHub 웹사이트에서 생성

1. **GitHub에 로그인**
   - https://github.com 접속

2. **새 저장소 생성**
   - 우측 상단 `+` 버튼 → `New repository` 클릭
   - Repository name: `youth-life`
   - Description: "오행 리듬 기반 인생 운영 시스템"
   - Public 또는 Private 선택
   - **Initialize this repository with:** 모두 체크 해제
   - `Create repository` 클릭

3. **로컬 저장소와 연결**
   ```bash
   # 현재 디렉토리에서 실행
   git remote add origin https://github.com/YOUR_USERNAME/youth-life.git
   git branch -M master
   git push -u origin master
   ```

### 방법 2: GitHub CLI 사용 (추천)

```bash
# GitHub CLI 설치 (Windows - 관리자 권한)
winget install --id GitHub.cli

# 로그인
gh auth login

# 저장소 생성 및 푸시
gh repo create youth-life --public --source=. --remote=origin --push
```

---

## ☁️ 2단계: Supabase 설정

### 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com) 로그인
2. `New Project` 클릭
3. 프로젝트 정보 입력:
   - Name: `youth-life`
   - Database Password: 안전한 비밀번호 생성
   - Region: `Northeast Asia (Tokyo)` 또는 가까운 지역
   - `Create new project` 클릭 (1-2분 소요)

### 2. 데이터베이스 스키마 생성

1. 좌측 메뉴에서 `SQL Editor` 클릭
2. `New query` 클릭
3. `supabase/schema.sql` 파일 내용 전체 복사
4. SQL Editor에 붙여넣기
5. `Run` 버튼 클릭 (또는 Ctrl+Enter)
6. ✅ 성공 메시지 확인

### 3. API 키 확인

1. 좌측 메뉴에서 `Settings` → `API` 클릭
2. 다음 정보 복사:
   - **Project URL**: `https://xxx.supabase.co`
   - **anon public**: `eyJ...` (공개 키)
   - **service_role**: `eyJ...` (서비스 키, 비공개!)

---

## 🌐 3단계: Vercel 배포

### 1. Vercel 계정 생성 및 연결

1. [Vercel](https://vercel.com) 접속
2. `Sign Up` → `Continue with GitHub` (GitHub 계정으로 로그인)
3. Vercel이 GitHub 저장소 접근 권한 요청 → `Authorize` 클릭

### 2. 프로젝트 배포

1. Vercel 대시보드에서 `Add New...` → `Project` 클릭
2. `Import Git Repository` 섹션에서 `youth-life` 저장소 찾기
3. `Import` 클릭
4. 프로젝트 설정:
   - **Framework Preset**: Next.js (자동 감지됨)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (기본값)
   - **Output Directory**: `.next` (기본값)

5. **환경 변수 설정** (중요!)
   - `Environment Variables` 섹션 클릭
   - 다음 환경 변수 추가:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   OPENAI_API_KEY=sk-...  (선택)
   NEXT_PUBLIC_APP_URL=https://youth-life.vercel.app
   ```

   각 변수를 개별적으로 추가:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Supabase Project URL 붙여넣기
   - `Add` 클릭
   - 나머지 변수도 동일하게 반복

6. `Deploy` 클릭
7. ⏳ 배포 진행 (1-3분 소요)
8. ✅ 배포 완료! 🎉

### 3. 배포 URL 확인

- 배포가 완료되면 `https://youth-life-xxx.vercel.app` 형태의 URL 생성
- `Visit` 버튼 클릭하여 사이트 확인

---

## 🔧 4단계: 배포 후 설정

### 1. 커스텀 도메인 연결 (선택)

1. Vercel 프로젝트 → `Settings` → `Domains`
2. 도메인 입력 (예: `youthlife.com`)
3. DNS 설정 안내에 따라 레코드 추가
4. 자동 HTTPS 인증서 발급

### 2. 환경 변수 업데이트

배포 후 환경 변수를 변경하려면:
1. Vercel 프로젝트 → `Settings` → `Environment Variables`
2. 변수 수정
3. `Save` → 자동 재배포

### 3. Supabase URL 업데이트

1. Supabase → `Settings` → `API`
2. `Site URL` 항목에 Vercel URL 추가:
   ```
   https://youth-life-xxx.vercel.app
   ```

---

## 🔄 5단계: 지속적 배포 (CI/CD)

### 자동 배포 설정 (이미 완료!)

Vercel은 기본적으로 GitHub 저장소와 연동되어:
- `master` 브랜치에 푸시하면 → 프로덕션 자동 배포
- PR 생성하면 → 프리뷰 배포 자동 생성

### 수동 배포

로컬에서 코드 수정 후:
```bash
git add .
git commit -m "Update feature"
git push origin master
```

→ 자동으로 Vercel 배포 시작!

---

## 🧪 6단계: 배포 확인

### 1. 사이트 동작 확인

- [ ] 홈 페이지 로딩
- [ ] 네비게이션 작동
- [ ] 오늘 테마 표시
- [ ] 모든 페이지 접근 가능

### 2. API 연결 확인

브라우저 개발자 도구 (F12) → Console 탭:
- Supabase 연결 오류 없는지 확인
- API 요청 성공 확인

### 3. 모바일 반응형 확인

- [ ] 모바일 브라우저에서 접속
- [ ] 하단 네비게이션 표시
- [ ] 터치 인터랙션 정상 작동

---

## 🐛 문제 해결

### 배포 실패 시

1. **빌드 로그 확인**
   - Vercel 배포 페이지에서 `View Function Logs` 클릭
   - 에러 메시지 확인

2. **일반적인 문제**

   **문제**: `Module not found: Can't resolve '@/...'`
   - **해결**: `tsconfig.json` 경로 설정 확인

   **문제**: Supabase 연결 실패
   - **해결**: 환경 변수가 올바르게 설정되었는지 확인
   - Vercel → Settings → Environment Variables

   **문제**: 페이지 404 에러
   - **해결**: `app/` 디렉토리 구조 확인
   - Next.js 15 App Router 규칙 준수

### Supabase RLS 오류

```
Row Level Security policy violation
```

→ `supabase/schema.sql` 재실행 필요

### OpenAI API 에러

```
OpenAI API request failed
```

→ `.env` 파일에 `OPENAI_API_KEY` 확인

---

## 📊 모니터링

### Vercel Analytics (무료)

1. Vercel 프로젝트 → `Analytics` 탭
2. 방문자 수, 페이지 뷰 등 확인

### Supabase Usage

1. Supabase → `Settings` → `Usage`
2. Database 크기, API 요청 수 모니터링

---

## 💡 추가 최적화

### 1. PWA 설정

`public/manifest.json` 생성:
```json
{
  "name": "Youth Life",
  "short_name": "Youth Life",
  "description": "오행 리듬 기반 인생 운영 시스템",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0A0E27",
  "theme_color": "#00D9FF",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 2. 성능 최적화

```bash
# 이미지 최적화
npm install sharp

# 번들 분석
npm run build
npx @next/bundle-analyzer
```

### 3. SEO 개선

`app/layout.tsx`에 메타데이터 추가:
```typescript
export const metadata = {
  title: 'Youth Life - 인생 운영 시스템',
  description: '오행 리듬 기반 루틴·목표·금전·성찰 관리',
  keywords: ['생산성', '목표관리', '루틴', '자기계발'],
  openGraph: {
    title: 'Youth Life',
    description: '게임처럼 즐기는 인생 운영',
    url: 'https://youth-life.vercel.app',
    siteName: 'Youth Life',
  }
}
```

---

## 📞 지원

### 공식 문서
- [Next.js 문서](https://nextjs.org/docs)
- [Vercel 문서](https://vercel.com/docs)
- [Supabase 문서](https://supabase.com/docs)

### 커뮤니티
- [GitHub Issues](https://github.com/yourusername/youth-life/issues)
- [Discord](https://discord.gg/yourserver)

---

## ✅ 체크리스트

배포 전 확인:
- [ ] Git 커밋 완료
- [ ] GitHub 저장소 생성
- [ ] Supabase 프로젝트 생성 및 스키마 실행
- [ ] Vercel 프로젝트 생성
- [ ] 모든 환경 변수 설정
- [ ] 배포 성공 확인
- [ ] 사이트 동작 테스트

축하합니다! 🎉 Youth Life가 성공적으로 배포되었습니다!

---

**다음 단계**: [README.md](./README.md) 참고하여 기능 확장

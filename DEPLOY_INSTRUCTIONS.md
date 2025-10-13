# 🚀 Youth Life 배포 완료 가이드

## 📋 현재 상태
- ✅ Git 커밋 완료 (6개 커밋)
- ✅ 모든 코드 준비 완료
- ✅ 인증 시스템 작동 (비밀번호: bo020623)
- ✅ 로컬 개발 서버 실행 중 (http://localhost:3000)

---

## 1️⃣ GitHub 저장소 생성 및 푸시 (5분)

### 방법 A: GitHub 웹사이트 (가장 쉬움)

1. **https://github.com 접속 및 로그인**

2. **새 저장소 생성**
   - 우측 상단 `+` → `New repository` 클릭
   - Repository name: `youth-life`
   - Description: `오행 리듬 기반 인생 운영 시스템`
   - **Public** 선택 (Vercel 무료 배포)
   - ⚠️ **중요**: 아무것도 체크하지 마세요!
     - [ ] Add a README file
     - [ ] Add .gitignore
     - [ ] Choose a license
   - `Create repository` 클릭

3. **로컬 저장소와 연결**

   생성된 페이지에서 다음 명령어 복사 후 실행:

   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/youth-life.git
   git branch -M master
   git push -u origin master
   ```

   **YOUR_USERNAME**을 실제 GitHub 사용자명으로 변경!

4. **인증**
   - GitHub 사용자명 입력
   - 비밀번호 대신 **Personal Access Token** 입력

   **Token 생성 방법**:
   - GitHub → Settings → Developer settings
   - Personal access tokens → Tokens (classic)
   - Generate new token (classic)
   - Note: `youth-life`
   - Expiration: 90 days
   - Select scopes: [x] repo (전체)
   - Generate token → **복사** (다시 볼 수 없음!)

---

## 2️⃣ Vercel 배포 (5분)

### 1단계: Vercel 계정 생성

1. **https://vercel.com 접속**
2. `Sign Up` → `Continue with GitHub` 클릭
3. GitHub 계정으로 로그인
4. Vercel이 저장소 접근 권한 요청 → `Authorize` 클릭

### 2단계: 프로젝트 임포트

1. Vercel 대시보드 → `Add New...` → `Project` 클릭
2. `Import Git Repository` 섹션에서 `youth-life` 찾기
3. `Import` 클릭

### 3단계: 프로젝트 설정

- **Framework Preset**: Next.js (자동 감지)
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 4단계: 환경 변수 설정 (선택)

**현재는 환경 변수 불필요!**
- 모든 데이터가 localStorage에 저장됨
- Supabase 연동 시에만 필요

나중에 추가하려면:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 5단계: 배포!

1. `Deploy` 버튼 클릭
2. ⏳ 배포 진행 (2-3분)
3. ✅ 배포 완료!

### 6단계: 배포 URL 확인

- `https://youth-life-xxx.vercel.app` 형태의 URL 생성
- `Visit` 버튼 클릭하여 사이트 확인

---

## 3️⃣ 배포 후 테스트

### 확인사항

1. **로그인 페이지**
   - [ ] 페이지 로딩 확인
   - [ ] 비밀번호 입력란 표시
   - [ ] 잘못된 비밀번호 시 에러 표시

2. **비밀번호로 로그인**
   - [ ] `bo020623` 입력
   - [ ] 메인 페이지로 이동

3. **메인 기능**
   - [ ] 오늘의 테마 표시 (요일별)
   - [ ] 핵심 3태스크 카드 표시
   - [ ] 스탯 게이지 표시
   - [ ] 모든 페이지 네비게이션 작동

4. **데이터 저장**
   - [ ] 태스크 체크 시 저장
   - [ ] 페이지 새로고침 후 데이터 유지
   - [ ] 로그아웃 후 재로그인 시 데이터 유지

5. **모바일 반응형**
   - [ ] 모바일에서 접속
   - [ ] 하단 네비게이션 표시
   - [ ] 터치 동작 정상

---

## 4️⃣ 커스텀 도메인 연결 (선택)

### 도메인이 있다면:

1. Vercel 프로젝트 → `Settings` → `Domains`
2. 도메인 입력 (예: `youthlife.com`)
3. DNS 설정 안내에 따라 레코드 추가
4. 자동 HTTPS 인증서 발급 ✅

---

## 5️⃣ 자동 배포 설정 (이미 완료!)

**Vercel은 자동으로 GitHub와 연동됩니다:**

- `master` 브랜치에 푸시 → **프로덕션 자동 배포**
- Pull Request 생성 → **프리뷰 배포 자동 생성**

### 앞으로 업데이트 방법:

```bash
# 코드 수정 후
git add .
git commit -m "Update feature"
git push origin master
```

→ 자동으로 Vercel 배포 시작! 🚀

---

## 🎯 배포 완료 체크리스트

### GitHub
- [ ] 저장소 생성 완료
- [ ] 로컬 코드 푸시 완료
- [ ] GitHub에서 파일 확인

### Vercel
- [ ] 프로젝트 임포트 완료
- [ ] 첫 배포 성공
- [ ] 배포 URL 확인

### 테스트
- [ ] 로그인 작동
- [ ] 메인 기능 작동
- [ ] 데이터 저장 확인
- [ ] 모바일 반응형 확인

---

## 🐛 문제 해결

### "remote origin already exists" 에러

```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/youth-life.git
git push -u origin master
```

### Vercel 빌드 실패

1. Vercel → Deployments → 실패한 배포 클릭
2. `View Function Logs` 확인
3. 에러 메시지 확인

**일반적인 해결책**:
```bash
# 로컬에서 빌드 테스트
npm run build

# 성공하면 다시 푸시
git push origin master
```

### 로그인 후 빈 화면

- 브라우저 콘솔 (F12) 확인
- localStorage 지원 확인
- 시크릿 모드에서 테스트

---

## 📱 PWA 설정 (추후)

### manifest.json 추가

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

---

## 🎉 축하합니다!

**Youth Life가 전 세계에 배포되었습니다!** 🌍

이제 어디서든 접속 가능:
- 💻 데스크톱
- 📱 모바일
- 🌐 모든 브라우저

---

## 📞 다음 단계

1. **친구와 공유**: 배포 URL 공유
2. **피드백 수집**: 사용 경험 개선
3. **기능 추가**:
   - Supabase 연동 (여러 기기 동기화)
   - GPT 코칭 활성화
   - 알림 시스템
   - PWA 설치

---

## 📧 지원

- 📖 문서: `README.md`, `DEPLOYMENT.md`
- 🐙 GitHub: Issues 탭 활용
- 💬 문의: your.email@example.com

**Happy Life Management! 🎮✨**

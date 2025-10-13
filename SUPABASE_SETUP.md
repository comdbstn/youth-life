# 🗄️ Supabase 설정 가이드

## 1단계: Supabase 프로젝트 생성 (5분)

### 1. Supabase 계정 생성
1. https://supabase.com 접속
2. **Start your project** 클릭
3. GitHub 계정으로 로그인

### 2. 새 프로젝트 생성
1. **New Project** 클릭
2. 프로젝트 정보 입력:
   - **Name**: `youth-life`
   - **Database Password**: 안전한 비밀번호 생성 (자동 생성 추천)
   - **Region**: `Northeast Asia (Seoul)` 선택 (가장 빠름)
   - **Pricing Plan**: Free (무료)
3. **Create new project** 클릭
4. ⏳ 프로젝트 생성 대기 (약 2분)

---

## 2단계: 데이터베이스 스키마 생성 (3분)

### 1. SQL Editor 열기
1. 좌측 메뉴에서 **SQL Editor** 클릭
2. **New query** 클릭

### 2. 스키마 실행
1. `supabase/schema.sql` 파일 내용 전체 복사
2. SQL Editor에 붙여넣기
3. 우측 하단 **Run** 버튼 클릭 (또는 Ctrl+Enter)
4. ✅ "Success. No rows returned" 메시지 확인

### 3. 테이블 확인
1. 좌측 메뉴에서 **Table Editor** 클릭
2. 다음 9개 테이블 생성 확인:
   - ✅ profiles
   - ✅ goals
   - ✅ tasks
   - ✅ time_blocks
   - ✅ day_plans
   - ✅ reflections
   - ✅ finance_entries
   - ✅ stats
   - ✅ streaks

### 4. 마스터 사용자 초기화 (필수!)
1. SQL Editor에서 **New query** 클릭
2. `supabase/init_master_user.sql` 파일 내용 전체 복사
3. SQL Editor에 붙여넣기
4. **Run** 버튼 클릭
5. ✅ 결과에서 마스터 사용자 정보 확인:
   ```
   id: 00000000-0000-0000-0000-000000000001
   email: master@youth-life.app
   ```

⚠️ **중요**: 이 단계를 건너뛰면 앱에서 "invalid input syntax for type uuid" 에러가 발생합니다!

---

## 3단계: API 키 복사 (2분)

### 1. Settings로 이동
1. 좌측 메뉴 하단 **Project Settings** (⚙️) 클릭
2. **API** 섹션 클릭

### 2. 환경 변수 복사
다음 2개 값을 복사해주세요:

#### **Project URL**
```
예시: https://abcdefghijklmno.supabase.co
```

#### **anon public key**
```
예시: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 4단계: 로컬 환경 변수 설정 (1분)

### 1. `.env.local` 파일 생성
프로젝트 루트에 `.env.local` 파일을 만들고 다음 내용 입력:

```env
NEXT_PUBLIC_SUPABASE_URL=복사한_Project_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=복사한_anon_public_key
SUPABASE_SERVICE_ROLE_KEY=복사할_service_role_key
```

### 2. Service Role Key 복사
⚠️ **주의**: Service Role Key는 서버에서만 사용!

1. Project Settings → API로 돌아가기
2. **service_role secret** 옆 **Reveal** 클릭
3. 키 복사 후 `.env.local`에 추가

**예시 `.env.local` 파일:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk5MzQwMDAsImV4cCI6MjAwNTUxMDAwMH0.xxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4OTkzNDAwMCwiZXhwIjoyMDA1NTEwMDAwfQ.yyyyyyyyyyy
```

---

## 5단계: Vercel 환경 변수 설정 (3분)

### 1. Vercel 대시보드 접속
1. https://vercel.com 로그인
2. `youth-life` 프로젝트 클릭

### 2. 환경 변수 추가
1. **Settings** 탭 클릭
2. 좌측 **Environment Variables** 클릭
3. 다음 3개 변수를 **하나씩** 추가:

| Key | Value | Environments |
|-----|-------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | 복사한 Project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 복사한 anon key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | 복사한 service_role key | Production, Preview, Development |

### 3. Redeploy
1. **Deployments** 탭으로 이동
2. 최신 배포 우측 `...` 클릭
3. **Redeploy** 클릭
4. **Redeploy** 확인

---

## 6단계: 로컬 개발 서버 재시작

```bash
# 기존 서버 중지 (Ctrl+C)
# 서버 재시작
npm run dev
```

---

## ✅ 설정 완료 확인

### 브라우저 콘솔 확인 (F12)
1. http://localhost:3000 접속
2. 콘솔에서 에러 없는지 확인
3. Supabase 연결 성공 메시지 확인

### 테스트
1. 로그인: `bo020623`
2. 태스크 추가 시도
3. 새로고침 후 데이터 유지 확인

---

## 🔒 보안 체크리스트

- [ ] `.env.local` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] Service Role Key를 절대 클라이언트 코드에서 사용하지 않기
- [ ] GitHub에 `.env.local` 파일 커밋하지 않기

---

## 🐛 문제 해결

### "Invalid API key" 에러
- API 키를 다시 복사했는지 확인
- 공백이나 줄바꿈이 없는지 확인
- `.env.local` 파일명이 정확한지 확인

### 테이블이 보이지 않음
- `schema.sql` 실행 성공 여부 확인
- SQL Editor에서 `SELECT * FROM tasks;` 실행 테스트

### 로컬에서 작동하지만 Vercel에서 안됨
- Vercel 환경 변수 설정 확인
- Redeploy 실행
- Vercel Function Logs 확인

---

## 📞 다음 단계

Supabase 설정이 완료되면:
1. ✅ 모든 컴포넌트가 실제 데이터베이스 사용
2. ✅ 여러 기기에서 동기화
3. ✅ 실시간 스탯 계산
4. 🎯 다음: OpenAI GPT 통합 (`OPENAI_SETUP.md`)

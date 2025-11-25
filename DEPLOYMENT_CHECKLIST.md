# 🚀 Youth Life - Vercel 배포 가이드

> 마지막 업데이트: 2025-11-26

---

## ✅ 코드 레벨 버그 수정 완료

### 1. Supabase 싱글톤 패턴 구현 ✅
**파일**: `lib/supabase.ts`

**문제**: "Multiple GoTrueClient instances detected" 경고
**원인**: Supabase 클라이언트가 여러 번 생성됨
**해결**:
```typescript
let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
  }
  return supabaseInstance;
};
```

### 2. favicon.ico 404 에러 해결 ✅
**파일**: `public/favicon.ico`
**해결**: 파비콘 파일 추가 완료

### 3. Vercel 프로젝트 연결 ✅
**프로젝트**: comdbstns-projects/youth-life
**명령어**: `vercel link --yes` 실행 완료

---

## 🔴 사용자가 직접 해야 할 필수 작업

### ⚠️ 중요: 현재 배포 실패 원인

에러 로그 분석 결과:
```
GET https://fqrfhochysbdyjxtoned.supabase.co/rest/v1/tasks?...
Failed to load resource: net::ERR_NAME_NOT_RESOLVED
```

**근본 원인**: Vercel에 Supabase 환경 변수가 설정되지 않았거나 잘못되었습니다.

---

## 📋 필수 작업 순서

### STEP 1: Supabase 프로젝트 URL 확인

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 사용 중인 프로젝트 선택
3. **Settings** → **API** 클릭
4. 다음 정보 확인 및 복사:
   - **Project URL**: `https://xxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key** (선택사항): `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**⚠️ 확인**: 에러 로그의 `fqrfhochysbdyjxtoned.supabase.co`가 실제 프로젝트 URL인지 확인하세요.

---

### STEP 2: Vercel 환경 변수 설정 (필수!)

#### 방법 1: Vercel Dashboard (권장)

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. **youth-life** 프로젝트 클릭
3. **Settings** → **Environment Variables** 메뉴 클릭
4. 다음 변수들을 추가:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1...` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1...` (선택) | Production, Preview, Development |
| `OPENAI_API_KEY` | `sk-...` (선택, GPT 기능용) | Production, Preview, Development |

5. **Save** 버튼 클릭

#### 방법 2: Vercel CLI

터미널에서 실행:

```bash
# Supabase URL 설정
vercel env add NEXT_PUBLIC_SUPABASE_URL
# 프롬프트: 값 입력 후 Production/Preview/Development 모두 선택

# Supabase Anon Key 설정
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# 프롬프트: 값 입력 후 Production/Preview/Development 모두 선택

# Service Role Key (선택사항)
vercel env add SUPABASE_SERVICE_ROLE_KEY

# OpenAI API Key (선택사항)
vercel env add OPENAI_API_KEY
```

---

### STEP 3: 로컬 환경 변수 설정 (.env.local)

로컬 개발을 위해 `.env.local` 파일 업데이트:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI (선택)
OPENAI_API_KEY=sk-...

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### STEP 4: Supabase 테이블 확인 및 생성

#### 4-1. 기존 테이블 확인

Supabase SQL Editor에서 실행:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

#### 4-2. 필요한 테이블 목록

- ✅ profiles
- ✅ day_plans
- ✅ tasks
- ✅ stats
- ✅ achievements
- ✅ streaks
- ✅ goals
- ✅ calendar_memos ⚠️ (새로 추가됨 - 아래 SQL 필요!)
- ✅ finance_entries
- ✅ reflections

#### 4-3. calendar_memos 테이블 생성 (필수!)

**이 테이블이 없으면 캘린더 페이지가 작동하지 않습니다!**

Supabase SQL Editor에서 실행:

```sql
-- calendar_memos 테이블 생성
CREATE TABLE IF NOT EXISTS calendar_memos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  color TEXT DEFAULT 'blue' CHECK (color IN ('blue', 'green', 'red', 'yellow', 'purple', 'pink', 'gray')),
  all_day BOOLEAN DEFAULT true,
  start_time TIME,
  end_time TIME,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_calendar_memos_user_date
ON calendar_memos(user_id, date);

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_calendar_memos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calendar_memos_updated_at
BEFORE UPDATE ON calendar_memos
FOR EACH ROW
EXECUTE FUNCTION update_calendar_memos_updated_at();

-- RLS 비활성화 (개인 사용)
ALTER TABLE calendar_memos DISABLE ROW LEVEL SECURITY;
```

#### 4-4. 마스터 사용자 확인

```sql
-- 마스터 사용자 존재 확인
SELECT * FROM profiles WHERE id = '00000000-0000-0000-0000-000000000001';

-- 없으면 생성
INSERT INTO profiles (id, email, timezone, locale)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'master@youth-life.app',
  'Asia/Seoul',
  'ko-KR'
)
ON CONFLICT (id) DO NOTHING;
```

---

### STEP 5: 재배포

환경 변수 설정 후 재배포:

#### 방법 1: Git Push (권장)
```bash
git push origin master
```
Vercel이 자동으로 감지해서 재배포합니다.

#### 방법 2: Vercel Dashboard
1. Vercel Dashboard → **Deployments** 탭
2. 최신 배포 옆 **...** 메뉴 → **Redeploy** 클릭

#### 방법 3: Vercel CLI
```bash
vercel --prod
```

---

## 🔍 배포 후 확인 사항

### 1. 배포 상태 확인

```bash
vercel ls
```

최신 배포의 **STATUS**가 `READY`인지 확인

### 2. 브라우저 콘솔 확인 (F12)

배포된 사이트 접속 후:

#### ✅ 다음 에러가 없어야 함:
- ❌ `ERR_NAME_NOT_RESOLVED`
- ❌ `Multiple GoTrueClient instances`
- ❌ `Failed to load resource: favicon.ico`
- ❌ `Failed to load tasks/stats`

#### ✅ 정상 작동 확인:
- ✅ Tasks 데이터 로드
- ✅ Stats 데이터 로드
- ✅ Supabase 연결 성공

### 3. 주요 기능 테스트

1. **로그인** (`/login`)
   - 비밀번호: `bo020623`
   - master 계정으로 로그인 성공

2. **대시보드** (`/`)
   - 오늘 테마 표시 확인
   - DayPlan 자동 초기화 확인
   - 아침 코치 GPT 버튼 (OpenAI API 키 설정 시)

3. **목표** (`/goals`)
   - 월간/주간/일일 목표 탭 전환
   - 목표 추가/수정/삭제

4. **캘린더** (`/calendar`)
   - 월간 뷰 표시
   - 날짜 클릭 → 메모 추가
   - 색상 태그 선택

5. **금전** (`/finance`)
   - 수입/지출 입력
   - 주간 통계 표시

6. **성찰** (`/reflection`)
   - 5문항 작성
   - GPT 밤 코치 피드백 (OpenAI API 키 설정 시)

7. **스탯** (`/stats`)
   - 게임 스탯 표시
   - 업적 자동 체크
   - 연속 기록 표시

8. **리포트** (`/report`)
   - 주간 완료율 계산
   - 태스크 통계 표시

---

## 🆘 트러블슈팅

### "ERR_NAME_NOT_RESOLVED" 계속 발생
**원인**: Vercel 환경 변수 미설정 또는 잘못된 URL
**해결**:
1. Vercel Dashboard → Settings → Environment Variables 확인
2. `NEXT_PUBLIC_SUPABASE_URL`이 올바른지 확인
3. `NEXT_PUBLIC_` 접두사가 있는지 확인 (클라이언트 변수 필수)
4. 재배포 실행

### "Failed to fetch" 에러
**원인**: Supabase RLS 또는 테이블 미생성
**해결**:
1. Supabase SQL Editor에서 테이블 존재 확인
2. RLS 비활성화 확인: `ALTER TABLE xxx DISABLE ROW LEVEL SECURITY;`
3. profiles 테이블에 master 사용자 확인

### GPT 코치가 작동 안 함
**원인**: OpenAI API 키 미설정
**해결**:
1. Vercel에 `OPENAI_API_KEY` 설정 확인
2. OpenAI API 크레딧 잔액 확인
3. API 키 유효성 확인

### 캘린더 페이지 에러
**원인**: calendar_memos 테이블 미생성
**해결**:
1. STEP 4-3의 SQL 실행
2. 테이블 생성 확인: `SELECT * FROM calendar_memos LIMIT 1;`

### 로컬에서는 되는데 Vercel에서 안 됨
**원인**: 환경 변수 불일치
**해결**:
1. `.env.local` 내용과 Vercel 환경 변수 비교
2. Vercel 환경 변수가 Production/Preview/Development 모두 설정되었는지 확인
3. 재배포 후 다시 확인

---

## 📝 요약

### ✅ 이미 완료된 작업 (코드 수정)
1. Supabase 싱글톤 패턴 적용 (`lib/supabase.ts`)
2. Favicon 추가 (`public/favicon.ico`)
3. Vercel 프로젝트 연결 (`vercel link`)
4. Git 커밋 완료

### 🔴 사용자가 해야 할 작업
1. **Supabase URL 확인** (Dashboard → Settings → API)
2. **Vercel 환경 변수 설정** (가장 중요!)
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY (선택)
   - OPENAI_API_KEY (선택)
3. **Supabase calendar_memos 테이블 생성** (SQL 실행)
4. **.env.local 파일 업데이트** (로컬 개발용)
5. **재배포** (`git push origin master`)

### 🎯 배포 후
- 브라우저 콘솔 에러 확인
- 모든 페이지 기능 테스트
- 데이터 CRUD 작동 확인

---

## ✅ 프로덕션 준비 완료 상태

### 1. 환경 설정
- [x] Next.js 15 + TypeScript 설정 완료
- [x] TailwindCSS + 게임 스타일 커스텀 컬러 적용
- [x] Supabase 통합 완료
- [x] OpenAI GPT-4o-mini 통합 완료
- [x] Vercel 배포 설정 완료

### 2. 데이터베이스 (Supabase)
- [x] 스키마 생성 (`supabase/schema.sql`)
- [x] 9개 테이블 생성 완료:
  - [x] profiles
  - [x] goals
  - [x] tasks
  - [x] time_blocks
  - [x] day_plans
  - [x] reflections
  - [x] finance_entries
  - [x] stats
  - [x] streaks
- [ ] **마스터 사용자 초기화 필요** (`supabase/init_master_user.sql` 실행)
- [x] RLS 정책 작성 (개인 사용이므로 비활성화 예정)

### 3. 인증 시스템
- [x] 간단한 비밀번호 인증 (`lib/simple-auth.ts`)
- [x] 로그인 페이지 (`/login`)
- [x] AuthGuard 컴포넌트
- [x] 로그아웃 기능
- [x] UUID 형식 USER_ID 설정 (`00000000-0000-0000-0000-000000000001`)

### 4. 핵심 기능 구현 상태

#### ✅ 완료된 기능
1. **테마 시스템**
   - [x] 요일별 자동 테마 판별 (월=실행, 화=집중, ...)
   - [x] ThemeHeader 컴포넌트
   - [x] 7가지 테마 설정 완료
   - [x] 테마별 추천 규칙 정의

2. **태스크 관리**
   - [x] Top3Tasks 컴포넌트 (오늘 핵심 3태스크)
   - [x] 태스크 CRUD (추가, 완료, 삭제)
   - [x] 우선순위 표시 (P1/P2/P3)
   - [x] 소요시간 표시
   - [x] 태그 시스템
   - [x] Supabase 실시간 연동

3. **목표 관리**
   - [x] 월/주/일 목표 탭
   - [x] 목표 CRUD
   - [x] 진행률 조정 (+10% / -10%)
   - [x] AI 목표 분해 버튼
   - [x] `/api/goals/breakdown` API 연동

4. **스탯 시스템**
   - [x] 5대 스탯 계산 (STR/INT/WIS/CHA/GRT)
   - [x] 경험치 & 레벨링 시스템
   - [x] 태스크 완료 시 자동 스탯 증가
   - [x] StatsOverview 컴포넌트
   - [x] 원형 프로그레스 바 UI

5. **금전 트래킹**
   - [x] 수입/지출 빠른 입력
   - [x] 카테고리 선택 (외주/월급/식비/교통 등)
   - [x] 감정지출 플래그
   - [x] 주간 통계 (수입/지출/순이익/저축률)
   - [x] 감정지출 경보 카드

6. **리포트**
   - [x] 주간 완료율 통계
   - [x] 주간 경험치 획득량
   - [x] 성장 기록 표시

7. **AI 기능**
   - [x] 목표 → 태스크 자동 분해 (GPT-4o-mini)
   - [x] `/api/goals/breakdown` API
   - [x] `/api/coach/morning` API (구현 완료, UI 미연결)
   - [x] `/api/coach/evening` API (구현 완료, UI 미연결)
   - [x] `lib/openai.ts` 유틸리티

8. **UI/UX**
   - [x] 게임 스타일 다크 테마
   - [x] 네온 컬러 (사이버 블루, 네온 핑크, 네온 그린)
   - [x] 카드 기반 레이아웃
   - [x] 반응형 디자인 (모바일/데스크톱)
   - [x] 하단 네비게이션 (모바일)
   - [x] 로딩 스피너 애니메이션
   - [x] 에러 핸들링 UI

#### 🚧 구현 예정 기능 (v1.1)
1. **성찰 페이지** (`/reflection`)
   - [ ] 5문항 폼 UI
   - [ ] GPT 저녁 코치 호출
   - [ ] 내일 우선순위 표시

2. **타임블록 스케줄러** (`/schedule`)
   - [ ] 드래그&드롭 타임라인
   - [ ] 실제 시간 기록
   - [ ] 계획 vs 실제 비교

3. **아침/저녁 코치 UI**
   - [ ] 홈 화면에 아침 코칭 카드 추가
   - [ ] "하루 마감" 버튼 추가
   - [ ] 코칭 메시지 표시

4. **PWA**
   - [ ] 매니페스트 설정
   - [ ] Service Worker
   - [ ] 푸시 알림

### 5. 코드 품질
- [x] TypeScript strict mode
- [x] snake_case 일관성 (Supabase 스키마)
- [x] Optional 필드 안전 처리
- [x] 에러 핸들링
- [x] 로딩 상태 표시
- [x] 더미데이터 제거 완료

### 6. 보안
- [x] 환경 변수 관리 (`.env.local` gitignore)
- [x] API 키 서버사이드 사용
- [x] RLS 비활성화 (개인 사용)
- [x] 간단한 인증 시스템

### 7. 문서화
- [x] `PRD.md` - 프로젝트 요구사항 정의
- [x] `SUPABASE_SETUP.md` - Supabase 설정 가이드
- [x] `OPENAI_SETUP.md` - OpenAI API Key 설정 가이드
- [x] `DEPLOYMENT_CHECKLIST.md` - 이 파일
- [x] Known Issues 문서화 (PRD.md 내)

---

## 🎯 즉시 실행 필요 사항

### ⚠️ Supabase SQL 실행 (필수!)

배포 후 **반드시** 실행해야 하는 SQL:

1. Supabase Dashboard 접속: https://supabase.com/dashboard
2. `youth-life` 프로젝트 선택
3. SQL Editor → New query
4. 아래 SQL 복사 & 실행:

```sql
-- RLS 비활성화 (개인 사용)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE goals DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE time_blocks DISABLE ROW LEVEL SECURITY;
ALTER TABLE day_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE reflections DISABLE ROW LEVEL SECURITY;
ALTER TABLE finance_entries DISABLE ROW LEVEL SECURITY;
ALTER TABLE stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE streaks DISABLE ROW LEVEL SECURITY;

-- 마스터 사용자 생성
INSERT INTO profiles (id, email, timezone, locale)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'master@youth-life.app',
  'Asia/Seoul',
  'ko-KR'
)
ON CONFLICT (id) DO NOTHING;

-- 오늘 스탯 초기화
INSERT INTO stats (user_id, date, str, int, wis, cha, grt, total_exp, level)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  CURRENT_DATE,
  0, 0, 0, 0, 0, 0, 1
)
ON CONFLICT (user_id, date) DO NOTHING;

-- 확인
SELECT 'Setup completed!' as status;
SELECT * FROM profiles WHERE id = '00000000-0000-0000-0000-000000000001';
SELECT * FROM stats WHERE user_id = '00000000-0000-0000-0000-000000000001';
```

### ⚠️ Vercel 환경 변수 확인

다음 환경 변수가 설정되어 있는지 확인:

1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. `OPENAI_API_KEY`

---

## 🎨 디자인 일관성 체크

### 색상 팔레트
- ✅ Primary: `#00D9FF` (cyber-blue)
- ✅ Secondary: `#FF2E63` (neon-pink)
- ✅ Success: `#00FF9F` (neon-green)
- ✅ Background: `#0A0E27` (dark-navy)
- ✅ Card: `#1A1F3A` (dark-card)
- ✅ Border: `#2A2F4A` (dark-border)

### 컴포넌트 스타일
- ✅ 카드: `.card-game` 클래스 사용
- ✅ 버튼: 네온 컬러 + hover 효과
- ✅ 입력 필드: 다크 배경 + 네온 테두리
- ✅ 로딩 스피너: cyber-blue 애니메이션
- ✅ 프로그레스 바: neon-green 색상

### 타이포그래피
- ✅ 제목: `text-2xl`~`text-3xl`, `font-bold`, `text-cyber-blue`
- ✅ 부제목: `text-lg`~`text-xl`, `font-bold`, `text-white`
- ✅ 본문: `text-sm`~`text-base`, `text-gray-400`
- ✅ 강조: `text-neon-pink` 또는 `text-neon-green`

---

## 🧪 테스트 체크리스트

### 기능 테스트
- [ ] 로그인 (비밀번호: `bo020623`)
- [ ] 오늘의 테마 표시 확인
- [ ] 태스크 추가/완료/삭제
- [ ] 목표 추가/진행률 조정
- [ ] AI 목표 분해 (OpenAI API 필요)
- [ ] 금전 입력 (수입/지출)
- [ ] 리포트 조회
- [ ] 스탯 증가 확인 (태스크 완료 시)
- [ ] 로그아웃

### 반응형 테스트
- [ ] 모바일 (< 768px)
- [ ] 태블릿 (768px ~ 1024px)
- [ ] 데스크톱 (> 1024px)

### 브라우저 테스트
- [ ] Chrome
- [ ] Safari
- [ ] Firefox
- [ ] Edge

---

## 🚀 배포 URL

- **Production**: https://youth-life.vercel.app
- **GitHub**: https://github.com/comdbstn/youth-life
- **Supabase**: https://ydysrhosplmoreiwzwjg.supabase.co

---

## 📝 다음 스프린트 계획 (v1.1)

### 우선순위 1
1. 성찰 페이지 구현
2. 아침/저녁 코치 UI 연결
3. 타임블록 스케줄러

### 우선순위 2
1. PWA 매니페스트
2. 푸시 알림
3. 배지/업적 시스템

### 우선순위 3
1. 월간 리포트
2. 데이터 내보내기
3. 다크 패턴 방지 대시보드

---

**모든 체크리스트가 완료되면 프로덕션 준비 완료! 🎉**

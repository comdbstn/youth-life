# 🚀 Youth Life - 배포 체크리스트

> 마지막 업데이트: 2025-01-14

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

# Youth Life - 오행 리듬 기반 인생 운영 시스템

## 📌 제품 정의
**오행 리듬 기반 루틴·목표·금전·성찰을 하루 리듬에 동기화하고, GPT가 코치처럼 피드백을 주는 개인 운영체제**

게임 인벤토리와 스테이터스 창 같은 UX로 자신의 인생을 관리하는 웹앱

---

## 🎯 핵심 기능

### 1. 오늘의 테마 자동 판별
- 로컬 시간대 기반 `YYYY-MM-DD(요일)` 자동 계산
- **주간 프레임 매핑**:
  - 월 🔥 **실행의 날** - 주간 목표 설정, 중요 일 추진
  - 화 🧱 **집중의 날** - 공부, 업무 몰입 (Deep Work)
  - 수 💧 **정리의 날** - 루틴 점검, 재무 관리, 마음 안정
  - 목 🌳 **확장의 날** - 네트워킹, 아이디어, 시장조사
  - 금 ⚙ **마감의 날** - 주간 마감, 리뷰, 데이터 기록
  - 토 🪶 **회복의 날** - 운동, 정리, 취미, 자연
  - 일 🌙 **성찰의 날** - 일기, 감사, 다음 주 계획

### 2. 테마별 추천 To-Do 생성기
- 입력: `요일 테마 + 월/주/일 목표 + 최근 수행 데이터 + 시간 가용성`
- 출력:
  - **핵심 3태스크** (Deep Work: 각 90-120분)
  - 보조 3태스크 (서포팅 작업)
  - 권장 타임블록 배치

#### 테마별 추천 규칙
- **EXECUTE(월)**: 상위 목표의 "출력물 생성형" 태스크 우선
- **FOCUS(화)**: 학습/코딩 Deep Work 묶음 90-120분
- **ORGANIZE(수)**: 재무/정리/백로그 청소
- **EXPAND(목)**: 미팅/아이디어/시장조사
- **WRAP(금)**: 리포트, 배포, 릴리즈, 주간 리뷰
- **RECOVER(토)**: 운동/취미/자연/수면
- **REFLECT(일)**: 글쓰기/회고/다음주 계획

### 3. 드래그 타임블록 스케줄러
- 핵심 3태스크를 타임라인에 자동 배치
- 드래그&드롭으로 재조정
- 실제 수행 시간 기록 (완료 시 타임스탬프)
- 기본 타임 슬롯:
  - 06-09: 프리프렙
  - 09-12: Deep Work
  - 13-15: 분석/정리
  - 15-17: 운동/외부
  - 19-22: 기록

### 4. 목표 계층 관리 (월 → 주 → 일)
- 3단 계층 구조
- 월간 목표 → 주간 목표 → 일일 태스크 연결
- 드릴다운 UI
- GPT 기반 "목표 → 태스크 자동 분해" 기능

### 5. 금전 트래킹
- **빠른 입력**: 숫자패드 + 태그 칩
- 태그 분류:
  - 고정지출 (집세, 보험 등)
  - 변동지출 (식비, 교통 등)
  - 감정지출 ⚠️ (충동구매, 스트레스 소비)
- 주간/월간 차트
- **감정지출 경보**: 주간 0건 달성 시 보너스 스탯

#### 금전 루틴
- **수입**: 오전 9-12시 '수익 루프' 집중 (외주·AI·콘텐츠)
- **저축**: 수익의 20% 자동분류
- **투자**: 27세 전까지 "경험·기술·언어"에 재투자
- **시스템**: 수입→기록→분석→조정 루프 유지

### 6. 하루 마감 성찰 (5문항)
1. 오늘 가장 잘한 1가지
2. 막혔던 순간 & 원인 1개
3. 내일 같은 실수를 줄이는 행동 1개
4. 감정지출 여부(금액/상황)
5. 오늘을 한 문장으로 요약

→ GPT 피드백: **칭찬 1줄 / 개선 1가지 / 내일 우선순위 3개**

### 7. GPT 하루 리듬 코칭
**아침 코치 (07:00)**
- 입력: 오늘 요일/테마, 월·주·일 목표, 최근 7일 수행로그
- 출력:
  1. 핵심 3태스크 제안
  2. 보조 3태스크
  3. 권장 타임블록 배치
  4. 격려 메시지 (간결/단호한 톤)

**밤 코치 (22:00)**
- 입력: 완료/미완료 태스크, 실제 타임블록, 감정/에너지, 금전 기록
- 출력:
  1. 오늘 칭찬 1줄
  2. 개선점 1가지
  3. 내일 우선순위 3개
  4. 감정지출 피드백(있으면)
  5. 한 문장 요약

### 8. 게임화: 스탯 시스템
5대 스탯 + 레벨링:
- **STR(체력)**: 운동/수면
- **INT(지성)**: 학습/코딩/독서
- **WIS(지혜)**: 성찰/명상/회고
- **CHA(매력)**: 네트워킹/소통/발표
- **GRT(꾸준함)**: 루틴 연속 수행

#### 스탯 환산 예시
- 운동 30분: **STR +3**
- Deep Work 90분: **INT +4, GRT +2**
- 성찰 작성: **WIS +3**
- 네트워킹 1회: **CHA +2**
- 감정지출 0일: **GRT +3**

경험치 누적 → 레벨업 시스템

### 9. 리포트 시스템
- **일간**: 오늘 수행률, 스탯 변화
- **주간**: 테마별 수행률, Deep Work 총합, 감정지출 카드
- **월간**: 성취 하이라이트, 다음 달 목표 추천

### 10. 알림 & PWA
- **아침 07:00**: "오늘의 테마 + 핵심 3"
- **점심 13:00**: "중간 점검"
- **밤 22:00**: "하루 마감 리포트 작성"
- iOS/Android PWA 위젯: 오늘 진행률, 다음 타임블록

---

## 🎮 디자인 컨셉: 게임 인벤토리/스테이터스 느낌

### 비주얼 가이드
- **배경**: 다크/네이비 그라데이션 (게임 UI 느낌)
- **카드**: 네온 테두리, 글로우 효과
- **타이포**: 고딕 계열, 굵은 폰트
- **컬러 팔레트**:
  - Primary: #00D9FF (사이버 블루)
  - Secondary: #FF2E63 (네온 핑크)
  - Success: #00FF9F (네온 그린)
  - Warning: #FFEB3B (골드)
  - 배경: #0A0E27 (다크 네이비)

### UI 요소
- **스탯 게이지**: 원형 프로그레스 + 숫자
- **타임라인**: 세로 타임슬롯 바 (드래그 가능)
- **태스크 카드**: 체크박스 + 우선순위 뱃지 + 예상시간
- **경험치 바**: 상단 고정 (레벨/EXP)
- **인벤토리**: 보상, 배지, 업적 카드
- **애니메이션**: 완료 시 파티클 효과, 레벨업 시 플래시

---

## 📱 사용자 여정

### A. 하루 시작
1. 앱 오픈 → 오늘 날짜/요일/테마 자동 표시
2. 월/주/일 목표 불러와 **핵심 3태스크** 제안(GPT)
3. 사용자 확정/수정
4. 타임블록 자동 배치 → 드래그로 조정

### B. 하루 운영
- 체크 완료 시 **타임라인**에 즉시 기록
- 경험치/스탯 실시간 상승
- 금전 빠른 입력
- 감정 로그 (이모지/색)

### C. 하루 마감
1. 5문항 성찰 폼 작성
2. GPT 요약/칭찬/개선 제시
3. 내일 우선순위 3개 자동 제안
4. 확인 시 내일 보드에 선배치

### D. 주간/월간
- 주간 리포트: 테마별 수행률, 스탯 차트
- 월간 리포트: 레벨업 기록, 목표 달성도
- 다음 기간 목표 설정

---

## 🏗️ 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS + shadcn/ui
- **State**: Zustand
- **Charts**: Recharts
- **Drag & Drop**: @dnd-kit
- **Animation**: Framer Motion

### Backend
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Security**: Row Level Security (RLS)
- **Cron Jobs**: Supabase Edge Functions

### AI
- **API**: OpenAI GPT-4
- **Integration**: Server Routes (API Routes)
- **Caching**: Redis (추후)

### Deployment
- **Web**: Vercel
- **Backend**: Supabase Cloud
- **PWA**: Service Worker + Web Push API

---

## 📊 데이터 모델

```typescript
// 사용자
User {
  id: uuid
  email: string
  timezone: string
  locale: string
  createdAt: timestamp
}

// 목표 (월/주/일)
Goal {
  id: uuid
  userId: uuid
  level: 'MONTHLY' | 'WEEKLY' | 'DAILY'
  title: string
  description: string
  periodStart: date
  periodEnd: date
  progress: number (0-100)
  status: 'active' | 'completed' | 'archived'
}

// 태스크
Task {
  id: uuid
  userId: uuid
  goalId?: uuid
  title: string
  description: string
  tags: string[]
  theme: 'EXECUTE' | 'FOCUS' | 'ORGANIZE' | ...
  priority: 1 | 2 | 3
  status: 'pending' | 'in_progress' | 'completed'
  plannedAt: timestamp
  dueAt: timestamp
  durationMin: number
  actualDurationMin?: number
  completedAt?: timestamp
}

// 타임블록
TimeBlock {
  id: uuid
  userId: uuid
  taskId: uuid
  date: date
  startTime: time
  endTime: time
  actualStart?: timestamp
  actualEnd?: timestamp
}

// 일일 플랜
DayPlan {
  id: uuid
  userId: uuid
  date: date
  theme: string
  top3TaskIds: uuid[]
  recommendations: json
  gptMorningCoach?: text
  gptNightCoach?: text
}

// 성찰
Reflection {
  id: uuid
  userId: uuid
  date: date
  mood: string
  energy: number (1-5)
  answers: {
    q1: string  // 가장 잘한 것
    q2: string  // 막힌 순간
    q3: string  // 개선 행동
    q4: string  // 감정지출
    q5: string  // 한 줄 요약
  }
  gptSummary: text
  gptPraise: string
  gptImprovement: string
  tomorrowPriorities: string[]
}

// 금전
FinanceEntry {
  id: uuid
  userId: uuid
  date: date
  type: 'income' | 'expense'
  amount: number
  category: string
  tag: 'fixed' | 'variable' | 'emotional'
  isEmotional: boolean
  note?: string
}

// 스탯
Stats {
  id: uuid
  userId: uuid
  date: date
  str: number
  int: number
  wis: number
  cha: number
  grt: number
  totalExp: number
  level: number
}

// 연속 기록
Streak {
  id: uuid
  userId: uuid
  metric: string  // 'reflection', 'no_emotional_spending', etc.
  count: number
  lastDate: date
  bestStreak: number
}
```

---

## 🔄 API 엔드포인트

```
POST   /api/day/init           // 오늘 플랜 초기화 + 테마 판별
GET    /api/day/:date          // 특정 날짜 플랜 조회

POST   /api/tasks              // 태스크 생성
PATCH  /api/tasks/:id          // 상태/시간 업데이트
DELETE /api/tasks/:id          // 삭제

POST   /api/timeblocks         // 타임블록 배치/수정
PATCH  /api/timeblocks/:id     // 실제 시간 기록

POST   /api/reflection         // 성찰 저장 → GPT 밤 코치 호출
GET    /api/reflection/:date   // 특정 날짜 성찰 조회

POST   /api/finance            // 수입/지출 기록
GET    /api/finance/report     // 주간/월간 리포트

GET    /api/stats              // 현재 스탯/레벨
GET    /api/stats/history      // 스탯 변화 히스토리

POST   /api/gpt/morning        // 아침 코치
POST   /api/gpt/night          // 밤 코치
POST   /api/gpt/goal-breakdown // 목표 → 태스크 자동 분해

GET    /api/report/weekly      // 주간 리포트
GET    /api/report/monthly     // 월간 리포트
```

---

## 🚀 MVP 개발 로드맵 (2주 스프린트)

### Sprint 1 (Week 1)
**목표**: 핵심 데이터 모델 + 테마 판별 + 기본 UI

#### Day 1-2: 프로젝트 셋업
- [x] Next.js + TypeScript + Tailwind 설정
- [ ] Supabase 프로젝트 생성 + 스키마 마이그레이션
- [ ] 인증 플로우 (이메일/비밀번호)
- [ ] 기본 레이아웃 + 네비게이션

#### Day 3-4: 테마 시스템 + DayPlan
- [ ] 오늘 날짜/요일/테마 자동 판별 로직
- [ ] DayPlan 생성 API
- [ ] 테마별 추천 규칙 엔진 (룰 기반)
- [ ] 홈 화면: 오늘의 테마 표시

#### Day 5-7: 태스크 + 타임블록
- [ ] 태스크 CRUD API
- [ ] 타임블록 배치 알고리즘
- [ ] 드래그&드롭 타임라인 UI
- [ ] 태스크 완료 시 스탯 증가 로직

### Sprint 2 (Week 2)
**목표**: 성찰 + GPT 코칭 + 금전 + 스탯 대시보드

#### Day 8-9: 성찰 + GPT 밤 코치
- [ ] 성찰 5문항 폼 UI
- [ ] GPT API 연동 (밤 코치 프롬프트)
- [ ] 내일 우선순위 자동 제안

#### Day 10-11: 금전 트래킹
- [ ] 빠른 입력 UI (숫자패드 + 태그)
- [ ] 감정지출 플래그
- [ ] 주간/월간 차트 (Recharts)

#### Day 12-13: 스탯 시스템
- [ ] 5대 스탯 계산 로직
- [ ] 원형 게이지 UI (게임 스타일)
- [ ] 레벨링 시스템
- [ ] 경험치 바 애니메이션

#### Day 14: 리포트 + 폴리싱
- [ ] 주간 리포트 페이지
- [ ] 다크 모드 게임 UI 적용
- [ ] 반응형 레이아웃 최적화
- [ ] PWA 매니페스트 설정

---

## 📈 성공 지표

### 사용자 행동
- **데일리 활성**: 하루 1회 이상 접속
- **핵심 3 완료율**: 주간 평균 60% 이상
- **Deep Work 시간**: 주간 평균 10시간 이상
- **성찰 작성**: 주간 5회 이상
- **감정지출 0일**: 월간 15일 이상

### 제품 메트릭
- **온보딩 7일 잔존율**: 40% 이상
- **주간 활성 → 월간 활성 전환**: 60% 이상
- **평균 세션 시간**: 8분 이상
- **스탯 레벨 10 달성**: 30일 내

---

## 🔒 보안/프라이버시

- **RLS(Row Level Security)**: 모든 테이블에 사용자별 접근 제어
- **데이터 암호화**: 금전/감정 로그 전송/저장 시 암호화
- **AI 로그**: 익명화/요약 저장 (원문 최소화)
- **로컬 우선**: 오프라인 캐시 + 동기화

---

## 💡 향후 확장 기능 (v1.1+)

1. **GPT 아침 코치** (현재 룰 기반 → GPT 기반)
2. **목표 → 태스크 자동 분해** (GPT)
3. **PWA 푸시 알림** (아침/밤 코치)
4. **배지 시스템** (연속 7일 성찰 등)
5. **소셜 기능** (친구와 스탯 비교)
6. **AI 음성 코치** (TTS)
7. **다크 패턴 방지 대시보드** (과몰입 경고)

---

## 📦 예시 데이터

### DayPlan JSON
```json
{
  "date": "2025-10-13",
  "theme": "EXECUTE",
  "themeEmoji": "🔥",
  "top3": [
    {
      "title": "수익루프 산출물 1건 완성",
      "durationMin": 120,
      "priority": 1,
      "tags": ["income", "deep-work"]
    },
    {
      "title": "웹앱 데이터모델 확정",
      "durationMin": 90,
      "priority": 2,
      "tags": ["project", "focus"]
    },
    {
      "title": "일본어 45분 학습",
      "durationMin": 45,
      "priority": 3,
      "tags": ["language", "skill"]
    }
  ],
  "timeblocks": [
    {"task": "수익루프 산출물", "start": "09:00", "end": "11:00"},
    {"task": "데이터모델 확정", "start": "11:15", "end": "12:45"},
    {"task": "일본어 학습", "start": "13:00", "end": "13:45"}
  ],
  "gptMorningCoach": "오늘은 실행의 날입니다. 수익루프 산출물을 최우선으로 완성하세요. 오전 9시부터 2시간 Deep Work로 집중하면 충분합니다. 에너지가 높은 아침을 활용하세요."
}
```

### Stats Update Example
```json
{
  "action": "complete_task",
  "taskId": "abc123",
  "statsGain": {
    "STR": 0,
    "INT": 4,
    "WIS": 0,
    "CHA": 0,
    "GRT": 2
  },
  "expGain": 120,
  "newLevel": 5,
  "levelUp": false
}
```

---

## 🎨 UI 컴포넌트 리스트

### Pages
1. `/` - 홈 (오늘 보드)
2. `/goals` - 목표 관리 (월/주/일)
3. `/finance` - 금전 트래킹
4. `/stats` - 스탯/레벨 대시보드
5. `/report` - 리포트 (일/주/월)
6. `/settings` - 설정

### Components
- `ThemeHeader` - 오늘 테마 헤더
- `Top3Tasks` - 핵심 3태스크 카드
- `TimelineBlock` - 드래그 가능 타임블록
- `StatGauge` - 원형 스탯 게이지
- `ExpBar` - 상단 고정 경험치 바
- `QuickFinanceInput` - 빠른 금전 입력
- `ReflectionForm` - 5문항 성찰 폼
- `GPTCoachCard` - GPT 피드백 카드
- `EmotionalSpendingAlert` - 감정지출 경고
- `AchievementBadge` - 업적 배지
- `WeeklyChart` - 주간 수행률 차트

---

## 🎯 개발 우선순위

### 🔥 P0 (MVP 필수)
- 테마 판별 + DayPlan 생성
- 태스크 CRUD + 타임블록
- 성찰 + GPT 밤 코치
- 스탯 시스템 + 레벨링
- 게임 스타일 UI

### ⚡ P1 (MVP 직후)
- GPT 아침 코치
- 금전 트래킹 + 감정지출
- 주간/월간 리포트
- PWA + 푸시 알림

### 💎 P2 (확장)
- 목표 자동 분해
- 배지 시스템
- 음성 코치
- 소셜 기능

---

**이제 코딩을 시작합니다! 🚀**

---

## 🐛 Known Issues & Fixes

### TypeScript + Supabase snake_case 이슈 (2025-01-14 해결)
**문제**: TypeScript 타입은 camelCase인데 Supabase DB는 snake_case라 타입 충돌 발생

**해결**:
- 모든 interface를 DB snake_case 기준으로 수정
- camelCase alias 필드 추가 (optional)로 하위 호환성 유지
- 예: `user_id` (primary) + `userId?` (alias)

**영향받은 파일**:
- `types/index.ts` - 모든 인터페이스 수정
- `components/*.tsx` - snake_case 사용
- `app/**/*.tsx` - snake_case 사용

**교훈**: Supabase 사용 시 처음부터 snake_case로 타입 정의하기

---

### API Route에서 optional 필드 undefined 에러 (2025-01-14 해결)
**문제**: `app/api/tasks/[id]/route.ts`에서 `updatedStats.totalExp`가 undefined 가능성으로 TypeScript 컴파일 에러

**원인**:
- DB에서 가져온 데이터는 `total_exp` (snake_case)
- TypeScript alias는 `totalExp?` (optional)
- 직접 접근 시 undefined 가능

**해결**:
```typescript
// Before (에러)
updatedStats.totalExp += expGain;

// After (수정)
const currentExp = updatedStats.total_exp || updatedStats.totalExp || 0;
updatedStats.total_exp = currentExp + expGain;
```

**영향받은 파일**:
- `app/api/tasks/[id]/route.ts` - snake_case로 일관성 있게 사용

**교훈**:
- Supabase에서 가져온 데이터는 **항상 snake_case 필드**로 접근
- Optional alias는 편의용일 뿐, DB 응답은 snake_case만 보장됨
- API Route에서는 snake_case 사용 강제

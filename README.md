# Youth Life - 오행 리듬 기반 인생 운영 시스템 🎮

**게임 스타일 UI로 자신의 인생을 관리하는 웹앱**

오행 리듬 기반 루틴·목표·금전·성찰을 하루 리듬에 동기화하고, GPT가 코치처럼 피드백을 주는 개인 운영체제

![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)

---

## 🚨 개발 원칙 (중요!)

### "임시" 코드 금지 원칙

이 프로젝트는 **"실제로 작동하지 않으면서 작동하는 것처럼 보이는 코드"를 절대 작성하지 않습니다.**

#### ❌ 하지 않는 것:
- Mock 데이터로 UI만 보여주기
- 에러를 숨기고 "작동하는 것처럼" 보이게 하기
- 데이터베이스 없이 "임시로" 동작하는 것처럼 만들기
- 나중에 고치기로 하고 일단 넘어가기

#### ✅ 하는 것:
- 데이터베이스를 제대로 설정하고 실제로 작동하게 만들기
- 에러가 나면 정확한 원인과 해결 방법 문서화
- 모든 기능이 실제로 작동하는 것을 확인 후 배포
- 설정이 필요하면 명확한 가이드 제공

### 설정 필수 사항

유키노 AI 비서를 사용하려면 **반드시** 다음을 설정해야 합니다:
1. Supabase 데이터베이스 테이블 생성 (SQL 실행)
2. OpenAI API 키 설정
3. 환경 변수 구성

자세한 내용: **[📖 유키노 완전 설정 가이드](./docs/YUKINO_SETUP.md)**

---

## ✨ 주요 기능

### 🎉 v1.0 배포 완료! (2025-11-26)
**Production URL**: https://youth-life.vercel.app

모든 핵심 기능이 정상 작동하며 Vercel에 성공적으로 배포되었습니다!

### 🏠 대시보드
- 오늘의 테마 자동 판별 (월: 실행 ~ 일: 성찰)
- DayPlan 자동 초기화
- 🤖 아침 코치 (GPT 기반 동기부여)
- 빠른 액션 (금전/캘린더/성찰)

### 🎯 핵심 3태스크 시스템
- 우선순위 기반 할 일 관리 (P1/P2/P3)
- 태스크 완료 시 자동 스탯 증가
- 실시간 Supabase 동기화
- 테마별 태그 시스템

### 🎮 게임 스탯 시스템
- **STR** (체력): 운동/수면 → 🔥
- **INT** (지성): 학습/코딩/독서 → 🧠
- **WIS** (지혜): 성찰/명상/회고 → 🔮
- **CHA** (매력): 네트워킹/소통 → ✨
- **GRT** (꾸준함): 루틴 연속 수행 → 💪
- 경험치 획득 → 레벨업 시스템 (최대 레벨 무제한)

### 🏆 업적 & 연속 기록
- 6개 자동 판별 업적 (7일 성찰, Deep Work 10h, 감정지출 0, 레벨10 등)
- 실시간 연속 기록 추적 (성찰/Deep Work/감정지출 0)
- 최고 기록 자동 갱신

### 🎯 목표 관리
- 월간/주간/일일 목표 계층 구조
- 진행률 조정 (-10% / +10%)
- ✨ AI 목표 자동 분해 (GPT-4)

### 📅 캘린더 메모
- 노션 캘린더 스타일 월간 뷰
- 날짜별 일정/메모 기록
- 7가지 색상 태그 (blue/green/red/yellow/purple/pink/gray)
- 종일/시간 지정 일정
- 오늘 날짜 강조 표시

### 💰 금전 트래킹
- 수입/지출 빠른 입력
- 감정지출 플래그 & 경보
- 주간 통계 (수입/지출/순이익/저축률)
- 카테고리별 분류

### 🌙 하루 마감 성찰
- 5문항 구조화된 성찰 (잘한 것/막힌 순간/개선 행동/감정지출/한 줄 요약)
- 기분/에너지 레벨 기록
- 🤖 GPT 밤 코치 자동 피드백
- 내일 우선순위 3개 자동 제안
- 연속 기록 자동 업데이트

### 📈 리포트 시스템
- 실제 데이터 기반 주간 완료율
- 주간 경험치 획득량
- 태스크 통계
- GPT 주간 요약 (구현 예정)

### 🤖 GPT AI 통합 (완료)
- **아침 코치**: 목표 기반 태스크 추천 + 어제 성과 분석
- **밤 코치**: 오늘 칭찬 + 개선점 + 내일 우선순위
- **목표 분해**: 큰 목표 → 실행 가능한 5-7개 태스크 자동 생성

---

## 🚀 빠른 시작

### 사전 요구사항
- Node.js 18+ 설치
- npm 또는 yarn
- Supabase 계정 (무료)
- OpenAI API 키 (선택)

### 설치

```bash
# 1. 저장소 클론
git clone https://github.com/yourusername/youth-life.git
cd youth-life

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 열어서 API 키 입력

# 4. 개발 서버 실행
npm run dev
```

브라우저에서 http://localhost:3000 열기

---

## ⚙️ 환경 변수 설정

`.env.local` 파일에 다음 내용 추가:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI (선택)
OPENAI_API_KEY=your_openai_api_key

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Supabase 설정

1. [Supabase](https://supabase.com/) 에서 새 프로젝트 생성
2. SQL Editor에서 `supabase/schema.sql` 실행
3. **유키노 AI 대화 기능 활성화** (선택):
   ```sql
   -- supabase/migrations/20250127_create_yukino_conversations.sql 실행
   ```
   이 마이그레이션을 실행하면:
   - 대화 내역이 영구 저장됩니다
   - 페이지 새로고침해도 대화가 유지됩니다
   - 유키노의 장기 기억 시스템이 활성화됩니다

   **실행하지 않아도** 유키노 채팅은 작동하지만, 대화 내역이 저장되지 않습니다.

4. Settings > API에서 URL과 anon key 복사
5. `.env.local`에 붙여넣기

---

## 📁 프로젝트 구조

```
youth-life/
├── app/                      # Next.js App Router
│   ├── page.tsx             # 홈 (오늘 보드 + 아침 코치)
│   ├── goals/               # 목표 관리 (월/주/일)
│   ├── calendar/            # 캘린더 메모
│   ├── finance/             # 금전 트래킹
│   ├── reflection/          # 하루 마감 성찰
│   ├── stats/               # 스탯 & 업적
│   ├── report/              # 주간/월간 리포트
│   ├── login/               # 로그인
│   └── api/                 # API 라우트
│       ├── tasks/           # 태스크 CRUD
│       ├── calendar/        # 캘린더 메모 CRUD
│       ├── coach/           # GPT 아침/밤 코치
│       ├── goals/           # 목표 자동 분해
│       └── day/             # DayPlan 초기화
│
├── components/              # React 컴포넌트
│   ├── ThemeHeader.tsx     # 오늘 테마 헤더
│   ├── Top3Tasks.tsx       # 핵심 3태스크
│   ├── StatsOverview.tsx   # 스탯 게이지
│   ├── Navigation.tsx      # 네비게이션 바
│   └── AuthGuard.tsx       # 인증 가드
│
├── lib/                    # 유틸리티 함수
│   ├── theme.ts           # 테마 판별 로직
│   ├── stats.ts           # 스탯 계산
│   ├── achievements.ts    # 업적 & 연속 기록
│   ├── supabase.ts        # Supabase 클라이언트
│   ├── openai.ts          # OpenAI GPT 통합
│   └── simple-auth.ts     # 간단 인증
│
├── types/                 # TypeScript 타입
│   └── index.ts          # 공통 타입 정의 (10개 테이블)
│
├── supabase/              # Supabase 설정
│   ├── schema.sql         # 데이터베이스 스키마
│   └── init_master_user.sql # 마스터 사용자 초기화
│
└── docs/                  # 문서
    ├── PRD.md
    ├── SUPABASE_SETUP.md
    ├── OPENAI_SETUP.md
    └── DEPLOYMENT.md
```

---

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary**: `#00D9FF` (사이버 블루)
- **Secondary**: `#FF2E63` (네온 핑크)
- **Success**: `#00FF9F` (네온 그린)
- **Warning**: `#FFEB3B` (골드)
- **Background**: `#0A0E27` (다크 네이비)

### 테마 컬러
- 🔥 **실행**: `#FF6B35`
- 🧱 **집중**: `#4ECDC4`
- 💧 **정리**: `#45B7D1`
- 🌳 **확장**: `#96CEB4`
- ⚙ **마감**: `#FFEAA7`
- 🪶 **회복**: `#DFE6E9`
- 🌙 **성찰**: `#A29BFE`

---

## 🛠️ 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **State**: Zustand (추후)
- **Charts**: Recharts (추후)
- **AI**: OpenAI GPT-4 (추후)

---

## 📋 개발 로드맵

### ✅ Phase 1 - MVP (완료)
- [x] 프로젝트 셋업
- [x] 테마 판별 시스템
- [x] 기본 UI 컴포넌트
- [x] 데이터베이스 스키마
- [x] 게임 스타일 디자인

### ✅ Phase 2 - 핵심 기능 (완료)
- [x] Supabase 연동
- [x] 인증 시스템
- [x] 태스크 CRUD
- [x] 스탯 계산 로직
- [x] 캘린더 메모 시스템
- [x] 목표 관리 (월/주/일)
- [x] 금전 트래킹

### ✅ Phase 3 - AI 통합 (완료)
- [x] GPT 아침 코치 API
- [x] GPT 밤 코치 API
- [x] 목표 자동 분해

### ✅ Phase 4 - 완성도 향상 (완료)
- [x] 성찰 페이지 (/reflection)
- [x] 아침/밤 코치 UI 연동
- [x] DayPlan 자동 초기화
- [x] 리포트 실제 데이터 연동
- [x] 배지/업적 로직
- [x] 연속 기록 시스템

### ✅ Phase 5 - 배포 & 버그 수정 (완료)
- [x] Vercel 프로덕션 배포
- [x] Supabase 데이터베이스 설정
- [x] 환경 변수 설정 가이드 작성
- [x] Next.js 15 동적 라우트 타입 수정
- [x] Supabase 컬럼명 오류 수정 (date, type, level)
- [x] 캘린더 날짜 범위 계산 버그 수정
- [x] 더미 데이터 제거
- [x] 싱글톤 패턴으로 Supabase 클라이언트 최적화

### 🎨 Phase 6 - 추가 기능 (선택)
- [ ] 타임블록 스케줄러 (드래그&드롭)
- [ ] PWA + 푸시 알림
- [ ] 음성 코치 (TTS)
- [ ] 소셜 공유 기능

---

## 📦 배포

### Vercel 배포 완료
- **Production URL**: https://youth-life.vercel.app
- **자동 배포**: GitHub master 브랜치 push 시 자동 배포
- **환경 변수**: Vercel Dashboard에서 설정 완료

### 배포 가이드
자세한 배포 가이드는 [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md) 참조

---

## 📝 변경 사항 (v1.1)

### 2025-11-27 - 유키노 AI 비서 안정화 및 날짜 필터링 개선
**주요 수정사항:**
- ✅ 유키노 대화 저장 Foreign Key 오류 수정 (users → profiles)
- ✅ 태스크 날짜 필터링 로직 완전 개선 (TIMESTAMP 기반 → 날짜 범위 기반)
- ✅ GPT System Prompt 강화 (현재 시각, 날짜 형식 명시)
- ✅ Top3Tasks 자동 새로고침 기능 추가 (페이지 포커스 시)
- ✅ useCallback으로 메모이제이션 최적화

**해결된 핵심 이슈:**
- 🔴 **유키노 태스크 추가 후 홈화면 미반영**: 날짜 필터링 로직이 `.gte()/.lte()` 사용으로 시간대 문제 발생
  - **해결**: `.gte(startOfDay).lt(startOfTomorrow)` 패턴으로 변경
- 🔴 **Foreign Key 제약조건 위반**: `yukino_conversations`가 `users` 테이블 참조
  - **해결**: Supabase에서 Foreign Key를 `profiles` 테이블로 수정
- 🟡 **GPT가 잘못된 날짜로 태스크 생성**: System Prompt에 현재 시각 정보 부족
  - **해결**: 한국 시간(KST) 및 ISO 8601 형식 예시 추가

**불안정 코드 제거:**
- ❌ 제거: "작동하는 것처럼 보이는" graceful degradation
- ❌ 제거: 에러를 숨기는 try-catch 남용
- ✅ 추가: 명확한 에러 메시지와 해결 가이드

**개발 원칙 준수:**
- 모든 기능이 **실제로 작동**함
- 데이터베이스가 제대로 설정되지 않으면 **명확한 에러 표시**
- "임시" 코드 없음

---

## 📝 변경 사항 (v1.0)

### 2025-11-26 - 프로덕션 배포 완료
**주요 수정사항:**
- ✅ Supabase 컬럼명 통일 (date, type, level)
- ✅ Next.js 15 동적 라우트 params Promise 타입 지원
- ✅ 캘린더 날짜 범위 계산 버그 수정 (11월 31일 → 다음 달 1일 미만)
- ✅ 리포트 페이지 더미 데이터 제거
- ✅ Supabase 싱글톤 패턴으로 메모리 최적화
- ✅ 환경 변수 설정 가이드 문서화

**해결된 이슈:**
- 400 Bad Request: 잘못된 컬럼명 (`entry_date` → `date`, `goal_type` → `level`)
- 406 Not Acceptable: 존재하지 않는 날짜 쿼리 (`2025-11-31`)
- Build Error: Service Role Key 빌드타임 초기화 오류

**데이터베이스 스키마:**
- 10개 테이블 생성 완료
- RLS 비활성화 (개인 사용)
- 마스터 사용자 초기화

---

## 🧪 테스트

```bash
# 린트 검사
npm run lint

# 빌드 테스트
npm run build

# 프로덕션 실행
npm run start
```

---

## 📖 사용 가이드

### 1. 하루 시작
1. 앱 오픈 → 오늘 테마 확인
2. GPT 추천 받기 → 핵심 3태스크 확정
3. 타임블록 배치 조정

### 2. 하루 운영
- 태스크 완료 시 체크
- 실시간 스탯/경험치 상승 확인
- 금전 발생 시 빠른 입력

### 3. 하루 마감
- 5문항 성찰 작성
- GPT 피드백 확인
- 내일 우선순위 미리 설정

---

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 라이센스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 참조

---

## 📧 문의

프로젝트 관련 문의: [your.email@example.com](mailto:your.email@example.com)

프로젝트 링크: [https://github.com/yourusername/youth-life](https://github.com/yourusername/youth-life)

---

## 🙏 감사의 말

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenAI](https://openai.com/)

---

**Made with ❤️ by Youth Life Team**

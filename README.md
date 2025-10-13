# Youth Life - 오행 리듬 기반 인생 운영 시스템 🎮

**게임 스타일 UI로 자신의 인생을 관리하는 웹앱**

오행 리듬 기반 루틴·목표·금전·성찰을 하루 리듬에 동기화하고, GPT가 코치처럼 피드백을 주는 개인 운영체제

![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)

---

## ✨ 주요 기능

### 🔥 오늘의 테마 자동 판별
- 요일별 자동 테마 설정 (월: 실행, 화: 집중, 수: 정리...)
- 테마에 맞는 추천 할 일 자동 생성

### 🎯 핵심 3태스크 시스템
- 우선순위 기반 할 일 관리
- 드래그&드롭 타임블록 스케줄러
- 실제 수행 시간 자동 기록

### 📊 게임 스탯 시스템
- **STR** (체력): 운동/수면
- **INT** (지성): 학습/코딩/독서
- **WIS** (지혜): 성찰/명상/회고
- **CHA** (매력): 네트워킹/소통
- **GRT** (꾸준함): 루틴 연속 수행
- 경험치 획득 → 레벨업 시스템

### 💰 금전 트래킹
- 빠른 입력 (숫자패드 + 태그)
- 감정지출 감지 및 경보
- 주간/월간 리포트

### 🌙 하루 마감 성찰
- 5문항 구조화된 성찰
- GPT 기반 피드백 (칭찬/개선/내일 우선순위)

### 🤖 GPT 코칭
- **아침 코치**: 오늘의 핵심 태스크 추천
- **밤 코치**: 하루 요약 및 내일 준비

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
3. Settings > API에서 URL과 anon key 복사
4. `.env.local`에 붙여넣기

---

## 📁 프로젝트 구조

```
youth-life/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈 (오늘 보드)
│   └── globals.css        # 글로벌 스타일
│
├── components/            # React 컴포넌트
│   ├── ThemeHeader.tsx    # 오늘 테마 헤더
│   ├── Top3Tasks.tsx      # 핵심 3태스크
│   └── StatsOverview.tsx  # 스탯 게이지
│
├── lib/                   # 유틸리티 함수
│   └── theme.ts           # 테마 판별 로직
│
├── types/                 # TypeScript 타입
│   └── index.ts           # 공통 타입 정의
│
├── supabase/              # Supabase 설정
│   └── schema.sql         # 데이터베이스 스키마
│
├── public/                # 정적 파일
│
├── PRD.md                 # 제품 기획서
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
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

### 🚧 Phase 2 - 핵심 기능 (진행 중)
- [ ] Supabase 연동
- [ ] 인증 시스템
- [ ] 태스크 CRUD
- [ ] 타임블록 스케줄러
- [ ] 스탯 계산 로직

### 📅 Phase 3 - AI 통합 (예정)
- [ ] GPT 아침 코치
- [ ] GPT 밤 코치
- [ ] 목표 자동 분해
- [ ] 추천 시스템

### 🎯 Phase 4 - 고급 기능 (예정)
- [ ] 금전 트래킹
- [ ] 주간/월간 리포트
- [ ] PWA + 푸시 알림
- [ ] 배지 시스템

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

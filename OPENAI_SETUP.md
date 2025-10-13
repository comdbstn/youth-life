# OpenAI API Key 설정 가이드

Youth Life 앱에서 AI 코칭 기능을 사용하려면 OpenAI API Key를 설정해야 합니다.

## 1. OpenAI API Key 발급

1. **OpenAI 웹사이트 접속**
   - https://platform.openai.com/ 방문
   - 계정이 없으면 회원가입

2. **API Key 생성**
   - 로그인 후 우측 상단 프로필 클릭
   - "View API keys" 선택
   - "Create new secret key" 클릭
   - 이름 입력 (예: "Youth Life Production")
   - ⚠️ **생성된 키를 바로 복사하세요! 다시 볼 수 없습니다.**

3. **요금제 확인**
   - API 사용량에 따라 과금됩니다
   - Settings > Billing 에서 요금제 확인
   - 사용량 제한(Limit) 설정 권장

## 2. Vercel에 환경 변수 추가

### 방법 1: Vercel Dashboard (웹)

1. https://vercel.com/dashboard 접속
2. "youth-life" 프로젝트 선택
3. "Settings" 탭 클릭
4. 좌측 메뉴에서 "Environment Variables" 선택
5. 새 환경 변수 추가:
   ```
   Name: OPENAI_API_KEY
   Value: sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx (복사한 키)
   Environment: Production, Preview, Development (모두 체크)
   ```
6. "Save" 클릭

### 방법 2: Vercel CLI (터미널)

```bash
# Vercel CLI 설치 (없으면)
npm install -g vercel

# 프로젝트 디렉토리에서 실행
vercel env add OPENAI_API_KEY

# 프롬프트에서:
# - Value 입력: sk-proj-xxxxxxxx...
# - Environment 선택: Production, Preview, Development 모두 선택
```

## 3. 재배포 (중요!)

환경 변수를 추가한 후에는 **반드시 재배포**해야 적용됩니다.

### 자동 재배포 (권장)
- GitHub에 새 커밋을 푸시하면 자동으로 재배포됩니다
- 또는 Vercel Dashboard에서 "Redeploy" 버튼 클릭

### 수동 재배포
```bash
vercel --prod
```

## 4. 적용된 AI 기능

### 4.1 아침 코치 (Morning Coach)
- **API**: `POST /api/coach/morning`
- **기능**:
  - 오늘의 테마에 맞는 동기부여 메시지
  - 사용자 목표 기반 조언
  - 어제 성과 피드백
- **사용 모델**: GPT-4o-mini

### 4.2 저녁 코치 (Evening Coach)
- **API**: `POST /api/coach/evening`
- **기능**:
  - 오늘 성과 칭찬
  - 개선점 제안
  - 내일 우선순위 3가지 추천
- **사용 모델**: GPT-4o-mini

### 4.3 목표 자동 분해 (Goal Breakdown)
- **API**: `POST /api/goals/breakdown`
- **기능**:
  - 큰 목표 → 5-7개 실행 가능 태스크
  - 자동 테마 배정
  - 우선순위 및 소요시간 추정
- **사용 모델**: GPT-4o-mini
- **UI**: 목표 페이지 각 카드의 "✨ AI 분해" 버튼

### 4.4 성찰 요약 (Reflection Summary)
- **기능**: 사용자의 5가지 성찰 질문 답변을 2-3문장으로 요약
- **사용 모델**: GPT-4o-mini

## 5. 비용 관리

### 예상 사용량 (GPT-4o-mini)
- 아침/저녁 코치: 하루 2회 × 약 300 토큰 = ~600 토큰/일
- 목표 분해: 필요시 × 약 1000 토큰 = 주 1-2회
- **월 예상 비용**: $1-3 (개인 사용 기준)

### 비용 절감 팁
1. OpenAI Dashboard에서 사용량 제한 설정
2. 불필요한 반복 호출 방지 (캐싱 활용)
3. 테스트 환경에서는 mock 데이터 사용

## 6. 문제 해결

### "API key not found" 에러
- Vercel 환경 변수가 제대로 설정되었는지 확인
- 재배포했는지 확인
- Environment를 Production으로 설정했는지 확인

### "Rate limit exceeded" 에러
- OpenAI 무료 티어 한도 초과
- Billing 설정에서 요금제 업그레이드 필요

### "Insufficient quota" 에러
- OpenAI 계정 잔액 부족
- Billing에서 충전 필요

## 7. 보안 주의사항

⚠️ **절대로 하지 말 것:**
- API Key를 GitHub에 커밋하지 마세요
- `.env.local` 파일을 커밋하지 마세요
- API Key를 클라이언트 코드에 넣지 마세요

✅ **올바른 방법:**
- 환경 변수로만 관리
- `.gitignore`에 `.env.local` 포함 (이미 설정됨)
- 서버 사이드 API 라우트에서만 사용

## 8. 로컬 개발 환경

로컬에서 테스트하려면:

```bash
# .env.local 파일 생성 (프로젝트 루트)
echo "OPENAI_API_KEY=sk-proj-xxxxxxxx..." > .env.local

# 개발 서버 재시작
npm run dev
```

---

**설정 완료 후 테스트**:
1. youth-life.vercel.app 접속
2. 목표 페이지에서 목표 추가
3. "✨ AI 분해" 버튼 클릭
4. 태스크가 자동 생성되는지 확인

문제가 있으면 Vercel Deployment Logs를 확인하세요!

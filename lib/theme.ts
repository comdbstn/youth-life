import { ThemeType, ThemeConfig } from '@/types';

// 테마 설정
export const THEME_CONFIG: Record<ThemeType, ThemeConfig> = {
  EXECUTE: {
    type: 'EXECUTE',
    emoji: '🔥',
    label: '실행의 날',
    color: '#FF6B35',
    description: '주간 목표 설정, 중요한 일 추진'
  },
  FOCUS: {
    type: 'FOCUS',
    emoji: '🧱',
    label: '집중의 날',
    color: '#4ECDC4',
    description: '공부, 업무 몰입 (Deep Work)'
  },
  ORGANIZE: {
    type: 'ORGANIZE',
    emoji: '💧',
    label: '정리의 날',
    color: '#45B7D1',
    description: '루틴 점검, 재무 관리, 마음 안정'
  },
  EXPAND: {
    type: 'EXPAND',
    emoji: '🌳',
    label: '확장의 날',
    color: '#96CEB4',
    description: '네트워킹, 아이디어, 시장조사'
  },
  WRAP: {
    type: 'WRAP',
    emoji: '⚙',
    label: '마감의 날',
    color: '#FFEAA7',
    description: '주간 마감, 리뷰, 데이터 기록'
  },
  RECOVER: {
    type: 'RECOVER',
    emoji: '🪶',
    label: '회복의 날',
    color: '#DFE6E9',
    description: '운동, 정리, 취미, 자연'
  },
  REFLECT: {
    type: 'REFLECT',
    emoji: '🌙',
    label: '성찰의 날',
    color: '#A29BFE',
    description: '일기, 감사, 다음 주 계획'
  }
};

// 요일 → 테마 매핑
const DAY_TO_THEME: Record<number, ThemeType> = {
  1: 'EXECUTE',   // 월
  2: 'FOCUS',     // 화
  3: 'ORGANIZE',  // 수
  4: 'EXPAND',    // 목
  5: 'WRAP',      // 금
  6: 'RECOVER',   // 토
  0: 'REFLECT',   // 일
};

/**
 * 오늘의 테마 판별
 * @param date - 날짜 (없으면 오늘)
 * @param timezone - 타임존 (없으면 로컬)
 */
export function getTodayTheme(date?: Date, timezone?: string): ThemeConfig {
  const now = date || new Date();
  const dayOfWeek = now.getDay(); // 0(일) ~ 6(토)
  const theme = DAY_TO_THEME[dayOfWeek];
  return THEME_CONFIG[theme];
}

/**
 * 날짜 포맷팅 (한국어)
 */
export function formatDateKo(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[date.getDay()];

  return `${year}.${month}.${day} (${dayName})`;
}

/**
 * 테마별 추천 태스크 규칙
 */
export function getThemeRecommendations(theme: ThemeType): string[] {
  const recommendations: Record<ThemeType, string[]> = {
    EXECUTE: [
      '수익 루프 산출물 1건 완성',
      '프로젝트 핵심 기능 개발',
      '중요 문서 작성 완료'
    ],
    FOCUS: [
      'Deep Work 90분 (코딩/학습)',
      '새로운 기술 스택 학습',
      '집중 독서 60분'
    ],
    ORGANIZE: [
      '이번 주 금전 정리',
      '백로그 청소 및 우선순위 재조정',
      '루틴 체크리스트 업데이트'
    ],
    EXPAND: [
      '네트워킹 미팅 1건',
      '아이디어 브레인스토밍',
      '시장/경쟁사 조사'
    ],
    WRAP: [
      '주간 리포트 작성',
      '완료 프로젝트 배포/릴리즈',
      '다음 주 목표 설정'
    ],
    RECOVER: [
      '운동 30분 이상',
      '취미 활동 60분',
      '자연 산책 또는 명상'
    ],
    REFLECT: [
      '주간 회고 작성',
      '감사 일기 3가지',
      '다음 주 계획 수립'
    ]
  };

  return recommendations[theme] || [];
}

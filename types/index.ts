// 테마 타입
export type ThemeType =
  | 'EXECUTE'   // 월 🔥
  | 'FOCUS'     // 화 🧱
  | 'ORGANIZE'  // 수 💧
  | 'EXPAND'    // 목 🌳
  | 'WRAP'      // 금 ⚙
  | 'RECOVER'   // 토 🪶
  | 'REFLECT';  // 일 🌙

export interface ThemeConfig {
  type: ThemeType;
  emoji: string;
  label: string;
  color: string;
  description: string;
}

// 태스크
export interface Task {
  id: string;
  userId: string;
  goalId?: string;
  title: string;
  description?: string;
  tags: string[];
  theme: ThemeType;
  priority: 1 | 2 | 3;
  status: 'pending' | 'in_progress' | 'completed';
  plannedAt: string;
  dueAt?: string;
  durationMin: number;
  actualDurationMin?: number;
  completedAt?: string;
}

// 목표
export interface Goal {
  id: string;
  userId: string;
  level: 'MONTHLY' | 'WEEKLY' | 'DAILY';
  title: string;
  description?: string;
  periodStart: string;
  periodEnd: string;
  progress: number;
  status: 'active' | 'completed' | 'archived';
}

// 타임블록
export interface TimeBlock {
  id: string;
  userId: string;
  taskId: string;
  date: string;
  startTime: string;
  endTime: string;
  actualStart?: string;
  actualEnd?: string;
}

// 일일 플랜
export interface DayPlan {
  id: string;
  userId: string;
  date: string;
  theme: ThemeType;
  top3TaskIds: string[];
  recommendations?: any;
  gptMorningCoach?: string;
  gptNightCoach?: string;
}

// 성찰
export interface Reflection {
  id: string;
  userId: string;
  date: string;
  mood: string;
  energy: number;
  answers: {
    q1: string; // 가장 잘한 것
    q2: string; // 막힌 순간
    q3: string; // 개선 행동
    q4: string; // 감정지출
    q5: string; // 한 줄 요약
  };
  gptSummary?: string;
  gptPraise?: string;
  gptImprovement?: string;
  tomorrowPriorities?: string[];
}

// 금전
export interface FinanceEntry {
  id: string;
  userId: string;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  tag: 'fixed' | 'variable' | 'emotional';
  isEmotional: boolean;
  note?: string;
}

// 스탯
export interface Stats {
  id: string;
  userId: string;
  date: string;
  str: number; // 체력
  int: number; // 지성
  wis: number; // 지혜
  cha: number; // 매력
  grt: number; // 꾸준함
  totalExp: number;
  level: number;
}

// 연속 기록
export interface Streak {
  id: string;
  userId: string;
  metric: string;
  count: number;
  lastDate: string;
  bestStreak: number;
}

// 사용자
export interface User {
  id: string;
  email: string;
  timezone: string;
  locale: string;
  createdAt: string;
}

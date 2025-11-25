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

// 태스크 (DB snake_case)
export interface Task {
  id: string;
  user_id: string;
  goal_id?: string;
  title: string;
  description?: string;
  tags: string[];
  theme: ThemeType;
  priority: 1 | 2 | 3;
  status: 'pending' | 'in_progress' | 'completed';
  planned_at: string;
  due_at?: string;
  duration_min: number;
  actual_duration_min?: number;
  completed_at?: string;
  created_at?: string;
  // camelCase aliases for convenience
  userId?: string;
  goalId?: string;
  plannedAt?: string;
  dueAt?: string;
  durationMin?: number;
  actualDurationMin?: number;
  completedAt?: string;
}

// 목표 (DB snake_case)
export interface Goal {
  id: string;
  user_id: string;
  goal_type: 'monthly' | 'weekly' | 'daily';
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  progress: number;
  status: 'pending' | 'in_progress' | 'completed' | 'archived';
  created_at?: string;
  // camelCase aliases
  userId?: string;
  startDate?: string;
  endDate?: string;
}

// 타임블록 (DB snake_case)
export interface TimeBlock {
  id: string;
  user_id: string;
  task_id: string;
  date: string;
  start_time: string;
  end_time: string;
  actual_start?: string;
  actual_end?: string;
  created_at?: string;
  // camelCase aliases
  userId?: string;
  taskId?: string;
  startTime?: string;
  endTime?: string;
  actualStart?: string;
  actualEnd?: string;
}

// 일일 플랜 (DB snake_case)
export interface DayPlan {
  id: string;
  user_id: string;
  date: string;
  theme: ThemeType;
  top3_task_ids: string[];
  recommendations?: any;
  gpt_morning_coach?: string;
  gpt_night_coach?: string;
  created_at?: string;
  // camelCase aliases
  userId?: string;
  top3TaskIds?: string[];
  gptMorningCoach?: string;
  gptNightCoach?: string;
}

// 성찰 (DB snake_case)
export interface Reflection {
  id: string;
  user_id: string;
  date: string;
  mood: string;
  energy: number;
  answers: {
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    q5: string;
  };
  gpt_summary?: string;
  gpt_praise?: string;
  gpt_improvement?: string;
  tomorrow_priorities?: string[];
  created_at?: string;
  // camelCase aliases
  userId?: string;
  gptSummary?: string;
  gptPraise?: string;
  gptImprovement?: string;
  tomorrowPriorities?: string[];
}

// 금전 (DB snake_case)
export interface FinanceEntry {
  id: string;
  user_id: string;
  entry_date: string;
  entry_type: 'income' | 'expense';
  amount: number;
  category: string;
  is_emotional: boolean;
  description?: string;
  created_at?: string;
  // camelCase aliases
  userId?: string;
  entryDate?: string;
  entryType?: string;
  isEmotional?: boolean;
}

// 스탯 (DB snake_case)
export interface Stats {
  id: string;
  user_id: string;
  date: string;
  str: number;
  int: number;
  wis: number;
  cha: number;
  grt: number;
  total_exp: number;
  level: number;
  created_at?: string;
  // camelCase aliases
  userId?: string;
  totalExp?: number;
}

// 연속 기록 (DB snake_case)
export interface Streak {
  id: string;
  user_id: string;
  metric: string;
  count: number;
  last_date: string;
  best_streak: number;
  created_at?: string;
  // camelCase aliases
  userId?: string;
  lastDate?: string;
  bestStreak?: number;
}

// 사용자 (DB snake_case)
export interface User {
  id: string;
  email: string;
  timezone?: string;
  locale?: string;
  created_at?: string;
  // camelCase aliases
  createdAt?: string;
}

// 캘린더 메모 (DB snake_case)
export interface CalendarMemo {
  id: string;
  user_id: string;
  date: string;
  title: string;
  content?: string;
  color?: string; // 색상 태그 (예: 'blue', 'green', 'red', 'yellow', 'purple')
  all_day: boolean;
  start_time?: string; // HH:mm 형식
  end_time?: string;   // HH:mm 형식
  created_at?: string;
  updated_at?: string;
  // camelCase aliases
  userId?: string;
  allDay?: boolean;
  startTime?: string;
  endTime?: string;
  createdAt?: string;
  updatedAt?: string;
}

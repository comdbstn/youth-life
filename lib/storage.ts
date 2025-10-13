import type { User, Task, Goal, Stats, FinanceEntry, Reflection, DayPlan } from '@/types';

// 로컬 스토리지 키
const STORAGE_KEYS = {
  USER: 'youth_life_user',
  TASKS: 'youth_life_tasks',
  GOALS: 'youth_life_goals',
  STATS: 'youth_life_stats',
  FINANCE: 'youth_life_finance',
  REFLECTIONS: 'youth_life_reflections',
  DAY_PLANS: 'youth_life_day_plans',
};

// 브라우저 환경 체크
const isBrowser = typeof window !== 'undefined';

// === 사용자 관리 ===
export function getCurrentUser(): User | null {
  if (!isBrowser) return null;
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  return userStr ? JSON.parse(userStr) : null;
}

export function setCurrentUser(user: User | null) {
  if (!isBrowser) return;
  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
}

export function signUp(email: string, password: string): { user: User | null; error: string | null } {
  if (!isBrowser) return { user: null, error: 'Not in browser' };

  // 간단한 검증
  if (!email || !password || password.length < 6) {
    return { user: null, error: '이메일과 비밀번호(6자 이상)를 입력하세요.' };
  }

  const user: User = {
    id: `user_${Date.now()}`,
    email,
    timezone: 'Asia/Seoul',
    locale: 'ko-KR',
    created_at: new Date().toISOString(),
  };

  // 비밀번호는 실제로는 해싱해야 하지만, 데모용으로 간단히 저장
  localStorage.setItem(`${STORAGE_KEYS.USER}_${email}_password`, password);

  setCurrentUser(user);
  initializeUserData(user.id);

  return { user, error: null };
}

export function signIn(email: string, password: string): { user: User | null; error: string | null } {
  if (!isBrowser) return { user: null, error: 'Not in browser' };

  const storedPassword = localStorage.getItem(`${STORAGE_KEYS.USER}_${email}_password`);

  if (!storedPassword) {
    return { user: null, error: '등록되지 않은 이메일입니다.' };
  }

  if (storedPassword !== password) {
    return { user: null, error: '비밀번호가 올바르지 않습니다.' };
  }

  const user: User = {
    id: `user_${email}`,
    email,
    timezone: 'Asia/Seoul',
    locale: 'ko-KR',
    created_at: new Date().toISOString(),
  };

  setCurrentUser(user);

  return { user, error: null };
}

export function signOut() {
  setCurrentUser(null);
}

// === 초기 데이터 생성 ===
function initializeUserData(userId: string) {
  // 오늘 스탯 초기화
  const today = new Date().toISOString().split('T')[0];
  const initialStats: Stats = {
    id: `stats_${Date.now()}`,
    user_id: userId,
    date: today,
    str: 0,
    int: 0,
    wis: 0,
    cha: 0,
    grt: 0,
    total_exp: 0,
    level: 1,
  };
  saveStats(initialStats);
}

// === 태스크 관리 ===
export function getTasks(userId: string, date?: string): Task[] {
  if (!isBrowser) return [];
  const tasksStr = localStorage.getItem(STORAGE_KEYS.TASKS);
  const allTasks: Task[] = tasksStr ? JSON.parse(tasksStr) : [];

  let filtered = allTasks.filter(t => (t.user_id || t.userId) === userId);

  if (date) {
    const plannedAt = (t: Task) => t.planned_at || t.plannedAt || '';
    filtered = filtered.filter(t => plannedAt(t).startsWith(date));
  }

  return filtered.sort((a, b) => a.priority - b.priority);
}

export function saveTask(task: Task) {
  if (!isBrowser) return;
  const tasksStr = localStorage.getItem(STORAGE_KEYS.TASKS);
  const allTasks: Task[] = tasksStr ? JSON.parse(tasksStr) : [];

  const index = allTasks.findIndex(t => t.id === task.id);
  if (index >= 0) {
    allTasks[index] = task;
  } else {
    allTasks.push(task);
  }

  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(allTasks));
}

export function deleteTask(taskId: string) {
  if (!isBrowser) return;
  const tasksStr = localStorage.getItem(STORAGE_KEYS.TASKS);
  const allTasks: Task[] = tasksStr ? JSON.parse(tasksStr) : [];

  const filtered = allTasks.filter(t => t.id !== taskId);
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(filtered));
}

// === 목표 관리 ===
export function getGoals(userId: string, level?: 'MONTHLY' | 'WEEKLY' | 'DAILY'): Goal[] {
  if (!isBrowser) return [];
  const goalsStr = localStorage.getItem(STORAGE_KEYS.GOALS);
  const allGoals: Goal[] = goalsStr ? JSON.parse(goalsStr) : [];

  let filtered = allGoals.filter(g => (g.user_id || g.userId) === userId);

  if (level) {
    filtered = filtered.filter(g => (g.goal_type as any) === level);
  }

  return filtered;
}

export function saveGoal(goal: Goal) {
  if (!isBrowser) return;
  const goalsStr = localStorage.getItem(STORAGE_KEYS.GOALS);
  const allGoals: Goal[] = goalsStr ? JSON.parse(goalsStr) : [];

  const index = allGoals.findIndex(g => g.id === goal.id);
  if (index >= 0) {
    allGoals[index] = goal;
  } else {
    allGoals.push(goal);
  }

  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(allGoals));
}

// === 스탯 관리 ===
export function getStats(userId: string, date: string): Stats | null {
  if (!isBrowser) return null;
  const statsStr = localStorage.getItem(STORAGE_KEYS.STATS);
  const allStats: Stats[] = statsStr ? JSON.parse(statsStr) : [];

  return allStats.find(s => (s.user_id || s.userId) === userId && s.date === date) || null;
}

export function saveStats(stats: Stats) {
  if (!isBrowser) return;
  const statsStr = localStorage.getItem(STORAGE_KEYS.STATS);
  const allStats: Stats[] = statsStr ? JSON.parse(statsStr) : [];

  const userId = stats.user_id || stats.userId;
  const index = allStats.findIndex(s => (s.user_id || s.userId) === userId && s.date === stats.date);
  if (index >= 0) {
    allStats[index] = stats;
  } else {
    allStats.push(stats);
  }

  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(allStats));
}

// === 금전 관리 ===
export function getFinanceEntries(userId: string, startDate?: string, endDate?: string): FinanceEntry[] {
  if (!isBrowser) return [];
  const financeStr = localStorage.getItem(STORAGE_KEYS.FINANCE);
  const allEntries: FinanceEntry[] = financeStr ? JSON.parse(financeStr) : [];

  let filtered = allEntries.filter(e => (e.user_id || e.userId) === userId);

  if (startDate) {
    const entryDate = (e: FinanceEntry) => e.entry_date || e.entryDate || '';
    filtered = filtered.filter(e => entryDate(e) >= startDate);
  }
  if (endDate) {
    const entryDate = (e: FinanceEntry) => e.entry_date || e.entryDate || '';
    filtered = filtered.filter(e => entryDate(e) <= endDate);
  }

  const getDate = (e: FinanceEntry) => e.entry_date || e.entryDate || '';
  return filtered.sort((a, b) => getDate(b).localeCompare(getDate(a)));
}

export function saveFinanceEntry(entry: FinanceEntry) {
  if (!isBrowser) return;
  const financeStr = localStorage.getItem(STORAGE_KEYS.FINANCE);
  const allEntries: FinanceEntry[] = financeStr ? JSON.parse(financeStr) : [];

  const index = allEntries.findIndex(e => e.id === entry.id);
  if (index >= 0) {
    allEntries[index] = entry;
  } else {
    allEntries.push(entry);
  }

  localStorage.setItem(STORAGE_KEYS.FINANCE, JSON.stringify(allEntries));
}

// === DayPlan 관리 ===
export function getDayPlan(userId: string, date: string): DayPlan | null {
  if (!isBrowser) return null;
  const plansStr = localStorage.getItem(STORAGE_KEYS.DAY_PLANS);
  const allPlans: DayPlan[] = plansStr ? JSON.parse(plansStr) : [];

  return allPlans.find(p => (p.user_id || p.userId) === userId && p.date === date) || null;
}

export function saveDayPlan(plan: DayPlan) {
  if (!isBrowser) return;
  const plansStr = localStorage.getItem(STORAGE_KEYS.DAY_PLANS);
  const allPlans: DayPlan[] = plansStr ? JSON.parse(plansStr) : [];

  const userId = plan.user_id || plan.userId;
  const index = allPlans.findIndex(p => (p.user_id || p.userId) === userId && p.date === plan.date);
  if (index >= 0) {
    allPlans[index] = plan;
  } else {
    allPlans.push(plan);
  }

  localStorage.setItem(STORAGE_KEYS.DAY_PLANS, JSON.stringify(allPlans));
}

// === 성찰 관리 ===
export function getReflection(userId: string, date: string): Reflection | null {
  if (!isBrowser) return null;
  const reflectionsStr = localStorage.getItem(STORAGE_KEYS.REFLECTIONS);
  const allReflections: Reflection[] = reflectionsStr ? JSON.parse(reflectionsStr) : [];

  return allReflections.find(r => (r.user_id || r.userId) === userId && r.date === date) || null;
}

export function saveReflection(reflection: Reflection) {
  if (!isBrowser) return;
  const reflectionsStr = localStorage.getItem(STORAGE_KEYS.REFLECTIONS);
  const allReflections: Reflection[] = reflectionsStr ? JSON.parse(reflectionsStr) : [];

  const userId = reflection.user_id || reflection.userId;
  const index = allReflections.findIndex(r => (r.user_id || r.userId) === userId && r.date === reflection.date);
  if (index >= 0) {
    allReflections[index] = reflection;
  } else {
    allReflections.push(reflection);
  }

  localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(allReflections));
}

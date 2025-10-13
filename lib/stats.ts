import type { Task, Stats } from '@/types';

/**
 * 태스크 완료 시 스탯 증가 계산
 */
export function calculateStatGain(task: Task): Partial<Stats> {
  const statGain: Partial<Stats> = {
    str: 0,
    int: 0,
    wis: 0,
    cha: 0,
    grt: 0,
  };

  // 태그 기반 스탯 증가
  const tags = task.tags || [];
  const duration = task.duration_min || task.durationMin || 0;

  // STR (체력): 운동, 수면
  if (tags.some(t => ['exercise', 'workout', 'fitness', 'sleep', 'health'].includes(t))) {
    statGain.str = (statGain.str || 0) + Math.floor(duration / 10);
  }

  // INT (지성): 학습, 코딩, 독서
  if (tags.some(t => ['learning', 'study', 'coding', 'development', 'reading', 'research'].includes(t))) {
    statGain.int = (statGain.int || 0) + Math.floor(duration / 10);
  }

  // WIS (지혜): 성찰, 명상, 회고
  if (tags.some(t => ['reflection', 'meditation', 'review', 'planning', 'wisdom'].includes(t))) {
    statGain.wis = (statGain.wis || 0) + Math.floor(duration / 10);
  }

  // CHA (매력): 네트워킹, 소통, 발표
  if (tags.some(t => ['networking', 'meeting', 'presentation', 'communication', 'social'].includes(t))) {
    statGain.cha = (statGain.cha || 0) + Math.floor(duration / 10);
  }

  // GRT (꾸준함): 모든 태스크 완료 시 기본 증가
  statGain.grt = (statGain.grt || 0) + 2;

  // Deep Work (90분 이상): INT, GRT 추가 증가
  if (duration >= 90) {
    statGain.int = (statGain.int || 0) + 5;
    statGain.grt = (statGain.grt || 0) + 3;
  }

  return statGain;
}

/**
 * 경험치 계산
 */
export function calculateExpGain(task: Task): number {
  const duration = task.duration_min || task.durationMin || 0;
  let exp = duration; // 기본: 1분당 1 EXP

  // 우선순위별 보너스
  if (task.priority === 1) exp *= 1.5;
  if (task.priority === 2) exp *= 1.2;

  // Deep Work 보너스
  if (duration >= 90) exp += 100;

  return Math.floor(exp);
}

/**
 * 레벨 계산 (레벨당 필요 경험치는 레벨 * 300)
 */
export function calculateLevel(totalExp: number): { level: number; currentExp: number; nextLevelExp: number } {
  let level = 1;
  let expForCurrentLevel = 0;

  while (totalExp >= expForCurrentLevel + level * 300) {
    expForCurrentLevel += level * 300;
    level++;
  }

  const currentExp = totalExp - expForCurrentLevel;
  const nextLevelExp = level * 300;

  return { level, currentExp, nextLevelExp };
}

/**
 * 스탯 적용
 */
export function applyStatGain(currentStats: Stats, gain: Partial<Stats>): Stats {
  const newStats = { ...currentStats };

  newStats.str = (newStats.str || 0) + (gain.str || 0);
  newStats.int = (newStats.int || 0) + (gain.int || 0);
  newStats.wis = (newStats.wis || 0) + (gain.wis || 0);
  newStats.cha = (newStats.cha || 0) + (gain.cha || 0);
  newStats.grt = (newStats.grt || 0) + (gain.grt || 0);

  return newStats;
}

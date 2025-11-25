import { supabase } from './supabase';

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  condition: (userId: string) => Promise<boolean>;
  unlocked: boolean;
  unlockedAt?: string;
}

// 업적 정의
export const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'reflection_7_days',
    icon: '🔥',
    title: '7일 연속 성찰',
    description: '7일 연속으로 하루 마감 성찰 작성',
    condition: async (userId: string) => {
      const { data: streak } = await supabase
        .from('streaks')
        .select('count')
        .eq('user_id', userId)
        .eq('metric', 'reflection')
        .single();

      return (streak?.count || 0) >= 7;
    },
  },
  {
    id: 'deep_work_10h',
    icon: '🧠',
    title: 'Deep Work 마스터',
    description: '주간 Deep Work 10시간 달성',
    condition: async (userId: string) => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      const { data: tasks } = await supabase
        .from('tasks')
        .select('duration_min, actual_duration_min')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .gte('completed_at', weekAgo)
        .contains('tags', ['deep-work']);

      const totalMinutes =
        tasks?.reduce(
          (acc, t) => acc + (t.actual_duration_min || t.duration_min || 0),
          0
        ) || 0;

      return totalMinutes >= 600; // 10시간 = 600분
    },
  },
  {
    id: 'no_emotional_spending',
    icon: '💰',
    title: '감정지출 제로',
    description: '월간 감정지출 0건 달성',
    condition: async (userId: string) => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      const monthAgoStr = monthAgo.toISOString().split('T')[0];

      const { data: entries } = await supabase
        .from('finance_entries')
        .select('id')
        .eq('user_id', userId)
        .eq('is_emotional', true)
        .gte('entry_date', monthAgoStr);

      return (entries?.length || 0) === 0;
    },
  },
  {
    id: 'level_10',
    icon: '⚡',
    title: '레벨 10 돌파',
    description: '레벨 10 달성',
    condition: async (userId: string) => {
      const { data: stat } = await supabase
        .from('stats')
        .select('level')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(1)
        .single();

      return (stat?.level || 1) >= 10;
    },
  },
  {
    id: 'tasks_30',
    icon: '✅',
    title: '태스크 마스터',
    description: '월간 30개 태스크 완료',
    condition: async (userId: string) => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      const monthAgoStr = monthAgo.toISOString().split('T')[0];

      const { data: tasks } = await supabase
        .from('tasks')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .gte('completed_at', monthAgoStr);

      return (tasks?.length || 0) >= 30;
    },
  },
  {
    id: 'all_stats_50',
    icon: '🏆',
    title: '올라운더',
    description: '모든 스탯 50 이상 달성',
    condition: async (userId: string) => {
      const { data: stat } = await supabase
        .from('stats')
        .select('str, int, wis, cha, grt')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(1)
        .single();

      if (!stat) return false;

      return (
        stat.str >= 50 &&
        stat.int >= 50 &&
        stat.wis >= 50 &&
        stat.cha >= 50 &&
        stat.grt >= 50
      );
    },
  },
];

/**
 * 사용자의 업적 달성 여부 확인
 */
export async function checkAchievements(
  userId: string
): Promise<Achievement[]> {
  const achievements: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    try {
      const unlocked = await achievement.condition(userId);
      achievements.push({
        ...achievement,
        unlocked,
      });
    } catch (error) {
      console.error(`Failed to check achievement ${achievement.id}:`, error);
      achievements.push({
        ...achievement,
        unlocked: false,
      });
    }
  }

  return achievements;
}

/**
 * 연속 기록 업데이트
 */
export async function updateStreak(
  userId: string,
  metric: string,
  date: string
): Promise<void> {
  try {
    // 기존 연속 기록 조회
    const { data: existingStreak } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .eq('metric', metric)
      .single();

    const today = new Date(date);
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (!existingStreak) {
      // 첫 기록 생성
      await supabase.from('streaks').insert({
        user_id: userId,
        metric,
        count: 1,
        last_date: date,
        best_streak: 1,
      });
    } else {
      // 어제와 연속인지 확인
      const lastDate = existingStreak.last_date || existingStreak.lastDate;
      const isConsecutive = lastDate === yesterdayStr;

      const newCount = isConsecutive ? existingStreak.count + 1 : 1;
      const newBestStreak = Math.max(
        newCount,
        existingStreak.best_streak || existingStreak.bestStreak || 0
      );

      await supabase
        .from('streaks')
        .update({
          count: newCount,
          last_date: date,
          best_streak: newBestStreak,
        })
        .eq('id', existingStreak.id);
    }
  } catch (error) {
    console.error('Failed to update streak:', error);
  }
}

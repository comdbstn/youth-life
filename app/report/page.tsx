'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUserId } from '@/lib/simple-auth';

export default function ReportPage() {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [weeklyStats, setWeeklyStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    completionRate: 0,
    expGained: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWeeklyReport();
  }, [period]);

  const loadWeeklyReport = async () => {
    try {
      setIsLoading(true);
      const userId = getCurrentUserId();
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const weekAgoStr = weekAgo.toISOString().split('T')[0];

      // 주간 태스크 통계
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .gte('planned_at', weekAgoStr);

      if (tasksError) throw tasksError;

      const completed = tasks?.filter((t) => t.status === 'completed').length || 0;
      const total = tasks?.length || 0;

      // 주간 스탯 조회 (최신 스탯 기준)
      const { data: latestStat, error: statsError } = await supabase
        .from('stats')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(1)
        .single();

      if (statsError && statsError.code !== 'PGRST116') {
        console.error('Stats error:', statsError);
      }

      // 일주일 전 스탯
      const { data: oldStat } = await supabase
        .from('stats')
        .select('*')
        .eq('user_id', userId)
        .eq('date', weekAgoStr)
        .single();

      const currentExp = latestStat ? (latestStat.total_exp || 0) : 0;
      const oldExp = oldStat ? (oldStat.total_exp || 0) : 0;
      const expGained = currentExp - oldExp;

      setWeeklyStats({
        totalTasks: total,
        completedTasks: completed,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        expGained: expGained > 0 ? expGained : 0,
      });
    } catch (err: any) {
      console.error('Failed to load report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="card-game mb-6">
        <h1 className="text-3xl font-bold text-cyber-blue mb-6">📈 리포트</h1>

        {/* 탭 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-6 py-2 rounded-lg font-bold ${
              period === 'weekly'
                ? 'bg-cyber-blue text-dark-navy'
                : 'bg-dark-bg border border-dark-border text-gray-400 hover:text-white'
            }`}
          >
            주간
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-6 py-2 rounded-lg font-bold ${
              period === 'monthly'
                ? 'bg-cyber-blue text-dark-navy'
                : 'bg-dark-bg border border-dark-border text-gray-400 hover:text-white'
            }`}
          >
            월간
          </button>
        </div>

        {/* 기간 */}
        <div className="flex items-center justify-between mb-6">
          <button className="text-gray-400 hover:text-white">◀</button>
          <h2 className="text-xl font-bold text-white">
            {new Date().toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
            })}{' '}
            {period === 'weekly' ? '이번 주' : '이번 달'}
          </h2>
          <button className="text-gray-400 hover:text-white">▶</button>
        </div>
      </div>

      {/* 주간 요약 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-blue"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="card-game">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-cyber-blue/20 rounded-lg flex items-center justify-center text-2xl">
                ✅
              </div>
              <div>
                <p className="text-xs text-gray-500">완료율</p>
                <p className="text-3xl font-bold text-cyber-blue">
                  {weeklyStats.completionRate}%
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              핵심 태스크{' '}
              <span className="text-white font-bold">
                {weeklyStats.completedTasks}/{weeklyStats.totalTasks}
              </span>{' '}
              완료
            </p>
          </div>

          <div className="card-game">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-neon-green/20 rounded-lg flex items-center justify-center text-2xl">
                ⏱️
              </div>
              <div>
                <p className="text-xs text-gray-500">태스크</p>
                <p className="text-3xl font-bold text-neon-green">
                  {weeklyStats.completedTasks}개
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400">이번 주 완료한 태스크</p>
          </div>

          <div className="card-game">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-neon-pink/20 rounded-lg flex items-center justify-center text-2xl">
                📊
              </div>
              <div>
                <p className="text-xs text-gray-500">경험치</p>
                <p className="text-3xl font-bold text-neon-pink">
                  +{weeklyStats.expGained}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400">획득한 경험치</p>
          </div>
        </div>
      )}

      {/* GPT 주간 요약 (OpenAI API 연동 시 활성화) */}
      <div className="card-game border-2 border-dark-border">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🤖</span>
          <h2 className="text-2xl font-bold text-gray-400">GPT 주간 요약</h2>
        </div>

        <div className="bg-dark-bg rounded-xl p-6 text-center">
          <p className="text-gray-500 mb-4">
            OpenAI API 키를 설정하면 GPT 기반 주간 요약을 확인할 수 있습니다.
          </p>
          <p className="text-sm text-gray-600">
            Vercel 환경 변수에 <code className="text-cyber-blue">OPENAI_API_KEY</code>를 추가하세요.
          </p>
        </div>
      </div>
    </main>
  );
}

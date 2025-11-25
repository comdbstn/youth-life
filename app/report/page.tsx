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

      {/* 테마별 수행률 */}
      <div className="card-game mb-6">
        <h2 className="text-2xl font-bold text-white mb-6">🗓️ 테마별 수행률</h2>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <span className="text-white font-bold">실행의 날 (월)</span>
              </div>
              <span className="text-neon-green font-bold">100%</span>
            </div>
            <div className="h-3 bg-dark-border rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-neon-green" style={{ width: '100%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧱</span>
                <span className="text-white font-bold">집중의 날 (화)</span>
              </div>
              <span className="text-neon-green font-bold">85%</span>
            </div>
            <div className="h-3 bg-dark-border rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-neon-green" style={{ width: '85%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💧</span>
                <span className="text-white font-bold">정리의 날 (수)</span>
              </div>
              <span className="text-cyber-blue font-bold">67%</span>
            </div>
            <div className="h-3 bg-dark-border rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: '67%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌳</span>
                <span className="text-white font-bold">확장의 날 (목)</span>
              </div>
              <span className="text-yellow-500 font-bold">50%</span>
            </div>
            <div className="h-3 bg-dark-border rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-yellow-500" style={{ width: '50%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚙</span>
                <span className="text-white font-bold">마감의 날 (금)</span>
              </div>
              <span className="text-neon-green font-bold">90%</span>
            </div>
            <div className="h-3 bg-dark-border rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-neon-green" style={{ width: '90%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* GPT 주간 요약 */}
      <div className="card-game border-2 border-cyber-blue">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🤖</span>
          <h2 className="text-2xl font-bold text-cyber-blue">GPT 주간 요약</h2>
        </div>

        <div className="bg-dark-bg rounded-xl p-6 space-y-4">
          <div>
            <h3 className="text-neon-green font-bold mb-2">✨ 이번 주 하이라이트</h3>
            <p className="text-gray-300">
              수익 루프 시스템 첫 산출물 완성으로 월요일 목표를 100% 달성했습니다.
              특히 화요일 Deep Work 3시간은 이번 주 최고 집중도를 보여줬습니다.
            </p>
          </div>

          <div>
            <h3 className="text-neon-pink font-bold mb-2">🎯 개선 포인트</h3>
            <p className="text-gray-300">
              목요일 네트워킹 미팅이 취소되면서 확장의 날 목표 달성률이 50%에 그쳤습니다.
              다음 주에는 대체 활동(아이디어 브레인스토밍 등)을 미리 준비하세요.
            </p>
          </div>

          <div>
            <h3 className="text-cyber-blue font-bold mb-2">🚀 다음 주 추천</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>수익 루프 2차 산출물 제작 (월요일 Deep Work 2시간)</li>
              <li>일본어 학습 시간 45분 → 60분으로 증량 (화/목)</li>
              <li>금요일 주간 리뷰에 30분 추가 배정</li>
            </ul>
          </div>

          <div className="pt-4 border-t border-dark-border">
            <p className="text-sm text-gray-500 italic">
              "이번 주 성과는 훌륭했습니다. 꾸준함(GRT) 스탯이 특히 크게 올랐네요.
              다음 주에도 이 리듬을 유지하면 레벨 7 달성이 보입니다. 화이팅!"
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

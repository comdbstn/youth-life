'use client';

import { useState, useEffect } from 'react';
import StatsOverview from '@/components/StatsOverview';
import { getCurrentUserId } from '@/lib/simple-auth';
import { checkAchievements, type Achievement } from '@/lib/achievements';
import { supabase } from '@/lib/supabase';

export default function StatsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [streaks, setStreaks] = useState<any[]>([]);

  useEffect(() => {
    loadAchievements();
    loadStreaks();
  }, []);

  const loadAchievements = async () => {
    try {
      setIsLoading(true);
      const userId = getCurrentUserId();
      const result = await checkAchievements(userId);
      setAchievements(result);
    } catch (err) {
      console.error('Failed to load achievements:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStreaks = async () => {
    try {
      const userId = getCurrentUserId();
      const { data, error } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      setStreaks(data || []);
    } catch (err) {
      console.error('Failed to load streaks:', err);
    }
  };

  const getStreakByMetric = (metric: string) => {
    return streaks.find((s) => s.metric === metric);
  };

  const reflectionStreak = getStreakByMetric('reflection');
  const deepWorkStreak = getStreakByMetric('deep_work');
  const noEmotionalSpendingStreak = getStreakByMetric('no_emotional_spending');

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 왼쪽: 현재 스탯 */}
        <div className="space-y-6">
          <StatsOverview />

          {/* 업적 */}
          <div className="card-game">
            <h2 className="text-2xl font-bold text-neon-gold mb-6">🏆 업적</h2>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-blue"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`bg-dark-bg rounded-xl p-4 border-2 ${
                      achievement.unlocked
                        ? 'border-neon-green'
                        : 'border-dark-border opacity-50'
                    }`}
                  >
                    <div className="text-center mb-2">
                      <span className="text-4xl">{achievement.icon}</span>
                    </div>
                    <h3
                      className={`text-sm font-bold text-center mb-1 ${
                        achievement.unlocked ? 'text-white' : 'text-gray-500'
                      }`}
                    >
                      {achievement.title}
                    </h3>
                    <p
                      className={`text-xs text-center ${
                        achievement.unlocked ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {achievement.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽: 스탯 히스토리 */}
        <div className="space-y-6">
          {/* 주간 성장 */}
          <div className="card-game">
            <h2 className="text-2xl font-bold text-cyber-blue mb-6">📈 주간 성장</h2>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span>💪</span>
                    <span className="text-white font-bold">STR</span>
                  </div>
                  <span className="text-neon-green font-bold">+8</span>
                </div>
                <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-gray-600 to-neon-green animate-glow" style={{ width: '24%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span>🧠</span>
                    <span className="text-white font-bold">INT</span>
                  </div>
                  <span className="text-neon-green font-bold">+15</span>
                </div>
                <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-gray-600 to-cyber-blue animate-glow" style={{ width: '56%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span>🔮</span>
                    <span className="text-white font-bold">WIS</span>
                  </div>
                  <span className="text-neon-green font-bold">+12</span>
                </div>
                <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-gray-600 to-purple-500 animate-glow" style={{ width: '30%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span>✨</span>
                    <span className="text-white font-bold">CHA</span>
                  </div>
                  <span className="text-neon-green font-bold">+5</span>
                </div>
                <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-gray-600 to-yellow-500 animate-glow" style={{ width: '16%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span>🔥</span>
                    <span className="text-white font-bold">GRT</span>
                  </div>
                  <span className="text-neon-green font-bold">+18</span>
                </div>
                <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-gray-600 to-neon-green animate-glow" style={{ width: '44%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* 연속 기록 */}
          <div className="card-game">
            <h2 className="text-2xl font-bold text-neon-pink mb-6">🔥 연속 기록</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between bg-dark-bg rounded-lg p-4">
                <div>
                  <p className="text-white font-bold mb-1">성찰 작성</p>
                  <p className="text-xs text-gray-500">현재 기록</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-neon-green">
                    {reflectionStreak?.count || 0}일
                  </p>
                  <p className="text-xs text-gray-500">
                    최고: {reflectionStreak?.best_streak || reflectionStreak?.bestStreak || 0}일
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-dark-bg rounded-lg p-4">
                <div>
                  <p className="text-white font-bold mb-1">Deep Work</p>
                  <p className="text-xs text-gray-500">현재 기록</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-cyber-blue">
                    {deepWorkStreak?.count || 0}일
                  </p>
                  <p className="text-xs text-gray-500">
                    최고: {deepWorkStreak?.best_streak || deepWorkStreak?.bestStreak || 0}일
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-dark-bg rounded-lg p-4">
                <div>
                  <p className="text-white font-bold mb-1">감정지출 0</p>
                  <p className="text-xs text-gray-500">현재 기록</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-neon-gold">
                    {noEmotionalSpendingStreak?.count || 0}일
                  </p>
                  <p className="text-xs text-gray-500">
                    최고: {noEmotionalSpendingStreak?.best_streak || noEmotionalSpendingStreak?.bestStreak || 0}일
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUserId } from '@/lib/simple-auth';
import type { Goal } from '@/types';

type GoalType = 'monthly' | 'weekly' | 'daily';

export default function GoalsPage() {
  const [activeTab, setActiveTab] = useState<GoalType>('monthly');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBreakingDown, setIsBreakingDown] = useState(false);
  const [selectedGoalForBreakdown, setSelectedGoalForBreakdown] = useState<string | null>(null);

  useEffect(() => {
    loadGoals();
  }, [activeTab]);

  const loadGoals = async () => {
    try {
      setIsLoading(true);
      const userId = getCurrentUserId();

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .eq('level', activeTab.toUpperCase())
        .order('created_at', { ascending: false });

      if (error) throw error;

      setGoals(data || []);
    } catch (err: any) {
      console.error('Failed to load goals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGoal = async () => {
    const title = prompt('목표 제목을 입력하세요:');
    if (!title) return;

    const description = prompt('목표 설명 (선택):');
    const userId = getCurrentUserId();

    try {
      // 기간 계산
      const now = new Date();
      let periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      let periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      if (activeTab === 'weekly') {
        const dayOfWeek = now.getDay();
        periodStart = new Date(now);
        periodStart.setDate(now.getDate() - dayOfWeek);
        periodEnd = new Date(periodStart);
        periodEnd.setDate(periodStart.getDate() + 6);
      } else if (activeTab === 'daily') {
        periodStart = now;
        periodEnd = now;
      }

      const newGoal: Partial<Goal> = {
        user_id: userId,
        title,
        description: description || undefined,
        level: activeTab.toUpperCase() as 'MONTHLY' | 'WEEKLY' | 'DAILY',
        status: 'active',
        progress: 0,
        period_start: periodStart.toISOString().split('T')[0],
        period_end: periodEnd.toISOString().split('T')[0],
      };

      const { data, error } = await supabase
        .from('goals')
        .insert(newGoal)
        .select()
        .single();

      if (error) throw error;

      setGoals(prev => [data, ...prev]);
    } catch (err: any) {
      console.error('Failed to add goal:', err);
      alert('목표 추가 실패: ' + err.message);
    }
  };

  const handleUpdateProgress = async (goalId: string, newProgress: number) => {
    try {
      const { error } = await supabase
        .from('goals')
        .update({ progress: newProgress })
        .eq('id', goalId);

      if (error) throw error;

      setGoals(prev =>
        prev.map(g =>
          g.id === goalId ? { ...g, progress: newProgress } : g
        )
      );
    } catch (err: any) {
      console.error('Failed to update progress:', err);
      alert('진행률 업데이트 실패: ' + err.message);
    }
  };

  const handleBreakdownGoal = async (goalId: string) => {
    try {
      setIsBreakingDown(true);
      setSelectedGoalForBreakdown(goalId);
      const userId = getCurrentUserId();

      const response = await fetch('/api/goals/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalId, userId }),
      });

      if (!response.ok) {
        throw new Error('목표 분해 실패');
      }

      const result = await response.json();
      alert(`✨ ${result.count}개의 태스크가 생성되었습니다!\n태스크 페이지에서 확인하세요.`);
    } catch (err: any) {
      console.error('Failed to breakdown goal:', err);
      alert('목표 분해 실패: ' + err.message);
    } finally {
      setIsBreakingDown(false);
      setSelectedGoalForBreakdown(null);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { text: string; color: string }> = {
      pending: { text: '대기중', color: 'bg-gray-700 text-gray-400' },
      in_progress: { text: '진행중', color: 'bg-neon-green/20 text-neon-green' },
      completed: { text: '완료', color: 'bg-cyber-blue/20 text-cyber-blue' },
      archived: { text: '보관', color: 'bg-gray-800 text-gray-500' },
    };
    return labels[status] || labels.pending;
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="card-game">
        <h1 className="text-3xl font-bold text-cyber-blue mb-6">🎯 목표 관리</h1>

        {/* 월/주/일 탭 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-6 py-2 rounded-lg font-bold ${
              activeTab === 'monthly'
                ? 'bg-cyber-blue text-dark-navy'
                : 'bg-dark-bg border border-dark-border text-gray-400 hover:text-white'
            }`}
          >
            월간 목표
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-6 py-2 rounded-lg font-bold ${
              activeTab === 'weekly'
                ? 'bg-cyber-blue text-dark-navy'
                : 'bg-dark-bg border border-dark-border text-gray-400 hover:text-white'
            }`}
          >
            주간 목표
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-6 py-2 rounded-lg font-bold ${
              activeTab === 'daily'
                ? 'bg-cyber-blue text-dark-navy'
                : 'bg-dark-bg border border-dark-border text-gray-400 hover:text-white'
            }`}
          >
            일일 목표
          </button>
        </div>

        {/* 목표 리스트 */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-blue"></div>
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">{activeTab === 'monthly' ? '월간' : activeTab === 'weekly' ? '주간' : '일일'} 목표가 없습니다</p>
            <button
              onClick={handleAddGoal}
              className="px-6 py-3 bg-cyber-blue text-dark-navy rounded-lg hover:bg-cyber-blue/80 transition-colors font-bold"
            >
              첫 목표 추가하기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const statusInfo = getStatusLabel(goal.status);
              return (
                <div
                  key={goal.id}
                  className="bg-dark-bg border-2 border-dark-border rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {goal.title}
                      </h3>
                      {goal.description && (
                        <p className="text-gray-400 text-sm">
                          {goal.description}
                        </p>
                      )}
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                  </div>

                  {/* 진행률 */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span>진행률</span>
                      <span>{goal.progress || 0}%</span>
                    </div>
                    <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-neon-green transition-all duration-300"
                        style={{ width: `${goal.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* 진행률 조정 & AI 분해 */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateProgress(goal.id, Math.max(0, (goal.progress || 0) - 10))}
                      className="px-3 py-1 text-xs bg-dark-navy text-gray-400 rounded hover:text-white transition-colors"
                    >
                      -10%
                    </button>
                    <button
                      onClick={() => handleUpdateProgress(goal.id, Math.min(100, (goal.progress || 0) + 10))}
                      className="px-3 py-1 text-xs bg-dark-navy text-gray-400 rounded hover:text-white transition-colors"
                    >
                      +10%
                    </button>
                    <button
                      onClick={() => handleBreakdownGoal(goal.id)}
                      disabled={isBreakingDown && selectedGoalForBreakdown === goal.id}
                      className="ml-auto px-4 py-1 text-xs bg-gradient-to-r from-cyber-blue to-neon-pink text-white rounded hover:opacity-80 transition-opacity disabled:opacity-50"
                    >
                      {isBreakingDown && selectedGoalForBreakdown === goal.id ? '분해 중...' : '✨ AI 분해'}
                    </button>
                  </div>

                  {(goal.startDate || goal.endDate) && (
                    <div className="text-xs text-gray-500 mt-3">
                      기간: {goal.startDate?.split('T')[0]} - {goal.endDate?.split('T')[0]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 추가 버튼 */}
        {!isLoading && (
          <button
            onClick={handleAddGoal}
            className="w-full mt-6 py-4 border-2 border-dashed border-dark-border text-gray-400 rounded-lg hover:border-cyber-blue hover:text-cyber-blue transition-all"
          >
            + 새 목표 추가
          </button>
        )}
      </div>

      {/* GPT 목표 분해 안내 */}
      <div className="card-game mt-6">
        <h2 className="text-xl font-bold text-neon-pink mb-4">✨ AI 목표 분해</h2>
        <p className="text-gray-400 text-sm mb-4">
          큰 목표를 실행 가능한 작은 태스크로 자동 분해합니다.
        </p>
        <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <p className="text-sm text-gray-400">
            💡 각 목표 카드의 <span className="text-neon-pink font-bold">&quot;✨ AI 분해&quot;</span> 버튼을 클릭하면
            GPT-4가 목표를 구체적인 태스크로 자동 분해합니다.
          </p>
        </div>
      </div>
    </main>
  );
}

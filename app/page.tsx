'use client';

import { useState, useEffect } from 'react';
import ThemeHeader from '@/components/ThemeHeader';
import Top3Tasks from '@/components/Top3Tasks';
import StatsOverview from '@/components/StatsOverview';
import { getCurrentUserId } from '@/lib/simple-auth';
import { getTodayTheme } from '@/lib/theme';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [morningCoach, setMorningCoach] = useState<string | null>(null);
  const [isLoadingCoach, setIsLoadingCoach] = useState(false);
  const [showCoach, setShowCoach] = useState(false);

  useEffect(() => {
    initializeDayPlan();
  }, []);

  const initializeDayPlan = async () => {
    try {
      const userId = getCurrentUserId();
      const today = new Date().toISOString().split('T')[0];

      // 오늘 DayPlan이 있는지 확인
      const { data: existingPlan, error: planError } = await supabase
        .from('day_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      if (planError && planError.code !== 'PGRST116') {
        console.error('Failed to check day plan:', planError);
        return;
      }

      if (existingPlan) {
        // 이미 있으면 아침 코치 메시지 표시
        if (existingPlan.gpt_morning_coach || existingPlan.gptMorningCoach) {
          setMorningCoach(existingPlan.gpt_morning_coach || existingPlan.gptMorningCoach);
        }
      } else {
        // 없으면 DayPlan 초기화
        const theme = getTodayTheme();
        const response = await fetch('/api/day/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, date: today }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Day plan initialized:', data);
        }
      }
    } catch (err: any) {
      console.error('Failed to initialize day plan:', err);
    }
  };

  const handleGetMorningCoach = async () => {
    try {
      setIsLoadingCoach(true);
      const userId = getCurrentUserId();
      const theme = getTodayTheme();

      const response = await fetch('/api/coach/morning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, theme: theme.type }),
      });

      if (!response.ok) {
        throw new Error('Failed to get morning coach');
      }

      const data = await response.json();
      setMorningCoach(data.message);
      setShowCoach(true);
    } catch (err: any) {
      console.error('Failed to get morning coach:', err);
      alert('아침 코치를 불러오는데 실패했습니다: ' + err.message);
    } finally {
      setIsLoadingCoach(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 헤더: 오늘 테마 */}
      <ThemeHeader />

      {/* 아침 코치 카드 */}
      {showCoach && morningCoach && (
        <div className="card-game mt-6 border-2 border-cyber-blue">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <h2 className="text-xl font-bold text-cyber-blue">아침 코치</h2>
            </div>
            <button
              onClick={() => setShowCoach(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
            <p className="text-white whitespace-pre-line">{morningCoach}</p>
          </div>
        </div>
      )}

      {/* 메인 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* 왼쪽: 핵심 3태스크 + 아침 코치 버튼 */}
        <div className="lg:col-span-2 space-y-6">
          <Top3Tasks />

          {/* 아침 코치 버튼 (아직 안 받았을 때만) */}
          {!morningCoach && (
            <button
              onClick={handleGetMorningCoach}
              disabled={isLoadingCoach}
              className="w-full py-4 bg-gradient-to-r from-cyber-blue to-neon-pink text-white font-bold rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoadingCoach ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>코칭 생성 중...</span>
                </>
              ) : (
                <>
                  <span>🤖</span>
                  <span>아침 코치 받기</span>
                </>
              )}
            </button>
          )}

          {/* 타임라인 (추후 구현) */}
          <div className="card-game">
            <h2 className="text-xl font-bold text-cyber-blue mb-4">⏰ 타임라인</h2>
            <div className="h-64 flex items-center justify-center text-gray-500">
              타임블록 스케줄러 (구현 예정)
            </div>
          </div>
        </div>

        {/* 오른쪽: 스탯 + 빠른 액션 */}
        <div className="space-y-6">
          <StatsOverview />

          {/* 유키노 AI 비서 */}
          <div className="card-game border-2 border-gradient-to-r from-cyber-blue to-neon-pink">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyber-blue to-neon-pink flex items-center justify-center text-2xl">
                ❄️
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">유키노</h3>
                <p className="text-xs text-gray-400">AI 전략 비서</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              모든 데이터를 분석하고, 전략을 제안하며, 당신의 성장을 돕는 AI 비서입니다.
            </p>
            <a
              href="/yukino"
              className="block w-full py-3 bg-gradient-to-r from-cyber-blue to-neon-pink text-white rounded-lg hover:opacity-80 transition-opacity font-bold text-center"
            >
              💬 유키노와 대화하기
            </a>
          </div>

          {/* 빠른 액션 */}
          <div className="card-game">
            <h3 className="text-lg font-bold text-neon-green mb-4">⚡ 빠른 액션</h3>
            <div className="space-y-3">
              <a
                href="/finance"
                className="block w-full py-3 bg-dark-bg border-2 border-neon-green text-neon-green rounded-lg hover:bg-neon-green hover:text-dark-navy transition-all font-bold text-center"
              >
                💰 금전 입력
              </a>
              <a
                href="/calendar"
                className="block w-full py-3 bg-dark-bg border-2 border-cyber-blue text-cyber-blue rounded-lg hover:bg-cyber-blue hover:text-dark-navy transition-all font-bold text-center"
              >
                📅 일정 추가
              </a>
              <a
                href="/reflection"
                className="block w-full py-3 bg-dark-bg border-2 border-neon-pink text-neon-pink rounded-lg hover:bg-neon-pink hover:text-dark-navy transition-all font-bold text-center"
              >
                🌙 하루 마감
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

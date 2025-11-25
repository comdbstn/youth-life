'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUserId } from '@/lib/simple-auth';
import { getTodayTheme } from '@/lib/theme';
import { updateStreak } from '@/lib/achievements';
import type { Reflection } from '@/types';

export default function ReflectionPage() {
  const [mood, setMood] = useState('');
  const [energy, setEnergy] = useState(3);
  const [answers, setAnswers] = useState({
    q1: '', // 가장 잘한 것
    q2: '', // 막힌 순간
    q3: '', // 개선 행동
    q4: '', // 감정지출
    q5: '', // 한 줄 요약
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [todayReflection, setTodayReflection] = useState<Reflection | null>(null);
  const [gptFeedback, setGptFeedback] = useState<{
    praise: string;
    improvement: string;
    tomorrowPriorities: string[];
  } | null>(null);

  useEffect(() => {
    loadTodayReflection();
  }, []);

  const loadTodayReflection = async () => {
    try {
      const userId = getCurrentUserId();
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('reflections')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setTodayReflection(data);
        setMood(data.mood);
        setEnergy(data.energy);
        setAnswers(data.answers);

        // GPT 피드백이 있으면 표시
        if (data.gpt_praise || data.gptPraise) {
          setGptFeedback({
            praise: data.gpt_praise || data.gptPraise || '',
            improvement: data.gpt_improvement || data.gptImprovement || '',
            tomorrowPriorities: data.tomorrow_priorities || data.tomorrowPriorities || [],
          });
        }
      }
    } catch (err: any) {
      console.error('Failed to load reflection:', err);
    }
  };

  const handleSaveReflection = async () => {
    if (!mood || !answers.q1 || !answers.q5) {
      alert('기분, 가장 잘한 것, 한 줄 요약은 필수입니다');
      return;
    }

    try {
      setIsLoading(true);
      const userId = getCurrentUserId();
      const today = new Date().toISOString().split('T')[0];

      const reflectionData: Partial<Reflection> = {
        user_id: userId,
        date: today,
        mood,
        energy,
        answers,
      };

      let reflectionId = todayReflection?.id;

      if (todayReflection) {
        // 업데이트
        const { error } = await supabase
          .from('reflections')
          .update(reflectionData)
          .eq('id', todayReflection.id);

        if (error) throw error;
      } else {
        // 새로 생성
        const { data, error } = await supabase
          .from('reflections')
          .insert(reflectionData)
          .select()
          .single();

        if (error) throw error;
        reflectionId = data.id;
        setTodayReflection(data);
      }

      // GPT 밤 코치 호출
      setIsFeedbackLoading(true);
      const theme = getTodayTheme();

      const response = await fetch('/api/coach/evening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          theme: theme.type,
          reflectionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get evening coach feedback');
      }

      const feedbackData = await response.json();
      setGptFeedback({
        praise: feedbackData.praise || '',
        improvement: feedbackData.improvement || '',
        tomorrowPriorities: feedbackData.tomorrowPriorities || [],
      });

      // 연속 기록 업데이트
      await updateStreak(userId, 'reflection', today);

      alert('성찰이 저장되었습니다! 🌙');
    } catch (err: any) {
      console.error('Failed to save reflection:', err);
      alert('저장 실패: ' + err.message);
    } finally {
      setIsLoading(false);
      setIsFeedbackLoading(false);
    }
  };

  const moods = [
    { emoji: '😊', label: '좋음', value: 'good' },
    { emoji: '😐', label: '보통', value: 'normal' },
    { emoji: '😔', label: '힘듦', value: 'tired' },
    { emoji: '😤', label: '스트레스', value: 'stressed' },
    { emoji: '🥳', label: '최고', value: 'great' },
  ];

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="card-game">
        <h1 className="text-3xl font-bold text-neon-pink mb-2">🌙 하루 마감 성찰</h1>
        <p className="text-gray-400 text-sm mb-6">
          오늘을 돌아보고 내일을 준비하세요
        </p>

        {/* 기분 */}
        <div className="mb-6">
          <label className="text-white font-bold mb-3 block">
            오늘 기분은 어땠나요?
          </label>
          <div className="flex gap-3">
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                className={`flex-1 py-4 rounded-xl border-2 transition-all ${
                  mood === m.value
                    ? 'border-neon-pink bg-neon-pink/20 text-white'
                    : 'border-dark-border bg-dark-bg text-gray-400 hover:border-cyber-blue'
                }`}
              >
                <div className="text-3xl mb-1">{m.emoji}</div>
                <div className="text-xs font-bold">{m.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 에너지 레벨 */}
        <div className="mb-6">
          <label className="text-white font-bold mb-3 block">
            에너지 레벨: {energy}/5
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={energy}
            onChange={(e) => setEnergy(parseInt(e.target.value))}
            className="w-full h-2 bg-dark-border rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #00FF9F 0%, #00FF9F ${
                (energy / 5) * 100
              }%, #2A2F4A ${(energy / 5) * 100}%, #2A2F4A 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>낮음</span>
            <span>높음</span>
          </div>
        </div>

        {/* 5문항 */}
        <div className="space-y-6 mb-8">
          {/* Q1 */}
          <div>
            <label className="text-white font-bold mb-2 block">
              1. 오늘 가장 잘한 것 1가지 *
            </label>
            <textarea
              value={answers.q1}
              onChange={(e) => setAnswers({ ...answers, q1: e.target.value })}
              placeholder="무엇을 성취했나요?"
              rows={2}
              className="w-full px-4 py-3 bg-dark-card border-2 border-dark-border rounded-lg text-white focus:border-neon-green outline-none resize-none"
            />
          </div>

          {/* Q2 */}
          <div>
            <label className="text-white font-bold mb-2 block">
              2. 막혔던 순간 & 원인 1개
            </label>
            <textarea
              value={answers.q2}
              onChange={(e) => setAnswers({ ...answers, q2: e.target.value })}
              placeholder="어떤 어려움이 있었나요?"
              rows={2}
              className="w-full px-4 py-3 bg-dark-card border-2 border-dark-border rounded-lg text-white focus:border-cyber-blue outline-none resize-none"
            />
          </div>

          {/* Q3 */}
          <div>
            <label className="text-white font-bold mb-2 block">
              3. 내일 같은 실수를 줄이는 행동 1개
            </label>
            <textarea
              value={answers.q3}
              onChange={(e) => setAnswers({ ...answers, q3: e.target.value })}
              placeholder="내일은 어떻게 개선할까요?"
              rows={2}
              className="w-full px-4 py-3 bg-dark-card border-2 border-dark-border rounded-lg text-white focus:border-neon-pink outline-none resize-none"
            />
          </div>

          {/* Q4 */}
          <div>
            <label className="text-white font-bold mb-2 block">
              4. 감정지출 여부 (금액/상황)
            </label>
            <textarea
              value={answers.q4}
              onChange={(e) => setAnswers({ ...answers, q4: e.target.value })}
              placeholder="충동 구매나 스트레스 소비가 있었나요?"
              rows={2}
              className="w-full px-4 py-3 bg-dark-card border-2 border-dark-border rounded-lg text-white focus:border-yellow-500 outline-none resize-none"
            />
          </div>

          {/* Q5 */}
          <div>
            <label className="text-white font-bold mb-2 block">
              5. 오늘을 한 문장으로 요약 *
            </label>
            <textarea
              value={answers.q5}
              onChange={(e) => setAnswers({ ...answers, q5: e.target.value })}
              placeholder="오늘은 어떤 하루였나요?"
              rows={2}
              className="w-full px-4 py-3 bg-dark-card border-2 border-dark-border rounded-lg text-white focus:border-purple-500 outline-none resize-none"
            />
          </div>
        </div>

        {/* 저장 버튼 */}
        <button
          onClick={handleSaveReflection}
          disabled={isLoading || isFeedbackLoading}
          className="w-full py-4 bg-gradient-to-r from-neon-pink to-purple-500 text-white font-bold rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? '저장 중...'
            : isFeedbackLoading
            ? 'GPT 피드백 생성 중...'
            : '저장하고 피드백 받기 🤖'}
        </button>
      </div>

      {/* GPT 피드백 */}
      {gptFeedback && (
        <div className="card-game mt-6 border-2 border-neon-pink">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🤖</span>
            <h2 className="text-2xl font-bold text-neon-pink">GPT 밤 코치</h2>
          </div>

          <div className="space-y-4">
            {/* 칭찬 */}
            {gptFeedback.praise && (
              <div className="bg-neon-green/10 border-2 border-neon-green rounded-lg p-4">
                <h3 className="text-neon-green font-bold mb-2 flex items-center gap-2">
                  <span>✨</span> 오늘의 하이라이트
                </h3>
                <p className="text-white">{gptFeedback.praise}</p>
              </div>
            )}

            {/* 개선점 */}
            {gptFeedback.improvement && (
              <div className="bg-cyber-blue/10 border-2 border-cyber-blue rounded-lg p-4">
                <h3 className="text-cyber-blue font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> 개선 포인트
                </h3>
                <p className="text-white">{gptFeedback.improvement}</p>
              </div>
            )}

            {/* 내일 우선순위 */}
            {gptFeedback.tomorrowPriorities &&
              gptFeedback.tomorrowPriorities.length > 0 && (
                <div className="bg-neon-pink/10 border-2 border-neon-pink rounded-lg p-4">
                  <h3 className="text-neon-pink font-bold mb-3 flex items-center gap-2">
                    <span>🎯</span> 내일의 우선순위
                  </h3>
                  <ul className="space-y-2">
                    {gptFeedback.tomorrowPriorities.map((priority, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-white">
                        <span className="text-neon-pink font-bold mt-0.5">
                          {idx + 1}.
                        </span>
                        <span>{priority}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>

          <div className="mt-4 pt-4 border-t border-dark-border">
            <p className="text-sm text-gray-400 text-center">
              내일도 화이팅! 🚀
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

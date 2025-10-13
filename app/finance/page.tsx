'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUserId } from '@/lib/simple-auth';
import type { FinanceEntry } from '@/types';

export default function FinancePage() {
  const [entryType, setEntryType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [todayEntries, setTodayEntries] = useState<FinanceEntry[]>([]);
  const [weeklyStats, setWeeklyStats] = useState({
    income: 0,
    expense: 0,
    emotionalExpense: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFinanceData();
  }, []);

  const loadFinanceData = async () => {
    try {
      setIsLoading(true);
      const userId = getCurrentUserId();
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      // 오늘 기록
      const { data: todayData, error: todayError } = await supabase
        .from('finance_entries')
        .select('*')
        .eq('user_id', userId)
        .gte('entry_date', today)
        .order('entry_date', { ascending: false });

      if (todayError) throw todayError;

      setTodayEntries(todayData || []);

      // 주간 통계
      const { data: weekData, error: weekError } = await supabase
        .from('finance_entries')
        .select('*')
        .eq('user_id', userId)
        .gte('entry_date', weekAgo);

      if (weekError) throw weekError;

      const stats = (weekData || []).reduce(
        (acc, entry) => {
          if (entry.entry_type === 'income') {
            acc.income += entry.amount;
          } else {
            acc.expense += entry.amount;
            if (entry.is_emotional) {
              acc.emotionalExpense += entry.amount;
            }
          }
          return acc;
        },
        { income: 0, expense: 0, emotionalExpense: 0 }
      );

      setWeeklyStats(stats);
    } catch (err: any) {
      console.error('Failed to load finance data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEntry = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('금액을 입력하세요');
      return;
    }

    if (!category) {
      alert('카테고리를 선택하세요');
      return;
    }

    try {
      const userId = getCurrentUserId();
      const newEntry: Partial<FinanceEntry> = {
        user_id: userId,
        entry_type: entryType,
        amount: parseFloat(amount),
        category,
        description,
        is_emotional: category === 'emotional',
        entry_date: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('finance_entries')
        .insert(newEntry)
        .select()
        .single();

      if (error) throw error;

      setTodayEntries(prev => [data, ...prev]);
      setAmount('');
      setCategory('');
      setDescription('');

      // 주간 통계 업데이트
      if (entryType === 'income') {
        setWeeklyStats(prev => ({ ...prev, income: prev.income + data.amount }));
      } else {
        setWeeklyStats(prev => ({
          ...prev,
          expense: prev.expense + data.amount,
          emotionalExpense: data.is_emotional
            ? prev.emotionalExpense + data.amount
            : prev.emotionalExpense,
        }));
      }
    } catch (err: any) {
      console.error('Failed to add entry:', err);
      alert('기록 추가 실패: ' + err.message);
    }
  };

  const categories = {
    income: ['외주', '월급', '부수입', '기타'],
    expense: ['식비', '교통', '쇼핑', '교육', '주거', '의료', 'emotional'],
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 빠른 입력 */}
        <div className="lg:col-span-2">
          <div className="card-game">
            <h1 className="text-3xl font-bold text-neon-green mb-6">💰 금전 트래킹</h1>

            {/* 입력 폼 */}
            <div className="bg-dark-bg rounded-xl p-6 mb-6">
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => {
                    setEntryType('income');
                    setCategory('');
                  }}
                  className={`flex-1 py-3 font-bold rounded-lg ${
                    entryType === 'income'
                      ? 'bg-neon-green text-dark-navy'
                      : 'bg-dark-border text-gray-400 hover:bg-neon-green hover:text-dark-navy'
                  }`}
                >
                  수입
                </button>
                <button
                  onClick={() => {
                    setEntryType('expense');
                    setCategory('');
                  }}
                  className={`flex-1 py-3 font-bold rounded-lg ${
                    entryType === 'expense'
                      ? 'bg-neon-pink text-white'
                      : 'bg-dark-border text-gray-400 hover:bg-neon-pink hover:text-white'
                  }`}
                >
                  지출
                </button>
              </div>

              {/* 금액 입력 */}
              <div className="mb-4">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="금액 입력"
                  className="w-full px-4 py-3 bg-dark-card border-2 border-dark-border rounded-lg text-white text-2xl text-center focus:border-cyber-blue outline-none"
                />
              </div>

              {/* 설명 입력 */}
              <div className="mb-4">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="설명 (선택)"
                  className="w-full px-4 py-3 bg-dark-card border-2 border-dark-border rounded-lg text-white focus:border-cyber-blue outline-none"
                />
              </div>

              {/* 카테고리 */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {categories[entryType].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold ${
                      category === cat
                        ? cat === 'emotional'
                          ? 'bg-neon-pink text-white border-2 border-neon-pink'
                          : 'bg-cyber-blue text-dark-navy border-2 border-cyber-blue'
                        : cat === 'emotional'
                        ? 'bg-dark-card border border-neon-pink text-neon-pink'
                        : 'bg-dark-card border border-dark-border text-gray-400 hover:border-cyber-blue hover:text-white'
                    }`}
                  >
                    {cat === 'emotional' ? '⚠️ 감정지출' : cat}
                  </button>
                ))}
              </div>

              <button
                onClick={handleAddEntry}
                className="w-full py-3 bg-cyber-blue text-dark-navy font-bold rounded-lg hover:opacity-80"
              >
                기록하기
              </button>
            </div>

            {/* 오늘 기록 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">오늘의 기록</h2>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-blue"></div>
                </div>
              ) : todayEntries.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">오늘의 기록이 없습니다</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayEntries.map((entry) => {
                    const isIncome = entry.entry_type === 'income' || entry.entryType === 'income';
                    const time = new Date(entry.entry_date || entry.entryDate).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between bg-dark-bg rounded-lg p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              isIncome
                                ? 'bg-neon-green/20 text-neon-green'
                                : 'bg-red-500/20 text-red-500'
                            }`}
                          >
                            {isIncome ? '+' : '-'}
                          </div>
                          <div>
                            <p className="text-white font-bold">
                              {entry.description || entry.category}
                            </p>
                            <p className="text-xs text-gray-500">
                              {time} · {entry.category}
                              {entry.is_emotional && ' · ⚠️'}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`font-bold text-lg ${
                            isIncome ? 'text-neon-green' : 'text-red-500'
                          }`}
                        >
                          {isIncome ? '+' : '-'}
                          {entry.amount.toLocaleString('ko-KR')}원
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 통계 */}
        <div className="space-y-6">
          {/* 이번 주 요약 */}
          <div className="card-game">
            <h3 className="text-lg font-bold text-white mb-4">📊 이번 주</h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-blue"></div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">수입</p>
                  <p className="text-2xl font-bold text-neon-green">
                    +{weeklyStats.income.toLocaleString('ko-KR')}원
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">지출</p>
                  <p className="text-2xl font-bold text-red-500">
                    -{weeklyStats.expense.toLocaleString('ko-KR')}원
                  </p>
                </div>
                <div className="pt-3 border-t border-dark-border">
                  <p className="text-xs text-gray-500 mb-1">순이익</p>
                  <p
                    className={`text-3xl font-bold ${
                      weeklyStats.income - weeklyStats.expense >= 0
                        ? 'text-cyber-blue'
                        : 'text-red-500'
                    }`}
                  >
                    {weeklyStats.income - weeklyStats.expense >= 0 ? '+' : ''}
                    {(weeklyStats.income - weeklyStats.expense).toLocaleString('ko-KR')}원
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 감정지출 경보 */}
          {weeklyStats.emotionalExpense > 0 && (
            <div className="card-game border-2 border-neon-pink">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">⚠️</span>
                <h3 className="text-lg font-bold text-neon-pink">감정지출 경보</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                이번 주 감정지출:{' '}
                <span className="text-neon-pink font-bold">
                  {weeklyStats.emotionalExpense.toLocaleString('ko-KR')}원
                </span>
              </p>
              <div className="mt-4 pt-4 border-t border-dark-border">
                <p className="text-xs text-gray-400">
                  🎯 목표: 주간 감정지출 0건 달성 시{' '}
                  <span className="text-neon-green">GRT +5</span>
                </p>
              </div>
            </div>
          )}

          {/* 저축률 */}
          {weeklyStats.income > 0 && (
            <div className="card-game">
              <h3 className="text-lg font-bold text-white mb-4">💎 저축률</h3>
              <div className="text-center mb-4">
                <p className="text-4xl font-bold text-cyber-blue mb-1">
                  {Math.round(
                    ((weeklyStats.income - weeklyStats.expense) / weeklyStats.income) * 100
                  )}
                  %
                </p>
                <p className="text-xs text-gray-500">목표: 20% 이상</p>
              </div>
              <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyber-blue to-neon-green transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      ((weeklyStats.income - weeklyStats.expense) / weeklyStats.income) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

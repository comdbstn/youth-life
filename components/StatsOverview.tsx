'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUserId } from '@/lib/simple-auth';
import { calculateLevel } from '@/lib/stats';

interface StatGaugeProps {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: string;
}

function StatGauge({ label, value, max, color, icon }: StatGaugeProps) {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 36; // 반지름 36
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        {/* 배경 원 */}
        <svg className="transform -rotate-90 w-20 h-20">
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            className="text-dark-border"
          />
          {/* 진행 원 */}
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
            style={{
              filter: `drop-shadow(0 0 6px ${color})`
            }}
          />
        </svg>

        {/* 아이콘 + 숫자 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl">{icon}</span>
          <span className="text-xs font-bold text-white">{value}</span>
        </div>
      </div>

      {/* 라벨 */}
      <p className="text-xs text-gray-400 mt-2">{label}</p>
    </div>
  );
}

export default function StatsOverview() {
  const [stats, setStats] = useState({
    str: 0,
    int: 0,
    wis: 0,
    cha: 0,
    grt: 0,
    level: 1,
    totalExp: 0,
    nextLevelExp: 100,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const userId = getCurrentUserId();
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('stats')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        const levelInfo = calculateLevel(data.totalExp || data.total_exp || 0);
        setStats({
          str: data.str || 0,
          int: data.int || 0,
          wis: data.wis || 0,
          cha: data.cha || 0,
          grt: data.grt || 0,
          level: levelInfo.level,
          totalExp: data.totalExp || data.total_exp || 0,
          nextLevelExp: levelInfo.nextLevelExp,
        });
      } else {
        // 오늘 스탯이 없으면 초기값
        setStats({
          str: 0,
          int: 0,
          wis: 0,
          cha: 0,
          grt: 0,
          level: 1,
          totalExp: 0,
          nextLevelExp: 100,
        });
      }
    } catch (err: any) {
      console.error('Failed to load stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const statConfigs: StatGaugeProps[] = [
    { label: 'STR', value: stats.str, max: 50, color: '#FF6B35', icon: '💪' },
    { label: 'INT', value: stats.int, max: 50, color: '#4ECDC4', icon: '🧠' },
    { label: 'WIS', value: stats.wis, max: 50, color: '#A29BFE', icon: '🔮' },
    { label: 'CHA', value: stats.cha, max: 50, color: '#FFEAA7', icon: '✨' },
    { label: 'GRT', value: stats.grt, max: 50, color: '#00FF9F', icon: '🔥' },
  ];

  const expPercentage = (stats.totalExp / stats.nextLevelExp) * 100;

  if (isLoading) {
    return (
      <div className="card-game">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-blue"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-game">
      {/* 레벨 헤더 */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyber-blue to-neon-pink rounded-full">
          <span className="text-white font-bold">LEVEL</span>
          <span className="text-2xl font-bold text-white">{stats.level}</span>
        </div>

        {/* 경험치 바 */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>EXP</span>
            <span>{stats.totalExp} / {stats.nextLevelExp}</span>
          </div>
          <div className="h-3 bg-dark-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyber-blue to-neon-pink transition-all duration-500 relative"
              style={{ width: `${expPercentage}%` }}
            >
              <div className="absolute inset-0 animate-glow" />
            </div>
          </div>
        </div>
      </div>

      {/* 5대 스탯 */}
      <div className="grid grid-cols-3 gap-4 justify-items-center">
        <StatGauge {...statConfigs[0]} />
        <StatGauge {...statConfigs[1]} />
        <StatGauge {...statConfigs[2]} />
      </div>
      <div className="grid grid-cols-2 gap-4 justify-items-center mt-4">
        <StatGauge {...statConfigs[3]} />
        <StatGauge {...statConfigs[4]} />
      </div>

      {/* 스탯 설명 */}
      <div className="mt-6 pt-6 border-t border-dark-border">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span>💪 STR</span>
            <span className="text-gray-500">운동/수면</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🧠 INT</span>
            <span className="text-gray-500">학습/코딩</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔮 WIS</span>
            <span className="text-gray-500">성찰/명상</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✨ CHA</span>
            <span className="text-gray-500">네트워킹</span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <span>🔥 GRT</span>
            <span className="text-gray-500">꾸준함/루틴</span>
          </div>
        </div>
      </div>
    </div>
  );
}

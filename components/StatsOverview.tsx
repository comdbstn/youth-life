'use client';

import { useState, useEffect } from 'react';

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
    str: 12,
    int: 28,
    wis: 15,
    cha: 8,
    grt: 22,
    level: 5,
    totalExp: 1240,
    nextLevelExp: 1500,
  });

  const statConfigs: StatGaugeProps[] = [
    { label: 'STR', value: stats.str, max: 50, color: '#FF6B35', icon: '💪' },
    { label: 'INT', value: stats.int, max: 50, color: '#4ECDC4', icon: '🧠' },
    { label: 'WIS', value: stats.wis, max: 50, color: '#A29BFE', icon: '🔮' },
    { label: 'CHA', value: stats.cha, max: 50, color: '#FFEAA7', icon: '✨' },
    { label: 'GRT', value: stats.grt, max: 50, color: '#00FF9F', icon: '🔥' },
  ];

  const expPercentage = (stats.totalExp / stats.nextLevelExp) * 100;

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

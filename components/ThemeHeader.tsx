'use client';

import { useEffect, useState } from 'react';
import { getTodayTheme, formatDateKo } from '@/lib/theme';
import type { ThemeConfig } from '@/types';

export default function ThemeHeader() {
  const [theme, setTheme] = useState<ThemeConfig | null>(null);
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    setTheme(getTodayTheme(now));
    setDateStr(formatDateKo(now));
  }, []);

  if (!theme) return null;

  return (
    <div className="card-game">
      <div className="flex items-center justify-between">
        {/* 왼쪽: 날짜 + 테마 */}
        <div className="space-y-2">
          <p className="text-gray-400 text-sm">{dateStr}</p>
          <div className="flex items-center gap-3">
            <span className="text-5xl">{theme.emoji}</span>
            <div>
              <h1 className="text-3xl font-bold text-cyber-blue glow-text">
                {theme.label}
              </h1>
              <p className="text-gray-300 text-sm mt-1">
                {theme.description}
              </p>
            </div>
          </div>
        </div>

        {/* 오른쪽: 진행률 (추후 구현) */}
        <div className="text-right">
          <div className="text-4xl font-bold text-neon-green">0/3</div>
          <p className="text-gray-400 text-sm mt-1">핵심 태스크 완료</p>
        </div>
      </div>

      {/* 테마 컬러 인디케이터 */}
      <div
        className="h-2 rounded-full mt-6 animate-glow"
        style={{
          backgroundColor: theme.color,
          boxShadow: `0 0 20px ${theme.color}80`
        }}
      />
    </div>
  );
}

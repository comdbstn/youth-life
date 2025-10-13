'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/simple-auth';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (login(password)) {
      router.push('/');
      router.refresh();
    } else {
      setError('비밀번호가 올바르지 않습니다.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card-game max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-4xl font-bold text-cyber-blue mb-2">Youth Life</h1>
          <p className="text-gray-400">오행 리듬 기반 인생 운영 시스템</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-4 bg-dark-bg border-2 border-dark-border rounded-lg text-white text-center text-2xl focus:border-cyber-blue outline-none transition-colors"
              placeholder="••••••••"
              autoFocus
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 animate-pulse">
              <p className="text-red-500 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-cyber-blue to-neon-pink text-white font-bold rounded-lg text-lg hover:opacity-90 transition-opacity shadow-neon"
          >
            입장하기 🚀
          </button>
        </form>

        <div className="mt-8 bg-dark-bg rounded-xl p-6 border border-dark-border">
          <h3 className="text-cyber-blue font-bold mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>시작하기</span>
          </h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>🔥 요일별 자동 테마 (월:실행 ~ 일:성찰)</li>
            <li>🎯 핵심 3태스크 시스템</li>
            <li>📊 5대 스탯 + 레벨업</li>
            <li>💰 금전 트래킹 + 감정지출 감지</li>
            <li>🌙 하루 마감 성찰</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

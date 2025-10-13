import StatsOverview from '@/components/StatsOverview';

export default function StatsPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 왼쪽: 현재 스탯 */}
        <div className="space-y-6">
          <StatsOverview />

          {/* 업적 */}
          <div className="card-game">
            <h2 className="text-2xl font-bold text-neon-gold mb-6">🏆 업적</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-dark-bg rounded-xl p-4 border-2 border-neon-green">
                <div className="text-center mb-2">
                  <span className="text-4xl">🔥</span>
                </div>
                <h3 className="text-sm font-bold text-white text-center mb-1">
                  7일 연속 성찰
                </h3>
                <p className="text-xs text-gray-500 text-center">
                  2025.01.07 달성
                </p>
              </div>

              <div className="bg-dark-bg rounded-xl p-4 border-2 border-cyber-blue">
                <div className="text-center mb-2">
                  <span className="text-4xl">🧠</span>
                </div>
                <h3 className="text-sm font-bold text-white text-center mb-1">
                  Deep Work 마스터
                </h3>
                <p className="text-xs text-gray-500 text-center">
                  주간 10시간 달성
                </p>
              </div>

              <div className="bg-dark-bg rounded-xl p-4 border-2 border-dark-border opacity-50">
                <div className="text-center mb-2">
                  <span className="text-4xl">💰</span>
                </div>
                <h3 className="text-sm font-bold text-gray-500 text-center mb-1">
                  감정지출 제로
                </h3>
                <p className="text-xs text-gray-600 text-center">
                  월간 0건 달성 필요
                </p>
              </div>

              <div className="bg-dark-bg rounded-xl p-4 border-2 border-dark-border opacity-50">
                <div className="text-center mb-2">
                  <span className="text-4xl">⚡</span>
                </div>
                <h3 className="text-sm font-bold text-gray-500 text-center mb-1">
                  레벨 10 돌파
                </h3>
                <p className="text-xs text-gray-600 text-center">
                  현재 레벨 5
                </p>
              </div>
            </div>
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
                  <p className="text-3xl font-bold text-neon-green">7일</p>
                  <p className="text-xs text-gray-500">최고: 12일</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-dark-bg rounded-lg p-4">
                <div>
                  <p className="text-white font-bold mb-1">Deep Work</p>
                  <p className="text-xs text-gray-500">현재 기록</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-cyber-blue">5일</p>
                  <p className="text-xs text-gray-500">최고: 8일</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-dark-bg rounded-lg p-4">
                <div>
                  <p className="text-white font-bold mb-1">감정지출 0</p>
                  <p className="text-xs text-gray-500">현재 기록</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-neon-gold">3일</p>
                  <p className="text-xs text-gray-500">최고: 14일</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

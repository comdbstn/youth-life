export default function FinancePage() {
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
                <button className="flex-1 py-3 bg-neon-green text-dark-navy font-bold rounded-lg">
                  수입
                </button>
                <button className="flex-1 py-3 bg-dark-border text-gray-400 font-bold rounded-lg hover:bg-neon-pink hover:text-white">
                  지출
                </button>
              </div>

              {/* 금액 입력 */}
              <div className="mb-4">
                <input
                  type="number"
                  placeholder="금액 입력"
                  className="w-full px-4 py-3 bg-dark-card border-2 border-dark-border rounded-lg text-white text-2xl text-center focus:border-cyber-blue outline-none"
                />
              </div>

              {/* 카테고리 */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <button className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-sm text-gray-400 hover:border-cyber-blue hover:text-white">
                  식비
                </button>
                <button className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-sm text-gray-400 hover:border-cyber-blue hover:text-white">
                  교통
                </button>
                <button className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-sm text-gray-400 hover:border-cyber-blue hover:text-white">
                  쇼핑
                </button>
                <button className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-sm text-gray-400 hover:border-cyber-blue hover:text-white">
                  교육
                </button>
                <button className="px-4 py-2 bg-dark-card border border-neon-pink rounded-lg text-sm text-neon-pink hover:bg-neon-pink hover:text-white">
                  ⚠️ 감정지출
                </button>
              </div>

              <button className="w-full py-3 bg-cyber-blue text-dark-navy font-bold rounded-lg hover:opacity-80">
                기록하기
              </button>
            </div>

            {/* 오늘 기록 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">오늘의 기록</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-dark-bg rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neon-green/20 rounded-lg flex items-center justify-center text-neon-green">
                      +
                    </div>
                    <div>
                      <p className="text-white font-bold">외주 수입</p>
                      <p className="text-xs text-gray-500">13:24 · 수입</p>
                    </div>
                  </div>
                  <span className="text-neon-green font-bold text-lg">+150,000원</span>
                </div>

                <div className="flex items-center justify-between bg-dark-bg rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center text-red-500">
                      -
                    </div>
                    <div>
                      <p className="text-white font-bold">점심</p>
                      <p className="text-xs text-gray-500">12:30 · 식비</p>
                    </div>
                  </div>
                  <span className="text-red-500 font-bold text-lg">-12,000원</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 통계 */}
        <div className="space-y-6">
          {/* 이번 주 요약 */}
          <div className="card-game">
            <h3 className="text-lg font-bold text-white mb-4">📊 이번 주</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">수입</p>
                <p className="text-2xl font-bold text-neon-green">+450,000원</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">지출</p>
                <p className="text-2xl font-bold text-red-500">-180,000원</p>
              </div>
              <div className="pt-3 border-t border-dark-border">
                <p className="text-xs text-gray-500 mb-1">순이익</p>
                <p className="text-3xl font-bold text-cyber-blue">+270,000원</p>
              </div>
            </div>
          </div>

          {/* 감정지출 경보 */}
          <div className="card-game border-2 border-neon-pink">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-lg font-bold text-neon-pink">감정지출 경보</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              이번 주 감정지출: <span className="text-neon-pink font-bold">2건</span>
            </p>
            <div className="space-y-2">
              <div className="bg-dark-bg rounded-lg p-3">
                <p className="text-white text-sm font-bold mb-1">스트레스 쇼핑</p>
                <p className="text-xs text-gray-500">화요일 · 58,000원</p>
              </div>
              <div className="bg-dark-bg rounded-lg p-3">
                <p className="text-white text-sm font-bold mb-1">충동 구매</p>
                <p className="text-xs text-gray-500">목요일 · 32,000원</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-dark-border">
              <p className="text-xs text-gray-400">
                🎯 목표: 주간 감정지출 0건 달성 시 <span className="text-neon-green">GRT +5</span>
              </p>
            </div>
          </div>

          {/* 저축률 */}
          <div className="card-game">
            <h3 className="text-lg font-bold text-white mb-4">💎 저축률</h3>
            <div className="text-center mb-4">
              <p className="text-4xl font-bold text-cyber-blue mb-1">60%</p>
              <p className="text-xs text-gray-500">목표: 20% 이상</p>
            </div>
            <div className="h-2 bg-dark-border rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyber-blue to-neon-green" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

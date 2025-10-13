export default function ReportPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="card-game mb-6">
        <h1 className="text-3xl font-bold text-cyber-blue mb-6">📈 리포트</h1>

        {/* 탭 */}
        <div className="flex gap-2 mb-6">
          <button className="px-6 py-2 bg-cyber-blue text-dark-navy rounded-lg font-bold">
            주간
          </button>
          <button className="px-6 py-2 bg-dark-bg border border-dark-border text-gray-400 rounded-lg font-bold hover:text-white">
            월간
          </button>
        </div>

        {/* 기간 */}
        <div className="flex items-center justify-between mb-6">
          <button className="text-gray-400 hover:text-white">◀</button>
          <h2 className="text-xl font-bold text-white">2025년 1월 2주차</h2>
          <button className="text-gray-400 hover:text-white">▶</button>
        </div>
      </div>

      {/* 주간 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card-game">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-cyber-blue/20 rounded-lg flex items-center justify-center text-2xl">
              ✅
            </div>
            <div>
              <p className="text-xs text-gray-500">완료율</p>
              <p className="text-3xl font-bold text-cyber-blue">73%</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            핵심 태스크 <span className="text-white font-bold">15/21</span> 완료
          </p>
        </div>

        <div className="card-game">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-neon-green/20 rounded-lg flex items-center justify-center text-2xl">
              ⏱️
            </div>
            <div>
              <p className="text-xs text-gray-500">Deep Work</p>
              <p className="text-3xl font-bold text-neon-green">12.5h</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            목표 10시간 <span className="text-neon-green font-bold">달성</span>
          </p>
        </div>

        <div className="card-game">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-neon-pink/20 rounded-lg flex items-center justify-center text-2xl">
              📊
            </div>
            <div>
              <p className="text-xs text-gray-500">레벨</p>
              <p className="text-3xl font-bold text-neon-pink">5 → 6</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            경험치 <span className="text-white font-bold">+1,240</span> 획득
          </p>
        </div>
      </div>

      {/* 테마별 수행률 */}
      <div className="card-game mb-6">
        <h2 className="text-2xl font-bold text-white mb-6">🗓️ 테마별 수행률</h2>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <span className="text-white font-bold">실행의 날 (월)</span>
              </div>
              <span className="text-neon-green font-bold">100%</span>
            </div>
            <div className="h-3 bg-dark-border rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-neon-green" style={{ width: '100%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧱</span>
                <span className="text-white font-bold">집중의 날 (화)</span>
              </div>
              <span className="text-neon-green font-bold">85%</span>
            </div>
            <div className="h-3 bg-dark-border rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-neon-green" style={{ width: '85%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💧</span>
                <span className="text-white font-bold">정리의 날 (수)</span>
              </div>
              <span className="text-cyber-blue font-bold">67%</span>
            </div>
            <div className="h-3 bg-dark-border rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: '67%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌳</span>
                <span className="text-white font-bold">확장의 날 (목)</span>
              </div>
              <span className="text-yellow-500 font-bold">50%</span>
            </div>
            <div className="h-3 bg-dark-border rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-yellow-500" style={{ width: '50%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚙</span>
                <span className="text-white font-bold">마감의 날 (금)</span>
              </div>
              <span className="text-neon-green font-bold">90%</span>
            </div>
            <div className="h-3 bg-dark-border rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-neon-green" style={{ width: '90%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* GPT 주간 요약 */}
      <div className="card-game border-2 border-cyber-blue">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🤖</span>
          <h2 className="text-2xl font-bold text-cyber-blue">GPT 주간 요약</h2>
        </div>

        <div className="bg-dark-bg rounded-xl p-6 space-y-4">
          <div>
            <h3 className="text-neon-green font-bold mb-2">✨ 이번 주 하이라이트</h3>
            <p className="text-gray-300">
              수익 루프 시스템 첫 산출물 완성으로 월요일 목표를 100% 달성했습니다.
              특히 화요일 Deep Work 3시간은 이번 주 최고 집중도를 보여줬습니다.
            </p>
          </div>

          <div>
            <h3 className="text-neon-pink font-bold mb-2">🎯 개선 포인트</h3>
            <p className="text-gray-300">
              목요일 네트워킹 미팅이 취소되면서 확장의 날 목표 달성률이 50%에 그쳤습니다.
              다음 주에는 대체 활동(아이디어 브레인스토밍 등)을 미리 준비하세요.
            </p>
          </div>

          <div>
            <h3 className="text-cyber-blue font-bold mb-2">🚀 다음 주 추천</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>수익 루프 2차 산출물 제작 (월요일 Deep Work 2시간)</li>
              <li>일본어 학습 시간 45분 → 60분으로 증량 (화/목)</li>
              <li>금요일 주간 리뷰에 30분 추가 배정</li>
            </ul>
          </div>

          <div className="pt-4 border-t border-dark-border">
            <p className="text-sm text-gray-500 italic">
              "이번 주 성과는 훌륭했습니다. 꾸준함(GRT) 스탯이 특히 크게 올랐네요.
              다음 주에도 이 리듬을 유지하면 레벨 7 달성이 보입니다. 화이팅!"
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

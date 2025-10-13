export default function GoalsPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="card-game">
        <h1 className="text-3xl font-bold text-cyber-blue mb-6">🎯 목표 관리</h1>

        {/* 월/주/일 탭 */}
        <div className="flex gap-2 mb-6">
          <button className="px-6 py-2 bg-cyber-blue text-dark-navy rounded-lg font-bold">
            월간 목표
          </button>
          <button className="px-6 py-2 bg-dark-bg border border-dark-border text-gray-400 rounded-lg font-bold hover:text-white">
            주간 목표
          </button>
          <button className="px-6 py-2 bg-dark-bg border border-dark-border text-gray-400 rounded-lg font-bold hover:text-white">
            일일 목표
          </button>
        </div>

        {/* 목표 리스트 */}
        <div className="space-y-4">
          <div className="bg-dark-bg border-2 border-dark-border rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  수익 루프 시스템 구축
                </h3>
                <p className="text-gray-400 text-sm">
                  AI 기반 콘텐츠 생성 자동화 및 수익화
                </p>
              </div>
              <span className="px-3 py-1 bg-neon-green/20 text-neon-green text-xs font-bold rounded">
                진행중
              </span>
            </div>

            {/* 진행률 */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>진행률</span>
                <span>45%</span>
              </div>
              <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                <div className="h-full bg-neon-green" style={{ width: '45%' }} />
              </div>
            </div>

            <div className="text-xs text-gray-500">
              기간: 2025.01.01 - 2025.01.31
            </div>
          </div>

          {/* 더미 목표 */}
          <div className="bg-dark-bg border-2 border-dark-border rounded-xl p-6 opacity-60">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  일본어 N2 합격
                </h3>
                <p className="text-gray-400 text-sm">
                  매일 45분 학습 + 주말 모의고사
                </p>
              </div>
              <span className="px-3 py-1 bg-gray-700 text-gray-400 text-xs font-bold rounded">
                대기중
              </span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>진행률</span>
                <span>15%</span>
              </div>
              <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                <div className="h-full bg-cyber-blue" style={{ width: '15%' }} />
              </div>
            </div>

            <div className="text-xs text-gray-500">
              기간: 2025.01.01 - 2025.06.30
            </div>
          </div>
        </div>

        {/* 추가 버튼 */}
        <button className="w-full mt-6 py-4 border-2 border-dashed border-dark-border text-gray-400 rounded-lg hover:border-cyber-blue hover:text-cyber-blue transition-all">
          + 새 목표 추가
        </button>
      </div>

      {/* GPT 목표 분해 */}
      <div className="card-game mt-6">
        <h2 className="text-xl font-bold text-neon-pink mb-4">✨ AI 목표 분해</h2>
        <p className="text-gray-400 text-sm mb-4">
          큰 목표를 실행 가능한 작은 태스크로 자동 분해합니다.
        </p>
        <button className="w-full py-3 bg-gradient-to-r from-cyber-blue to-neon-pink text-white rounded-lg font-bold hover:opacity-80 transition-opacity">
          목표를 태스크로 변환
        </button>
      </div>
    </main>
  );
}

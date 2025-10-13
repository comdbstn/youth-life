import ThemeHeader from '@/components/ThemeHeader';
import Top3Tasks from '@/components/Top3Tasks';
import StatsOverview from '@/components/StatsOverview';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 헤더: 오늘 테마 */}
      <ThemeHeader />

      {/* 메인 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* 왼쪽: 핵심 3태스크 + 타임라인 */}
        <div className="lg:col-span-2 space-y-6">
          <Top3Tasks />

          {/* 타임라인 (추후 구현) */}
          <div className="card-game">
            <h2 className="text-xl font-bold text-cyber-blue mb-4">⏰ 타임라인</h2>
            <div className="h-64 flex items-center justify-center text-gray-500">
              타임블록 스케줄러 (구현 예정)
            </div>
          </div>
        </div>

        {/* 오른쪽: 스탯 + 빠른 입력 */}
        <div className="space-y-6">
          <StatsOverview />

          {/* 빠른 입력 (추후 구현) */}
          <div className="card-game">
            <h3 className="text-lg font-bold text-neon-green mb-4">💰 빠른 입력</h3>
            <div className="h-32 flex items-center justify-center text-gray-500">
              금전 입력 (구현 예정)
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/simple-auth';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  // 로그인 페이지에서는 네비게이션 표시 안 함
  if (pathname === '/login') {
    return null;
  }

  const navItems = [
    { href: '/', label: '홈', icon: '🏠' },
    { href: '/goals', label: '목표', icon: '🎯' },
    { href: '/calendar', label: '캘린더', icon: '📅' },
    { href: '/finance', label: '금전', icon: '💰' },
    { href: '/reflection', label: '성찰', icon: '🌙' },
    { href: '/stats', label: '스탯', icon: '📊' },
    { href: '/report', label: '리포트', icon: '📈' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-dark-border md:static md:border-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex justify-around md:justify-start md:gap-8 py-3 flex-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex flex-col md:flex-row items-center gap-1 md:gap-2 px-4 py-2 rounded-lg
                    transition-all duration-300
                    ${isActive
                      ? 'text-cyber-blue bg-cyber-blue/10 shadow-neon'
                      : 'text-gray-400 hover:text-white hover:bg-dark-bg'
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs md:text-sm font-bold">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* 로그아웃 버튼 (데스크톱만) */}
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-500 transition-colors"
            title="로그아웃"
          >
            <span>🚪</span>
            <span className="text-sm">나가기</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

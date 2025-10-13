'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: '홈', icon: '🏠' },
    { href: '/goals', label: '목표', icon: '🎯' },
    { href: '/finance', label: '금전', icon: '💰' },
    { href: '/stats', label: '스탯', icon: '📊' },
    { href: '/report', label: '리포트', icon: '📈' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-dark-border md:static md:border-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-around md:justify-start md:gap-8 py-3">
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
      </div>
    </nav>
  );
}

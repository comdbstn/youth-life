'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/simple-auth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 로그인 페이지는 체크 불필요
    if (pathname === '/login') {
      setIsLoading(false);
      return;
    }

    // 인증 체크
    if (!isAuthenticated()) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [pathname, router]);

  // 로딩 중이면 로딩 화면 표시
  if (isLoading && pathname !== '/login') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎮</div>
          <p className="text-cyber-blue text-xl font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

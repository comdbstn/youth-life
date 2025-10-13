// 간단한 비밀번호 인증 시스템
const MASTER_PASSWORD = 'bo020623';
const AUTH_KEY = 'youth_life_authenticated';
// UUID v4 format for Supabase compatibility
const USER_ID = '00000000-0000-0000-0000-000000000001';

export function login(password: string): boolean {
  if (password === MASTER_PASSWORD) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem('youth_life_user_id', USER_ID);
    }
    return true;
  }
  return false;
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(AUTH_KEY) === 'true';
}

export function getUserId(): string {
  return USER_ID;
}

export function getCurrentUserId(): string {
  if (typeof window === 'undefined') return USER_ID;
  return localStorage.getItem('youth_life_user_id') || USER_ID;
}

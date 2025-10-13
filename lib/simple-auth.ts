// 간단한 비밀번호 인증 시스템
const MASTER_PASSWORD = 'bo020623';
const AUTH_KEY = 'youth_life_authenticated';
const USER_ID = 'master_user';

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

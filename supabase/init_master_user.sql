-- 마스터 사용자 초기화 스크립트 (개인 사용용)
-- 이 스크립트를 Supabase SQL Editor에 복사해서 실행하세요

-- 1. RLS 비활성화 (개인 사용이므로 보안 정책 제거)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE goals DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE time_blocks DISABLE ROW LEVEL SECURITY;
ALTER TABLE day_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE reflections DISABLE ROW LEVEL SECURITY;
ALTER TABLE finance_entries DISABLE ROW LEVEL SECURITY;
ALTER TABLE stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE streaks DISABLE ROW LEVEL SECURITY;

-- 2. 마스터 사용자 생성
INSERT INTO profiles (id, email, timezone, locale)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'master@youth-life.app',
  'Asia/Seoul',
  'ko-KR'
)
ON CONFLICT (id) DO NOTHING;

-- 3. 오늘 스탯 초기화
INSERT INTO stats (user_id, date, str, int, wis, cha, grt, total_exp, level)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  CURRENT_DATE,
  0, 0, 0, 0, 0, 0, 1
)
ON CONFLICT (user_id, date) DO NOTHING;

-- 4. 확인
SELECT 'Setup completed!' as status;
SELECT * FROM profiles WHERE id = '00000000-0000-0000-0000-000000000001';
SELECT * FROM stats WHERE user_id = '00000000-0000-0000-0000-000000000001';

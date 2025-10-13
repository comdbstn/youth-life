-- 마스터 사용자 초기화 스크립트
-- 이 스크립트는 Supabase SQL Editor에서 실행하세요

-- 1. RLS를 임시로 비활성화 (개발/프로토타입용)
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
INSERT INTO profiles (id, email, timezone, locale, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'master@youth-life.app',
  'Asia/Seoul',
  'ko-KR',
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 3. 마스터 사용자의 초기 스탯 생성 (오늘 날짜)
INSERT INTO stats (id, user_id, date, str, int, wis, cha, grt, total_exp, level, created_at)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  CURRENT_DATE,
  0, 0, 0, 0, 0,
  0,
  1,
  NOW()
)
ON CONFLICT (user_id, date) DO NOTHING;

-- 4. 확인 쿼리
SELECT * FROM profiles WHERE id = '00000000-0000-0000-0000-000000000001';
SELECT * FROM stats WHERE user_id = '00000000-0000-0000-0000-000000000001';

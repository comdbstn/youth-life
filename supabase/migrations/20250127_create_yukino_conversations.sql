-- 유키노 대화 내역 테이블
CREATE TABLE IF NOT EXISTS yukino_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'yukino', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_yukino_conversations_user_id ON yukino_conversations(user_id);
CREATE INDEX idx_yukino_conversations_created_at ON yukino_conversations(created_at);

-- RLS 활성화
ALTER TABLE yukino_conversations ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 자신의 대화만 조회/삽입 가능
CREATE POLICY "Users can view their own conversations"
  ON yukino_conversations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations"
  ON yukino_conversations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 유키노 장기 기억 테이블 (주기적 요약 저장)
CREATE TABLE IF NOT EXISTS yukino_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  memory_type TEXT NOT NULL CHECK (memory_type IN ('insight', 'preference', 'pattern', 'goal', 'achievement')),
  content TEXT NOT NULL,
  importance INTEGER DEFAULT 5 CHECK (importance BETWEEN 1 AND 10),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_yukino_memory_user_id ON yukino_memory(user_id);
CREATE INDEX idx_yukino_memory_type ON yukino_memory(memory_type);
CREATE INDEX idx_yukino_memory_importance ON yukino_memory(importance);

-- RLS
ALTER TABLE yukino_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own memory"
  ON yukino_memory
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own memory"
  ON yukino_memory
  FOR ALL
  USING (auth.uid() = user_id);

-- 업데이트 시간 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_yukino_memory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER yukino_memory_updated_at
  BEFORE UPDATE ON yukino_memory
  FOR EACH ROW
  EXECUTE FUNCTION update_yukino_memory_updated_at();

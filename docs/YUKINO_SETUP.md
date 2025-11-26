# 유키노 AI 비서 완전 설정 가이드

## ⚠️ 필수: Supabase 데이터베이스 설정

유키노 AI 비서가 **실제로 작동하려면** 다음 SQL을 Supabase에서 실행해야 합니다.

## 1️⃣ Supabase SQL Editor 접속

1. [Supabase Dashboard](https://supabase.com/dashboard) 로그인
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **SQL Editor** 클릭
4. **New query** 버튼 클릭

## 2️⃣ 유키노 테이블 생성 SQL 실행

아래 전체 SQL을 복사해서 SQL Editor에 붙여넣고 **Run** 버튼 클릭:

```sql
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
```

## 3️⃣ 실행 확인

SQL 실행 후 아래 명령어로 테이블이 제대로 생성되었는지 확인:

```sql
-- 테이블 확인
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('yukino_conversations', 'yukino_memory');
```

결과가 2개 행으로 나와야 합니다:
- `yukino_conversations`
- `yukino_memory`

## 4️⃣ 테스트

1. 웹사이트에서 유키노 페이지 접속
2. 메시지 입력 후 전송
3. 페이지 새로고침
4. **대화 내역이 그대로 유지되면 성공!** ✅

## 🚨 자주 발생하는 문제

### 문제 1: "relation does not exist" 에러
**원인**: SQL을 실행하지 않았거나 실행 실패

**해결**:
1. SQL Editor에서 위 SQL 다시 실행
2. 에러 메시지 확인
3. 테이블 확인 쿼리 실행

### 문제 2: RLS 정책 오류
**원인**: auth.uid()를 사용하는데 사용자 인증이 안 됨

**해결**:
현재 시스템은 simple-auth 사용 중이므로 RLS 정책 수정 필요:

```sql
-- 기존 정책 삭제
DROP POLICY IF EXISTS "Users can view their own conversations" ON yukino_conversations;
DROP POLICY IF EXISTS "Users can insert their own conversations" ON yukino_conversations;
DROP POLICY IF EXISTS "Users can view their own memory" ON yukino_memory;
DROP POLICY IF EXISTS "Users can manage their own memory" ON yukino_memory;

-- 모든 사용자가 접근 가능하도록 임시 설정 (개발용)
CREATE POLICY "Allow all for conversations"
  ON yukino_conversations
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all for memory"
  ON yukino_memory
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

**⚠️ 주의**: 위 정책은 개발용입니다. 프로덕션에서는 제대로 된 인증 시스템 필요!

### 문제 3: 대화가 저장 안 됨
**원인**: user_id가 UUID가 아님

**확인**:
```sql
SELECT * FROM yukino_conversations LIMIT 5;
```

**user_id 컬럼 타입 변경 필요시**:
```sql
-- 기존 데이터 백업
CREATE TABLE yukino_conversations_backup AS SELECT * FROM yukino_conversations;

-- 테이블 삭제 후 재생성
DROP TABLE yukino_conversations CASCADE;

-- 위의 CREATE TABLE 문 다시 실행
```

## 📊 데이터 확인 쿼리

### 저장된 대화 확인
```sql
SELECT
  role,
  LEFT(content, 50) as preview,
  created_at
FROM yukino_conversations
ORDER BY created_at DESC
LIMIT 10;
```

### 장기 기억 확인
```sql
SELECT
  memory_type,
  content,
  importance,
  created_at
FROM yukino_memory
ORDER BY importance DESC, created_at DESC;
```

## ✅ 완료 체크리스트

- [ ] Supabase SQL Editor에서 테이블 생성 SQL 실행
- [ ] 테이블 생성 확인 쿼리 실행하여 2개 테이블 존재 확인
- [ ] 웹사이트에서 유키노와 대화
- [ ] 페이지 새로고침 후 대화 내역 유지 확인
- [ ] Supabase Table Editor에서 데이터 확인

모든 체크가 완료되면 유키노 AI 비서가 완전히 작동합니다!

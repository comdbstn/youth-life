import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import OpenAI from 'openai';
import { YUKINO_SYSTEM_PROMPT } from '@/lib/yukino-persona';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function definitions for GPT
const functions = [
  {
    name: 'add_task',
    description: '새로운 태스크를 추가합니다',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: '태스크 제목' },
        description: { type: 'string', description: '태스크 설명' },
        planned_at: { type: 'string', description: 'ISO 8601 형식 날짜시간' },
        duration_min: { type: 'number', description: '예상 소요시간(분)' },
        priority: { type: 'number', enum: [1, 2, 3], description: '우선순위' },
        tags: { type: 'array', items: { type: 'string' }, description: '태그 목록' },
      },
      required: ['title', 'planned_at', 'duration_min', 'priority'],
    },
  },
  {
    name: 'update_task',
    description: '기존 태스크를 수정합니다',
    parameters: {
      type: 'object',
      properties: {
        task_id: { type: 'string', description: '태스크 ID' },
        updates: {
          type: 'object',
          description: '업데이트할 필드들',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'in_progress', 'completed'] },
            planned_at: { type: 'string' },
            duration_min: { type: 'number' },
            priority: { type: 'number', enum: [1, 2, 3] },
          },
        },
      },
      required: ['task_id', 'updates'],
    },
  },
  {
    name: 'delete_task',
    description: '태스크를 삭제합니다',
    parameters: {
      type: 'object',
      properties: {
        task_id: { type: 'string', description: '태스크 ID' },
      },
      required: ['task_id'],
    },
  },
  {
    name: 'add_goal',
    description: '새로운 목표를 추가합니다',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: '목표 제목' },
        description: { type: 'string', description: '목표 설명' },
        level: { type: 'string', enum: ['MONTHLY', 'WEEKLY', 'DAILY'], description: '목표 레벨' },
        period_start: { type: 'string', description: 'YYYY-MM-DD 형식' },
        period_end: { type: 'string', description: 'YYYY-MM-DD 형식' },
      },
      required: ['title', 'level', 'period_start', 'period_end'],
    },
  },
  {
    name: 'update_goal',
    description: '목표 진행률이나 상태를 업데이트합니다',
    parameters: {
      type: 'object',
      properties: {
        goal_id: { type: 'string', description: '목표 ID' },
        updates: {
          type: 'object',
          properties: {
            progress: { type: 'number', description: '진행률 (0-100)' },
            status: { type: 'string', enum: ['active', 'completed', 'archived'] },
          },
        },
      },
      required: ['goal_id', 'updates'],
    },
  },
  {
    name: 'add_finance_entry',
    description: '금전 기록을 추가합니다',
    parameters: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['income', 'expense'], description: '수입/지출' },
        amount: { type: 'number', description: '금액' },
        category: { type: 'string', description: '카테고리' },
        note: { type: 'string', description: '메모' },
        is_emotional: { type: 'boolean', description: '감정지출 여부' },
      },
      required: ['type', 'amount', 'category'],
    },
  },
  {
    name: 'save_insight',
    description: '유키노가 발견한 중요한 인사이트나 패턴을 장기 기억에 저장합니다',
    parameters: {
      type: 'object',
      properties: {
        memory_type: {
          type: 'string',
          enum: ['insight', 'preference', 'pattern', 'goal', 'achievement'],
          description: '기억 유형'
        },
        content: { type: 'string', description: '기억할 내용' },
        importance: { type: 'number', description: '중요도 (1-10)', minimum: 1, maximum: 10 },
      },
      required: ['memory_type', 'content', 'importance'],
    },
  },
];

// Function execution handlers
async function executeFunction(functionName: string, args: any, userId: string) {
  switch (functionName) {
    case 'add_task': {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: userId,
          title: args.title,
          description: args.description || null,
          planned_at: args.planned_at,
          duration_min: args.duration_min,
          priority: args.priority,
          tags: args.tags || [],
          theme: 'EXECUTE',
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, task: data };
    }

    case 'update_task': {
      const { data, error } = await supabase
        .from('tasks')
        .update(args.updates)
        .eq('id', args.task_id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, task: data };
    }

    case 'delete_task': {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', args.task_id)
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    }

    case 'add_goal': {
      const { data, error } = await supabase
        .from('goals')
        .insert({
          user_id: userId,
          title: args.title,
          description: args.description || null,
          level: args.level,
          period_start: args.period_start,
          period_end: args.period_end,
          progress: 0,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, goal: data };
    }

    case 'update_goal': {
      const { data, error } = await supabase
        .from('goals')
        .update(args.updates)
        .eq('id', args.goal_id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, goal: data };
    }

    case 'add_finance_entry': {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('finance_entries')
        .insert({
          user_id: userId,
          date: today,
          type: args.type,
          amount: args.amount,
          category: args.category,
          note: args.note || null,
          is_emotional: args.is_emotional || false,
          tag: args.is_emotional ? 'emotional' : 'variable',
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, entry: data };
    }

    case 'save_insight': {
      const { data, error } = await supabase
        .from('yukino_memory')
        .insert({
          user_id: userId,
          memory_type: args.memory_type,
          content: args.content,
          importance: args.importance,
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, memory: data };
    }

    default:
      throw new Error(`Unknown function: ${functionName}`);
  }
}

/**
 * POST /api/yukino/chat-v2
 * 유키노 AI 비서와 대화 (개선 버전 - Function Calling + 대화 저장)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, userId } = body;

    if (!message || !userId) {
      return NextResponse.json(
        { error: 'message and userId are required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // 대화 내역 로드 (최근 20개)
    const { data: conversationHistory, error: historyError } = await supabase
      .from('yukino_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(20);

    // 테이블이 없으면 명확한 에러 메시지 반환
    if (historyError && historyError.code === '42P01') {
      return NextResponse.json({
        error: 'Yukino database tables not created',
        message: '유키노 AI 비서를 사용하려면 Supabase에서 데이터베이스 테이블을 먼저 생성해야 합니다.',
        guide: 'docs/YUKINO_SETUP.md 파일을 참고하여 SQL을 실행하세요.',
        sqlFile: 'supabase/migrations/20250127_create_yukino_conversations.sql',
      }, { status: 503 });
    }

    if (historyError) throw historyError;

    // 유키노의 장기 기억 로드
    const { data: memories, error: memoryError } = await supabase
      .from('yukino_memory')
      .select('*')
      .eq('user_id', userId)
      .order('importance', { ascending: false })
      .limit(10);

    if (memoryError && memoryError.code === '42P01') {
      return NextResponse.json({
        error: 'Yukino database tables not created',
        message: '유키노 AI 비서를 사용하려면 Supabase에서 데이터베이스 테이블을 먼저 생성해야 합니다.',
        guide: 'docs/YUKINO_SETUP.md 파일을 참고하여 SQL을 실행하세요.',
        sqlFile: 'supabase/migrations/20250127_create_yukino_conversations.sql',
      }, { status: 503 });
    }

    if (memoryError) throw memoryError;

    // 현재 데이터 수집
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const [
      tasksResult,
      goalsResult,
      financeResult,
      reflectionResult,
      statsResult,
    ] = await Promise.all([
      supabase.from('tasks').select('*').eq('user_id', userId).gte('planned_at', today).order('planned_at', { ascending: true }),
      supabase.from('goals').select('*').eq('user_id', userId).eq('status', 'active'),
      supabase.from('finance_entries').select('*').eq('user_id', userId).gte('date', weekAgo).order('date', { ascending: false }),
      supabase.from('reflections').select('*').eq('user_id', userId).order('date', { ascending: false }).limit(3),
      supabase.from('stats').select('*').eq('user_id', userId).order('date', { ascending: false }).limit(1),
    ]);

    // 데이터 컨텍스트 구성
    const context = {
      today,
      tasks: tasksResult.data || [],
      goals: goalsResult.data || [],
      finance: financeResult.data || [],
      reflections: reflectionResult.data || [],
      latestStats: statsResult.data?.[0] || null,
      memories: memories || [],
    };

    // 메시지 구성
    const messages: any[] = [
      { role: 'system', content: YUKINO_SYSTEM_PROMPT },
      {
        role: 'system',
        content: `# 현재 데이터 컨텍스트 (${today})

## 오늘의 태스크 (${context.tasks.length}개)
${context.tasks.map(t => `- [${t.id}] ${t.title} (${t.status}) - ${t.planned_at}`).join('\n') || '없음'}

## 활성 목표 (${context.goals.length}개)
${context.goals.map(g => `- [${g.id}] ${g.title} (${g.level}): ${g.progress}%`).join('\n') || '없음'}

## 최근 스탯
${context.latestStats ? `STR: ${context.latestStats.str}, INT: ${context.latestStats.int}, WIS: ${context.latestStats.wis}, CHA: ${context.latestStats.cha}, GRT: ${context.latestStats.grt}, LV: ${context.latestStats.level}` : '데이터 없음'}

## 장기 기억 (중요도 높은 순)
${context.memories.map(m => `- [${m.memory_type}] ${m.content} (중요도: ${m.importance}/10)`).join('\n') || '아직 기억 없음'}`,
      },
    ];

    // 대화 내역 추가
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        if (msg.role !== 'system') {
          messages.push({
            role: msg.role === 'yukino' ? 'assistant' : 'user',
            content: msg.content,
          });
        }
      });
    }

    // 현재 사용자 메시지
    messages.push({ role: 'user', content: message });

    // OpenAI API 호출 (Function Calling 활성화)
    let completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      functions,
      function_call: 'auto',
      temperature: 0.7,
      max_tokens: 1500,
    });

    let functionResults: any[] = [];
    let finalResponse = '';

    // Function calling 처리
    while (completion.choices[0]?.finish_reason === 'function_call') {
      const functionCall = completion.choices[0].message.function_call!;
      const functionName = functionCall.name;
      const functionArgs = JSON.parse(functionCall.arguments);

      console.log(`[Yukino] Executing function: ${functionName}`, functionArgs);

      const result = await executeFunction(functionName, functionArgs, userId);
      functionResults.push({ function: functionName, result });

      // 함수 실행 결과를 메시지에 추가
      messages.push(completion.choices[0].message);
      messages.push({
        role: 'function',
        name: functionName,
        content: JSON.stringify(result),
      });

      // 다시 GPT 호출
      completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
        functions,
        function_call: 'auto',
        temperature: 0.7,
        max_tokens: 1500,
      });
    }

    finalResponse = completion.choices[0]?.message?.content || '응답을 생성할 수 없습니다.';

    // 사용자 메시지 저장
    const { error: userSaveError } = await supabase.from('yukino_conversations').insert({
      user_id: userId,
      role: 'user',
      content: message,
    });

    if (userSaveError) {
      console.error('[Yukino] Failed to save user message:', userSaveError);
      throw new Error(`대화 저장 실패: ${userSaveError.message} (code: ${userSaveError.code})`);
    }

    // 유키노 응답 저장
    const { error: yukinoSaveError } = await supabase.from('yukino_conversations').insert({
      user_id: userId,
      role: 'yukino',
      content: finalResponse,
      metadata: { functionCalls: functionResults },
    });

    if (yukinoSaveError) {
      console.error('[Yukino] Failed to save yukino response:', yukinoSaveError);
      throw new Error(`대화 저장 실패: ${yukinoSaveError.message} (code: ${yukinoSaveError.code})`);
    }

    return NextResponse.json({
      success: true,
      message: finalResponse,
      functionCalls: functionResults,
    });
  } catch (error: any) {
    console.error('Yukino chat error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * GET /api/yukino/chat-v2
 * 대화 내역 조회
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('yukino_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    // 테이블이 없으면 명확한 에러 메시지 반환
    if (error && error.code === '42P01') {
      return NextResponse.json({
        error: 'Yukino database tables not created',
        message: '유키노 AI 비서를 사용하려면 Supabase에서 데이터베이스 테이블을 먼저 생성해야 합니다.',
        guide: 'docs/YUKINO_SETUP.md 파일을 참고하여 SQL을 실행하세요.',
        sqlFile: 'supabase/migrations/20250127_create_yukino_conversations.sql',
      }, { status: 503 });
    }

    if (error) throw error;

    return NextResponse.json({ success: true, conversations: data || [] });
  } catch (error: any) {
    console.error('Failed to load conversations:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

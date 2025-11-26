import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import OpenAI from 'openai';
import { YUKINO_SYSTEM_PROMPT } from '@/lib/yukino-persona';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POST /api/yukino/chat
 * 유키노 AI 비서와 대화
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

    // 윤수의 모든 데이터 수집
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // 병렬로 모든 데이터 가져오기
    const [
      tasksResult,
      goalsResult,
      financeResult,
      reflectionResult,
      statsResult,
      dayPlanResult,
    ] = await Promise.all([
      supabase.from('tasks').select('*').eq('user_id', userId).gte('planned_at', today).order('planned_at', { ascending: true }),
      supabase.from('goals').select('*').eq('user_id', userId).eq('status', 'active'),
      supabase.from('finance_entries').select('*').eq('user_id', userId).gte('date', weekAgo).order('date', { ascending: false }),
      supabase.from('reflections').select('*').eq('user_id', userId).order('date', { ascending: false }).limit(7),
      supabase.from('stats').select('*').eq('user_id', userId).order('date', { ascending: false }).limit(7),
      supabase.from('day_plans').select('*').eq('user_id', userId).eq('date', today).single(),
    ]);

    // 데이터 컨텍스트 구성
    const context = {
      today,
      tasks: {
        today: tasksResult.data || [],
        pending: (tasksResult.data || []).filter(t => t.status === 'pending'),
        completed: (tasksResult.data || []).filter(t => t.status === 'completed'),
        inProgress: (tasksResult.data || []).filter(t => t.status === 'in_progress'),
      },
      goals: {
        monthly: (goalsResult.data || []).filter(g => g.level === 'MONTHLY'),
        weekly: (goalsResult.data || []).filter(g => g.level === 'WEEKLY'),
        daily: (goalsResult.data || []).filter(g => g.level === 'DAILY'),
      },
      finance: {
        thisWeek: financeResult.data || [],
        income: (financeResult.data || []).filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0),
        expense: (financeResult.data || []).filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0),
        emotionalExpense: (financeResult.data || []).filter(f => f.is_emotional).reduce((sum, f) => sum + f.amount, 0),
        emotionalCount: (financeResult.data || []).filter(f => f.is_emotional).length,
      },
      reflections: reflectionResult.data || [],
      stats: statsResult.data || [],
      latestStats: statsResult.data?.[0] || null,
      dayPlan: dayPlanResult.data || null,
    };

    // 데이터 요약 생성
    const dataSummary = `
# 현재 윤수님의 데이터 (${today})

## 오늘의 태스크
- 전체: ${context.tasks.today.length}개
- 완료: ${context.tasks.completed.length}개
- 진행중: ${context.tasks.inProgress.length}개
- 대기: ${context.tasks.pending.length}개
- 완료율: ${context.tasks.today.length > 0 ? Math.round((context.tasks.completed.length / context.tasks.today.length) * 100) : 0}%

태스크 목록:
${context.tasks.today.map(t => `- [${t.status === 'completed' ? '✓' : ' '}] ${t.title} (${t.planned_at?.split('T')[1]?.substring(0, 5) || '시간미정'})`).join('\n')}

## 현재 목표
### 월간 목표 (${context.goals.monthly.length}개)
${context.goals.monthly.map(g => `- ${g.title}: ${g.progress}% 완료`).join('\n') || '없음'}

### 주간 목표 (${context.goals.weekly.length}개)
${context.goals.weekly.map(g => `- ${g.title}: ${g.progress}% 완료`).join('\n') || '없음'}

### 일일 목표 (${context.goals.daily.length}개)
${context.goals.daily.map(g => `- ${g.title}: ${g.progress}% 완료`).join('\n') || '없음'}

## 이번 주 재정 (최근 7일)
- 수입: +${context.finance.income.toLocaleString()}원
- 지출: -${context.finance.expense.toLocaleString()}원
- 순이익: ${(context.finance.income - context.finance.expense).toLocaleString()}원
- 저축률: ${context.finance.income > 0 ? Math.round(((context.finance.income - context.finance.expense) / context.finance.income) * 100) : 0}%
- 감정지출: ${context.finance.emotionalCount}건, ${context.finance.emotionalExpense.toLocaleString()}원

## 최근 스탯 (${context.latestStats?.date || '데이터 없음'})
${context.latestStats ? `
- STR (실행력): ${context.latestStats.str}
- INT (지능): ${context.latestStats.int}
- WIS (지혜): ${context.latestStats.wis}
- CHA (매력): ${context.latestStats.cha}
- GRT (성장): ${context.latestStats.grt}
- 총 경험치: ${context.latestStats.total_exp}
- 레벨: ${context.latestStats.level}
` : '데이터 없음'}

## 최근 성찰 (최근 7일)
${context.reflections.length > 0 ? context.reflections.map(r => `
[${r.date}] 기분: ${r.mood}, 에너지: ${r.energy}/10
${r.gpt_summary || '요약 없음'}
`).join('\n') : '성찰 데이터 없음'}

## 오늘의 계획
${context.dayPlan ? `
- 테마: ${context.dayPlan.theme}
- Top3 태스크: ${context.dayPlan.top3_task_ids?.length || 0}개 설정됨
${context.dayPlan.gpt_morning_coach ? `- 아침 코칭: ${context.dayPlan.gpt_morning_coach}` : ''}
` : '계획 없음'}
`;

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: YUKINO_SYSTEM_PROMPT,
        },
        {
          role: 'system',
          content: dataSummary,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const reply = completion.choices[0]?.message?.content || '죄송합니다. 응답을 생성할 수 없습니다.';

    return NextResponse.json({
      success: true,
      message: reply,
      context: {
        tasksTotal: context.tasks.today.length,
        tasksCompleted: context.tasks.completed.length,
        goalsActive: goalsResult.data?.length || 0,
        savingsRate: context.finance.income > 0 ? Math.round(((context.finance.income - context.finance.expense) / context.finance.income) * 100) : 0,
      },
    });
  } catch (error: any) {
    console.error('Yukino chat error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

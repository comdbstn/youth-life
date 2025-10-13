import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getMorningCoach } from '@/lib/openai';

/**
 * POST /api/coach/morning
 * 아침 코칭 메시지 생성
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, theme } = body;

    if (!userId || !theme) {
      return NextResponse.json(
        { error: 'userId and theme are required' },
        { status: 400 }
      );
    }

    // 오늘 날짜
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    // 사용자의 활성 목표 가져오기
    const { data: goals, error: goalsError } = await supabase
      .from('goals')
      .select('title, description')
      .eq('user_id', userId)
      .in('status', ['pending', 'in_progress'])
      .limit(5);

    if (goalsError) {
      console.error('Failed to fetch goals:', goalsError);
    }

    const goalTitles = (goals || []).map((g) =>
      g.description ? `${g.title} - ${g.description}` : g.title
    );

    // 어제 통계 가져오기
    const { data: yesterdayTasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .gte('planned_at', yesterday)
      .lt('planned_at', today);

    const { data: yesterdayStats } = await supabase
      .from('stats')
      .select('*')
      .eq('user_id', userId)
      .eq('date', yesterday)
      .single();

    const completedTasks =
      yesterdayTasks?.filter((t) => t.status === 'completed').length || 0;
    const totalTasks = yesterdayTasks?.length || 0;

    // GPT 코칭 생성
    const coachingMessage = await getMorningCoach({
      theme,
      goals: goalTitles.length > 0 ? goalTitles : ['목표를 설정해보세요!'],
      yesterdayStats:
        yesterdayStats && totalTasks > 0
          ? {
              completedTasks,
              totalTasks,
              stats: {
                str: yesterdayStats.str || 0,
                int: yesterdayStats.int || 0,
                wis: yesterdayStats.wis || 0,
                cha: yesterdayStats.cha || 0,
                grt: yesterdayStats.grt || 0,
              },
            }
          : undefined,
    });

    // DayPlan에 저장 (있으면 업데이트, 없으면 생성)
    const { data: existingPlan } = await supabase
      .from('day_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    if (existingPlan) {
      await supabase
        .from('day_plans')
        .update({ gpt_morning_coach: coachingMessage })
        .eq('id', existingPlan.id);
    } else {
      await supabase.from('day_plans').insert({
        user_id: userId,
        date: today,
        theme,
        gpt_morning_coach: coachingMessage,
        top3_task_ids: [],
      });
    }

    return NextResponse.json({
      message: coachingMessage,
      goals: goalTitles,
      yesterdayStats:
        totalTasks > 0
          ? {
              completedTasks,
              totalTasks,
              completionRate: Math.round((completedTasks / totalTasks) * 100),
            }
          : null,
    });
  } catch (error: any) {
    console.error('Morning coach error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

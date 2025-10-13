import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getEveningCoach } from '@/lib/openai';

/**
 * POST /api/coach/evening
 * 저녁 코칭 메시지 생성
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, theme, reflectionId } = body;

    if (!userId || !theme) {
      return NextResponse.json(
        { error: 'userId and theme are required' },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().split('T')[0];

    // 오늘 태스크 가져오기
    const { data: todayTasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .gte('planned_at', today)
      .lt('planned_at', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    const completedTasks =
      todayTasks?.filter((t) => t.status === 'completed').length || 0;
    const totalTasks = todayTasks?.length || 0;

    // 오늘 스탯 가져오기
    const { data: todayStats } = await supabase
      .from('stats')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    // 성찰 데이터 가져오기 (선택사항)
    let reflection = null;
    if (reflectionId) {
      const { data: reflectionData } = await supabase
        .from('reflections')
        .select('*')
        .eq('id', reflectionId)
        .single();

      if (reflectionData) {
        reflection = {
          mood: reflectionData.mood,
          energy: reflectionData.energy,
          answers: reflectionData.answers,
        };
      }
    }

    // GPT 코칭 생성
    const coachingResult = await getEveningCoach({
      theme,
      todayStats: {
        completedTasks,
        totalTasks,
        stats: {
          str: todayStats?.str || 0,
          int: todayStats?.int || 0,
          wis: todayStats?.wis || 0,
          cha: todayStats?.cha || 0,
          grt: todayStats?.grt || 0,
        },
        totalExp: todayStats?.total_exp || 0,
      },
      reflection: reflection || undefined,
    });

    // Reflection 업데이트 또는 DayPlan 업데이트
    if (reflectionId) {
      await supabase
        .from('reflections')
        .update({
          gpt_praise: coachingResult.praise,
          gpt_improvement: coachingResult.improvement,
          tomorrow_priorities: coachingResult.tomorrowPriorities,
        })
        .eq('id', reflectionId);
    } else {
      // DayPlan에 저장
      const { data: existingPlan } = await supabase
        .from('day_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      if (existingPlan) {
        await supabase
          .from('day_plans')
          .update({
            gpt_night_coach: JSON.stringify(coachingResult),
          })
          .eq('id', existingPlan.id);
      } else {
        await supabase.from('day_plans').insert({
          user_id: userId,
          date: today,
          theme,
          gpt_night_coach: JSON.stringify(coachingResult),
          top3_task_ids: [],
        });
      }
    }

    return NextResponse.json({
      praise: coachingResult.praise,
      improvement: coachingResult.improvement,
      tomorrowPriorities: coachingResult.tomorrowPriorities,
      todayStats: {
        completedTasks,
        totalTasks,
        completionRate:
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        totalExp: todayStats?.total_exp || 0,
      },
    });
  } catch (error: any) {
    console.error('Evening coach error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

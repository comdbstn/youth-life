import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { breakdownGoal } from '@/lib/openai';

/**
 * POST /api/goals/breakdown
 * 목표를 태스크로 자동 분해
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { goalId, userId } = body;

    if (!goalId || !userId) {
      return NextResponse.json(
        { error: 'goalId and userId are required' },
        { status: 400 }
      );
    }

    // 목표 조회
    const { data: goal, error: goalError } = await supabase
      .from('goals')
      .select('*')
      .eq('id', goalId)
      .single();

    if (goalError || !goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    // 사용 가능한 테마
    const availableThemes = [
      'EXECUTE',
      'FOCUS',
      'ORGANIZE',
      'EXPAND',
      'WRAP',
      'RECOVER',
      'REFLECT',
    ];

    // GPT로 태스크 분해
    const result = await breakdownGoal({
      goalTitle: goal.title,
      goalDescription: goal.description || undefined,
      goalType: goal.level,
      availableThemes,
    });

    // 생성된 태스크를 DB에 저장
    const tasksToInsert = result.tasks.map((task) => ({
      user_id: userId,
      goal_id: goalId,
      title: task.title,
      description: task.description,
      tags: task.tags,
      theme: task.theme as any,
      priority: task.priority,
      status: 'pending' as const,
      planned_at: new Date().toISOString(),
      duration_min: task.durationMin,
    }));

    const { data: insertedTasks, error: insertError } = await supabase
      .from('tasks')
      .insert(tasksToInsert)
      .select();

    if (insertError) {
      console.error('Failed to insert tasks:', insertError);
      return NextResponse.json(
        { error: 'Failed to create tasks', details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      tasks: insertedTasks,
      count: insertedTasks?.length || 0,
    });
  } catch (error: any) {
    console.error('Goal breakdown error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

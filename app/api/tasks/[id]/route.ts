import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculateStatGain, calculateExpGain, calculateLevel, applyStatGain } from '@/lib/stats';

/**
 * PATCH /api/tasks/[id]
 * 태스크 업데이트 (상태 변경, 완료 처리)
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const body = await request.json();
    const taskId = params.id;

    // 태스크 조회
    const { data: task, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (fetchError || !task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // 완료 처리 시 스탯 증가
    if (body.status === 'completed' && task.status !== 'completed') {
      body.completed_at = new Date().toISOString();

      // 스탯 계산
      const statGain = calculateStatGain(task);
      const expGain = calculateExpGain(task);

      // 현재 스탯 조회
      const today = new Date().toISOString().split('T')[0];
      const { data: currentStats, error: statsError } = await supabase
        .from('stats')
        .select('*')
        .eq('user_id', task.user_id)
        .eq('date', today)
        .single();

      let newStats;
      if (statsError || !currentStats) {
        // 오늘 스탯이 없으면 생성
        newStats = {
          user_id: task.user_id,
          date: today,
          str: statGain.str || 0,
          int: statGain.int || 0,
          wis: statGain.wis || 0,
          cha: statGain.cha || 0,
          grt: statGain.grt || 0,
          totalExp: expGain,
          level: 1,
        };

        const levelInfo = calculateLevel(expGain);
        newStats.level = levelInfo.level;

        await supabase.from('stats').insert(newStats);
      } else {
        // 스탯 업데이트
        const updatedStats = applyStatGain(currentStats, statGain);
        updatedStats.totalExp += expGain;

        const levelInfo = calculateLevel(updatedStats.totalExp);
        updatedStats.level = levelInfo.level;

        await supabase
          .from('stats')
          .update(updatedStats)
          .eq('id', currentStats.id);

        newStats = updatedStats;
      }

      // 태스크 업데이트
      const { data: updatedTask, error: updateError } = await supabase
        .from('tasks')
        .update(body)
        .eq('id', taskId)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({
        task: updatedTask,
        statGain,
        expGain,
        newStats,
      });
    }

    // 일반 업데이트
    const { data: updatedTask, error: updateError } = await supabase
      .from('tasks')
      .update(body)
      .eq('id', taskId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ task: updatedTask });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/tasks/[id]
 * 태스크 삭제
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

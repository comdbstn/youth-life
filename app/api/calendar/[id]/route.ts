import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { CalendarMemo } from '@/types';

/**
 * PATCH /api/calendar/[id]
 * 캘린더 메모 수정
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, content, color, allDay, startTime, endTime, date } = body;

    const updates: Partial<CalendarMemo> = {};

    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (color !== undefined) updates.color = color;
    if (allDay !== undefined) updates.all_day = allDay;
    if (startTime !== undefined) updates.start_time = startTime;
    if (endTime !== undefined) updates.end_time = endTime;
    if (date !== undefined) updates.date = date;

    const { data, error } = await supabase
      .from('calendar_memos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Calendar PATCH error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/calendar/[id]
 * 캘린더 메모 삭제
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { error } = await supabase
      .from('calendar_memos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Calendar DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

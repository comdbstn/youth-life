import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { CalendarMemo } from '@/types';

/**
 * GET /api/calendar
 * 특정 월의 캘린더 메모 조회
 * Query: userId, year, month
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    let query = supabase
      .from('calendar_memos')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    // 특정 월 필터링
    if (year && month) {
      const startDate = `${year}-${month.padStart(2, '0')}-01`;
      const endDate = new Date(parseInt(year), parseInt(month), 0).toISOString().split('T')[0];
      query = query.gte('date', startDate).lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Calendar GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/calendar
 * 새 캘린더 메모 생성
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, date, title, content, color, allDay, startTime, endTime } = body;

    if (!userId || !date || !title) {
      return NextResponse.json(
        { error: 'userId, date, and title are required' },
        { status: 400 }
      );
    }

    const newMemo: Partial<CalendarMemo> = {
      user_id: userId,
      date,
      title,
      content: content || undefined,
      color: color || 'blue',
      all_day: allDay !== undefined ? allDay : true,
      start_time: startTime || undefined,
      end_time: endTime || undefined,
    };

    const { data, error } = await supabase
      .from('calendar_memos')
      .insert(newMemo)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Calendar POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

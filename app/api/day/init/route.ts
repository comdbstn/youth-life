import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getTodayTheme, getThemeRecommendations } from '@/lib/theme';

/**
 * POST /api/day/init
 * 오늘의 DayPlan 초기화 및 추천 태스크 생성
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, date } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const targetDate = date || new Date().toISOString().split('T')[0];
    const theme = getTodayTheme(new Date(targetDate));
    const recommendations = getThemeRecommendations(theme.type);

    // DayPlan 생성 또는 업데이트
    const { data: dayPlan, error } = await supabase
      .from('day_plans')
      .upsert({
        user_id: userId,
        date: targetDate,
        theme: theme.type,
        recommendations: recommendations,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating day plan:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      dayPlan,
      theme,
      recommendations,
    });
  } catch (error: any) {
    console.error('Error in /api/day/init:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

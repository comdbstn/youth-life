import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/gpt/morning
 * GPT 아침 코치 - 오늘의 핵심 태스크 추천
 */
export async function POST(request: NextRequest) {
  try {
    const { theme, goals, recentPerformance, availableTime } = await request.json();

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return NextResponse.json({
        message: '아침 코치 기능은 OpenAI API 키 설정 후 사용 가능합니다.',
        recommendations: [],
      });
    }

    const prompt = `
당신은 오행 리듬 기반 생산성 코치입니다.

## 오늘의 상황
- 테마: ${theme.emoji} ${theme.label} (${theme.description})
- 목표: ${JSON.stringify(goals)}
- 최근 7일 수행률: ${JSON.stringify(recentPerformance)}
- 가용 시간: ${availableTime}시간

## 지시사항
오늘의 테마와 목표를 고려하여:
1. 핵심 3태스크를 제안하세요 (각 90-120분 Deep Work)
2. 보조 3태스크를 제안하세요 (각 30-60분)
3. 권장 타임블록 배치를 제안하세요 (09:00-12:00, 13:00-15:00 등)

## 출력 형식 (JSON)
{
  "greeting": "간결한 인사 (1-2문장)",
  "top3": [
    {"title": "...", "durationMin": 120, "priority": 1, "tags": ["tag1", "tag2"]},
    {"title": "...", "durationMin": 90, "priority": 2, "tags": [...]},
    {"title": "...", "durationMin": 60, "priority": 3, "tags": [...]}
  ],
  "support": [
    {"title": "...", "durationMin": 45, "tags": [...]},
    ...
  ],
  "timeBlocks": [
    {"task": "핵심1", "start": "09:00", "end": "11:00"},
    ...
  ],
  "advice": "오늘 하루를 위한 조언 (1-2문장)"
}

톤: 단호하고 간결하게.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: '당신은 생산성 코치입니다.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    const coaching = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(coaching);
  } catch (error: any) {
    console.error('Error in /api/gpt/morning:', error);
    return NextResponse.json({
      message: '아침 코치 생성 중 오류가 발생했습니다.',
      error: error.message,
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/gpt/night
 * GPT 밤 코치 - 하루 요약 및 내일 우선순위
 */
export async function POST(request: NextRequest) {
  try {
    const { completedTasks, incompleteTasks, reflection, emotionalSpending } = await request.json();

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return NextResponse.json({
        praise: '오늘도 수고하셨습니다.',
        improvement: 'OpenAI API 키를 설정하면 맞춤형 피드백을 받을 수 있습니다.',
        tomorrowPriorities: [],
        summary: '오늘 하루를 마무리하세요.',
      });
    }

    const prompt = `
당신은 오행 리듬 기반 생산성 코치입니다.

## 오늘의 기록
### 완료한 태스크 (${completedTasks.length}개)
${JSON.stringify(completedTasks, null, 2)}

### 미완료 태스크 (${incompleteTasks.length}개)
${JSON.stringify(incompleteTasks, null, 2)}

### 성찰
${JSON.stringify(reflection, null, 2)}

### 감정지출
${emotionalSpending ? `발생: ${emotionalSpending.amount}원 (${emotionalSpending.note})` : '없음'}

## 지시사항
1. 오늘 가장 잘한 점 칭찬 (1줄)
2. 개선할 점 1가지 (구체적, 실행 가능)
3. 내일 우선순위 3개 (미완료 태스크 + 새로운 제안)
4. 감정지출 피드백 (있으면)
5. 한 문장 요약

## 출력 형식 (JSON)
{
  "praise": "칭찬 메시지",
  "improvement": "개선점",
  "tomorrowPriorities": ["1. ...", "2. ...", "3. ..."],
  "emotionalSpendingFeedback": "감정지출 관련 피드백 (없으면 null)",
  "summary": "오늘을 한 문장으로"
}

톤: 따뜻하지만 솔직하게.
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
        temperature: 0.8,
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
    console.error('Error in /api/gpt/night:', error);
    return NextResponse.json({
      praise: '오늘도 수고하셨습니다.',
      improvement: '내일은 더 나은 하루를 만들어보세요.',
      tomorrowPriorities: [],
      summary: '오늘 하루를 마무리하세요.',
      error: error.message,
    }, { status: 500 });
  }
}

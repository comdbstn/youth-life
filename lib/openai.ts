import OpenAI from 'openai';

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

/**
 * 아침 코치: 오늘의 태스크 추천 및 동기부여
 */
export async function getMorningCoach(params: {
  theme: string;
  goals: string[];
  yesterdayStats?: {
    completedTasks: number;
    totalTasks: number;
    stats: { str: number; int: number; wis: number; cha: number; grt: number };
  };
}) {
  const { theme, goals, yesterdayStats } = params;

  const prompt = `당신은 "Youth Life" 앱의 AI 코치입니다. 오늘은 "${theme}" 테마의 날입니다.

사용자의 목표:
${goals.map((g, i) => `${i + 1}. ${g}`).join('\n')}

${
  yesterdayStats
    ? `어제 성과: ${yesterdayStats.completedTasks}/${yesterdayStats.totalTasks} 태스크 완료, 스탯: STR ${yesterdayStats.stats.str} INT ${yesterdayStats.stats.int} WIS ${yesterdayStats.stats.wis} CHA ${yesterdayStats.stats.cha} GRT ${yesterdayStats.stats.grt}`
    : ''
}

오늘 하루를 어떻게 시작하면 좋을지 3-4문장으로 동기부여 메시지를 작성해주세요.
- 테마의 철학을 반영하세요
- 구체적이고 실행 가능한 조언을 포함하세요
- 긍정적이고 격려하는 톤을 유지하세요`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 300,
  });

  return completion.choices[0].message.content || '';
}

/**
 * 저녁 코치: 오늘의 성과 피드백
 */
export async function getEveningCoach(params: {
  theme: string;
  todayStats: {
    completedTasks: number;
    totalTasks: number;
    stats: { str: number; int: number; wis: number; cha: number; grt: number };
    totalExp: number;
  };
  reflection?: {
    mood: string;
    energy: number;
    answers: { q1: string; q2: string; q3: string; q4: string; q5: string };
  };
}) {
  const { theme, todayStats, reflection } = params;

  const prompt = `당신은 "Youth Life" 앱의 AI 코치입니다. 오늘은 "${theme}" 테마의 날이었습니다.

오늘의 성과:
- 완료한 태스크: ${todayStats.completedTasks}/${todayStats.totalTasks}
- 획득 경험치: ${todayStats.totalExp} EXP
- 스탯 상승: STR ${todayStats.stats.str} INT ${todayStats.stats.int} WIS ${todayStats.stats.wis} CHA ${todayStats.stats.cha} GRT ${todayStats.stats.grt}

${
  reflection
    ? `사용자 성찰:
- 기분: ${reflection.mood} (에너지: ${reflection.energy}/10)
- 잘한 점: ${reflection.answers.q1}
- 어려웠던 점: ${reflection.answers.q2}
- 배운 점: ${reflection.answers.q3}
- 내일 다르게 할 점: ${reflection.answers.q4}
- 감사한 점: ${reflection.answers.q5}`
    : ''
}

오늘 하루를 돌아보며 3가지를 제공해주세요:
1. **칭찬** (1-2문장): 오늘 잘한 점
2. **개선점** (1-2문장): 내일 더 나아질 수 있는 점
3. **내일 우선순위** (3가지 항목): 내일 집중해야 할 구체적인 행동

JSON 형식으로 응답:
{
  "praise": "칭찬 메시지",
  "improvement": "개선점 메시지",
  "tomorrowPriorities": ["우선순위1", "우선순위2", "우선순위3"]
}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 500,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0].message.content || '{}';
  return JSON.parse(content) as {
    praise: string;
    improvement: string;
    tomorrowPriorities: string[];
  };
}

/**
 * 목표 분해: 큰 목표를 실행 가능한 태스크로 변환
 */
export async function breakdownGoal(params: {
  goalTitle: string;
  goalDescription?: string;
  goalType: 'monthly' | 'weekly' | 'daily';
  availableThemes: string[];
}) {
  const { goalTitle, goalDescription, goalType, availableThemes } = params;

  const timeframe =
    goalType === 'monthly' ? '한 달' : goalType === 'weekly' ? '일주일' : '하루';

  const prompt = `사용자가 "${goalTitle}" 목표를 설정했습니다.
${goalDescription ? `설명: ${goalDescription}` : ''}

이 ${timeframe} 목표를 달성하기 위한 구체적이고 실행 가능한 태스크 5-7개로 분해해주세요.

사용 가능한 테마:
${availableThemes.join(', ')}

각 태스크는:
- 구체적이고 측정 가능해야 합니다
- 1-3시간 내에 완료 가능해야 합니다
- 테마 중 하나에 적합해야 합니다
- 우선순위가 명확해야 합니다

JSON 형식으로 응답:
{
  "tasks": [
    {
      "title": "태스크 제목",
      "description": "상세 설명",
      "theme": "테마명",
      "priority": 1-3 (1이 가장 높음),
      "durationMin": 60-180,
      "tags": ["태그1", "태그2"]
    }
  ]
}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
    max_tokens: 1000,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0].message.content || '{}';
  return JSON.parse(content) as {
    tasks: Array<{
      title: string;
      description: string;
      theme: string;
      priority: 1 | 2 | 3;
      durationMin: number;
      tags: string[];
    }>;
  };
}

/**
 * 성찰 요약: 사용자의 성찰 답변을 분석하고 요약
 */
export async function summarizeReflection(params: {
  mood: string;
  energy: number;
  answers: { q1: string; q2: string; q3: string; q4: string; q5: string };
}) {
  const { mood, energy, answers } = params;

  const prompt = `사용자의 하루 성찰 내용:
- 기분: ${mood} (에너지: ${energy}/10)
- 잘한 점: ${answers.q1}
- 어려웠던 점: ${answers.q2}
- 배운 점: ${answers.q3}
- 내일 다르게 할 점: ${answers.q4}
- 감사한 점: ${answers.q5}

이 성찰 내용을 2-3문장으로 핵심만 요약해주세요.
긍정적이고 통찰력 있는 톤으로 작성해주세요.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 200,
  });

  return completion.choices[0].message.content || '';
}

'use client';

import { useState } from 'react';
import type { Task } from '@/types';

// 더미 데이터
const DUMMY_TASKS: Task[] = [
  {
    id: '1',
    userId: 'user1',
    title: '수익 루프 산출물 1건 완성',
    description: 'AI 기반 콘텐츠 생성 자동화',
    tags: ['income', 'deep-work'],
    theme: 'EXECUTE',
    priority: 1,
    status: 'pending',
    plannedAt: new Date().toISOString(),
    durationMin: 120,
  },
  {
    id: '2',
    userId: 'user1',
    title: '웹앱 데이터모델 확정',
    description: 'Supabase 스키마 설계 및 마이그레이션',
    tags: ['project', 'focus'],
    theme: 'EXECUTE',
    priority: 2,
    status: 'pending',
    plannedAt: new Date().toISOString(),
    durationMin: 90,
  },
  {
    id: '3',
    userId: 'user1',
    title: '일본어 45분 학습',
    description: 'N2 문법 복습',
    tags: ['language', 'skill'],
    theme: 'EXECUTE',
    priority: 3,
    status: 'pending',
    plannedAt: new Date().toISOString(),
    durationMin: 45,
  },
];

export default function Top3Tasks() {
  const [tasks, setTasks] = useState<Task[]>(DUMMY_TASKS);

  const handleToggle = (taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === 'completed' ? 'pending' : 'completed',
              completedAt: task.status === 'completed' ? undefined : new Date().toISOString()
            }
          : task
      )
    );
  };

  const getPriorityColor = (priority: 1 | 2 | 3) => {
    switch (priority) {
      case 1:
        return 'bg-neon-pink text-white';
      case 2:
        return 'bg-cyber-blue text-dark-navy';
      case 3:
        return 'bg-neon-green text-dark-navy';
    }
  };

  return (
    <div className="card-game">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-cyber-blue">🎯 핵심 3태스크</h2>
        <button className="text-sm text-gray-400 hover:text-cyber-blue transition-colors">
          + 추가
        </button>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`
              bg-dark-bg border-2 rounded-xl p-4 transition-all duration-300
              ${task.status === 'completed'
                ? 'border-neon-green opacity-60'
                : 'border-dark-border hover:border-cyber-blue'
              }
            `}
          >
            <div className="flex items-start gap-4">
              {/* 체크박스 */}
              <button
                onClick={() => handleToggle(task.id)}
                className={`
                  mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center
                  transition-all duration-300 flex-shrink-0
                  ${task.status === 'completed'
                    ? 'bg-neon-green border-neon-green'
                    : 'border-cyber-blue hover:bg-cyber-blue/20'
                  }
                `}
              >
                {task.status === 'completed' && (
                  <svg className="w-4 h-4 text-dark-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {/* 내용 */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded ${getPriorityColor(task.priority)}`}>
                    P{task.priority}
                  </span>
                  <span className="text-gray-500 text-xs">{task.durationMin}분</span>
                </div>

                <h3 className={`text-lg font-bold mb-1 ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-white'}`}>
                  {task.title}
                </h3>

                {task.description && (
                  <p className="text-gray-400 text-sm mb-2">{task.description}</p>
                )}

                <div className="flex gap-2">
                  {task.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-dark-navy text-xs text-gray-400 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 하단: 추천 버튼 */}
      <div className="mt-6 pt-6 border-t border-dark-border">
        <button className="w-full py-3 bg-dark-bg border-2 border-cyber-blue text-cyber-blue rounded-lg hover:bg-cyber-blue hover:text-dark-navy transition-all duration-300 font-bold">
          ✨ GPT 추천 받기
        </button>
      </div>
    </div>
  );
}

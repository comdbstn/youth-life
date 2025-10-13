'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUserId } from '@/lib/simple-auth';
import { getTodayTheme } from '@/lib/theme';
import type { Task } from '@/types';

export default function Top3Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 초기 로드
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const userId = getCurrentUserId();
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .gte('planned_at', today)
        .lte('planned_at', today + 'T23:59:59')
        .order('priority', { ascending: true })
        .limit(3);

      if (error) throw error;

      setTasks(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load tasks:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
        })
        .eq('id', task.id);

      if (error) throw error;

      // 로컬 상태 업데이트
      setTasks(prev =>
        prev.map(t =>
          t.id === task.id
            ? { ...t, status: newStatus, completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined }
            : t
        )
      );

      // 완료 시 스탯 업데이트 API 호출
      if (newStatus === 'completed') {
        await fetch(`/api/tasks/${task.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'completed' }),
        });
      }
    } catch (err: any) {
      console.error('Failed to update task:', err);
      alert('태스크 업데이트 실패: ' + err.message);
    }
  };

  const handleAddTask = async () => {
    const title = prompt('태스크 제목을 입력하세요:');
    if (!title) return;

    const theme = getTodayTheme();
    const userId = getCurrentUserId();

    try {
      const newTask: Partial<Task> = {
        user_id: userId,
        title,
        theme: theme.type,
        priority: (tasks.length + 1) as 1 | 2 | 3,
        status: 'pending',
        planned_at: new Date().toISOString(),
        duration_min: 60,
        tags: [],
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert(newTask)
        .select()
        .single();

      if (error) throw error;

      setTasks(prev => [...prev, data]);
    } catch (err: any) {
      console.error('Failed to add task:', err);
      alert('태스크 추가 실패: ' + err.message);
    }
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

  if (isLoading) {
    return (
      <div className="card-game">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-blue"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-game">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">⚠️ {error}</p>
          <button
            onClick={loadTasks}
            className="px-4 py-2 bg-cyber-blue text-dark-navy rounded-lg hover:bg-cyber-blue/80 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-game">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-cyber-blue">🎯 핵심 3태스크</h2>
        <button
          onClick={handleAddTask}
          className="text-sm text-gray-400 hover:text-cyber-blue transition-colors"
        >
          + 추가
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">오늘의 태스크가 없습니다</p>
          <button
            onClick={handleAddTask}
            className="px-6 py-3 bg-cyber-blue text-dark-navy rounded-lg hover:bg-cyber-blue/80 transition-colors font-bold"
          >
            첫 태스크 추가하기
          </button>
        </div>
      ) : (
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
                  onClick={() => handleToggle(task)}
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
                    <span className="text-gray-500 text-xs">{task.durationMin || task.duration_min || 60}분</span>
                  </div>

                  <h3 className={`text-lg font-bold mb-1 ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-white'}`}>
                    {task.title}
                  </h3>

                  {task.description && (
                    <p className="text-gray-400 text-sm mb-2">{task.description}</p>
                  )}

                  {task.tags && task.tags.length > 0 && (
                    <div className="flex gap-2">
                      {task.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-dark-navy text-xs text-gray-400 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 하단: 추천 버튼 */}
      <div className="mt-6 pt-6 border-t border-dark-border">
        <button className="w-full py-3 bg-dark-bg border-2 border-cyber-blue text-cyber-blue rounded-lg hover:bg-cyber-blue hover:text-dark-navy transition-all duration-300 font-bold">
          ✨ GPT 추천 받기
        </button>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { supabase } from '@/lib/supabase';
import { getCurrentUserId } from '@/lib/simple-auth';
import { getTodayTheme } from '@/lib/theme';
import type { Task } from '@/types';

// 드래그 가능한 태스크 아이템
function SortableTask({ task, onToggle, onEdit, onDelete }: {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
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

  // 시간 표시 (planned_at 기준)
  const getTimeDisplay = () => {
    if (!task.planned_at) return '';
    const date = new Date(task.planned_at);
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-dark-bg border-2 rounded-xl p-4 transition-all duration-300
        ${task.status === 'completed'
          ? 'border-neon-green opacity-60'
          : 'border-dark-border hover:border-cyber-blue'
        }
      `}
    >
      <div className="flex items-start gap-3">
        {/* 드래그 핸들 */}
        <button
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab active:cursor-grabbing text-gray-600 hover:text-cyber-blue transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>

        {/* 체크박스 */}
        <button
          onClick={() => onToggle(task)}
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
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`px-2 py-0.5 text-xs font-bold rounded ${getPriorityColor(task.priority)}`}>
              P{task.priority}
            </span>
            {getTimeDisplay() && (
              <span className="text-xs text-gray-500">
                🕐 {getTimeDisplay()}
              </span>
            )}
            <span className="text-gray-500 text-xs">{task.duration_min || 60}분</span>
          </div>

          <h3
            onClick={() => onEdit(task)}
            className={`text-lg font-bold mb-1 cursor-pointer hover:text-cyber-blue transition-colors ${
              task.status === 'completed' ? 'line-through text-gray-500' : 'text-white'
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="text-gray-400 text-sm mb-2">{task.description}</p>
          )}

          {task.tags && task.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {task.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-dark-navy text-xs text-gray-400 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 삭제 버튼 */}
        <button
          onClick={() => onDelete(task)}
          className="mt-1 text-gray-600 hover:text-red-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// 태스크 추가/수정 모달
function TaskModal({ task, isOpen, onClose, onSave }: {
  task?: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => Promise<void>;
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration_min: 60,
    time: '', // HH:MM 형식
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (task) {
      const plannedTime = task.planned_at ? new Date(task.planned_at) : new Date();
      setFormData({
        title: task.title || '',
        description: task.description || '',
        duration_min: task.duration_min || 60,
        time: `${String(plannedTime.getHours()).padStart(2, '0')}:${String(plannedTime.getMinutes()).padStart(2, '0')}`,
        tags: task.tags || [],
      });
    } else {
      const now = new Date();
      setFormData({
        title: '',
        description: '',
        duration_min: 60,
        time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
        tags: [],
      });
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('제목을 입력하세요');
      return;
    }

    setIsSaving(true);
    try {
      // 시간 파싱
      const [hours, minutes] = formData.time.split(':').map(Number);
      const plannedDate = new Date();
      plannedDate.setHours(hours, minutes, 0, 0);

      await onSave({
        ...formData,
        planned_at: plannedDate.toISOString(),
        tags: formData.tags,
      });
      onClose();
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card border-2 border-cyber-blue rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-cyber-blue mb-6">
          {task ? '태스크 수정' : '태스크 추가'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 제목 */}
          <div>
            <label className="text-white font-bold mb-2 block">제목 *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border rounded-lg text-white focus:border-cyber-blue outline-none"
              placeholder="오늘 할 일을 입력하세요"
              autoFocus
            />
          </div>

          {/* 설명 */}
          <div>
            <label className="text-white font-bold mb-2 block">설명 (선택)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border rounded-lg text-white focus:border-cyber-blue outline-none resize-none"
              rows={3}
              placeholder="상세 내용을 입력하세요"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* 시간 */}
            <div>
              <label className="text-white font-bold mb-2 block">시작 시간</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border rounded-lg text-white focus:border-cyber-blue outline-none"
              />
            </div>

            {/* 소요 시간 */}
            <div>
              <label className="text-white font-bold mb-2 block">소요 시간</label>
              <select
                value={formData.duration_min}
                onChange={(e) => setFormData({ ...formData, duration_min: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border rounded-lg text-white focus:border-cyber-blue outline-none"
              >
                <option value={15}>15분</option>
                <option value={30}>30분</option>
                <option value={45}>45분</option>
                <option value={60}>1시간</option>
                <option value={90}>1.5시간</option>
                <option value={120}>2시간</option>
                <option value={180}>3시간</option>
              </select>
            </div>
          </div>

          {/* 태그 */}
          <div>
            <label className="text-white font-bold mb-2 block">태그</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-4 py-2 bg-dark-bg border-2 border-dark-border rounded-lg text-white focus:border-cyber-blue outline-none"
                placeholder="태그 입력 후 Enter"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-cyber-blue text-dark-navy rounded-lg hover:opacity-80 transition-opacity"
              >
                추가
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-dark-bg text-white rounded-full text-sm flex items-center gap-2"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-red-500 hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-dark-bg border-2 border-dark-border text-white rounded-lg hover:border-gray-400 transition-colors font-bold"
              disabled={isSaving}
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyber-blue to-neon-pink text-white rounded-lg hover:opacity-80 transition-opacity font-bold disabled:opacity-50"
              disabled={isSaving}
            >
              {isSaving ? '저장 중...' : task ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 메인 컴포넌트
export default function Top3Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const userId = getCurrentUserId();
      const today = new Date().toISOString().split('T')[0];

      // 날짜 범위: 오늘 00:00:00부터 내일 00:00:00 미만
      const startOfDay = today + 'T00:00:00.000Z';
      const startOfNextDay = new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000)
        .toISOString().split('T')[0] + 'T00:00:00.000Z';

      console.log('[Top3Tasks] Loading tasks for date range:', {
        today,
        startOfDay,
        startOfNextDay,
      });

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .gte('planned_at', startOfDay)
        .lt('planned_at', startOfNextDay)
        .order('planned_at', { ascending: true });

      if (error) throw error;

      console.log('[Top3Tasks] Loaded tasks:', data?.length || 0, 'tasks', data?.map(t => ({
        title: t.title,
        planned_at: t.planned_at,
      })));

      setTasks(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load tasks:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();

    // 페이지가 다시 포커스될 때 자동 새로고침
    const handleFocus = () => {
      loadTasks();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loadTasks]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex(t => t.id === active.id);
      const newIndex = tasks.findIndex(t => t.id === over.id);

      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      setTasks(newTasks);

      // 우선순위 업데이트
      try {
        for (let i = 0; i < newTasks.length; i++) {
          await supabase
            .from('tasks')
            .update({ priority: (i + 1) as 1 | 2 | 3 })
            .eq('id', newTasks[i].id);
        }
      } catch (err) {
        console.error('Failed to update priorities:', err);
        loadTasks(); // 실패 시 다시 로드
      }
    }
  };

  const handleToggle = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';

    try {
      // 먼저 API 호출 (스탯 업데이트 포함)
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update task');

      // 로컬 상태 업데이트
      setTasks(prev =>
        prev.map(t =>
          t.id === task.id
            ? { ...t, status: newStatus, completed_at: newStatus === 'completed' ? new Date().toISOString() : undefined }
            : t
        )
      );
    } catch (err: any) {
      console.error('Failed to update task:', err);
      alert('태스크 업데이트 실패: ' + err.message);
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    const userId = getCurrentUserId();
    const theme = getTodayTheme();

    try {
      if (editingTask) {
        // 수정
        const { error } = await supabase
          .from('tasks')
          .update(taskData)
          .eq('id', editingTask.id);

        if (error) throw error;

        setTasks(prev =>
          prev.map(t => (t.id === editingTask.id ? { ...t, ...taskData } : t))
        );
      } else {
        // 추가
        const newTask: Partial<Task> = {
          ...taskData,
          user_id: userId,
          theme: theme.type,
          priority: Math.min(tasks.length + 1, 3) as 1 | 2 | 3,
          status: 'pending',
        };

        const { data, error } = await supabase
          .from('tasks')
          .insert(newTask)
          .select()
          .single();

        if (error) throw error;

        setTasks(prev => [...prev, data].sort((a, b) =>
          new Date(a.planned_at).getTime() - new Date(b.planned_at).getTime()
        ));
      }
    } catch (err: any) {
      console.error('Failed to save task:', err);
      alert('태스크 저장 실패: ' + err.message);
      throw err;
    }
  };

  const handleDeleteTask = async (task: Task) => {
    if (!confirm(`"${task.title}" 태스크를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', task.id);

      if (error) throw error;

      setTasks(prev => prev.filter(t => t.id !== task.id));
    } catch (err: any) {
      console.error('Failed to delete task:', err);
      alert('태스크 삭제 실패: ' + err.message);
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
    <>
      <div className="card-game">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-cyber-blue">🎯 오늘의 태스크</h2>
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-cyber-blue text-dark-navy rounded-lg hover:opacity-80 transition-opacity font-bold text-sm"
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={tasks.map(t => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {tasks.map((task) => (
                  <SortableTask
                    key={task.id}
                    task={task}
                    onToggle={handleToggle}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* 하단: 통계 */}
        {tasks.length > 0 && (
          <div className="mt-6 pt-6 border-t border-dark-border">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">
                완료: {tasks.filter(t => t.status === 'completed').length}/{tasks.length}
              </span>
              <span className="text-gray-400">
                총 {tasks.reduce((sum, t) => sum + (t.duration_min || 60), 0)}분
              </span>
            </div>
          </div>
        )}
      </div>

      <TaskModal
        task={editingTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
      />
    </>
  );
}

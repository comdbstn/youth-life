'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUserId } from '@/lib/simple-auth';
import type { CalendarMemo } from '@/types';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [memos, setMemos] = useState<CalendarMemo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemo, setEditingMemo] = useState<CalendarMemo | null>(null);

  // 폼 상태
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('blue');
  const [allDay, setAllDay] = useState(true);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    loadMemos();
  }, [currentDate]);

  const loadMemos = async () => {
    try {
      setIsLoading(true);
      const userId = getCurrentUserId();

      const { data, error } = await supabase
        .from('calendar_memos')
        .select('*')
        .eq('user_id', userId)
        .gte('date', `${year}-${String(month + 1).padStart(2, '0')}-01`)
        .lt('date', `${year}-${String(month + 2).padStart(2, '0')}-01`)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;

      setMemos(data || []);
    } catch (err: any) {
      console.error('Failed to load memos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 월 변경
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // 캘린더 날짜 생성
  const getDaysInMonth = () => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: (Date | null)[] = [];

    // 이전 달 빈 칸
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // 현재 달 날짜
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const days = getDaysInMonth();

  // 특정 날짜의 메모 가져오기
  const getMemosForDate = (date: Date | null) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return memos.filter(m => m.date === dateStr);
  };

  // 날짜 클릭 핸들러
  const handleDateClick = (date: Date | null) => {
    if (!date) return;
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    setEditingMemo(null);
    resetForm();
    setIsModalOpen(true);
  };

  // 메모 클릭 핸들러
  const handleMemoClick = (memo: CalendarMemo, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMemo(memo);
    setSelectedDate(memo.date);
    setTitle(memo.title);
    setContent(memo.content || '');
    setColor(memo.color || 'blue');
    setAllDay(memo.all_day);
    setStartTime(memo.start_time || '09:00');
    setEndTime(memo.end_time || '10:00');
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setColor('blue');
    setAllDay(true);
    setStartTime('09:00');
    setEndTime('10:00');
  };

  // 메모 저장
  const handleSaveMemo = async () => {
    if (!title || !selectedDate) {
      alert('제목을 입력하세요');
      return;
    }

    try {
      const userId = getCurrentUserId();

      if (editingMemo) {
        // 수정
        const { data, error } = await supabase
          .from('calendar_memos')
          .update({
            title,
            content: content || undefined,
            color,
            all_day: allDay,
            start_time: allDay ? undefined : startTime,
            end_time: allDay ? undefined : endTime,
          })
          .eq('id', editingMemo.id)
          .select()
          .single();

        if (error) throw error;

        setMemos(prev =>
          prev.map(m => (m.id === editingMemo.id ? data : m))
        );
      } else {
        // 새로 추가
        const newMemo: Partial<CalendarMemo> = {
          user_id: userId,
          date: selectedDate,
          title,
          content: content || undefined,
          color,
          all_day: allDay,
          start_time: allDay ? undefined : startTime,
          end_time: allDay ? undefined : endTime,
        };

        const { data, error } = await supabase
          .from('calendar_memos')
          .insert(newMemo)
          .select()
          .single();

        if (error) throw error;

        setMemos(prev => [...prev, data]);
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      console.error('Failed to save memo:', err);
      alert('저장 실패: ' + err.message);
    }
  };

  // 메모 삭제
  const handleDeleteMemo = async () => {
    if (!editingMemo) return;

    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('calendar_memos')
        .delete()
        .eq('id', editingMemo.id);

      if (error) throw error;

      setMemos(prev => prev.filter(m => m.id !== editingMemo.id));
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      console.error('Failed to delete memo:', err);
      alert('삭제 실패: ' + err.message);
    }
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const colorClasses: Record<string, string> = {
    blue: 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue',
    green: 'bg-neon-green/20 text-neon-green border-neon-green',
    red: 'bg-red-500/20 text-red-500 border-red-500',
    yellow: 'bg-yellow-500/20 text-yellow-500 border-yellow-500',
    purple: 'bg-purple-500/20 text-purple-500 border-purple-500',
    pink: 'bg-neon-pink/20 text-neon-pink border-neon-pink',
    gray: 'bg-gray-500/20 text-gray-400 border-gray-500',
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="card-game">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-cyber-blue">📅 캘린더</h1>
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-dark-bg border border-cyber-blue text-cyber-blue rounded-lg hover:bg-cyber-blue hover:text-dark-navy transition-colors text-sm font-bold"
          >
            오늘
          </button>
        </div>

        {/* 월 네비게이션 */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToPreviousMonth}
            className="px-4 py-2 bg-dark-bg text-gray-400 rounded-lg hover:text-white transition-colors"
          >
            ◀
          </button>
          <h2 className="text-2xl font-bold text-white">
            {year}년 {month + 1}월
          </h2>
          <button
            onClick={goToNextMonth}
            className="px-4 py-2 bg-dark-bg text-gray-400 rounded-lg hover:text-white transition-colors"
          >
            ▶
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
            <div
              key={day}
              className={`text-center text-sm font-bold py-2 ${
                i === 0 ? 'text-red-500' : i === 6 ? 'text-cyber-blue' : 'text-gray-400'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 캘린더 그리드 */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-blue"></div>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {days.map((date, idx) => {
              const dayMemos = getMemosForDate(date);
              const isTodayDate = isToday(date);

              return (
                <div
                  key={idx}
                  onClick={() => handleDateClick(date)}
                  className={`
                    min-h-[120px] p-2 rounded-lg border-2 cursor-pointer transition-all
                    ${
                      date
                        ? 'bg-dark-bg border-dark-border hover:border-cyber-blue'
                        : 'bg-transparent border-transparent cursor-default'
                    }
                    ${isTodayDate ? 'border-neon-pink' : ''}
                  `}
                >
                  {date && (
                    <>
                      <div
                        className={`text-sm font-bold mb-1 ${
                          isTodayDate
                            ? 'text-neon-pink'
                            : idx % 7 === 0
                            ? 'text-red-500'
                            : idx % 7 === 6
                            ? 'text-cyber-blue'
                            : 'text-white'
                        }`}
                      >
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayMemos.slice(0, 3).map(memo => (
                          <div
                            key={memo.id}
                            onClick={(e) => handleMemoClick(memo, e)}
                            className={`text-xs px-2 py-1 rounded border truncate ${
                              colorClasses[memo.color || 'blue']
                            }`}
                          >
                            {!memo.all_day && memo.start_time && (
                              <span className="mr-1">{memo.start_time}</span>
                            )}
                            {memo.title}
                          </div>
                        ))}
                        {dayMemos.length > 3 && (
                          <div className="text-xs text-gray-500 px-2">
                            +{dayMemos.length - 3} 더보기
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 메모 추가/수정 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="card-game max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-cyber-blue mb-4">
              {editingMemo ? '일정 수정' : '새 일정'}
            </h2>

            {/* 날짜 */}
            <div className="mb-4">
              <label className="text-sm text-gray-400 mb-1 block">날짜</label>
              <div className="text-white font-bold">{selectedDate}</div>
            </div>

            {/* 제목 */}
            <div className="mb-4">
              <label className="text-sm text-gray-400 mb-1 block">제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="일정 제목"
                className="w-full px-4 py-2 bg-dark-card border-2 border-dark-border rounded-lg text-white focus:border-cyber-blue outline-none"
              />
            </div>

            {/* 내용 */}
            <div className="mb-4">
              <label className="text-sm text-gray-400 mb-1 block">내용 (선택)</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="일정 내용"
                rows={3}
                className="w-full px-4 py-2 bg-dark-card border-2 border-dark-border rounded-lg text-white focus:border-cyber-blue outline-none resize-none"
              />
            </div>

            {/* 색상 */}
            <div className="mb-4">
              <label className="text-sm text-gray-400 mb-2 block">색상</label>
              <div className="flex gap-2 flex-wrap">
                {Object.keys(colorClasses).map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      color === c ? 'border-white' : 'border-transparent'
                    } ${colorClasses[c]}`}
                  />
                ))}
              </div>
            </div>

            {/* 종일 여부 */}
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allDay}
                  onChange={(e) => setAllDay(e.target.checked)}
                  className="w-5 h-5"
                />
                <span className="text-white">종일</span>
              </label>
            </div>

            {/* 시간 */}
            {!allDay && (
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">시작</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-2 bg-dark-card border-2 border-dark-border rounded-lg text-white focus:border-cyber-blue outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">종료</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-2 bg-dark-card border-2 border-dark-border rounded-lg text-white focus:border-cyber-blue outline-none"
                  />
                </div>
              </div>
            )}

            {/* 버튼 */}
            <div className="flex gap-2">
              <button
                onClick={handleSaveMemo}
                className="flex-1 py-3 bg-cyber-blue text-dark-navy font-bold rounded-lg hover:opacity-80 transition-opacity"
              >
                {editingMemo ? '수정' : '추가'}
              </button>
              {editingMemo && (
                <button
                  onClick={handleDeleteMemo}
                  className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:opacity-80 transition-opacity"
                >
                  삭제
                </button>
              )}
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="px-6 py-3 bg-dark-bg border border-dark-border text-gray-400 font-bold rounded-lg hover:text-white transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { getCurrentUserId } from '@/lib/simple-auth';
import { YUKINO_GREETING } from '@/lib/yukino-persona';

interface Message {
  role: 'user' | 'yukino';
  content: string;
  timestamp: string;
}

interface ChatContext {
  tasksTotal: number;
  tasksCompleted: number;
  goalsActive: number;
  savingsRate: number;
}

export default function YukinoPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'yukino',
      content: YUKINO_GREETING,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState<ChatContext | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const userId = getCurrentUserId();
      const response = await fetch('/api/yukino/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Yukino');
      }

      const data = await response.json();

      const yukinoMessage: Message = {
        role: 'yukino',
        content: data.message,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, yukinoMessage]);
      setContext(data.context);
    } catch (err: any) {
      console.error('Failed to chat with Yukino:', err);
      const errorMessage: Message = {
        role: 'yukino',
        content: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    '오늘 해야 할 일 요약해줘',
    '이번 주 재정 상태 분석해줘',
    '목표 달성률 보고서 만들어줘',
    '루틴이 깨진 원인 분석해줘',
    '다음 달 목표 제안해줘',
    '일본 정착 준비 상황 점검해줘',
  ];

  return (
    <main className="h-screen flex flex-col bg-dark-navy">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-dark-bg via-dark-card to-dark-bg border-b-2 border-dark-border p-6">
        <div className="container mx-auto max-w-4xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* 유키노 아바타 */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyber-blue to-neon-pink flex items-center justify-center text-3xl">
              ❄️
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">유키노시타 유키노</h1>
              <p className="text-sm text-gray-400">개인 비서 겸 전략 파트너</p>
            </div>
          </div>

          {/* 실시간 컨텍스트 */}
          {context && (
            <div className="hidden md:flex gap-4 text-xs">
              <div className="text-center">
                <p className="text-gray-500">태스크</p>
                <p className="text-cyber-blue font-bold">
                  {context.tasksCompleted}/{context.tasksTotal}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-500">목표</p>
                <p className="text-neon-green font-bold">{context.goalsActive}개</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500">저축률</p>
                <p className="text-neon-pink font-bold">{context.savingsRate}%</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-4xl p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] ${
                  msg.role === 'user'
                    ? 'bg-cyber-blue text-dark-navy'
                    : 'bg-dark-card border-2 border-dark-border text-white'
                } rounded-2xl p-4`}
              >
                {msg.role === 'yukino' && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-dark-border">
                    <span className="text-lg">❄️</span>
                    <span className="text-sm font-bold text-cyber-blue">유키노시타 유키노</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                <p
                  className={`text-xs mt-2 ${
                    msg.role === 'user' ? 'text-dark-navy/60' : 'text-gray-500'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] bg-dark-card border-2 border-dark-border rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-dark-border">
                  <span className="text-lg">❄️</span>
                  <span className="text-sm font-bold text-cyber-blue">유키노시타 유키노</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyber-blue rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-cyber-blue rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-cyber-blue rounded-full animate-pulse delay-200"></div>
                  <span className="text-gray-400 text-sm ml-2">분석 중...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 빠른 액션 */}
      {messages.length === 1 && (
        <div className="container mx-auto max-w-4xl px-6 pb-4">
          <p className="text-xs text-gray-500 mb-2">빠른 질문:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => setInput(action)}
                className="text-xs bg-dark-card border border-dark-border text-gray-400 rounded-lg px-3 py-2 hover:border-cyber-blue hover:text-cyber-blue transition-all text-left"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 입력 영역 */}
      <div className="bg-dark-bg border-t-2 border-dark-border p-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="유키노에게 무엇이든 물어보세요..."
              className="flex-1 px-4 py-3 bg-dark-card border-2 border-dark-border rounded-lg text-white placeholder-gray-500 focus:border-cyber-blue outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-gradient-to-r from-cyber-blue to-neon-pink text-white font-bold rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              전송
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <p>
              💡 Shift + Enter로 줄바꿈, Enter로 전송
            </p>
            <p>
              모든 데이터에 접근 가능 | GPT-4o 기반
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

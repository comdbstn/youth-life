'use client';

import { useState, useEffect, useRef } from 'react';
import { getCurrentUserId } from '@/lib/simple-auth';
import { YUKINO_GREETING } from '@/lib/yukino-persona';

interface Message {
  role: 'user' | 'yukino';
  content: string;
  timestamp: string;
  metadata?: any;
}

export default function YukinoPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasLoadedRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 대화 내역 로드
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const userId = getCurrentUserId();
      const response = await fetch(`/api/yukino/chat-v2?userId=${userId}`);

      const data = await response.json();

      // 데이터베이스 테이블이 없는 경우
      if (response.status === 503 && data.error === 'Yukino database tables not created') {
        setMessages([{
          role: 'yukino',
          content: `⚠️ **데이터베이스 설정 필요**

안녕하세요, 윤수님. 유키노예요.

저와 대화하려면 먼저 Supabase에서 데이터베이스 테이블을 생성해야 해요.

**설정 방법:**
1. GitHub 저장소의 \`docs/YUKINO_SETUP.md\` 파일 확인
2. Supabase SQL Editor에서 마이그레이션 SQL 실행
3. 페이지 새로고침

SQL 파일 위치: \`${data.sqlFile}\`

설정이 완료되면 저와 대화하실 수 있어요. 기다리고 있을게요. 💕`,
          timestamp: new Date().toISOString(),
        }]);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load conversations');
      }

      if (data.conversations && data.conversations.length > 0) {
        const loadedMessages: Message[] = data.conversations.map((conv: any) => ({
          role: conv.role,
          content: conv.content,
          timestamp: conv.created_at,
          metadata: conv.metadata,
        }));
        setMessages(loadedMessages);
      } else {
        // 대화 내역이 없으면 인사말 표시
        setMessages([{
          role: 'yukino',
          content: YUKINO_GREETING,
          timestamp: new Date().toISOString(),
        }]);
      }
    } catch (err: any) {
      console.error('Failed to load conversations:', err);
      // 에러 시 에러 메시지 표시
      setMessages([{
        role: 'yukino',
        content: `❌ **오류 발생**

${err.message}

GitHub 저장소의 \`docs/YUKINO_SETUP.md\` 파일을 확인해주세요.`,
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    // 낙관적 업데이트: 즉시 메시지 표시
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      const userId = getCurrentUserId();
      const response = await fetch('/api/yukino/chat-v2', {
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

      // 데이터베이스 테이블이 없는 경우
      if (response.status === 503 && data.error === 'Yukino database tables not created') {
        const errorMessage: Message = {
          role: 'yukino',
          content: `⚠️ **데이터베이스 설정 필요**

${data.message}

**설정 방법:**
1. GitHub 저장소의 \`docs/YUKINO_SETUP.md\` 파일 확인
2. Supabase SQL Editor에서 마이그레이션 SQL 실행
3. 페이지 새로고침

SQL 파일 위치: \`${data.sqlFile}\``,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to get response from Yukino');
      }

      const yukinoMessage: Message = {
        role: 'yukino',
        content: data.message,
        timestamp: new Date().toISOString(),
        metadata: data.functionCalls,
      };

      setMessages(prev => [...prev, yukinoMessage]);

      // Function call이 있었다면 알림
      if (data.functionCalls && data.functionCalls.length > 0) {
        console.log('[Yukino] 실행된 기능:', data.functionCalls);
      }
    } catch (err: any) {
      console.error('Failed to chat with Yukino:', err);
      const errorMessage: Message = {
        role: 'yukino',
        content: `❌ **오류 발생**

${err.message}

Supabase 데이터베이스 설정을 확인해주세요.
자세한 내용: \`docs/YUKINO_SETUP.md\``,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
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
              <h1 className="text-2xl font-bold text-white">유키노</h1>
              <p className="text-sm text-gray-400">개인 비서 겸 전략 파트너</p>
            </div>
          </div>

          {/* 상태 표시 */}
          <div className="hidden md:flex gap-4 text-xs items-center">
            {isLoading ? (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-cyber-blue"></div>
                <span>대화 불러오는 중...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-neon-green">
                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                <span>준비 완료</span>
              </div>
            )}
          </div>
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
                    <span className="text-sm font-bold text-cyber-blue">유키노</span>
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

          {isSending && (
            <div className="flex justify-start">
              <div className="max-w-[80%] bg-dark-card border-2 border-dark-border rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-dark-border">
                  <span className="text-lg">❄️</span>
                  <span className="text-sm font-bold text-cyber-blue">유키노</span>
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

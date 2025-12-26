/**
 * 聊天数据管理器
 * 解决@assistant-ui组件数据流不透明的问题
 * 提供清晰的数据流向控制，便于后期维护
 */

import { useRef, useCallback } from 'react';
import { ThreadMessageLike } from '@assistant-ui/react';
import { AiChatMessage } from './types';

export interface ChatDataManager {
  // 获取当前会话消息
  getCurrentMessages: (sessionId: string) => ThreadMessageLike[];
  // 格式化消息为assistant-ui格式
  formatMessages: (messages: AiChatMessage[]) => ThreadMessageLike[];
  // 同步消息到runtime
  syncToRuntime: (messages: ThreadMessageLike[], runtime: any) => void;
  // 清空消息
  clearMessages: (runtime: any) => void;
  // 处理消息发送
  handleSendMessage: (messages: any[], sessionId: string) => Promise<Response>;
  // 调试日志
  debug: (message: string, data?: any) => void;
}

export const useChatDataManager = (sessionMessages?: Record<string, AiChatMessage[]>): ChatDataManager => {
  const debug = useCallback((message: string, data?: any) => {
    console.log(`🔧 [ChatDataManager] ${message}`, data || '');
  }, []);

  const formatMessages = useCallback((messages: AiChatMessage[]): ThreadMessageLike[] => {
    debug('开始格式化消息', { 原始消息数量: messages.length });
    
    const formatted = messages.map(msg => ({
      id: msg.id,
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content || '',
      metadata: {
        custom: {
          rendererType: msg.type,
          aiChatMessage: msg,
        },
      },
    }));
    
    debug('消息格式化完成', { 格式化后消息数量: formatted.length });
    return formatted;
  }, [debug]);

  const getCurrentMessages = useCallback((sessionId: string): ThreadMessageLike[] => {
    debug('获取会话消息', { sessionId });
    
    const sessionMessagesForId = sessionMessages?.[sessionId] || [];
    debug('查询到的原始消息', { 消息数量: sessionMessagesForId.length, 数据: sessionMessagesForId });
    
    const formatted = formatMessages(sessionMessagesForId);
    debug('最终格式化消息', { 消息数量: formatted.length });
    
    return formatted;
  }, [formatMessages, debug, sessionMessages]);

  const syncToRuntime = useCallback((messages: ThreadMessageLike[], runtime: any) => {
    if (!runtime || !runtime.thread) {
      debug('❌ runtime无效，无法同步消息');
      return;
    }
    
    debug('开始同步消息到runtime', { 消息数量: messages.length });
    
    try {
      runtime.thread.reset(messages);
      debug('✅ 消息同步成功', { 消息数量: messages.length });
    } catch (error) {
      debug('❌ 消息同步失败', error);
    }
  }, [debug]);

  const clearMessages = useCallback((runtime: any) => {
    debug('清空消息');
    syncToRuntime([], runtime);
  }, [syncToRuntime, debug]);

  const handleSendMessage = useCallback(async (messages: any[], sessionId: string): Promise<Response> => {
    debug('处理消息发送', { 消息数量: messages.length, sessionId });
    
    // 如果有消息，返回mock回复
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const replyContent = `收到: ${lastMessage?.content || '消息'}`;
      
      debug('生成回复', { 原消息: lastMessage, 回复内容: replyContent });
      
      return new Response(JSON.stringify({
        content: replyContent
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 如果没有消息，返回空响应
    return new Response(JSON.stringify({ content: '' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }, [debug]);

  return {
    getCurrentMessages,
    formatMessages,
    syncToRuntime,
    clearMessages,
    handleSendMessage,
    debug
  };
};

import type { ChatWidgetMessage, ChatWidgetSession } from "@/components/assistant-ui/chat-widget";
import {
  mockChatMessagesBySessionId,
  mockChatSessions,
} from "@/lib/mock-data/chat-sessions";

export type ChatStreamHandler = (delta: string) => void;

export type ChatService = {
  listSessions: () => Promise<ChatWidgetSession[]>;
  createSession: () => Promise<ChatWidgetSession>;
  getSessionHistory: (sessionId: string) => Promise<ChatWidgetMessage[]>;
  streamAssistantReply: (
    sessionId: string,
    onDelta: ChatStreamHandler,
  ) => Promise<void>;
};

type CreateMockChatServiceOptions = {
  sessions?: ChatWidgetSession[];
  sessionMessages?: Record<string, ChatWidgetMessage[]>;
};

const mockStream = [
  "已收到请求，正在整理分析。",
  " 正在汇总关键要点。",
  " 已生成初步结论，等待补充细节。",
];

const delay = (time: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, time);
  });

export const createMockChatService = (
  options: CreateMockChatServiceOptions = {},
): ChatService => {
  const sessions = options.sessions ?? mockChatSessions;
  const sessionMessages = options.sessionMessages ?? mockChatMessagesBySessionId;

  return {
    async listSessions() {
      // TODO: 接入真实接口时替换为请求方法
      // const response = await fetch("/api/chat/sessions");
      // return (await response.json()) as ChatWidgetSession[];
      return sessions;
    },
    async createSession() {
      // TODO: 接入真实接口时替换为请求方法
      // const response = await fetch("/api/chat/sessions", { method: "POST" });
      // return (await response.json()) as ChatWidgetSession;
      return {
        id: `session-${Date.now()}`,
        title: "新建会话",
        timeLabel: "刚刚",
        group: "今天",
      };
    },
    async getSessionHistory(sessionId: string) {
      // TODO: 接入真实接口时替换为请求方法
      // const response = await fetch(`/api/chat/sessions/${sessionId}`);
      // return (await response.json()) as ChatWidgetMessage[];
      return sessionMessages[sessionId] ?? [];
    },
    async streamAssistantReply(_sessionId, onDelta) {
      // TODO: 接入真实接口时替换为请求方法
      // const response = await fetch("/api/chat/stream", { method: "POST" });
      // const reader = response.body?.getReader();
      // while (reader) { ...解析 SSE/流式响应并调用 onDelta(...) }
      for (const chunk of mockStream) {
        await delay(500);
        onDelta(chunk);
      }
    },
  };
};

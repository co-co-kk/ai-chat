import type { AiChatFile, AiChatMessage } from "@/components/ai-chat/ai-chat";
import { mockFiles } from "@/app/mockData/chat-files";
import {
  type ChatSession,
  mockChatSessions,
} from "@/app/mockData/chat-sessions";
import { mockSessionMessages } from "@/app/mockData/chat-messages";

const sleep = (min = 500, max = 1000) =>
  new Promise((resolve) => {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    setTimeout(resolve, delay);
  });

let sessionsStore = [...mockChatSessions];
let messagesStore = { ...mockSessionMessages } as Record<
  string,
  AiChatMessage[]
>;
let filesStore = [...mockFiles];

export const chatService = {
  async listSessions() {
    await sleep();
    return [...sessionsStore];
  },
  async getSessionHistory(sessionId: string) {
    await sleep();
    return messagesStore[sessionId] ? [...messagesStore[sessionId]] : [];
  },
  async createSession() {
    await sleep();
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: "新会话",
      group: "今天",
      timeLabel: new Date().toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    sessionsStore = [newSession, ...sessionsStore];
    messagesStore = {
      ...messagesStore,
      [newSession.id]: [
        {
          id: `welcome-${newSession.id}`,
          role: "assistant",
          type: "text",
          content: "你好，我是XXX，有什么可以帮助你的吗？",
        },
      ],
    };
    return newSession;
  },
  async sendMessage(sessionId: string, input: string, attachments: AiChatFile[]) {
    await sleep();
    const newMessage: AiChatMessage = {
      id: `msg-${Date.now()}`,
      role: "assistant",
      type: "text",
      content: `收到你的问题：${input || "（无文本）"}`,
      files: attachments.length ? attachments : undefined,
      createdAt: new Date().toISOString(),
    };
    const existing = messagesStore[sessionId] ?? [];
    messagesStore = {
      ...messagesStore,
      [sessionId]: [...existing, newMessage],
    };
    return newMessage;
  },
  async uploadFiles(files: AiChatFile[]) {
    await sleep();
    filesStore = files.map((file) => ({
      ...file,
      status: "success",
      progress: 100,
    }));
    return [...filesStore];
  },
  async cancelUpload(fileId: string) {
    await sleep();
    filesStore = filesStore.filter((file) => file.id !== fileId);
    return [...filesStore];
  },
};

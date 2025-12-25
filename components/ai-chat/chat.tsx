"use client";

import { createContext, useContext, useId, useMemo } from "react";
import type { ReactNode } from "react";

export type AiChatLayoutMode = "standard" | "wide";
export type AiChatMessageRole = "assistant" | "user" | "system";
export type AiChatFileStatus = "idle" | "uploading" | "success" | "error";
export type AiChatFileKind = "image" | "pdf" | "doc" | "archive" | "other";

export type AiChatFile = {
  id: string;
  name: string;
  size: number;
  status?: AiChatFileStatus;
  progress?: number;
  kind?: AiChatFileKind;
  url?: string;
  errorMessage?: string;
};

export type AiChatMessage = {
  id: string;
  role: AiChatMessageRole;
  type?: string;
  content?: string;
  files?: AiChatFile[];
  meta?: Record<string, unknown>;
  createdAt?: string;
  children?: AiChatMessage[];
};

export type AiChatSession = {
  id: string;
  title: string;
  group: string;
  timeLabel: string;
};

export type AiChatState = {
  input: string;
  currentInput: string;
  messages: AiChatMessage[];
  attachments: AiChatFile[];
  isSending: boolean;
  setInput: (value: string | ((prev: string) => string)) => void;
  setAttachments: (value: AiChatFile[] | ((prev: AiChatFile[]) => AiChatFile[])) => void;
  appendMessage: (message: AiChatMessage) => void;
  clearMessages: () => void;
  sendMessage: (payload?: {
    text?: string;
    files?: AiChatFile[];
    role?: AiChatMessageRole;
    type?: string;
  }) => Promise<void>;
  openCustomDrawer: (drawerId: string) => void;
  closeCustomDrawer: (drawerId: string) => void;
  toggleCustomDrawer: (drawerId: string) => void;
};

export type AiChatHandle = {
  sendMessage: AiChatState["sendMessage"];
  appendMessage: AiChatState["appendMessage"];
  clearMessages: AiChatState["clearMessages"];
};

export type ChatContextValue = {
  state: AiChatState;
  mode: AiChatLayoutMode;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessions: AiChatSession[];
  onSessionsChange: (sessions: AiChatSession[]) => void;
  sessionMessages: Record<string, AiChatMessage[]>;
  initialSessionId?: string;
  onSessionChange: (sessionId: string) => void;
  onSessionCreate: (session: AiChatSession) => void;
  onSendMessage: (payload: {
    text: string;
    attachments: AiChatFile[];
    message: AiChatMessage;
  }) => void | Promise<void>;
  onInputChange: (value: string) => void;
  onAttachmentsSelect: (
    files: File[],
  ) => void | AiChatFile[] | Promise<AiChatFile[]>;
  onCancelUpload: (file: AiChatFile) => void;
  placeholder: string;
  disabled: boolean;
  customRenderers: Record<string, (message: AiChatMessage, state: AiChatState) => ReactNode>;
  customDrawers: Array<{
    id: string;
    title: string;
    content: ReactNode;
  }>;
  onDrawerToggle: (drawerId: string, open: boolean) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a Chat component");
  }
  return context;
};

export type ChatProps = {
  children: ReactNode;
  className?: string;
  title?: string;
  mode?: AiChatLayoutMode;
  onModeChange?: (mode: AiChatLayoutMode) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  sessions?: AiChatSession[];
  defaultSessions?: AiChatSession[];
  onSessionsChange?: (sessions: AiChatSession[]) => void;
  sessionMessages?: Record<string, AiChatMessage[]>;
  initialSessionId?: string;
  onSessionChange?: (sessionId: string) => void;
  onSessionCreate?: (session: AiChatSession) => void;
  messages?: AiChatMessage[];
  defaultMessages?: AiChatMessage[];
  onMessagesChange?: (messages: AiChatMessage[]) => void;
  attachments?: AiChatFile[];
  defaultAttachments?: AiChatFile[];
  onAttachmentsChange?: (files: AiChatFile[]) => void;
  onSendMessage?: (payload: {
    text: string;
    attachments: AiChatFile[];
    message: AiChatMessage;
  }) => void | Promise<void>;
  onInputChange?: (value: string) => void;
  onAttachmentsSelect?: (
    files: File[],
  ) => void | AiChatFile[] | Promise<AiChatFile[]>;
  onCancelUpload?: (file: AiChatFile) => void;
  placeholder?: string;
  disabled?: boolean;
  customRenderers?: Record<string, (message: AiChatMessage, state: AiChatState) => ReactNode>;
  customDrawers?: Array<{
    id: string;
    title: string;
    content: ReactNode;
  }>;
  onDrawerToggle?: (drawerId: string, open: boolean) => void;
};

export const Chat = ({
  children,
  className,
  title = "标题文案",
  mode = "standard",
  onModeChange,
  open = true,
  onOpenChange,
  sessions = [],
  defaultSessions = [],
  onSessionsChange,
  sessionMessages = {},
  initialSessionId,
  onSessionChange,
  onSessionCreate,
  messages,
  defaultMessages = [],
  onMessagesChange,
  attachments,
  defaultAttachments = [],
  onAttachmentsChange,
  onSendMessage,
  onInputChange,
  onAttachmentsSelect,
  onCancelUpload,
  placeholder = "我有什么可以帮您的吗？",
  disabled = false,
  customRenderers = {},
  customDrawers = [],
  onDrawerToggle,
}: ChatProps) => {
  const id = useId();
  
  // 这里会在实际的 Chat 组件中处理状态管理
  // 现在先创建一个基本的 context 结构
  
  return (
    <ChatContext.Provider
      value={{
        state: {} as AiChatState, // 临时，实际实现时会填充
        mode,
        title,
        open,
        onOpenChange: onOpenChange || (() => {}),
        sessions,
        onSessionsChange: onSessionsChange || (() => {}),
        sessionMessages,
        initialSessionId,
        onSessionChange: onSessionChange || (() => {}),
        onSessionCreate: onSessionCreate || (() => {}),
        onSendMessage: onSendMessage || (() => {}),
        onInputChange: onInputChange || (() => {}),
        onAttachmentsSelect: onAttachmentsSelect || (() => {}),
        onCancelUpload: onCancelUpload || (() => {}),
        placeholder,
        disabled,
        customRenderers,
        customDrawers,
        onDrawerToggle: onDrawerToggle || (() => {}),
      }}
    >
      <div className={className} data-chat-id={id}>
        {children}
      </div>
    </ChatContext.Provider>
  );
};

Chat.displayName = "Chat";
import type { ComponentType } from "react";
// 🎯 AiChat 核心类型定义
// 本文件集中管理所有 AiChat 组件相关的类型定义

// 基础枚举类型
export type AiChatLayoutMode = "standard" | "wide";
export type AiChatMessageRole = "assistant" | "user" | "system";
export type AiChatFileStatus = "idle" | "uploading" | "success" | "error";
export type AiChatFileKind = "image" | "pdf" | "doc" | "archive" | "other";

// 文件类型定义
export interface AiChatFile {
  id: string;
  name: string;
  size: number;
  status?: AiChatFileStatus;
  progress?: number;
  kind?: AiChatFileKind;
  url?: string;
  errorMessage?: string;
}

// 消息类型定义
export interface AiChatMessage {
  id: string;
  role: AiChatMessageRole;
  type?: string;
  content?: string;
  files?: AiChatFile[];
  meta?: Record<string, unknown>;
  createdAt?: string;
  children?: AiChatMessage[];
}

// 会话类型定义
export interface AiChatSession {
  id: string;
  title: string;
  group: string;
  timeLabel: string;
}

// 组件状态类型
export interface AiChatState {
  input: string;
  currentInput: string;
  messages: AiChatMessage[];
  attachments: AiChatFile[];
  isSending: boolean;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  setAttachments: React.Dispatch<React.SetStateAction<AiChatFile[]>>;
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
}

// 组件句柄类型（用于ref）
export interface AiChatHandle {
  sendMessage: AiChatState["sendMessage"];
  appendMessage: AiChatState["appendMessage"];
  clearMessages: AiChatState["clearMessages"];
}

// 自定义抽屉类型
export interface AiChatCustomDrawer {
  id: string;
  title: string;
  content: React.ReactNode;
}

// 自定义渲染器类型
export type AiChatCustomRenderer = (
  message: AiChatMessage,
  state: AiChatState
) => React.ReactNode;

// 组件属性类型
export interface AiChatProps {
  className?: string;
  title?: string;
  mode?: AiChatLayoutMode;
  onModeChange?: (mode: AiChatLayoutMode) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  sidePanel?: React.ReactNode;
  sidePanelClassName?: string;
  headerExtra?: (state: AiChatState) => React.ReactNode;
  showDefaultHeaderActions?: boolean;
  inputLeftSlot?: (state: AiChatState) => React.ReactNode;
  inputRightSlot?: (state: AiChatState) => React.ReactNode;
  composerFooterSlot?: (state: AiChatState) => React.ReactNode;
  customRenderers?: Record<string, AiChatCustomRenderer>;
  messages?: AiChatMessage[];
  defaultMessages?: AiChatMessage[];
  onMessagesChange?: (messages: AiChatMessage[]) => void;
  attachments?: AiChatFile[];
  defaultAttachments?: AiChatFile[];
  onAttachmentsChange?: (files: AiChatFile[]) => void;
  sessions?: AiChatSession[];
  defaultSessions?: AiChatSession[];
  onSessionsChange?: (sessions: AiChatSession[]) => void;
  sessionMessages?: Record<string, AiChatMessage[]>;
  initialSessionId?: string;
  onSessionChange?: (sessionId: string) => void;
  onSessionCreate?: (session: AiChatSession) => void;
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
  customDrawers?: AiChatCustomDrawer[];
  onDrawerToggle?: (drawerId: string, open: boolean) => void;
  // ✅ 新增：接收外部定义的工具列表
  tools?: AiChatTool[]; 
  // ✅ 新增：UI 插槽
  renderHeaderActions?: (state: AiChatState) => React.ReactNode;
  renderComposerActions?: (state: AiChatState) => React.ReactNode;
}



// 定义一个标准工具配置接口
export type AiChatTool<TArgs = any> = {
  toolName: string;           // 对应 JSON 中的 meta.toolName (如 "plan")
  component: ComponentType<TArgs>; // 对应的 React 组件
  dataTransformer?: (args: any) => TArgs; // 可选：数据清洗函数
};
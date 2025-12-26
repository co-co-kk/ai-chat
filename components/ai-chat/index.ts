// 🎯 AiChat 组件统一导出
// 提供简洁的导入接口，隐藏内部模块结构

// 主组件
export { AiChat } from "./ai-chat-refactored";

// 类型定义
export type {
  AiChatLayoutMode,
  AiChatMessageRole,
  AiChatFileStatus,
  AiChatFileKind,
  AiChatFile,
  AiChatMessage,
  AiChatSession,
  AiChatState,
  AiChatHandle,
  AiChatCustomDrawer,
  AiChatCustomRenderer,
  AiChatProps,
} from "./types";

// 子组件
export { AttachmentCard } from "./components/AttachmentCard";
export { FileIcon } from "./components/FileIcon";
export { ChatHeader } from "./components/ChatHeader";

// 工具函数
export { createId, formatSize, resolveFileKind, flattenMessages } from "./utils";

// Hook
export { useControllableState } from "./hooks/useControllableState";
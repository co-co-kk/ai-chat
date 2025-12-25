"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import {
  AssistantRuntimeProvider,
  type ThreadMessageLike,
  useAssistantApi,
  useAssistantState,
} from "@assistant-ui/react";
import { AssistantChatTransport, useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import {
  ResourceSummaryToolCard,
  WorkflowToolCard,
} from "@/components/assistant-ui/tool-call-cards";
import { cn } from "@/lib/utils";
import {
  FileArchive,
  FileImage,
  FileText,
  ArrowUp,
  History,
  Paperclip,
  Pin,
  Plus,
  CircleX,
  TriangleAlert,
  Maximize,
  Minimize,
} from "lucide-react";

// 导入所有子组件
import {
  ChatHeader,
  ChatHeaderTitle,
  ChatHeaderActions,
  ChatHeaderAction,
} from "./chat-header";
import {
  ChatMessages,
  ChatMessage,
  ChatEmpty,
} from "./chat-messages";
import {
  ChatInput,
  ChatInputField,
  ChatInputLeft,
  ChatInputRight,
  ChatInputAttachment,
  ChatInputAction,
  ChatInputSend,
} from "./chat-input";
import {
  ChatSidePanel,
  ChatSidebar,
} from "./chat-sidepanel";
import {
  ChatDrawers,
  ChatDrawer,
} from "./chat-drawers";

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
} from "./chat";

export type ChatProps = {
  children: ReactNode;
  className?: string;
};

// 简化的状态管理
const useSimpleChatState = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState("");

  const sendMessage = useCallback(async () => {
    if (!input.trim() && attachments.length === 0) return;
    
    const newMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      files: attachments,
      createdAt: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInput("");
    setAttachments([]);
    setIsSending(true);
    
    // 模拟AI回复
    setTimeout(() => {
      const reply = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "收到你的消息：" + input,
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, reply]);
      setIsSending(false);
    }, 1000);
  }, [input, attachments]);

  return {
    messages,
    attachments,
    isSending,
    input,
    setInput,
    setAttachments,
    sendMessage,
  };
};

// 主要的Chat组件
export const Chat = forwardRef<any, ChatProps>(
  ({ children, className }, ref) => {
    const chatState = useSimpleChatState();
    const [mode, setMode] = useState("standard");
    const [open, setOpen] = useState(true);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [isPinned, setIsPinned] = useState(false);

    // 创建Context值
    const contextValue = useMemo(() => ({
      ...chatState,
      mode,
      title: "智能助手",
      open,
      onOpenChange: setOpen,
      sessions: [],
      onSessionsChange: () => {},
      sessionMessages: {},
      initialSessionId: "",
      onSessionChange: () => {},
      onSessionCreate: () => {},
      onSendMessage: () => {},
      onInputChange: () => {},
      onAttachmentsSelect: () => {},
      onCancelUpload: () => {},
      placeholder: "我有什么可以帮您的吗？",
      disabled: false,
      customRenderers: {},
      customDrawers: [],
      onDrawerToggle: () => {},
    }), [chatState, mode, open]);

    const handleToggleMode = useCallback(() => {
      const nextMode = mode === "wide" ? "standard" : "wide";
      setMode(nextMode);
    }, [mode]);

    const handleToggleOpen = useCallback((nextOpen: boolean) => {
      setOpen(nextOpen);
    }, []);

    if (!open) {
      return null;
    }

    return (
      <div
        className={cn(
          "flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg",
          className,
        )}
      >
        <ChatHeader>
          <ChatHeaderTitle />
          <ChatHeaderActions>
            <ChatHeaderAction
              label="新会话"
              onClick={() => console.log("新建会话")}
              variant="primary"
              icon={<Plus className="size-4" />}
            />
            <ChatHeaderAction
              label="历史"
              onClick={() => setHistoryOpen(!historyOpen)}
              variant="secondary"
              icon={<History className="size-4" />}
            />
            <ChatHeaderAction
              label="展开/收缩"
              onClick={handleToggleMode}
              variant="secondary"
              icon={mode == 'standard' ? <Maximize className="size-4" /> : <Minimize className="size-4" />}
            />
            <ChatHeaderAction
              label="固定"
              onClick={() => setIsPinned(!isPinned)}
              variant="secondary"
              icon={<Pin className="size-4" />}
            />
            <ChatHeaderAction
              label="关闭"
              onClick={() => handleToggleOpen(false)}
              variant="secondary"
              icon={<CircleX className="size-4" />}
            />
          </ChatHeaderActions>
        </ChatHeader>

        <div
          className={cn(
            "relative flex flex-1 flex-col bg-white",
            mode === "wide" && "md:flex-row",
          )}
        >
          <div className="flex min-h-0 flex-1 flex-col">
            <ChatMessages>
              {chatState.messages.length === 0 ? (
                <ChatEmpty>
                  <div className="text-center">
                    <p className="text-lg font-medium text-slate-700">你好！我是你的智能助手</p>
                    <p className="text-sm text-slate-500 mt-2">有什么可以帮助你的吗？</p>
                  </div>
                </ChatEmpty>
              ) : (
                chatState.messages.map((message) => (
                  <ChatMessage key={message.id}>
                    <div className={`${
                      message.role === "user" 
                        ? "bg-blue-500 text-white ml-auto max-w-[80%]" 
                        : "bg-slate-100 text-slate-800 max-w-[80%]"
                    } rounded-lg px-4 py-2`}>
                      {message.content}
                    </div>
                  </ChatMessage>
                ))
              )}
            </ChatMessages>

            <ChatInput>
              <ChatInputLeft>
                <ChatInputAttachment 
                  onFileSelect={(files) => {
                    const newFiles = files.map(file => ({
                      id: file.name + Date.now(),
                      name: file.name,
                      size: file.size,
                      status: "success"
                    }));
                    chatState.setAttachments(prev => [...prev, ...newFiles]);
                  }}
                />
                <ChatInputAction
                  label="能力"
                  onClick={() => console.log("打开能力面板")}
                />
              </ChatInputLeft>
              <ChatInputRight>
                <ChatInputSend 
                  onSend={chatState.sendMessage}
                  disabled={chatState.isSending}
                />
              </ChatInputRight>
            </ChatInput>
          </div>

          {mode === "wide" && (
            <ChatSidePanel>
              <ChatSidebar>
                {children}
              </ChatSidebar>
            </ChatSidePanel>
          )}
        </div>
      </div>
    );
  },
);

Chat.displayName = "Chat";

// 设置所有子组件关系
Chat.Header = ChatHeader;
Chat.Header.Title = ChatHeaderTitle;
Chat.Header.Actions = ChatHeaderActions;
Chat.Header.Action = ChatHeaderAction;

Chat.Messages = ChatMessages;
Chat.Messages.Message = ChatMessage;
Chat.Messages.Empty = ChatEmpty;

Chat.Input = ChatInput;
Chat.Input.Field = ChatInputField;
Chat.Input.Left = ChatInputLeft;
Chat.Input.Right = ChatInputRight;
Chat.Input.Attachment = ChatInputAttachment;
Chat.Input.Action = ChatInputAction;
Chat.Input.Send = ChatInputSend;

Chat.SidePanel = ChatSidePanel;
Chat.SidePanel.Sidebar = ChatSidebar;

Chat.Drawers = ChatDrawers;
Chat.Drawers.Drawer = ChatDrawer;

// 导出所有组件
export {
  ChatHeader,
  ChatHeaderTitle,
  ChatHeaderActions,
  ChatHeaderAction,
  ChatMessages,
  ChatMessage,
  ChatEmpty,
  ChatInput,
  ChatInputField,
  ChatInputLeft,
  ChatInputRight,
  ChatInputAttachment,
  ChatInputAction,
  ChatInputSend,
  ChatSidePanel,
  ChatSidebar,
  ChatDrawers,
  ChatDrawer,
};
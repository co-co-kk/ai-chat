"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { AssistantRuntimeProvider, useAssistantApi, useAssistantState } from "@assistant-ui/react";
import { History, PanelRight, Plus, X, Maximize, Minimize, Pin, CircleX } from "lucide-react";

import { Thread } from "@/components/assistant-ui/thread";
import { cn } from "@/lib/utils";
import {
  AiChatProps,
  AiChatHandle,
  AiChatState,
  AiChatSession,
  AiChatMessage,
  AiChatFile,
} from "./types";
import { useControllableState } from "./hooks/useControllableState";
import { createId, flattenMessages } from "./utils";
import { AttachmentCard } from "./components/AttachmentCard";
import { ChatHeader } from "./components/ChatHeader";
// 导入mock数据
import { mockSessionMessages } from '../../app/mockData/chat-messages';
import { mockChatSessions } from "@/app/mockData/chat-sessions";
import { useMockAssistantRuntime } from "./runtime/mockRuntime";

// 同步组件 - 用于处理输入状态同步
const ComposerSync = ({
  onTextChange,
  resetSignal,
}: {
  onTextChange: (value: string) => void;
  resetSignal: number;
}) => {
  const api = useAssistantApi();
  const composerText = useAssistantState(({ composer }) => composer.text ?? "");

  useEffect(() => {
    onTextChange(composerText);
  }, [composerText, onTextChange]);

  useEffect(() => {
    // 在mock模式下安全调用
    if (api?.composer?.setText) {
      api.composer.setText("");
    }
  }, [api, resetSignal]);

  return null;
};

// 🎯 重构后的 AiChat 主组件
// 基于模块化架构，职责单一，易于维护

export const AiChat = forwardRef<AiChatHandle, AiChatProps>(
  (
    {
      className,
      title = "标题文案",
      mode,
      onModeChange,
      open,
      onOpenChange,
      sidePanel,
      sidePanelClassName,
      headerExtra,
      showDefaultHeaderActions = true,
      inputLeftSlot,
      inputRightSlot,
      composerFooterSlot,
      customRenderers,
      messages,
      defaultMessages = [],
      onMessagesChange,
      attachments,
      defaultAttachments = [],
      onAttachmentsChange,
      sessions,
      defaultSessions = [],
      onSessionsChange,
      sessionMessages = {},
      initialSessionId,
      onSessionChange,
      onSessionCreate,
      onSendMessage,
      onInputChange,
      onAttachmentsSelect,
      onCancelUpload,
      placeholder = "我有什么可以帮您的吗？",
      disabled = false,
      customDrawers,
      onDrawerToggle,
    },
    ref
  ) => {
    // 计算初始会话ID，确保在runtime使用前已定义
    const [activeSessionId, setActiveSessionId] = useState(() => {
      const initialId = initialSessionId ?? (mockChatSessions[0]?.id || "session-1");
      console.log('🚀 初始化会话ID:', initialId);
      return initialId;
    });

    // 状态管理
    const inputRef = React.useRef("");
    const [input, setInput] = useState(""); 
    // const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [internalMode, setInternalMode] = useState<"standard" | "wide">("standard");
    const [internalOpen, setInternalOpen] = useState(true);
    const [customDrawersState, setCustomDrawersState] = useState<Record<string, boolean>>({});
    const [composerResetSignal, setComposerResetSignal] = useState(0);

    // 消息状态 - 由runtime管理，这里仅用于API兼容性
    const [messageList, setMessageList] = useControllableState({
      value: messages,
      defaultValue: defaultMessages,
      onChange: onMessagesChange,
    });
    const [attachmentList, setAttachmentList] = useControllableState({
      value: attachments,
      defaultValue: defaultAttachments,
      onChange: onAttachmentsChange,
    });

    const [sessionList, setSessionList] = useControllableState({
      value: sessions,
      defaultValue: mockChatSessions,
      onChange: onSessionsChange,
    });

    // 解析属性值
    const resolvedMode = mode ?? internalMode;
    const resolvedOpen = open ?? internalOpen;

    // 初始化自定义抽屉状态
    useEffect(() => {
      if (customDrawers?.length) {
        const initialState: Record<string, boolean> = {};
        customDrawers.forEach((drawer) => {
          initialState[drawer.id] = false;
        });
        setCustomDrawersState(initialState);
      }
    }, [customDrawers]);
    const stableSessions = useMemo(
      () => (sessionList?.length ? sessionList : mockChatSessions),
      [sessionList]
    );
    const { runtime, activeSessionId: runtimeSessionId, switchSession } = useMockAssistantRuntime({
      initialSessionId: initialSessionId ?? (mockChatSessions[0]?.id || "session-1"),
      sessions: stableSessions,
      sessionMessages: mockSessionMessages,
      onSendMessage: async ({ text, attachments, message, sessionId }) => {
        // 保留你原来的回调链路（可选）
        await onSendMessage?.({ text, attachments, message });
      },
    });

    // 会话切换逻辑 - 使用mock数据
    useEffect(() => {
      if (!runtimeSessionId && sessionList[0]?.id) {
        const newSessionId = sessionList[0].id;
        setActiveSessionId(newSessionId);
      }
    }, [runtimeSessionId, sessionList]);

    useEffect(() => {
      if (initialSessionId) {
        console.log('🎯 设置初始会话:', initialSessionId);
        setActiveSessionId(initialSessionId);
      }
    }, [initialSessionId]);


    // 将mock消息格式转换为runtime格式
  const convertToRuntimeFormat = (mockMessages: AiChatMessage[]) => {
    return mockMessages.map(msg => ({
      id: msg.id,
      role: msg.role,
      parts: [
        {
          type: msg.type || 'text',
          content: msg.content
        }
      ]
    }));
  };
    // 测试方法 - 用于调试
    const testSessionSwitch = (sessionId: string) => {
      console.log('🧪 测试会话切换:', sessionId);
      console.log('🧪 消息数据:', mockSessionMessages[sessionId]);
      setActiveSessionId(sessionId);
    };

    // 消息操作函数
    const handleAppendMessage = useCallback(
      (message: AiChatMessage) => {
        setMessageList((prev) => [...prev, message]);
      },
      [setMessageList]
    );

    const handleClearMessages = useCallback(() => {
      setMessageList([]);
    }, [setMessageList]);

    const handleCreateSession = useCallback(() => {
      const session: AiChatSession = {
        id: `session-${Date.now()}`,
        title: "新会话",
        group: "今天",
        timeLabel: new Date().toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      
      setSessionList((prev) => [session, ...prev]);
      setActiveSessionId(session.id);
      setMessageList([]); // 新会话从空消息开始
      onSessionCreate?.(session);
      onSessionChange?.(session.id);
    }, [onSessionChange, onSessionCreate, setMessageList, setSessionList]);

    const handleSelectSession = useCallback(
      (sessionId: string) => {
        switchSession(sessionId);
        // setActiveSessionId(sessionId); // 你如果想保留 UI 层状态
        onSessionChange?.(sessionId);
      }, [onSessionChange]
    );

    // 抽屉控制函数
    const handleOpenDrawer = useCallback((drawerId: string) => {
      setCustomDrawersState((prev) => ({ ...prev, [drawerId]: true }));
      onDrawerToggle?.(drawerId, true);
    }, [onDrawerToggle]);

    const handleCloseDrawer = useCallback((drawerId: string) => {
      setCustomDrawersState((prev) => ({ ...prev, [drawerId]: false }));
      onDrawerToggle?.(drawerId, false);
    }, [onDrawerToggle]);

    const handleToggleDrawer = useCallback((drawerId: string) => {
      setCustomDrawersState((prev) => {
        const isOpen = !!prev[drawerId];
        const newState = { ...prev, [drawerId]: !isOpen };
        onDrawerToggle?.(drawerId, !isOpen);
        return newState;
      });
    }, [onDrawerToggle]);

    // 发送消息处理
    const handleSendMessage = useCallback(
      async (payload?: {
        text?: string;
        files?: AiChatFile[];
        role?: "assistant" | "user" | "system";
        type?: string;
      }) => {
        if (isSending || disabled) return;

        const text = payload?.text ?? "";
        const files = payload?.files ?? [];

        if (!text.trim() && files.length === 0) return;

        setIsSending(true);

        try {
          const message: AiChatMessage = {
            id: createId(),
            role: payload?.role ?? "user",
            type: payload?.type,
            content: text,
            files,
            createdAt: new Date().toISOString(),
          };

          await onSendMessage?.({
            text,
            attachments: files,
            message,
          });

          setMessageList((prev) => [...prev, message]);
          setComposerResetSignal(prev => prev + 1); // 重置输入框
        } catch (error) {
          console.error("发送消息失败:", error);
        } finally {
          setIsSending(false);
        }
      },
      [isSending, disabled, onSendMessage, setMessageList]
    );

    // 组件句柄
    useImperativeHandle(ref, () => ({
      sendMessage: handleSendMessage,
      appendMessage: handleAppendMessage,
      clearMessages: handleClearMessages,
    }));

    // 处理输入变化
  const handleComposerTextChange = useCallback(
    (value: string) => {
      inputRef.current = value;
    onInputChange?.(value);
    },
    [onInputChange]
  );

  // 构建AiChatState对象
  const aiChatState: AiChatState = useMemo(
    () => ({
      input,
      currentInput: input,
      messages: messageList,
      attachments: attachmentList,
      isSending,
      setInput,
      setAttachments: setAttachmentList,
      appendMessage: handleAppendMessage,
      clearMessages: handleClearMessages,
      sendMessage: handleSendMessage,
      openCustomDrawer: handleOpenDrawer,
      closeCustomDrawer: handleCloseDrawer,
      toggleCustomDrawer: handleToggleDrawer,
    }),
    [
      input,
      messageList,
      attachmentList,
      isSending,
      setInput,
      setAttachmentList,
      handleAppendMessage,
      handleClearMessages,
      handleSendMessage,
      handleOpenDrawer,
      handleCloseDrawer,
      handleToggleDrawer,
    ]
  );

    // 渲染会话列表 - 带蒙层的右侧抽屉
    const renderSessionList = () => {
      if (!historyOpen) return null;

      return (
        <>
          {/* 蒙层背景 */}
          <div 
            className="absolute inset-0 z-20 bg-black/20 backdrop-blur-sm"
            onClick={() => setHistoryOpen(false)}
          />
          
          {/* 抽屉内容 */}
          <div className="absolute right-0 top-0 z-30 h-full w-64 border-l bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-slate-700">会话历史</h3>
              <button
                onClick={() => setHistoryOpen(false)}
                className="rounded-md p-1 hover:bg-slate-200"
              >
                <X className="size-4" />
              </button>
            </div>
            
            <button
              onClick={handleCreateSession}
              className="mb-4 flex w-full items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
            >
              <Plus className="size-4" />
              新建会话
            </button>
            <div className="space-y-2">
              {sessionList.map((session) => (
                <button
                  key={session.id}
                  onClick={() => handleSelectSession(session.id)}
                  className={cn(
                    "w-full rounded-md p-3 text-left text-sm transition-colors",
                    runtimeSessionId === session.id
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-slate-100"
                  )}
                >
                  <div className="font-medium">{session.title}</div>
                  <div className="text-xs text-slate-500">
                    {session.group} · {session.timeLabel}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      );
    };

    // 渲染自定义抽屉 - 带蒙层的抽屉
    const renderCustomDrawers = () => {
      if (!customDrawers?.length) return null;

      return (
        <>
          {customDrawers.map((drawer) => {
            if (!customDrawersState[drawer.id]) return null;

            // 蒙层和抽屉的组合
            const isLeft = drawer.position === 'left';
            const overlayClass = "absolute inset-0 z-20 bg-black/20 backdrop-blur-sm";
            const drawerClass = isLeft
              ? 'absolute left-0 top-0 z-30 h-full w-64 border-r bg-white p-4 shadow-xl'
              : 'absolute right-0 top-0 z-30 h-full w-64 border-l bg-white p-4 shadow-xl';

            return (
              <React.Fragment key={drawer.id}>
                {/* 蒙层背景 */}
                <div 
                  className={overlayClass}
                  onClick={() => handleCloseDrawer(drawer.id)}
                />
                
                {/* 抽屉内容 */}
                <div className={drawerClass}>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-700">{drawer.title}</h3>
                    <button
                      onClick={() => handleCloseDrawer(drawer.id)}
                      className="rounded-md p-1 hover:bg-slate-200"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  {drawer.content}
                </div>
              </React.Fragment>
            );
          })}
        </>
      );
    };

    return (
      <AssistantRuntimeProvider runtime={runtime}>
        <div
          className={cn(
            "relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg",
            className,
          )}
        >
          {/* 头部 */}
          <ChatHeader
            title={title}
            mode={resolvedMode}
            historyOpen={historyOpen}
            isPinned={isPinned}
            showDefaultHeaderActions={showDefaultHeaderActions}
            showNewSessionButton={showDefaultHeaderActions}
            showHistoryButton={showDefaultHeaderActions}
            showModeToggleButton={showDefaultHeaderActions && !!sidePanel}
            showPinButton={showDefaultHeaderActions}
            showCloseButton={showDefaultHeaderActions}
            headerExtra={headerExtra}
            onCreateSession={handleCreateSession}
            onToggleHistory={() => setHistoryOpen(!historyOpen)}
            onToggleMode={() => {
              const nextMode = resolvedMode === "wide" ? "standard" : "wide";
              if (!mode) setInternalMode(nextMode);
              onModeChange?.(nextMode);
            }}
            onTogglePin={() => setIsPinned(!isPinned)}
            onClose={() => {
              if (!open) setInternalOpen(false);
              onOpenChange?.(false);
            }}
            state={aiChatState}
          />

          {/* 主体内容 */}
          <div className="relative flex flex-1 overflow-hidden">
            {/* 会话列表抽屉 - 从右侧滑出 */}
            {renderSessionList()}

            {/* 自定义抽屉 */}
            {renderCustomDrawers()}

            {/* 侧边栏 - 固定宽度，不挤压内容 */}
            {resolvedMode === "wide" && sidePanel && (
              <div className={cn("w-80 border-r bg-slate-50 p-4", sidePanelClassName)}>
                {sidePanel}
              </div>
            )}

            {/* 主聊天区域 - 保持原有宽度 */}
            <div className="flex-1">
              <Thread
                messageComponents={{
                  ...customRenderers,
                }}
                composerInputPlaceholder={placeholder}
                composerFooter={composerFooterSlot?.(aiChatState)}
                composerActionLeftSlot={inputLeftSlot?.(aiChatState)}
                composerActionRightSlot={inputRightSlot?.(aiChatState)}
                attachments={attachmentList}
                onAttachmentsChange={setAttachmentList}
                />
              
                {/* onSendMessage={(text, attachments) => {
                  handleSendMessage({ text, files: attachments });
                }} */}
              {/* 状态同步组件 */}
              <ComposerSync
                onTextChange={handleComposerTextChange}
                resetSignal={composerResetSignal}
              />

              {/* 附件展示区域 */}
              {attachmentList.length > 0 && (
                <div className="border-t bg-slate-50 p-4">
                  <div className="mb-2 text-sm font-medium text-slate-700">附件</div>
                  <div className="space-y-2">
                    {attachmentList.map((file) => (
                      <AttachmentCard
                        key={file.id}
                        file={file}
                        onCancel={onCancelUpload}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </AssistantRuntimeProvider>
    );
  }
);

AiChat.displayName = "AiChat";
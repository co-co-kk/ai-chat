"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import type {
  ChangeEvent,
  ComponentProps,
  Dispatch,
  ReactNode,
  SetStateAction,
} from "react";
import {
  AssistantRuntimeProvider,
  type ThreadMessageLike,
  useAssistantApi,
  useAssistantState,
} from "@assistant-ui/react";
import { AssistantChatTransport, useChatRuntime } from "@assistant-ui/react-ai-sdk";
import {
  FileArchive,
  FileImage,
  FileText,
  ArrowUp,
  History,
  PanelRight,
  Paperclip,
  Pin,
  Plus,
  X,
  CircleX,
  TriangleAlert,
  Maximize,
  Minimize,
} from "lucide-react";

import { Thread } from "@/components/assistant-ui/thread";
import {
  ResourceSummaryToolCard,
  WorkflowToolCard,
} from "@/components/assistant-ui/tool-call-cards";
import { cn } from "@/lib/utils";

// 导出所有类型
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

// 导入所有子组件
import {
  Chat as ChatBase,
  ChatContextValue,
  useChatContext,
  type ChatProps,
} from "./chat";
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

const useControllableState = <T,>({
  value,
  defaultValue,
  onChange,
}: {
  value?: T;
  defaultValue: T;
  onChange?: (next: T) => void;
}) => {
  const [internalValue, setInternalValue] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? (value as T) : internalValue;

  const setValue = useCallback(
    (next: SetStateAction<T>) => {
      const resolved =
        typeof next === "function"
          ? (next as (prev: T) => T)(currentValue)
          : next;
      if (!isControlled) {
        setInternalValue(resolved);
      }
      onChange?.(resolved);
    },
    [currentValue, isControlled, onChange],
  );

  return [currentValue, setValue] as const;
};

const createId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const formatSize = (size: number) => {
  if (size <= 0) return "0KB";
  const kb = size / 1024;
  if (kb < 1024) return `${kb.toFixed(0)}KB`;
  return `${(kb / 1024).toFixed(1)}MB`;
};

const resolveFileKind = (file: any): any => {
  if (file.kind) return file.kind;
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return "pdf";
  if (name.endsWith(".doc") || name.endsWith(".docx")) return "doc";
  if (name.endsWith(".zip") || name.endsWith(".rar") || name.endsWith(".7z")) {
    return "archive";
  }
  if (
    name.endsWith(".png") ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    name.endsWith(".webp") ||
    name.endsWith(".gif")
  ) {
    return "image";
  }
  return "other";
};

const FileIcon = ({ kind }: { kind: any }) => {
  if (kind === "pdf") return <FileText className="size-4 text-emerald-500" />;
  if (kind === "doc") return <FileText className="size-4 text-sky-500" />;
  if (kind === "archive")
    return <FileArchive className="size-4 text-amber-500" />;
  if (kind === "image") return <FileImage className="size-4 text-blue-500" />;
  return <FileText className="size-4 text-slate-400" />;
};

const AttachmentCard = ({
  file,
  onCancel,
}: {
  file: any;
  onCancel?: (file: any) => void;
}) => {
  const kind = resolveFileKind(file);
  const isError = file.status === "error";
  const isUploading = file.status === "uploading";
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border bg-white px-3 py-2 text-xs shadow-sm",
        isError && "border-red-300 bg-red-50",
        isUploading && "border-blue-200 bg-blue-50",
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex size-6 items-center justify-center rounded-md bg-white shadow-sm">
          {isError ? (
            <TriangleAlert className="size-4 text-red-500" />
          ) : (
            <FileIcon kind={kind} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-slate-700">
            {file.name}
          </div>
          <div className="text-[11px] text-slate-400">
            {formatSize(file.size)}
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
          <span>
            {file.status === "uploading" ? "上传中" : null}
            {file.status === "success" ? "完成" : null}
            {file.status === "error" ? "失败" : null}
          </span>
          {isUploading && onCancel ? (
            <button
              type="button"
              className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] text-slate-500 hover:bg-slate-100"
              onClick={() => onCancel(file)}
            >
              取消
            </button>
          ) : null}
        </div>
      </div>
      {isUploading ? (
        <div className="h-1 w-full overflow-hidden rounded-full bg-blue-100">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{ width: `${Math.min(file.progress ?? 0, 100)}%` }}
          />
        </div>
      ) : null}
      {isError && file.errorMessage ? (
        <div className="text-[11px] text-red-500">{file.errorMessage}</div>
      ) : null}
    </div>
  );
};

const flattenMessages = (
  messages: any[],
  depth = 0,
): Array<{ message: any; depth: number }> =>
  messages.flatMap((message) => [
    { message, depth },
    ...(message.children ? flattenMessages(message.children, depth + 1) : []),
  ]);

const toThreadMessages = (
  messages: any[],
  customRenderers: Record<string, (message: any, state: any) => ReactNode>,
): ThreadMessageLike[] =>
  flattenMessages(messages).map(({ message, depth }) => {
    if (message.type && customRenderers?.[message.type]) {
      return {
        id: message.id,
        role: message.role,
        content: [
          {
            type: "tool-call",
            toolName: message.type,
            toolCallId: `${message.id}-tool-call`,
            args: { message, depth },
            argsText: JSON.stringify({ message, depth }),
          },
        ],
      };
    }

    if (message.children?.length) {
      return {
        id: message.id,
        role: message.role,
        content: [
          {
            type: "tool-call",
            toolName: "nested-message",
            toolCallId: `${message.id}-nested`,
            args: { message, depth },
            argsText: JSON.stringify({ message, depth }),
          },
        ],
      };
    }

    if (depth > 0) {
      return {
        id: message.id,
        role: message.role,
        content: [
          {
            type: "tool-call",
            toolName: "nested-item",
            toolCallId: `${message.id}-nested-item`,
            args: { message, depth },
            argsText: JSON.stringify({ message, depth }),
          },
        ],
      };
    }

    return {
      id: message.id,
      role: message.role,
      content: [
        {
          type: "text",
          text: message.content ?? "",
        },
      ],
    };
  });

const useToolMessageArgs = () =>
  useAssistantState(({ part }) => {
    return (part?.args as { message?: any; depth?: number }) ?? {};
  });

const CustomToolCall = ({
  renderer,
  state,
}: {
  renderer: (message: any, state: any) => ReactNode;
  state: any;
}) => {
  const { message, depth = 0 } = useToolMessageArgs();

  if (!message) return null;
  const composerText = useAssistantState(({ composer }) => composer.text ?? "");
  return (
    <div style={{ marginLeft: depth * 16 }}>
      {renderer(message, {
        ...state,
        input: composerText,
        currentInput: composerText,
      })}
    </div>
  );
};

const NestedMessageCard = ({
  state,
  customRenderers,
}: {
  state: any;
  customRenderers?: Record<string, (message: any, state: any) => ReactNode>;
}) => {
  const { message, depth = 0 } = useToolMessageArgs();
  if (!message) return null;
  const renderer = message.type ? customRenderers?.[message.type] : undefined;
  const composerText = useAssistantState(({ composer }) => composer.text ?? "");
  const resolvedState = {
    ...state,
    input: composerText,
    currentInput: composerText,
  };

  return (
    <div style={{ marginLeft: depth * 16 }} className="space-y-2">
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="text-sm font-semibold text-slate-700">
          {message.content ?? message.meta?.title ?? ""}
        </div>
        {renderer ? (
          <div className="mt-2">{renderer(message, resolvedState)}</div>
        ) : null}
      </div>
    </div>
  );
};

const NestedMessageItem = () => {
  const { message, depth = 0 } = useToolMessageArgs();
  if (!message) return null;
  return (
    <div style={{ marginLeft: depth * 16 }} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
      {message.content}
    </div>
  );
};

const ComposerSlot = ({
  state,
  renderSlot,
}: {
  state: any;
  renderSlot?: (state: any) => ReactNode;
}) => {
  const api = useAssistantApi();
  const composerText = useAssistantState(({ composer }) => composer.text ?? "");

  const bridgedState = useMemo(
    () => ({
      ...state,
      input: composerText,
      currentInput: composerText,
      setInput: (next: any) => {
        const resolved =
          typeof next === "function" ? next(composerText) : next;
        api.composer().setText(resolved);
        state.setInput(resolved);
      },
    }),
    [api, composerText, state],
  );

  return <>{renderSlot?.(bridgedState)}</>;
};

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
    api.composer().setText("");
  }, [api, resetSignal]);

  return null;
};

// 主要的 Chat 组件，包含完整的状态管理
export const Chat = forwardRef<any, ChatProps>(
  (
    {
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
    },
    ref,
  ) => {
    const runtime = useChatRuntime({
      transport: new AssistantChatTransport({
        api: "/api/chat",
        fetch: async () => {
          throw new Error("Mock mode: 使用本地数据");
        },
      }),
    });

    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [composerResetSignal, setComposerResetSignal] = useState(0);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [internalMode, setInternalMode] = useState(mode);
    const [internalOpen, setInternalOpen] = useState(open);
    
    const [customDrawersState, setCustomDrawersState] = useState<Record<string, boolean>>({});
    
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
      defaultValue: defaultSessions,
      onChange: onSessionsChange,
    });
    const [activeSessionId, setActiveSessionId] = useState(
      initialSessionId ?? sessionList[0]?.id ?? "",
    );

    const resolvedMode = mode ?? internalMode;
    const resolvedOpen = open ?? internalOpen;

    useEffect(() => {
      if (!activeSessionId && sessionList[0]?.id) {
        setActiveSessionId(sessionList[0].id);
      }
    }, [activeSessionId, sessionList]);

    useEffect(() => {
      if (initialSessionId) {
        setActiveSessionId(initialSessionId);
      }
    }, [initialSessionId]);

    useEffect(() => {
      if (messages !== undefined) return;
      if (!activeSessionId) return;
      const nextMessages = sessionMessages[activeSessionId];
      if (nextMessages) {
        setMessageList(nextMessages);
      }
    }, [activeSessionId, messages, sessionMessages, setMessageList]);
    
    useEffect(() => {
      if (customDrawers && customDrawers.length > 0) {
        const initialDrawersState: Record<string, boolean> = {};
        customDrawers.forEach(drawer => {
          initialDrawersState[drawer.id] = false;
        });
        setCustomDrawersState(prev => ({
          ...prev,
          ...initialDrawersState
        }));
      }
    }, [customDrawers]);

    const appendMessage = useCallback(
      (message: any) => {
        setMessageList((prev) => [...prev, message]);
      },
      [setMessageList],
    );

    const clearMessages = useCallback(() => {
      setMessageList([]);
    }, [setMessageList]);

    const handleCreateSession = useCallback(() => {
      const session: any = {
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
      setMessageList([]);
      onSessionCreate?.(session);
      onSessionChange?.(session.id);
    }, [onSessionChange, onSessionCreate, setMessageList, setSessionList]);

    const handleSelectSession = useCallback(
      (sessionId: string) => {
        setActiveSessionId(sessionId);
        onSessionChange?.(sessionId);
      },
      [onSessionChange],
    );

    const openCustomDrawer = useCallback((drawerId: string) => {
      setCustomDrawersState(prev => {
        const newState = { ...prev, [drawerId]: true };
        onDrawerToggle?.(drawerId, true);
        return newState;
      });
    }, [onDrawerToggle]);

    const closeCustomDrawer = useCallback((drawerId: string) => {
      setCustomDrawersState(prev => {
        const newState = { ...prev, [drawerId]: false };
        onDrawerToggle?.(drawerId, false);
        return newState;
      });
    }, [onDrawerToggle]);

    const toggleCustomDrawer = useCallback((drawerId: string) => {
      setCustomDrawersState(prev => {
        const isOpen = !!prev[drawerId];
        const newState = { ...prev, [drawerId]: !isOpen };
        onDrawerToggle?.(drawerId, !isOpen);
        return newState;
      });
    }, [onDrawerToggle]);

    const handleToggleMode = useCallback(() => {
      const nextMode = resolvedMode === "wide" ? "standard" : "wide";
      if (!mode) {
        setInternalMode(nextMode);
      }
      onModeChange?.(nextMode);
    }, [mode, onModeChange, resolvedMode]);

    const handleToggleOpen = useCallback(
      (nextOpen: boolean) => {
        if (open === undefined) {
          setInternalOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
      },
      [onOpenChange, open],
    );

    const sendMessage = useCallback(
      async (payload?: {
        text?: string;
        files?: any[];
        role?: any;
        type?: string;
      }) => {
        const text = payload?.text ?? input.trim();
        const files = payload?.files ?? attachmentList;
        if (!text && files.length === 0) return;
        const message: any = {
          id: createId(),
          role: payload?.role ?? "user",
          type: payload?.type ?? "text",
          content: text,
          files: files.length ? files : undefined,
          createdAt: new Date().toISOString(),
        };
        appendMessage(message);
        setInput("");
        setAttachmentList([]);
        setComposerResetSignal((prev) => prev + 1);
        setIsSending(true);
        try {
          await onSendMessage?.({
            text,
            attachments: files,
            message,
          });
        } finally {
          setIsSending(false);
        }
      },
      [appendMessage, attachmentList, input, onSendMessage, setAttachmentList],
    );

    useImperativeHandle(
      ref,
      () => ({
        sendMessage,
        appendMessage,
        clearMessages,
      }),
      [appendMessage, clearMessages, sendMessage],
    );

    const state: any = useMemo(
      () => ({
        input,
        currentInput: input,
        messages: messageList,
        attachments: attachmentList,
        isSending,
        setInput: (next: any) => {
          const resolved = typeof next === "function" ? next(input) : next;
          setInput(resolved);
          onInputChange?.(resolved);
        },
        setAttachments: setAttachmentList,
        appendMessage,
        clearMessages,
        sendMessage,
        openCustomDrawer,
        closeCustomDrawer,
        toggleCustomDrawer,
      }),
      [
        appendMessage,
        attachmentList,
        clearMessages,
        input,
        isSending,
        messageList,
        onInputChange,
        sendMessage,
        setAttachmentList,
        openCustomDrawer,
        closeCustomDrawer,
        toggleCustomDrawer,
      ],
    );

    const handleComposerTextChange = useCallback(
      (value: string) => {
        setInput(value);
        onInputChange?.(value);
      },
      [onInputChange],
    );

    const threadMessages = useMemo(
      () => toThreadMessages(messageList, customRenderers),
      [customRenderers, messageList],
    );

    useEffect(() => {
      runtime.thread.reset(threadMessages);
    }, [runtime, threadMessages]);

    const customToolComponents = useMemo(() => {
      return {
        tools: {
          by_name: {
            workflow: WorkflowToolCard,
            "resource-summary": ResourceSummaryToolCard,
            "nested-message": () => (
              <NestedMessageCard
                state={state}
                customRenderers={customRenderers}
              />
            ),
            "nested-item": () => <NestedMessageItem />,
            ...Object.fromEntries(
              Object.entries(customRenderers ?? {}).map(([key, renderer]) => [
                key,
                () => <CustomToolCall renderer={renderer} state={state} />,
              ]),
            ),
          },
        },
      } as ComponentProps<typeof Thread>["assistantPartComponents"];
    }, [customRenderers, state]);

    const groupedSessions = useMemo(() => {
      return sessionList.reduce<Record<string, any[]>>(
        (acc, session) => {
          acc[session.group] = acc[session.group] ?? [];
          acc[session.group].push(session);
          return acc;
        },
        {},
      );
    }, [sessionList]);

    const historyDrawer = (
      <div
        className={cn(
          "absolute inset-y-0 right-0 z-20 w-72 border-l border-slate-200 bg-white shadow-[-12px_0_24px_rgba(15,23,42,0.08)] transition-transform",
          historyOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
          历史记录
          <button
            type="button"
            onClick={() => setHistoryOpen(false)}
            className="flex size-6 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="h-full overflow-y-auto px-4 py-3">
          {Object.entries(groupedSessions).map(([group, items]) => (
            <div key={group} className="mb-4">
              <div className="mb-2 text-xs font-semibold text-slate-400">
                {group}
              </div>
              <div className="space-y-2">
                {items.map((session: any) => (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() => handleSelectSession(session.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50",
                      session.id === activeSessionId &&
                        "bg-blue-50 text-blue-700",
                    )}
                  >
                    <span className="line-clamp-1">{session.title}</span>
                    <span className="text-[10px] text-slate-400">
                      {session.timeLabel}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    if (!resolvedOpen) {
      return null;
    }

    return (
      <AssistantRuntimeProvider runtime={runtime}>
        <ComposerSync
          onTextChange={handleComposerTextChange}
          resetSignal={composerResetSignal}
        />
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
                onClick={handleCreateSession}
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
                icon={resolvedMode == 'standard' ? <Maximize className="size-4" /> : <Minimize className="size-4" />}
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
              resolvedMode === "wide" && "md:flex-row",
            )}
          >
            {historyOpen ? (
              <button
                type="button"
                className="absolute inset-0 z-10 bg-black/20"
                onClick={() => setHistoryOpen(false)}
              />
            ) : null}
            {historyDrawer}
            
            <ChatDrawers>
              {customDrawers?.map((drawer) => {
                const isOpen = customDrawersState[drawer.id] || false;
                return (
                  <ChatDrawer
                    key={drawer.id}
                    id={drawer.id}
                    title={drawer.title}
                    open={isOpen}
                  >
                    {drawer.content}
                  </ChatDrawer>
                );
              })}
            </ChatDrawers>
            
            <div className="flex min-h-0 flex-1 flex-col">
              <Thread
                messageComponents={undefined}
                assistantPartComponents={customToolComponents}
                composerAttachments={null}
                composerAttachment={null}
                composerActionLeftSlot={
                  <ComposerSlot
                    state={state}
                    renderSlot={() => (
                      <ChatInputLeft>
                        {onAttachmentsSelect && (
                          <ChatInputAttachment
                            onFileSelect={(files) => {
                              const nextFiles = files.map((file) => ({
                                id: createId(),
                                name: file.name,
                                size: file.size,
                                status: "uploading" as any,
                                progress: 0,
                              }));
                              setAttachmentList((prev) => [...prev, ...nextFiles]);
                            }}
                          />
                        )}
                      </ChatInputLeft>
                    )}
                  />
                }
                composerActionRightSlot={
                  <ComposerSlot
                    state={state}
                    renderSlot={() => (
                      <ChatInputRight>
                        <ChatInputSend />
                      </ChatInputRight>
                    )}
                  />
                }
                hideComposerSendButton
                composerInputPlaceholder={placeholder}
                composerFooter={
                  <div className="px-4 pb-3 text-center text-xs text-slate-400">
                    AI 生成，仅供参考
                  </div>
                }
                attachments={attachmentList}
                onAttachmentsChange={setAttachmentList}
              />
            </div>

            {resolvedMode === "wide" && (
              <ChatSidePanel>
                <ChatSidebar>
                  {children}
                </ChatSidebar>
              </ChatSidePanel>
            )}
          </div>
        </div>
      </AssistantRuntimeProvider>
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

export {
  Chat,
  useChatContext,
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
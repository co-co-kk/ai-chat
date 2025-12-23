"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import {
  AssistantRuntimeProvider,
  type ThreadMessageLike,
} from "@assistant-ui/react";
import { AssistantChatTransport, useChatRuntime } from "@assistant-ui/react-ai-sdk";
import {
  Clock,
  History,
  Plus,
  PanelLeft,
  Trash2,
  X,
} from "lucide-react";

import { Thread } from "@/components/assistant-ui/thread";
import {
  ResourceSummaryToolCard,
  WorkflowToolCard,
} from "@/components/assistant-ui/tool-call-cards";
import {
  ComposerActionModule,
} from "@/components/assistant-ui/composer-action-modules";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createMockChatService, type ChatService } from "@/lib/chat-service";
import {
  mockChatMessagesBySessionId,
  mockChatSessions,
  type MockChatMessage,
  type MockChatSession,
} from "@/lib/mock-data/chat-sessions";

export type ChatWidgetSession = MockChatSession;
export type ChatWidgetMessage = MockChatMessage;

export type ChatWidgetProps = {
  className?: string;
  title?: string;
  sessions?: ChatWidgetSession[];
  sessionMessages?: Record<string, ChatWidgetMessage[]>;
  service?: ChatService;
  initialSessionId?: string;
  layoutMode?: "split" | "compact";
  onLayoutModeChange?: (mode: "split" | "compact") => void;
  messageComponents?: ComponentProps<typeof Thread>["messageComponents"];
  assistantPartComponents?: ComponentProps<typeof Thread>["assistantPartComponents"];
  composerActionModules?: ComposerActionModule[];
  composerAttachment?: ReactNode;
  composerAttachments?: ReactNode;
  composerActionSlot?: ReactNode;
  composerFooter?: ReactNode;
  headerActions?: ReactNode;
  showDefaultHeaderActions?: boolean;
  showLayoutToggle?: boolean;
};

const toThreadMessages = (messages: ChatWidgetMessage[]): ThreadMessageLike[] =>
  messages.map((message) => ({
    id: message.id,
    role: message.role,
    content: message.parts.map((part, index) => {
      if (part.type === "tool-call") {
        return {
          type: "tool-call",
          toolName: part.toolName,
          toolCallId: `${message.id}-${index}`,
          args: part.args,
          argsText: JSON.stringify(part.args),
        };
      }

      return {
        type: "text",
        text: part.content,
      };
    }),
  }));

export const ChatWidget = ({
  className,
  title = "标题标题标题文案文案",
  sessions = mockChatSessions,
  sessionMessages = mockChatMessagesBySessionId,
  service,
  initialSessionId,
  layoutMode,
  onLayoutModeChange,
  messageComponents,
  assistantPartComponents,
  composerActionModules,
  composerAttachment,
  composerAttachments,
  composerActionSlot,
  composerFooter,
  headerActions,
  showDefaultHeaderActions = true,
  showLayoutToggle = true,
}: ChatWidgetProps) => {
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: "/api/chat",
      // TODO: 接入真实接口时，替换为实际的 API 请求。
      // fetch: (input, init) => fetch(input, init),
      fetch: async () => {
        throw new Error("Mock mode: 使用本地数据");
      },
    }),
  });

  const chatService = useMemo(
    () =>
      service ??
      createMockChatService({
        sessions,
        sessionMessages,
      }),
    [service, sessions, sessionMessages],
  );

  const [sessionList, setSessionList] = useState<ChatWidgetSession[]>(sessions);
  const [activeSessionId, setActiveSessionId] = useState(
    initialSessionId ?? "",
  );
  const [historyOpen, setHistoryOpen] = useState(false);
  const [internalLayoutMode, setInternalLayoutMode] = useState<
    "split" | "compact"
  >(layoutMode ?? "compact");

  const resolvedLayoutMode = layoutMode ?? internalLayoutMode;

  const groupedSessions = useMemo(() => {
    return sessionList.reduce<Record<string, ChatWidgetSession[]>>(
      (acc, session) => {
        acc[session.group] = acc[session.group] ?? [];
        acc[session.group].push(session);
        return acc;
      },
      {},
    );
  }, [sessionList]);

  const loadSessionHistory = useCallback(
    async (sessionId: string) => {
      const history = await chatService.getSessionHistory(sessionId);
      runtime.thread.reset(toThreadMessages(history));
    },
    [chatService, runtime],
  );

  const handleStreamDelta = useCallback(
    (delta: string) => {
      // TODO: 流式渲染组装位置，后续接入 SSE/WebSocket 时在此处拼装消息。
      // runtime.thread.append({
      //   role: "assistant",
      //   content: [{ type: "text", text: delta }],
      // });
      void delta;
    },
    [runtime],
  );

  const handleNewSession = useCallback(async () => {
    const newSession = await chatService.createSession();
    setSessionList((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    runtime.thread.reset([]);
    handleStreamDelta("");
    // TODO: mock 环境下演示流式响应时可启用
    // await chatService.streamAssistantReply(newSession.id, handleStreamDelta);
  }, [chatService, handleStreamDelta, runtime]);

  const handleSelectSession = useCallback(
    (sessionId: string) => {
      setActiveSessionId(sessionId);
      loadSessionHistory(sessionId);
    },
    [loadSessionHistory],
  );

  useEffect(() => {
    let isMounted = true;

    chatService.listSessions().then((list) => {
      if (!isMounted) return;
      setSessionList(list);
      setActiveSessionId(
        (current) => current || initialSessionId || list[0]?.id || "",
      );
    });

    return () => {
      isMounted = false;
    };
  }, [chatService, initialSessionId]);

  useEffect(() => {
    if (!activeSessionId) return;
    loadSessionHistory(activeSessionId);
  }, [activeSessionId, loadSessionHistory]);

  useEffect(() => {
    setHistoryOpen(resolvedLayoutMode === "split");
  }, [resolvedLayoutMode]);

  const handleLayoutModeChange = useCallback(
    (mode: "split" | "compact") => {
      if (!layoutMode) {
        setInternalLayoutMode(mode);
      }
      onLayoutModeChange?.(mode);
    },
    [layoutMode, onLayoutModeChange],
  );

  const defaultComposerModules: ComposerActionModule[] = [
    {
      id: "capability",
      type: "button",
      label: "特定能力",
      onClick: () => undefined,
    },
  ];

  const toggleLayoutMode =
    resolvedLayoutMode === "split" ? "compact" : "split";

  const historyPanel = (
    <div
      className={cn(
        "chat-widget-history border-border bg-white",
        resolvedLayoutMode === "split"
          ? "w-72 border-r"
          : "absolute inset-y-0 right-0 w-[70%] border-l shadow-[-12px_0_24px_rgba(15,23,42,0.08)]",
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3 text-sm font-semibold text-slate-700">
        历史记录
        {resolvedLayoutMode === "split" ? null : (
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-slate-500"
            onClick={() => setHistoryOpen(false)}
          >
            <X className="size-4" />
          </Button>
        )}
      </div>
      <div className="max-h-full overflow-y-auto px-4 py-3">
        {Object.entries(groupedSessions).map(([group, items]) => (
          <div key={group} className="mb-4">
            <div className="mb-2 text-xs font-semibold text-slate-500">
              {group}
            </div>
            <div className="space-y-2">
              {items.map((session) => (
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
                  <span className="flex items-center gap-2 text-[10px] text-slate-400">
                    {session.timeLabel}
                    <Trash2 className="size-3 text-slate-300" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div
        className={cn(
          "chat-widget flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-lg",
          className,
        )}
      >
        <div className="chat-widget-header flex items-center justify-between border-b border-border bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <div className="flex size-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <span className="text-xs">🤖</span>
            </div>
            <span>{title}</span>
          </div>
          <div className="flex items-center gap-2">
            {headerActions}
            {showDefaultHeaderActions ? (
              <>
                {showLayoutToggle ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-slate-500"
                    onClick={() => handleLayoutModeChange(toggleLayoutMode)}
                  >
                    <PanelLeft className="size-4" />
                  </Button>
                ) : null}
                <Button
                  size="sm"
                  className="h-7 rounded-md bg-blue-600 px-3 text-xs text-white hover:bg-blue-700"
                  onClick={handleNewSession}
                >
                  <Plus className="mr-1 size-3" />
                  新会话
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-slate-500"
                  onClick={() => {
                    if (resolvedLayoutMode === "split") return;
                    setHistoryOpen((prev) => !prev);
                  }}
                >
                  <History className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-slate-500"
                >
                  <Clock className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-slate-500"
                >
                  <X className="size-4" />
                </Button>
              </>
            ) : null}
          </div>
        </div>

        <div
          className={cn(
            "chat-widget-body relative flex-1 bg-white",
            resolvedLayoutMode === "split" && "flex",
          )}
        >
          {resolvedLayoutMode === "split" ? historyPanel : null}
          <div className="relative flex-1">
            <Thread
              messageComponents={messageComponents}
              assistantPartComponents={
                assistantPartComponents ?? {
                  tools: {
                    by_name: {
                      workflow: WorkflowToolCard,
                      "resource-summary": ResourceSummaryToolCard,
                    },
                  },
                }
              }
              composerActionModules={
                composerActionModules ?? defaultComposerModules
              }
              composerAttachment={composerAttachment}
              composerAttachments={composerAttachments}
              composerActionSlot={composerActionSlot}
              composerFooter={
                composerFooter ?? (
                  <div className="px-4 pb-3 text-center text-xs text-slate-400">
                    AI 生成，仅供参考
                  </div>
                )
              }
            />
          </div>
          {resolvedLayoutMode === "compact" && historyOpen ? historyPanel : null}
        </div>
      </div>
    </AssistantRuntimeProvider>
  );
};

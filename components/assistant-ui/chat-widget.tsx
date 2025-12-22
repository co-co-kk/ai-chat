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
  Trash2,
  X,
} from "lucide-react";

import { Thread } from "@/components/assistant-ui/thread";
import {
  ComposerActionModule,
} from "@/components/assistant-ui/composer-action-modules";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
  initialSessionId?: string;
  messageComponents?: ComponentProps<typeof Thread>["messageComponents"];
  composerActionModules?: ComposerActionModule[];
  composerFooter?: ReactNode;
};

const toThreadMessages = (messages: ChatWidgetMessage[]): ThreadMessageLike[] =>
  messages.map((message) => ({
    id: message.id,
    role: message.role,
    content: message.parts.map((part) => ({
      type: "text",
      text: part.content,
    })),
  }));

export const ChatWidget = ({
  className,
  title = "标题标题标题文案文案",
  sessions = mockChatSessions,
  sessionMessages = mockChatMessagesBySessionId,
  initialSessionId,
  messageComponents,
  composerActionModules,
  composerFooter,
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

  const [sessionList, setSessionList] = useState<ChatWidgetSession[]>(sessions);
  const [activeSessionId, setActiveSessionId] = useState(
    initialSessionId ?? sessions[0]?.id ?? "",
  );
  const [historyOpen, setHistoryOpen] = useState(false);

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
      // TODO: 通过会话 ID 查询历史记录（替换 mock 数据）
      // const response = await fetch(`/api/chat/sessions/${sessionId}`);
      // const history = await response.json();
      const history = sessionMessages[sessionId] ?? [];
      runtime.thread.reset(toThreadMessages(history));
    },
    [runtime, sessionMessages],
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

  const handleNewSession = useCallback(() => {
    // TODO: 新建会话接口调用（替换 mock 数据）
    // const newSession = await createSession();
    const newSession: ChatWidgetSession = {
      id: `session-${Date.now()}`,
      title: "新建会话",
      timeLabel: "刚刚",
      group: "今天",
    };
    setSessionList((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    runtime.thread.reset([]);
    handleStreamDelta("");
  }, [handleStreamDelta, runtime]);

  const handleSelectSession = useCallback(
    (sessionId: string) => {
      setActiveSessionId(sessionId);
      loadSessionHistory(sessionId);
    },
    [loadSessionHistory],
  );

  useEffect(() => {
    if (!activeSessionId) return;
    loadSessionHistory(activeSessionId);
  }, [activeSessionId, loadSessionHistory]);

  const defaultComposerModules: ComposerActionModule[] = [
    {
      id: "capability",
      type: "button",
      label: "特定能力",
      onClick: () => undefined,
    },
  ];

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
              onClick={() => setHistoryOpen((prev) => !prev)}
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
          </div>
        </div>

        <div className="chat-widget-body relative flex-1 bg-white">
          <Thread
            messageComponents={messageComponents}
            composerActionModules={
              composerActionModules ?? defaultComposerModules
            }
            composerFooter={
              composerFooter ?? (
                <div className="px-4 pb-3 text-center text-xs text-slate-400">
                  AI 生成，仅供参考
                </div>
              )
            }
          />

          {historyOpen ? (
            <div className="chat-widget-history absolute inset-y-0 right-0 w-[70%] border-l border-border bg-white shadow-[-12px_0_24px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between border-b border-border px-4 py-3 text-sm font-semibold text-slate-700">
                历史记录
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-slate-500"
                  onClick={() => setHistoryOpen(false)}
                >
                  <X className="size-4" />
                </Button>
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
          ) : null}
        </div>
      </div>
    </AssistantRuntimeProvider>
  );
};

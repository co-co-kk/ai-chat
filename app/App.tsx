"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  Clipboard,
  RefreshCw,
  Share2,
  SquarePlus,
} from "lucide-react";

import {
  AiChat,
  type AiChatFile,
  type AiChatMessage,
  type AiChatSession,
  type AiChatState,
} from "@/components/ai-chat/ai-chat";
import { mockFiles } from "@/app/mockData/chat-files";
import { mockSessionMessages } from "@/app/mockData/chat-messages";
import { mockChatSessions } from "@/app/mockData/chat-sessions";
import { mockTools } from "@/app/mockData/chat-tools";
import { chatService } from "@/services/chat-service";
import { cn } from "@/lib/utils";

const HeaderButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
  >
    {label}
  </button>
);

const RendererCard = ({ message }: { message: AiChatMessage }) => {
  const meta = message.meta as {
    title?: string;
    subtitle?: string;
    duration?: string;
    sections?: Array<{ title: string; description: string }>;
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
        <span>{meta?.title ?? message.content}</span>
        <span className="text-xs text-emerald-500">{meta?.duration}</span>
      </div>
      <div className="mt-1 text-xs text-slate-400">{meta?.subtitle}</div>
      <div className="mt-3 space-y-2">
        {meta?.sections?.map((section) => (
          <div
            key={section.title}
            className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
          >
            <div className="text-xs font-medium text-slate-600">
              {section.title}
            </div>
            <div className="text-[11px] text-slate-400">
              {section.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InputToolButton = ({
  label,
  onClick,
  className,
}: {
  label: string;
  onClick: () => void;
  className?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500 hover:bg-slate-100",
      className,
    )}
  >
    {label}
  </button>
);

const InputSlot = ({ state }: { state: AiChatState }) => (
  <div className="flex items-center gap-2">
    <button className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
      能力
      <ChevronDown className="size-3" />
    </button>
    <InputToolButton
      label="引用"
      onClick={() => state.setInput(`${state.currentInput}「引用自历史消息」`)}
    />
    <InputToolButton
      label="清空"
      onClick={() => state.setInput("")}
      className="text-blue-600"
    />
  </div>
);

const libraryRows = Array.from({ length: 7 }).map((_, index) => ({
  id: `doc-${index + 1}`,
  name: `文档库文档库文档库文档库文档库文档库文档库${index + 1}`,
  size: "200G",
  owner: "鸡米花",
  date: "2025-10-11",
}));

export const App = () => {
  const [openChat, setOpenChat] = useState(true);
  const [sessions, setSessions] = useState<AiChatSession[]>(mockChatSessions);
  const [sessionMessages, setSessionMessages] = useState(mockSessionMessages);
  const [activeSessionId, setActiveSessionId] = useState(
    mockChatSessions[0]?.id ?? "",
  );
  const [messages, setMessages] = useState<AiChatMessage[]>(
    mockSessionMessages[activeSessionId] ?? [],
  );
  const [attachments, setAttachments] = useState<AiChatFile[]>(mockFiles);

  const [workspaceSessions, setWorkspaceSessions] = useState<AiChatSession[]>(
    mockChatSessions,
  );
  const [workspaceSessionMessages, setWorkspaceSessionMessages] = useState(
    mockSessionMessages,
  );
  const [workspaceActiveSessionId, setWorkspaceActiveSessionId] = useState(
    mockChatSessions[0]?.id ?? "",
  );
  const [workspaceMessages, setWorkspaceMessages] = useState<AiChatMessage[]>(
    mockSessionMessages[workspaceActiveSessionId] ?? [],
  );
  const [workspaceAttachments, setWorkspaceAttachments] = useState<AiChatFile[]>(
    [],
  );

  const handleSessionChange = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setMessages(sessionMessages[sessionId] ?? []);
  };

  const handleWorkspaceSessionChange = (sessionId: string) => {
    setWorkspaceActiveSessionId(sessionId);
    setWorkspaceMessages(workspaceSessionMessages[sessionId] ?? []);
  };

  const handleMessagesChange = (next: AiChatMessage[]) => {
    setMessages(next);
    setSessionMessages((prev) => ({
      ...prev,
      [activeSessionId]: next,
    }));
  };

  const handleWorkspaceMessagesChange = (next: AiChatMessage[]) => {
    setWorkspaceMessages(next);
    setWorkspaceSessionMessages((prev) => ({
      ...prev,
      [workspaceActiveSessionId]: next,
    }));
  };

  const createSendHandler =
    (
      setMessageList: (value: AiChatMessage[] | ((prev: AiChatMessage[]) => AiChatMessage[])) => void,
      sessionId: string,
    ) =>
    async ({
      text,
      attachments: files,
    }: {
      text: string;
      attachments: AiChatFile[];
    }) => {
      const reply = await chatService.sendMessage(sessionId, text, files);
      setMessageList((prev) => [...prev, reply]);
    };

  const createUploadHandler =
    (
      setFileList: (value: AiChatFile[] | ((prev: AiChatFile[]) => AiChatFile[])) => void,
    ) =>
    async (files: File[]) => {
      const next = files.map((file) => ({
        id: `${file.name}-${Date.now()}`,
        name: file.name,
        size: file.size,
        status: "uploading" as const,
        progress: 30,
      }));
      let merged: AiChatFile[] = [];
      setFileList((prev) => {
        merged = [...prev, ...next];
        return merged;
      });
      const uploaded = await chatService.uploadFiles(merged);
      setFileList(uploaded);
      return uploaded;
    };

  const headerActions = useMemo(
    () => (state: AiChatState) => (
      <div className="flex items-center gap-2">
        <HeaderButton label={mockTools[0].label} onClick={state.clearMessages} />
        <HeaderButton
          label={mockTools[1].label}
          onClick={() =>
            state.appendMessage({
              id: `tool-${Date.now()}`,
              role: "assistant",
              type: "text",
              content: "已切换到高阶模型。",
            })
          }
        />
        <HeaderButton label={mockTools[2].label} onClick={() => undefined} />
      </div>
    ),
    [],
  );

  const renderers = useMemo(
    () => ({
      "analysis-card": (message: AiChatMessage) => (
        <RendererCard message={message} />
      ),
    }),
    [],
  );

  return (
    <div className="min-h-dvh bg-[#f5f7fb] px-6 py-8 text-slate-700">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-lg font-semibold">AiChat 组件库演示</div>
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-600">
            React + TypeScript + Tailwind + assistant-ui
          </span>
        </div>
        <button
          type="button"
          onClick={() => setOpenChat(true)}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-600 shadow-sm"
        >
          打开聊天组件
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AiChat
          title="标准模式"
          mode="standard"
          open={openChat}
          onOpenChange={setOpenChat}
          sessions={sessions}
          onSessionsChange={setSessions}
          sessionMessages={sessionMessages}
          initialSessionId={activeSessionId}
          onSessionChange={handleSessionChange}
          onSessionCreate={(session) => {
            setSessions((prev) => [session, ...prev]);
            setSessionMessages((prev) => ({ ...prev, [session.id]: [] }));
            setActiveSessionId(session.id);
            setMessages([]);
          }}
          messages={messages}
          onMessagesChange={handleMessagesChange}
          attachments={attachments}
          onAttachmentsChange={setAttachments}
          onSendMessage={createSendHandler(setMessages, activeSessionId)}
          onAttachmentsSelect={createUploadHandler(setAttachments)}
          onCancelUpload={(file) => {
            chatService.cancelUpload(file.id).then(setAttachments);
          }}
          headerExtra={headerActions}
          inputLeftSlot={({ currentInput }) => (
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
                能力
                <ChevronDown className="size-3" />
              </button>
              <div className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">
                输入中：{currentInput.length} 字
              </div>
            </div>
          )}
          inputRightSlot={({ sendMessage }) => (
            <button
              type="button"
              onClick={() => void sendMessage()}
              className="rounded-full border border-blue-200 px-3 py-1 text-xs text-blue-600 hover:bg-blue-50"
            >
              一键发送
            </button>
          )}
          composerFooterSlot={() => (
            <div className="text-center text-xs text-slate-400">
              AI 生成，仅供参考
            </div>
          )}
          customRenderers={renderers}
        />

        <AiChat
          title="宽屏模式"
          mode="wide"
          sessions={sessions}
          onSessionsChange={setSessions}
          sessionMessages={sessionMessages}
          initialSessionId={activeSessionId}
          onSessionChange={handleSessionChange}
          onSessionCreate={(session) => {
            setSessions((prev) => [session, ...prev]);
            setSessionMessages((prev) => ({ ...prev, [session.id]: [] }));
            setActiveSessionId(session.id);
            setMessages([]);
          }}
          messages={messages}
          onMessagesChange={handleMessagesChange}
          attachments={attachments}
          onAttachmentsChange={setAttachments}
          onSendMessage={createSendHandler(setMessages, activeSessionId)}
          onAttachmentsSelect={createUploadHandler(setAttachments)}
          onCancelUpload={(file) => {
            chatService.cancelUpload(file.id).then(setAttachments);
          }}
          headerExtra={headerActions}
          inputLeftSlot={(state) => <InputSlot state={state} />}
          inputRightSlot={({ currentInput }) => (
            <button
              type="button"
              className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500 hover:bg-slate-100"
            >
              <Clipboard className="size-3" />
              复制({currentInput.length})
            </button>
          )}
          customRenderers={renderers}
          sidePanel={
            <div className="space-y-3 text-xs text-slate-500">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                扩展侧边栏
                <RefreshCw className="size-3" />
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                在这里挂载知识库、推荐问题或统计信息。
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                文件上传、复杂报文和工具卡片均可在主区域渲染。
              </div>
            </div>
          }
        />
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-700">知识库场景</div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button className="flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1">
              <SquarePlus className="size-3" />
              新建文件夹
            </button>
            <button className="flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1">
              <Share2 className="size-3" />
              分享设置
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500">
              <span>文件名</span>
              <span>文件大小</span>
              <span>所有者</span>
              <span>创建时间</span>
            </div>
            {libraryRows.map((row, index) => (
              <div
                key={row.id}
                className={cn(
                  "grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 px-4 py-3 text-xs text-slate-600",
                  index % 2 === 0 ? "bg-white" : "bg-slate-50",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-md bg-blue-50" />
                  <span className="line-clamp-1">{row.name}</span>
                </div>
                <span>{row.size}</span>
                <span>{row.owner}</span>
                <div className="flex items-center justify-between">
                  <span>{row.date}</span>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 rounded-md border border-blue-200 px-2 py-1 text-[11px] text-blue-600">
                      <SquarePlus className="size-3" />
                      添加到对话
                    </button>
                    <button className="rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-500">
                      共享设置
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <AiChat
            title="文档库助手"
            mode="wide"
            sessions={workspaceSessions}
            onSessionsChange={setWorkspaceSessions}
            sessionMessages={workspaceSessionMessages}
            initialSessionId={workspaceActiveSessionId}
            onSessionChange={handleWorkspaceSessionChange}
            onSessionCreate={(session) => {
              setWorkspaceSessions((prev) => [session, ...prev]);
              setWorkspaceSessionMessages((prev) => ({
                ...prev,
                [session.id]: [],
              }));
              setWorkspaceActiveSessionId(session.id);
              setWorkspaceMessages([]);
            }}
            messages={workspaceMessages}
            onMessagesChange={handleWorkspaceMessagesChange}
            attachments={workspaceAttachments}
            onAttachmentsChange={setWorkspaceAttachments}
            onSendMessage={createSendHandler(
              setWorkspaceMessages,
              workspaceActiveSessionId,
            )}
            onAttachmentsSelect={createUploadHandler(setWorkspaceAttachments)}
            onCancelUpload={(file) => {
              chatService.cancelUpload(file.id).then(setWorkspaceAttachments);
            }}
            headerExtra={headerActions}
            inputLeftSlot={({ currentInput }) => (
              <div className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">
                已选文件 {workspaceAttachments.length} | 输入 {currentInput.length}
              </div>
            )}
            customRenderers={renderers}
            sidePanel={
              <div className="space-y-3 text-xs text-slate-500">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  任务面板
                  <RefreshCw className="size-3" />
                </div>
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                  支持将选中文档作为上下文加入对话。
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

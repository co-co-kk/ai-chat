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
  Chat,
  type AiChatFile,
  type AiChatMessage,
  type AiChatSession,
  type AiChatState,
} from "@/components/ai-chat/index";
import { mockFiles } from "@/app/mockData/chat-files";
import { mockSessionMessages } from "@/app/mockData/chat-messages";
import { mockChatSessions } from "@/app/mockData/chat-sessions";
import { mockTools } from "@/app/mockData/chat-tools";
import { chatService } from "@/services/chat-service";
import { cn } from "@/lib/utils";

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

  const handleSessionChange = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setMessages(sessionMessages[sessionId] ?? []);
  };

  const handleMessagesChange = (next: AiChatMessage[]) => {
    setMessages(next);
    setSessionMessages((prev) => ({
      ...prev,
      [activeSessionId]: next,
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

  const renderers = useMemo(
    () => ({
      "analysis-card": (message: AiChatMessage) => (
        <RendererCard message={message} />
      ),
    }),
    [],
  );

  const customDrawerContent = (
    <div className="space-y-3">
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
        这是一个自定义抽屉内容
      </div>
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
        可以放置任何内容
      </div>
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
        比如知识库、工具列表等
      </div>
    </div>
  );

  const customDrawers = [
    {
      id: 'knowledge-base',
      title: '知识库',
      content: customDrawerContent,
    },
    {
      id: 'tools-panel',
      title: '工具面板',
      content: (
        <div className="space-y-3">
          <div className="text-sm font-medium text-slate-700">可用工具</div>
          <div className="space-y-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
              <div className="font-medium text-slate-600">文档分析</div>
              <div className="text-[11px] text-slate-400">分析上传的文档内容</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
              <div className="font-medium text-slate-600">网页搜索</div>
              <div className="text-[11px] text-slate-400">实时搜索网络信息</div>
            </div>
          </div>
        </div>
      ),
    }
  ];

  return (
    <div className="min-h-dvh bg-[#f5f7fb] px-6 py-8 text-slate-700 flex flex-col h-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-lg font-semibold">AiChat 组件库演示 (新组合式 API)</div>
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
      
      <div className="h-full flex-1 ">
        <Chat
          title="标题文案"
          mode="standard"
          open={openChat}
          onOpenChange={setOpenChat}
          sessions={sessions}
          onSessionsChange={setSessions}
          sessionMessages={sessionMessages}
          initialSessionId={activeSessionId}
          onSessionChange={handleSessionChange}
          onSessionCreate={(session: AiChatSession) => {
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
          customRenderers={renderers}
          customDrawers={customDrawers}
        >
          {/* 自定义侧边栏内容 - 只在 wide 模式下显示 */}
          <Chat.SidePanel.Sidebar>
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
          </Chat.SidePanel.Sidebar>
        </Chat>
      </div>
    </div>
  );
};
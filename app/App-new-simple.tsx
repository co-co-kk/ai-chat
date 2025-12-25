"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  RefreshCw,
} from "lucide-react";

// 使用原始的 AiChat 组件进行测试
import {
  AiChat,
  type AiChatFile,
  type AiChatMessage,
  type AiChatSession,
} from "@/components/ai-chat/ai-chat";
import { mockFiles } from "@/app/mockData/chat-files";
import { mockSessionMessages } from "@/app/mockData/chat-messages";
import { mockChatSessions } from "@/app/mockData/chat-sessions";
import { chatService } from "@/services/chat-service";

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

export const AppNew = () => {
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
        <AiChat
          title="标题文案"
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
          inputLeftSlot={({ currentInput, openCustomDrawer, toggleCustomDrawer }) => (
            <div className="flex items-center gap-2">
              <button 
                className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                onClick={() => toggleCustomDrawer('knowledge-base')}
              >
                能力
                <ChevronDown className="size-3" />
              </button>
              <button
                className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                onClick={() => toggleCustomDrawer('tools-panel')}
              >
                工具
                <RefreshCw className="size-3" />
              </button>
              <div className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">
                输入中：{currentInput.length} 字
              </div>
            </div>
          )}
          customRenderers={renderers}
          customDrawers={customDrawers}
        />
      </div>
    </div>
  );
};
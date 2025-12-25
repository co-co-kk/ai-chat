"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  RefreshCw,
} from "lucide-react";

import {
  Chat,
  ChatHeader,
  ChatHeaderTitle,
  ChatHeaderActions,
  ChatHeaderAction,
  ChatMessages,
  ChatEmpty,
  ChatInput,
  ChatInputLeft,
  ChatInputRight,
  ChatInputAttachment,
  ChatInputAction,
  ChatInputSend,
  ChatSidePanel,
  ChatSidebar,
  ChatDrawers,
  ChatDrawer,
  type AiChatFile,
  type AiChatMessage,
  type AiChatSession,
} from "@/components/ai-chat/index";
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
          <div className="text-lg font-semibold">AiChat 组件库演示 (真正组合式 API)</div>
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
        <Chat>
          {/* 自定义头部 */}
          <ChatHeader>
            <ChatHeaderTitle>智能助手</ChatHeaderTitle>
            <ChatHeaderActions>
              <ChatHeaderAction
                label="新会话"
                onClick={() => {
                  const session: AiChatSession = {
                    id: `session-${Date.now()}`,
                    title: "新会话",
                    group: "今天",
                    timeLabel: new Date().toLocaleTimeString("zh-CN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  };
                  setSessions((prev) => [session, ...prev]);
                  setSessionMessages((prev) => ({ ...prev, [session.id]: [] }));
                  setActiveSessionId(session.id);
                  setMessages([]);
                }}
                variant="primary"
              />
              <ChatHeaderAction
                label="历史"
                onClick={() => console.log("打开历史记录")}
                variant="secondary"
              />
            </ChatHeaderActions>
          </ChatHeader>

          {/* 自定义消息区域 */}
          <ChatMessages>
            {messages.length === 0 ? (
              <ChatEmpty>
                <div className="text-center">
                  <p className="text-lg font-medium text-slate-700">你好！我是你的智能助手</p>
                  <p className="text-sm text-slate-500 mt-2">有什么可以帮助你的吗？</p>
                </div>
              </ChatEmpty>
            ) : (
              messages.map((message) => (
                <ChatMessages.Message key={message.id}>
                  {message.type === "analysis-card" ? (
                    <RendererCard message={message} />
                  ) : (
                    <div className={`${
                      message.role === "user" 
                        ? "bg-blue-500 text-white ml-auto max-w-[80%]" 
                        : "bg-slate-100 text-slate-800 max-w-[80%]"
                    } rounded-lg px-4 py-2`}>
                      {message.content}
                    </div>
                  )}
                </ChatMessages.Message>
              ))
            )}
          </ChatMessages>

          {/* 自定义输入框 */}
          <ChatInput>
            <ChatInputLeft>
              <ChatInputAttachment 
                onFileSelect={async (files) => {
                  const next = files.map((file) => ({
                    id: `${file.name}-${Date.now()}`,
                    name: file.name,
                    size: file.size,
                    status: "uploading" as const,
                    progress: 30,
                  }));
                  setAttachments((prev) => [...prev, ...next]);
                  const uploaded = await chatService.uploadFiles([...attachments, ...next]);
                  setAttachments(uploaded);
                }}
              />
              <ChatInputAction
                label="能力"
                onClick={() => console.log("打开能力面板")}
              />
              <ChatInputAction
                label="工具"
                onClick={() => console.log("打开工具面板")}
              />
            </ChatInputLeft>
            <ChatInputRight>
              <ChatInputSend 
                onSend={async () => {
                  const reply = await chatService.sendMessage(activeSessionId, "", attachments);
                  setMessages((prev) => [...prev, reply]);
                }}
              />
            </ChatInputRight>
          </ChatInput>

          {/* 自定义侧边栏 */}
          <ChatSidePanel>
            <ChatSidebar>
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
            </ChatSidebar>
          </ChatSidePanel>

          {/* 自定义抽屉 */}
          <ChatDrawers>
            <ChatDrawer id="knowledge-base" title="知识库">
              {customDrawerContent}
            </ChatDrawer>
            <ChatDrawer id="tools-panel" title="工具面板">
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
            </ChatDrawer>
          </ChatDrawers>
        </Chat>
      </div>
    </div>
  );
};
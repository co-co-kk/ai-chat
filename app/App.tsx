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
} from "@/components/ai-chat";
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
  // 会话列表状态 - 从 mock 数据初始化
  const [sessions, setSessions] = useState<AiChatSession[]>(mockChatSessions);
  
  // 会话消息映射状态 - 存储每个会话的对应消息列表
  const [sessionMessages, setSessionMessages] = useState(mockSessionMessages);
  
  // 当前活动会话ID - 默认为第一个会话
  const [activeSessionId, setActiveSessionId] = useState(
    mockChatSessions[0]?.id ?? "",
  );
  
  // 当前会话的消息列表 - 从对应会话的消息数据初始化
  const [messages, setMessages] = useState<AiChatMessage[]>(
    mockSessionMessages[activeSessionId] ?? [],
  );
  
  // 当前会话的附件列表
  const [attachments, setAttachments] = useState<AiChatFile[]>(mockFiles);

  // 工作区会话相关状态
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

  // 切换会话的处理函数
  // 数据流：点击会话项 → handleSessionChange → 更新 activeSessionId 和 messages
  const handleSessionChange = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setMessages(sessionMessages[sessionId] ?? []);
  };

  const handleWorkspaceSessionChange = (sessionId: string) => {
    setWorkspaceActiveSessionId(sessionId);
    setWorkspaceMessages(workspaceSessionMessages[sessionId] ?? []);
  };

  // 消息列表变化的处理函数
  // 数据流：消息列表更新 → handleMessagesChange → 更新状态并同步到 sessionMessages
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

  // 创建发送消息处理函数
  // 在实际应用中，这里会调用后端API
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
      // TODO: 实际项目中应替换为真实API调用
      // 示例：const reply = await fetch('/api/chat/send', { method: 'POST', body: JSON.stringify({sessionId, text, files}) })
      const reply = await chatService.sendMessage(sessionId, text, files);
      setMessageList((prev) => [...prev, reply]);
    };

  // 创建上传文件处理函数
  // 在实际应用中，这里会调用后端API上传文件
  const createUploadHandler =
    (
      setFileList: (value: AiChatFile[] | ((prev: AiChatFile[]) => AiChatFile[])) => void,
    ) =>
    async (files: File[]) => {
      // 模拟上传过程
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

  // 自定义抽屉内容
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
    {/* grid gap-6 lg:grid-cols-2 */}
      <div className="h-full flex-1 ">
        <AiChat
          title="标题文案"
          mode="standard"
          // mode="wide"
          open={openChat}
          onOpenChange={setOpenChat}
          sessions={sessions}
          onSessionsChange={setSessions}
          // sessionMessages - 会话ID到消息列表的映射，用于根据会话ID加载对应消息
          // 数据流：点击历史会话 → onSessionChange → handleSessionChange → 根据sessionMessages[sessionId]更新消息列表
          sessionMessages={sessionMessages}
          initialSessionId={activeSessionId}
          onSessionChange={handleSessionChange}
          onSessionCreate={(session) => {
            // 创建新会话时，初始化空消息列表
            setSessions((prev) => [session, ...prev]);
            setSessionMessages((prev) => ({ ...prev, [session.id]: [] }));
            setActiveSessionId(session.id);
            setMessages([]);
          }}
          messages={messages}
          onMessagesChange={handleMessagesChange}
          attachments={attachments}
          onAttachmentsChange={setAttachments}
          // 实际项目中，这里应替换为真实API调用
          // 数据流：发送消息 → onSendMessage → createSendHandler → API调用 → 更新消息列表
          onSendMessage={createSendHandler(setMessages, activeSessionId)}
          onAttachmentsSelect={createUploadHandler(setAttachments)}
          onCancelUpload={(file) => {
            chatService.cancelUpload(file.id).then(setAttachments);
          }}
          // headerExtra={headerActions}
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
              </button>
              <div className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">
                输入中：{currentInput.length} 字
              </div>
            </div>
          )}
          // inputRightSlot={({ sendMessage }) => (
          //   <button
          //     type="button"
          //     onClick={() => void sendMessage()}
          //     className="rounded-full border border-blue-200 px-3 py-1 text-xs text-blue-600 hover:bg-blue-50"
          //   >
          //     一键发送
          //   </button>
          // )}
          composerFooterSlot={() => (
            <div className="text-center text-xs text-slate-400">
              AI 生成，仅供参考
            </div>
          )}
          customRenderers={renderers}
          customDrawers={customDrawers}
        />
      </div>
    </div>
  );
};
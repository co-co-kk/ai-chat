"use client";

import { useEffect, useMemo, useState } from "react";
import { Clipboard, Maximize2, RefreshCw } from "lucide-react";

import {
  AiChat,
  type AiChatFile,
  type AiChatMessage,
  type AiChatState,
} from "@/components/ai-chat/ai-chat";
import { mockTools } from "@/mock/tools";
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
    <InputToolButton
      label="引用"
      onClick={() =>
        state.setInput(`${state.currentInput}「引用自历史消息」`)
      }
    />
    <InputToolButton
      label="清空"
      onClick={() => state.setInput("")}
      className="text-blue-600"
    />
  </div>
);

export const App = () => {
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [attachments, setAttachments] = useState<AiChatFile[]>([]);

  useEffect(() => {
    chatService.listMessages().then(setMessages);
  }, []);

  const handleSendMessage = async ({
    text,
    attachments: files,
  }: {
    text: string;
    attachments: AiChatFile[];
  }) => {
    const reply = await chatService.sendMessage(text, files);
    setMessages((prev) => [...prev, reply]);
  };

  const handleUpload = async (files: File[]) => {
    const next = files.map((file) => ({
      id: `${file.name}-${Date.now()}`,
      name: file.name,
      size: file.size,
      status: "uploading" as const,
      progress: 30,
    }));
    const merged = [...attachments, ...next];
    setAttachments(merged);
    const uploaded = await chatService.uploadFiles(merged);
    setAttachments(uploaded);
    return uploaded;
  };

  const headerActions = useMemo(
    () => (state: AiChatState) => (
      <div className="flex items-center gap-2">
        <HeaderButton label={mockTools[0].label} onClick={state.clearMessages} />
        <HeaderButton
          label={mockTools[1].label}
          onClick={() => state.appendMessage({
            id: `tool-${Date.now()}`,
            role: "assistant",
            type: "text",
            content: "已切换到高阶模型。",
          })}
        />
        <HeaderButton label={mockTools[2].label} onClick={() => undefined} />
        <button
          type="button"
          className="rounded-full border border-slate-200 p-1 text-slate-500"
        >
          <Maximize2 className="size-3" />
        </button>
      </div>
    ),
    [],
  );

  return (
    <div className="min-h-dvh bg-[#f5f7fb] px-6 py-8 text-slate-700">
      <div className="mb-6 flex items-center gap-3">
        <div className="text-lg font-semibold">AiChat 组件库演示</div>
        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-600">
          React + TypeScript + Tailwind
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AiChat
          title="标准模式"
          mode="standard"
          messages={messages}
          onMessagesChange={setMessages}
          attachments={attachments}
          onAttachmentsChange={setAttachments}
          onSendMessage={handleSendMessage}
          onAttachmentsSelect={handleUpload}
          onCancelUpload={(file) => {
            chatService.cancelUpload(file.id).then(setAttachments);
          }}
          headerExtra={headerActions}
          inputLeftSlot={({ currentInput }) => (
            <div className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">
              输入中：{currentInput.length} 字
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
          customRenderers={{
            "analysis-card": (message) => <RendererCard message={message} />,
          }}
        />

        <AiChat
          title="宽屏模式"
          mode="wide"
          messages={messages}
          onMessagesChange={setMessages}
          attachments={attachments}
          onAttachmentsChange={setAttachments}
          onSendMessage={handleSendMessage}
          onAttachmentsSelect={handleUpload}
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
          customRenderers={{
            "analysis-card": (message) => <RendererCard message={message} />,
          }}
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
    </div>
  );
};

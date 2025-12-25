"use client";

import { useState, useCallback } from "react";
import { Plus, History, Maximize, Minimize, CircleX, Pin, Paperclip, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

// 类型定义
export type ChatProps = {
  children?: React.ReactNode;
  className?: string;
};

// 简单的内部状态
const SimpleChat = ({ children, className }: ChatProps) => {
  const [messages, setMessages] = useState<Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: string;
  }>>([]);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Array<{
    id: string;
    name: string;
    size: number;
    status: string;
  }>>([]);
  const [isSending, setIsSending] = useState(false);
  const [mode, setMode] = useState("standard");
  const [open, setOpen] = useState(true);
  const [isPinned, setIsPinned] = useState(false);

  const sendMessage = useCallback(async () => {
    if (!input.trim() && attachments.length === 0) return;
    
    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input,
      createdAt: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setAttachments([]);
    setIsSending(true);
    
    // 模拟AI回复
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: `收到你的消息："${input}"。我是AI助手，很高兴为您服务！`,
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsSending(false);
    }, 1000);
  }, [input, attachments]);

  const handleFileSelect = useCallback((files: File[]) => {
    const newFiles = files.map(file => ({
      id: file.name + Date.now(),
      name: file.name,
      size: file.size,
      status: "success" as const,
    }));
    setAttachments(prev => [...prev, ...newFiles]);
  }, []);

  const handleToggleMode = useCallback(() => {
    setMode(prev => prev === "wide" ? "standard" : "wide");
  }, []);

  if (!open) {
    return null;
  }

  return (
    <div className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg",
      className
    )}>
      {/* 头部 */}
      <header className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <div className="flex size-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <span className="text-xs">🤖</span>
          </div>
          <span>智能助手</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => console.log("新建会话")}
            className="bg-[#002FA7] text-[#fff] hover:bg-[#002FA7] w-[72px] h-[30px] rounded-[6px] px-[5px] text-xs flex items-center justify-center gap-1"
          >
            <Plus className="size-3" />
            新会话
          </button>
          <button
            type="button"
            onClick={() => console.log("打开历史记录")}
            className="flex size-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          >
            <History className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleToggleMode}
            className="flex size-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          >
            {mode === 'standard' ? <Maximize className="size-4" /> : <Minimize className="size-4" />}
          </button>
          <button
            type="button"
            onClick={() => setIsPinned(!isPinned)}
            className="flex size-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          >
            <Pin className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex size-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          >
            <CircleX className="size-4" />
          </button>
        </div>
      </header>

      {/* 主体 */}
      <div className={cn(
        "relative flex flex-1 flex-col bg-white",
        mode === "wide" && "md:flex-row"
      )}>
        <div className="flex min-h-0 flex-1 flex-col">
          {/* 消息区域 */}
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {messages.length === 0 ? (
                <div className="flex w-full flex-grow flex-col items-center justify-center">
                  <p className="mt-4 font-medium text-slate-700">你好！我是你的智能助手</p>
                  <p className="text-sm text-slate-500 mt-2">有什么可以帮助你的吗？</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg px-4 py-2",
                          message.role === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-slate-100 text-slate-800"
                        )}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 输入框 */}
          <div className="border-t border-slate-100 p-4">
            <div className="flex w-full flex-wrap items-end rounded-lg border border-slate-200 bg-white px-2.5 shadow-sm">
              <div className="flex items-center gap-2">
                <label className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50">
                  <Paperclip className="size-4" />
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      if (files.length) handleFileSelect(files);
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => console.log("打开能力面板")}
                  className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-100"
                >
                  能力
                </button>
                {attachments.length > 0 && (
                  <div className="text-xs text-slate-500">
                    附件: {attachments.length}
                  </div>
                )}
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="我有什么可以帮您的吗？"
                rows={1}
                className="max-h-40 flex-grow resize-none border-none bg-transparent px-2 py-4 text-sm outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={isSending || (!input.trim() && attachments.length === 0)}
                className="flex size-9 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 my-2.5"
              >
                <ArrowUp className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 侧边栏 */}
        {mode === "wide" && (
          <aside className="border-t border-slate-100 bg-slate-50 px-4 py-4 md:w-80 md:border-l md:border-t-0">
            <div className="space-y-3 text-xs text-slate-500">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                扩展侧边栏
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                在这里挂载知识库、推荐问题或统计信息。
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                文件上传、复杂报文和工具卡片均可在主区域渲染。
              </div>
              {children && (
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                  {children}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

// 子组件（为了保持API一致性）
SimpleChat.Header = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
  <header className={cn("flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3", className)}>
    {children}
  </header>
);

SimpleChat.Messages = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
  <div className={cn("flex-1 overflow-y-auto px-4 py-4", className)}>
    {children}
  </div>
);

SimpleChat.Input = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
  <div className={cn("border-t border-slate-100 p-4", className)}>
    {children}
  </div>
);

SimpleChat.SidePanel = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
  <aside className={cn("border-t border-slate-100 bg-slate-50 px-4 py-4 md:w-80 md:border-l md:border-t-0", className)}>
    {children}
  </aside>
);

export default SimpleChat;
export { SimpleChat as Chat };
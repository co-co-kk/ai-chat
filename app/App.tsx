"use client";

import { useState } from "react";
import { Chat } from "@/components/ai-chat/working-chat";

export const App = () => {
  const [openChat, setOpenChat] = useState(true);

  return (
    <div className="min-h-dvh bg-[#f5f7fb] px-6 py-8 text-slate-700 flex flex-col h-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-lg font-semibold">AiChat 组件库演示 (简单组合式 API)</div>
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
      
      <div className="h-full flex-1">
        <Chat>
          {/* 可选的侧边栏内容 */}
          <div className="text-xs text-slate-500">
            <div className="font-semibold text-slate-700 mb-2">自定义侧边栏内容</div>
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 mb-2">
              这里可以放置任何自定义内容
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
              比如知识库、推荐问题或统计信息
            </div>
          </div>
        </Chat>
      </div>
    </div>
  );
};
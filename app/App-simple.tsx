"use client";

import { useState } from "react";
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
  ChatInputSend,
  ChatSidePanel,
  ChatSidebar,
} from "@/components/ai-chat/index";

export const AppSimple = () => {
  const [openChat, setOpenChat] = useState(true);

  return (
    <div className="min-h-dvh bg-[#f5f7fb] px-6 py-8 text-slate-700 flex flex-col h-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-lg font-semibold">AiChat 简洁组合式 API</div>
          <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-600">
            最少配置，开箱即用
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
          {/* 最简配置 - 只需要必要的结构 */}
          <ChatHeader>
            <ChatHeaderTitle />
            <ChatHeaderActions>
              <ChatHeaderAction
                label="新会话"
                onClick={() => console.log("新建会话")}
                variant="primary"
              />
            </ChatHeaderActions>
          </ChatHeader>

          <ChatMessages>
            <ChatEmpty />
          </ChatMessages>

          <ChatInput>
            <ChatInputLeft />
            <ChatInputRight>
              <ChatInputSend />
            </ChatInputRight>
          </ChatInput>

          <ChatSidePanel>
            <ChatSidebar>
              <div className="text-xs text-slate-500">
                侧边栏内容（仅在 wide 模式显示）
              </div>
            </ChatSidebar>
          </ChatSidePanel>
        </Chat>
      </div>
    </div>
  );
};
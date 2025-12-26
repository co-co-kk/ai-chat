import React, { useState } from "react";
import { AiChat, ChatHeader } from "../index";
import { Button } from "@/components/ui/button";

// 🎯 ChatHeader 自定义扩展示例
// 展示如何完全自定义头部功能

export const HeaderCustomizationExample: React.FC = () => {
  const [customMode, setCustomMode] = useState<"standard" | "wide">("standard");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  // 示例状态
  const mockState = {
    input: "",
    currentInput: "",
    messages: [],
    attachments: [],
    isSending: false,
    setInput: () => {},
    setAttachments: () => {},
    appendMessage: () => {},
    clearMessages: () => {},
    sendMessage: async () => {},
    openCustomDrawer: () => {},
    closeCustomDrawer: () => {},
    toggleCustomDrawer: () => {},
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-lg font-semibold">ChatHeader 自定义扩展示例</h2>

      {/* 示例1: 完全默认头部 */}
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-2">1. 完全默认头部</h3>
        <ChatHeader
          title="默认头部"
          mode={customMode}
          historyOpen={historyOpen}
          isPinned={isPinned}
          onCreateSession={() => alert("创建新会话")}
          onToggleHistory={() => setHistoryOpen(!historyOpen)}
          onToggleMode={() => setCustomMode(customMode === "standard" ? "wide" : "standard")}
          onTogglePin={() => setIsPinned(!isPinned)}
          onClose={() => alert("关闭窗口")}
          state={mockState}
        />
      </div>

      {/* 示例2: 隐藏部分默认按钮 */}
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-2">2. 隐藏部分按钮</h3>
        <ChatHeader
          title="精简头部"
          mode={customMode}
          historyOpen={historyOpen}
          isPinned={isPinned}
          showNewSessionButton={false}
          showCloseButton={false}
          onCreateSession={() => alert("创建新会话")}
          onToggleHistory={() => setHistoryOpen(!historyOpen)}
          onToggleMode={() => setCustomMode(customMode === "standard" ? "wide" : "standard")}
          onTogglePin={() => setIsPinned(!isPinned)}
          onClose={() => alert("关闭窗口")}
          state={mockState}
        />
      </div>

      {/* 示例3: 自定义头部内容 */}
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-2">3. 自定义头部内容</h3>
        <ChatHeader
          title="自定义头部"
          mode={customMode}
          historyOpen={historyOpen}
          isPinned={isPinned}
          headerLeft={(state) => (
            <div className="flex items-center gap-2">
              <span className="text-blue-600">🎯</span>
              <span className="font-bold">{state.messages.length} 条消息</span>
            </div>
          )}
          headerExtra={(state) => (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                导出
              </Button>
              <Button size="sm" variant="outline">
                设置
              </Button>
            </div>
          )}
          onCreateSession={() => alert("创建新会话")}
          onToggleHistory={() => setHistoryOpen(!historyOpen)}
          onToggleMode={() => setCustomMode(customMode === "standard" ? "wide" : "standard")}
          onTogglePin={() => setIsPinned(!isPinned)}
          onClose={() => alert("关闭窗口")}
          state={mockState}
        />
      </div>

      {/* 示例4: 完全自定义按钮 */}
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-2">4. 完全自定义按钮</h3>
        <ChatHeader
          title="完全自定义"
          mode={customMode}
          historyOpen={historyOpen}
          isPinned={isPinned}
          showDefaultHeaderActions={false}
          headerExtra={(state) => (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost">
                分享
              </Button>
              <Button size="sm" variant="ghost">
                帮助
              </Button>
              <Button size="sm" variant="ghost">
                更多
              </Button>
            </div>
          )}
          state={mockState}
        />
      </div>

      {/* 示例5: 集成到AiChat组件 */}
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-2">5. 集成到AiChat组件</h3>
        <div className="h-[400px]">
          <AiChat
            title="集成示例"
            headerExtra={(state) => (
              <Button size="sm" variant="outline">
                高级设置
              </Button>
            )}
          />
        </div>
      </div>
    </div>
  );
};
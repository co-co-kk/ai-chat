import React from "react";
import { Plus, History, Maximize, Minimize, Pin, CircleX, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AiChatState } from "../types";

// 🎩 增强版聊天头部组件
// 支持完整的默认功能 + 灵活的自定义扩展

interface ChatHeaderProps {
  title: string;
  mode: "standard" | "wide";
  historyOpen: boolean;
  isPinned: boolean;
  showDefaultHeaderActions?: boolean;
  
  // 默认按钮的显示控制
  showNewSessionButton?: boolean;
  showHistoryButton?: boolean;
  showModeToggleButton?: boolean;
  showPinButton?: boolean;
  showCloseButton?: boolean;
  
  // 事件回调
  onCreateSession?: () => void;
  onToggleHistory?: () => void;
  onToggleMode?: () => void;
  onTogglePin?: () => void;
  onClose?: () => void;
  
  // 自定义扩展
  headerExtra?: (state: AiChatState) => React.ReactNode;
  headerLeft?: (state: AiChatState) => React.ReactNode;
  
  state: AiChatState;
}

// 默认按钮配置
const defaultButtons = {
  newSession: {
    icon: Plus,
    label: "新会话",
    className: "flex items-center gap-1 w-[72px] h-[30px] rounded-[6px] bg-[#002FA7] px-[5px] text-xs text-[#fff] hover:bg-[#0035b8] cursor-pointer",
  },
  history: {
    icon: History,
    label: "历史会话",
    className: "flex size-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 cursor-pointer",
    activeClassName: "border-blue-200 text-blue-600",
  },
  modeToggle: {
    standard: { icon: Maximize, label: "展开" },
    wide: { icon: Minimize, label: "收缩" },
    className: "flex size-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 cursor-pointer",
  },
  pin: {
    icon: Pin,
    label: "固定",
    className: "flex size-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 cursor-pointer",
    activeClassName: "border-blue-200 text-blue-600",
  },
  close: {
    icon: CircleX,
    label: "关闭",
    className: "flex size-7 items-center justify-center rounded-full text-slate-500 cursor-pointer hover:bg-slate-100",
  },
};

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  mode,
  historyOpen,
  isPinned,
  showDefaultHeaderActions = true,
  showNewSessionButton = true,
  showHistoryButton = true,
  showModeToggleButton = true,
  showPinButton = true,
  showCloseButton = true,
  onCreateSession,
  onToggleHistory,
  onToggleMode,
  onTogglePin,
  onClose,
  headerExtra,
  headerLeft,
  state,
}) => {
  // 渲染左侧内容
  const renderLeftContent = () => {
    if (headerLeft) {
      return headerLeft(state);
    }

    return (
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <div className="flex size-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <span className="text-xs">🤖</span>
        </div>
        <span>{title}</span>
      </div>
    );
  };

  // 渲染默认按钮
  const renderDefaultButtons = () => {
    if (!showDefaultHeaderActions) return null;

    return (
      <>
        {/* 新建会话按钮 */}
        {showNewSessionButton && onCreateSession && (
          <button
            type="button"
            onClick={onCreateSession}
            className={defaultButtons.newSession.className}
            title="创建新会话"
          >
            <Plus className="size-4" />
            新会话
          </button>
        )}

        {/* 历史会话按钮 */}
        {showHistoryButton && onToggleHistory && (
          <button
            type="button"
            onClick={onToggleHistory}
            className={cn(
              defaultButtons.history.className,
              historyOpen && defaultButtons.history.activeClassName
            )}
            title="历史会话"
            aria-label="历史会话"
          >
            <History className="size-4" />
          </button>
        )}

        {/* 布局切换按钮 */}
        {showModeToggleButton && onToggleMode && (
          <button
            type="button"
            onClick={onToggleMode}
            className={defaultButtons.modeToggle.className}
            title={mode === "standard" ? defaultButtons.modeToggle.standard.label : defaultButtons.modeToggle.wide.label}
            aria-label="切换布局"
          >
            {mode === "standard" ? (
              <Maximize className="size-4" />
            ) : (
              <Minimize className="size-4" />
            )}
          </button>
        )}

        {/* 固定按钮 */}
        {showPinButton && onTogglePin && (
          <button
            type="button"
            onClick={onTogglePin}
            className={cn(
              defaultButtons.pin.className,
              isPinned && defaultButtons.pin.activeClassName
            )}
            title={isPinned ? "取消固定" : "固定窗口"}
            aria-label="固定窗口"
          >
            <Pin className="size-4" />
          </button>
        )}

        {/* 关闭按钮 */}
        {showCloseButton && onClose && (
          <button
            type="button"
            onClick={onClose}
            className={defaultButtons.close.className}
            title="关闭窗口"
            aria-label="关闭窗口"
          >
            <CircleX className="size-4" />
          </button>
        )}
      </>
    );
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
      {/* 左侧内容 */}
      {renderLeftContent()}
      
      {/* 右侧按钮区域 */}
      <div className="flex items-center gap-2">
        {/* 默认按钮 */}
        {renderDefaultButtons()}
        
        {/* 自定义扩展内容 */}
        {headerExtra?.(state)}
      </div>
    </header>
  );
};

// 预设配置
ChatHeader.defaultProps = {
  showDefaultHeaderActions: true,
  showNewSessionButton: true,
  showHistoryButton: true,
  showModeToggleButton: true,
  showPinButton: true,
  showCloseButton: true,
};
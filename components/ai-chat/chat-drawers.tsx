"use client";

import { forwardRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useChatContext } from "./chat";
import { X } from "lucide-react";

export type ChatDrawersProps = {
  children: ReactNode;
  className?: string;
};

export const ChatDrawers = forwardRef<HTMLDivElement, ChatDrawersProps>(
  ({ children, className }, ref) => {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  },
);

ChatDrawers.displayName = "Chat.Drawers";

export type ChatDrawerProps = {
  id: string;
  title?: string;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

export const ChatDrawer = forwardRef<HTMLDivElement, ChatDrawerProps>(
  ({ id, title, children, open, onOpenChange, className }, ref) => {
    const { customDrawers, state, onDrawerToggle } = useChatContext();
    
    // 查找对应的自定义抽屉配置
    const drawerConfig = customDrawers.find(drawer => drawer.id === id);
    const drawerTitle = title || drawerConfig?.title || id;
    const isOpen = open !== undefined ? open : false; // 这里需要从状态中获取实际的开关状态
    
    const handleClose = () => {
      onOpenChange?.(false);
      state.closeCustomDrawer(id);
      onDrawerToggle(id, false);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "absolute inset-y-0 right-0 z-20 w-72 border-l border-slate-200 bg-white shadow-[-12px_0_24px_rgba(15,23,42,0.08)] transition-transform",
          isOpen ? "translate-x-0" : "translate-x-full",
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
          {drawerTitle}
          <button
            type="button"
            onClick={handleClose}
            className="flex size-6 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="h-full overflow-y-auto px-4 py-3">
          {children}
        </div>
      </div>
    );
  },
);

ChatDrawer.displayName = "Chat.Drawer";

// 设置子组件关系
ChatDrawers.Drawer = ChatDrawer;
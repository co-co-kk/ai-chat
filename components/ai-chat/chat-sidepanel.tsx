"use client";

import { forwardRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useChatContext } from "./chat";

export type ChatSidePanelProps = {
  children: ReactNode;
  className?: string;
};

export const ChatSidePanel = forwardRef<HTMLDivElement, ChatSidePanelProps>(
  ({ children, className }, ref) => {
    const { mode } = useChatContext();
    
    if (mode !== "wide") {
      return null;
    }

    return (
      <aside
        ref={ref}
        className={cn(
          "border-t border-slate-100 bg-slate-50 px-4 py-4 md:w-80 md:border-l md:border-t-0",
          className,
        )}
      >
        {children}
      </aside>
    );
  },
);

ChatSidePanel.displayName = "Chat.SidePanel";

export type ChatSidebarProps = {
  children: ReactNode;
  className?: string;
};

export const ChatSidebar = forwardRef<HTMLDivElement, ChatSidebarProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("space-y-3", className)}
      >
        {children}
      </div>
    );
  },
);

ChatSidebar.displayName = "Chat.Sidebar";

// 设置子组件关系
ChatSidePanel.Sidebar = ChatSidebar;
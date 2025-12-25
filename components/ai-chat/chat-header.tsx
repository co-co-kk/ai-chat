"use client";

import { forwardRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useChatContext } from "./chat";

export type ChatHeaderProps = {
  children: ReactNode;
  className?: string;
};

export const ChatHeader = forwardRef<HTMLDivElement, ChatHeaderProps>(
  ({ children, className }, ref) => {
    const { title } = useChatContext();
    
    return (
      <header
        ref={ref}
        className={cn(
          "flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3",
          className,
        )}
      >
        {children}
      </header>
    );
  },
);

ChatHeader.displayName = "Chat.Header";

// Header 子组件
export type ChatHeaderTitleProps = {
  children?: ReactNode;
  className?: string;
};

export const ChatHeaderTitle = forwardRef<HTMLDivElement, ChatHeaderTitleProps>(
  ({ children, className }, ref) => {
    const { title } = useChatContext();
    
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2 text-sm font-semibold text-slate-700",
          className,
        )}
      >
        <div className="flex size-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <span className="text-xs">🤖</span>
        </div>
        <span>{children || title}</span>
      </div>
    );
  },
);

ChatHeaderTitle.displayName = "Chat.Header.Title";

export type ChatHeaderActionsProps = {
  children: ReactNode;
  className?: string;
};

export const ChatHeaderActions = forwardRef<HTMLDivElement, ChatHeaderActionsProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2", className)}
      >
        {children}
      </div>
    );
  },
);

ChatHeaderActions.displayName = "Chat.Header.Actions";

export type ChatHeaderActionProps = {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  variant?: "default" | "primary" | "secondary";
  className?: string;
};

export const ChatHeaderAction = forwardRef<HTMLButtonElement, ChatHeaderActionProps>(
  ({ label, onClick, icon, variant = "default", className }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case "primary":
          return "bg-[#002FA7] text-[#fff] hover:bg-[#002FA7] w-[72px] h-[30px] rounded-[6px] px-[5px] text-xs";
        case "secondary":
          return "flex size-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100";
        default:
          return "rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-100";
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={cn(getVariantStyles(), className)}
      >
        {icon}
        {variant !== "secondary" && label}
      </button>
    );
  },
);

ChatHeaderAction.displayName = "Chat.Header.Action";

// 设置子组件关系
ChatHeader.Title = ChatHeaderTitle;
ChatHeader.Actions = ChatHeaderActions;
ChatHeader.Action = ChatHeaderAction;
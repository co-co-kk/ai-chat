"use client";

import { forwardRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useChatContext } from "./chat";

export type ChatMessagesProps = {
  children?: ReactNode;
  className?: string;
};

export const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

ChatMessages.displayName = "Chat.Messages";

export type ChatMessageProps = {
  message?: any;
  children?: ReactNode;
  className?: string;
};

export const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(
  ({ message, children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("py-4", className)}
      >
        {children}
      </div>
    );
  },
);

ChatMessage.displayName = "Chat.Message";

export type ChatEmptyProps = {
  children?: ReactNode;
  className?: string;
};

export const ChatEmpty = forwardRef<HTMLDivElement, ChatEmptyProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full flex-grow flex-col items-center justify-center",
          className,
        )}
      >
        {children || (
          <div className="text-center">
            <p className="mt-4 font-medium text-slate-700">How can I help you today?</p>
          </div>
        )}
      </div>
    );
  },
);

ChatEmpty.displayName = "Chat.Empty";

// 设置子组件关系
ChatMessages.Message = ChatMessage;
ChatMessages.Empty = ChatEmpty;
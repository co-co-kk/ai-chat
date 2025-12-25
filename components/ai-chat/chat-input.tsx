"use client";

import { forwardRef } from "react";
import type { ChangeEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useChatContext } from "./chat";
import { Paperclip, ArrowUp } from "lucide-react";

export type ChatInputProps = {
  children?: ReactNode;
  className?: string;
};

export const ChatInput = forwardRef<HTMLDivElement, ChatInputProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full flex-wrap items-end rounded-lg border border-slate-200 bg-white px-2.5 shadow-sm",
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

ChatInput.displayName = "Chat.Input";

export type ChatInputFieldProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export const ChatInputField = forwardRef<HTMLTextAreaElement, ChatInputFieldProps>(
  ({ value, onChange, placeholder, disabled = false, className }, ref) => {
    const { placeholder: contextPlaceholder, disabled: contextDisabled } = useChatContext();
    
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <textarea
        ref={ref}
        value={value}
        onChange={handleChange}
        placeholder={placeholder || contextPlaceholder}
        disabled={disabled || contextDisabled}
        rows={1}
        className={cn(
          "max-h-40 flex-grow resize-none border-none bg-transparent px-2 py-4 text-sm outline-none",
          className,
        )}
      />
    );
  },
);

ChatInputField.displayName = "Chat.Input.Field";

export type ChatInputLeftProps = {
  children: ReactNode;
  className?: string;
};

export const ChatInputLeft = forwardRef<HTMLDivElement, ChatInputLeftProps>(
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

ChatInputLeft.displayName = "Chat.Input.Left";

export type ChatInputRightProps = {
  children: ReactNode;
  className?: string;
};

export const ChatInputRight = forwardRef<HTMLDivElement, ChatInputRightProps>(
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

ChatInputRight.displayName = "Chat.Input.Right";

export type ChatInputAttachmentProps = {
  onFileSelect?: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
};

export const ChatInputAttachment = forwardRef<HTMLLabelElement, ChatInputAttachmentProps>(
  ({ onFileSelect, disabled = false, className }, ref) => {
    const { onAttachmentsSelect } = useChatContext();
    
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? []);
      if (!files.length) return;
      onFileSelect?.(files);
      onAttachmentsSelect?.(files);
    };

    return (
      <label
        ref={ref}
        className={cn(
          "flex size-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50",
          className,
        )}
      >
        <Paperclip className="size-4" />
        <input
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
        />
      </label>
    );
  },
);

ChatInputAttachment.displayName = "Chat.Input.Attachment";

export type ChatInputActionProps = {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  variant?: "default" | "primary";
  className?: string;
};

export const ChatInputAction = forwardRef<HTMLButtonElement, ChatInputActionProps>(
  ({ label, onClick, icon, variant = "default", className }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case "primary":
          return "flex size-9 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300";
        default:
          return "flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500 hover:bg-slate-100";
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
        {variant !== "primary" && label}
      </button>
    );
  },
);

ChatInputAction.displayName = "Chat.Input.Action";

export type ChatInputSendProps = {
  onSend?: () => void;
  disabled?: boolean;
  className?: string;
};

export const ChatInputSend = forwardRef<HTMLButtonElement, ChatInputSendProps>(
  ({ onSend, disabled = false, className }, ref) => {
    const { state } = useChatContext();
    
    const handleClick = () => {
      onSend?.();
      state.sendMessage();
    };

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        disabled={disabled || state.isSending}
        className={cn(
          "flex size-9 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 my-2.5",
          className,
        )}
      >
        <ArrowUp className="size-4" />
      </button>
    );
  },
);

ChatInputSend.displayName = "Chat.Input.Send";

// 设置子组件关系
ChatInput.Field = ChatInputField;
ChatInput.Left = ChatInputLeft;
ChatInput.Right = ChatInputRight;
ChatInput.Attachment = ChatInputAttachment;
ChatInput.Action = ChatInputAction;
ChatInput.Send = ChatInputSend;
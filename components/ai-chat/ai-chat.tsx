"use client";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import type {
  ReactNode,
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from "react";
import {
  FileArchive,
  FileImage,
  FileText,
  Paperclip,
  Send,
  TriangleAlert,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type AiChatLayoutMode = "standard" | "wide";
export type AiChatMessageRole = "assistant" | "user" | "system";
export type AiChatFileStatus = "idle" | "uploading" | "success" | "error";
export type AiChatFileKind = "image" | "pdf" | "archive" | "other";

export type AiChatFile = {
  id: string;
  name: string;
  size: number;
  status?: AiChatFileStatus;
  progress?: number;
  kind?: AiChatFileKind;
  url?: string;
  errorMessage?: string;
};

export type AiChatMessage = {
  id: string;
  role: AiChatMessageRole;
  type?: string;
  content?: string;
  files?: AiChatFile[];
  meta?: Record<string, unknown>;
  createdAt?: string;
};

export type AiChatState = {
  input: string;
  messages: AiChatMessage[];
  attachments: AiChatFile[];
  isSending: boolean;
  setInput: Dispatch<SetStateAction<string>>;
  setAttachments: Dispatch<SetStateAction<AiChatFile[]>>;
  appendMessage: (message: AiChatMessage) => void;
  clearMessages: () => void;
  sendMessage: (payload?: {
    text?: string;
    files?: AiChatFile[];
    role?: AiChatMessageRole;
    type?: string;
  }) => Promise<void>;
};

export type AiChatHandle = {
  sendMessage: AiChatState["sendMessage"];
  appendMessage: AiChatState["appendMessage"];
  clearMessages: AiChatState["clearMessages"];
};

export type AiChatProps = {
  className?: string;
  title?: string;
  layoutMode?: AiChatLayoutMode;
  sidePanel?: ReactNode;
  sidePanelClassName?: string;
  headerActions?: (state: AiChatState) => ReactNode;
  renderInputLeft?: (state: AiChatState) => ReactNode;
  renderInputRight?: (state: AiChatState) => ReactNode;
  renderComposerFooter?: (state: AiChatState) => ReactNode;
  messageRenderers?: Record<
    string,
    (message: AiChatMessage, state: AiChatState) => ReactNode
  >;
  messages?: AiChatMessage[];
  defaultMessages?: AiChatMessage[];
  onMessagesChange?: (messages: AiChatMessage[]) => void;
  attachments?: AiChatFile[];
  defaultAttachments?: AiChatFile[];
  onAttachmentsChange?: (files: AiChatFile[]) => void;
  onSendMessage?: (payload: {
    text: string;
    attachments: AiChatFile[];
    message: AiChatMessage;
  }) => void | Promise<void>;
  onInputChange?: (value: string) => void;
  onAttachmentsSelect?: (
    files: File[],
  ) => void | AiChatFile[] | Promise<AiChatFile[]>;
  placeholder?: string;
  disabled?: boolean;
};

const useControllableState = <T,>({
  value,
  defaultValue,
  onChange,
}: {
  value?: T;
  defaultValue: T;
  onChange?: (next: T) => void;
}) => {
  const [internalValue, setInternalValue] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? (value as T) : internalValue;

  const setValue = useCallback(
    (next: SetStateAction<T>) => {
      const resolved =
        typeof next === "function"
          ? (next as (prev: T) => T)(currentValue)
          : next;
      if (!isControlled) {
        setInternalValue(resolved);
      }
      onChange?.(resolved);
    },
    [currentValue, isControlled, onChange],
  );

  return [currentValue, setValue] as const;
};

const createId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const formatSize = (size: number) => {
  if (size <= 0) return "0KB";
  const kb = size / 1024;
  if (kb < 1024) return `${kb.toFixed(0)}KB`;
  return `${(kb / 1024).toFixed(1)}MB`;
};

const resolveFileKind = (file: AiChatFile): AiChatFileKind => {
  if (file.kind) return file.kind;
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return "pdf";
  if (name.endsWith(".zip") || name.endsWith(".rar") || name.endsWith(".7z")) {
    return "archive";
  }
  if (
    name.endsWith(".png") ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    name.endsWith(".webp") ||
    name.endsWith(".gif")
  ) {
    return "image";
  }
  return "other";
};

const FileIcon = ({ kind }: { kind: AiChatFileKind }) => {
  if (kind === "pdf") return <FileText className="size-4 text-emerald-500" />;
  if (kind === "archive")
    return <FileArchive className="size-4 text-amber-500" />;
  if (kind === "image") return <FileImage className="size-4 text-blue-500" />;
  return <FileText className="size-4 text-slate-400" />;
};

const AttachmentCard = ({ file }: { file: AiChatFile }) => {
  const kind = resolveFileKind(file);
  const isError = file.status === "error";
  const isUploading = file.status === "uploading";
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border bg-white px-3 py-2 text-xs shadow-sm",
        isError && "border-red-300 bg-red-50",
        isUploading && "border-blue-200 bg-blue-50",
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex size-6 items-center justify-center rounded-md bg-white shadow-sm">
          {isError ? (
            <TriangleAlert className="size-4 text-red-500" />
          ) : (
            <FileIcon kind={kind} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-slate-700">
            {file.name}
          </div>
          <div className="text-[11px] text-slate-400">
            {formatSize(file.size)}
          </div>
        </div>
        <div className="text-[11px] font-medium text-slate-400">
          {file.status === "uploading" ? "上传中" : null}
          {file.status === "success" ? "完成" : null}
          {file.status === "error" ? "失败" : null}
        </div>
      </div>
      {isUploading ? (
        <div className="h-1 w-full overflow-hidden rounded-full bg-blue-100">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{ width: `${Math.min(file.progress ?? 0, 100)}%` }}
          />
        </div>
      ) : null}
      {isError && file.errorMessage ? (
        <div className="text-[11px] text-red-500">{file.errorMessage}</div>
      ) : null}
    </div>
  );
};

export const AiChat = forwardRef<AiChatHandle, AiChatProps>(
  (
    {
      className,
      title = "标题文案",
      layoutMode = "standard",
      sidePanel,
      sidePanelClassName,
      headerActions,
      renderInputLeft,
      renderInputRight,
      renderComposerFooter,
      messageRenderers,
      messages,
      defaultMessages = [],
      onMessagesChange,
      attachments,
      defaultAttachments = [],
      onAttachmentsChange,
      onSendMessage,
      onInputChange,
      onAttachmentsSelect,
      placeholder = "我有什么可以帮您的吗？",
      disabled = false,
    },
    ref,
  ) => {
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [messageList, setMessageList] = useControllableState({
      value: messages,
      defaultValue: defaultMessages,
      onChange: onMessagesChange,
    });
    const [attachmentList, setAttachmentList] = useControllableState({
      value: attachments,
      defaultValue: defaultAttachments,
      onChange: onAttachmentsChange,
    });

    const appendMessage = useCallback(
      (message: AiChatMessage) => {
        setMessageList((prev) => [...prev, message]);
      },
      [setMessageList],
    );

    const clearMessages = useCallback(() => {
      setMessageList([]);
    }, [setMessageList]);

    const sendMessage = useCallback(
      async (payload?: {
        text?: string;
        files?: AiChatFile[];
        role?: AiChatMessageRole;
        type?: string;
      }) => {
        const text = payload?.text ?? input.trim();
        const files = payload?.files ?? attachmentList;
        if (!text && files.length === 0) return;
        const message: AiChatMessage = {
          id: createId(),
          role: payload?.role ?? "user",
          type: payload?.type ?? "text",
          content: text,
          files: files.length ? files : undefined,
          createdAt: new Date().toISOString(),
        };
        appendMessage(message);
        setInput("");
        setAttachmentList([]);
        setIsSending(true);
        try {
          await onSendMessage?.({
            text,
            attachments: files,
            message,
          });
        } finally {
          setIsSending(false);
        }
      },
      [appendMessage, attachmentList, input, onSendMessage, setAttachmentList],
    );

    useImperativeHandle(
      ref,
      () => ({
        sendMessage,
        appendMessage,
        clearMessages,
      }),
      [appendMessage, clearMessages, sendMessage],
    );

    const state: AiChatState = useMemo(
      () => ({
        input,
        messages: messageList,
        attachments: attachmentList,
        isSending,
        setInput: (next) => {
          setInput(next);
          if (typeof next === "string") {
            onInputChange?.(next);
          }
        },
        setAttachments: setAttachmentList,
        appendMessage,
        clearMessages,
        sendMessage,
      }),
      [
        attachmentList,
        appendMessage,
        clearMessages,
        input,
        isSending,
        messageList,
        onInputChange,
        sendMessage,
        setAttachmentList,
      ],
    );

    const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      const value = event.target.value;
      setInput(value);
      onInputChange?.(value);
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? []);
      if (!files.length) return;
      const result = await onAttachmentsSelect?.(files);
      if (Array.isArray(result)) {
        setAttachmentList(result);
        return;
      }
      const nextFiles = files.map((file) => ({
        id: createId(),
        name: file.name,
        size: file.size,
        status: "success" as AiChatFileStatus,
      }));
      setAttachmentList((prev) => [...prev, ...nextFiles]);
    };

    return (
      <div
        className={cn(
          "flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg",
          className,
        )}
      >
        <header className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <div className="flex size-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <span className="text-xs">🤖</span>
            </div>
            <span>{title}</span>
          </div>
          <div className="flex items-center gap-2">
            {headerActions?.(state)}
          </div>
        </header>

        <div
          className={cn(
            "flex flex-1 flex-col bg-white",
            layoutMode === "wide" && "md:flex-row",
          )}
        >
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
              {messageList.map((message) => {
                const renderer =
                  message.type && messageRenderers?.[message.type];
                if (renderer) {
                  return (
                    <div key={message.id} className="space-y-2">
                      {renderer(message, state)}
                    </div>
                  );
                }
                const isUser = message.role === "user";
                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex w-full",
                      isUser ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] space-y-2 rounded-2xl px-4 py-3 text-sm shadow-sm",
                        isUser
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-700",
                      )}
                    >
                      {message.content ? (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      ) : null}
                      {message.files?.length ? (
                        <div className="grid gap-2">
                          {message.files.map((file) => (
                            <AttachmentCard key={file.id} file={file} />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-100 bg-white px-4 py-4">
              {attachmentList.length ? (
                <div className="mb-3 grid gap-2 sm:grid-cols-2">
                  {attachmentList.map((file) => (
                    <AttachmentCard key={file.id} file={file} />
                  ))}
                </div>
              ) : null}

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <label className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50">
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={disabled}
                    />
                    <Paperclip className="size-4" />
                  </label>
                  {renderInputLeft?.(state)}
                </div>
                <textarea
                  className="min-h-[44px] flex-1 resize-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  placeholder={placeholder}
                  value={input}
                  onChange={handleInputChange}
                  disabled={disabled}
                />
                <div className="flex items-center gap-2">
                  {renderInputRight?.(state)}
                  <button
                    type="button"
                    onClick={() => void sendMessage()}
                    disabled={disabled || isSending}
                    className="flex size-10 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200"
                  >
                    <Send className="size-4" />
                  </button>
                </div>
              </div>

              {renderComposerFooter ? (
                <div className="pt-3">{renderComposerFooter(state)}</div>
              ) : null}
            </div>
          </div>

          {layoutMode === "wide" && sidePanel ? (
            <aside
              className={cn(
                "border-t border-slate-100 bg-slate-50 px-4 py-4 md:w-80 md:border-l md:border-t-0",
                sidePanelClassName,
              )}
            >
              {sidePanel}
            </aside>
          ) : null}
        </div>
      </div>
    );
  },
);

AiChat.displayName = "AiChat";

"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import type {
  ChangeEvent,
  ComponentProps,
  Dispatch,
  ReactNode,
  SetStateAction,
} from "react";
import {
  AssistantRuntimeProvider,
  type ThreadMessageLike,
  useAssistantApi,
  useAssistantState,
} from "@assistant-ui/react";
import { AssistantChatTransport, useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { FileArchive, FileImage, FileText, TriangleAlert } from "lucide-react";

import { Thread } from "@/components/assistant-ui/thread";
import {
  ResourceSummaryToolCard,
  WorkflowToolCard,
} from "@/components/assistant-ui/tool-call-cards";
import { cn } from "@/lib/utils";

export type AiChatLayoutMode = "standard" | "wide";
export type AiChatMessageRole = "assistant" | "user" | "system";
export type AiChatFileStatus = "idle" | "uploading" | "success" | "error";
export type AiChatFileKind = "image" | "pdf" | "doc" | "archive" | "other";

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
  currentInput: string;
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
  mode?: AiChatLayoutMode;
  sidePanel?: ReactNode;
  sidePanelClassName?: string;
  headerExtra?: (state: AiChatState) => ReactNode;
  inputLeftSlot?: (state: AiChatState) => ReactNode;
  inputRightSlot?: (state: AiChatState) => ReactNode;
  composerFooterSlot?: (state: AiChatState) => ReactNode;
  customRenderers?: Record<
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
  onCancelUpload?: (file: AiChatFile) => void;
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
  if (name.endsWith(".doc") || name.endsWith(".docx")) return "doc";
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
  if (kind === "doc") return <FileText className="size-4 text-sky-500" />;
  if (kind === "archive")
    return <FileArchive className="size-4 text-amber-500" />;
  if (kind === "image") return <FileImage className="size-4 text-blue-500" />;
  return <FileText className="size-4 text-slate-400" />;
};

const AttachmentCard = ({
  file,
  onCancel,
}: {
  file: AiChatFile;
  onCancel?: (file: AiChatFile) => void;
}) => {
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
        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
          <span>
            {file.status === "uploading" ? "上传中" : null}
            {file.status === "success" ? "完成" : null}
            {file.status === "error" ? "失败" : null}
          </span>
          {isUploading && onCancel ? (
            <button
              type="button"
              className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] text-slate-500 hover:bg-slate-100"
              onClick={() => onCancel(file)}
            >
              取消
            </button>
          ) : null}
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

const toThreadMessages = (
  messages: AiChatMessage[],
  customRenderers: AiChatProps["customRenderers"],
): ThreadMessageLike[] =>
  messages.map((message) => {
    if (message.type && customRenderers?.[message.type]) {
      return {
        id: message.id,
        role: message.role,
        content: [
          {
            type: "tool-call",
            toolName: message.type,
            toolCallId: `${message.id}-tool-call`,
            args: { message },
            argsText: JSON.stringify({ message }),
          },
        ],
      };
    }

    return {
      id: message.id,
      role: message.role,
      content: [
        {
          type: "text",
          text: message.content ?? "",
        },
      ],
    };
  });

const CustomToolCall = ({
  renderer,
  state,
}: {
  renderer: (message: AiChatMessage, state: AiChatState) => ReactNode;
  state: AiChatState;
}) => {
  const message = useAssistantState(({ part }) => {
    const args = (part?.args as { message?: AiChatMessage } | undefined) ?? {};
    return args.message;
  });

  if (!message) return null;
  const composerText = useAssistantState(({ composer }) => composer.text ?? "");
  return (
    <>
      {renderer(message, {
        ...state,
        input: composerText,
        currentInput: composerText,
      })}
    </>
  );
};

const ComposerSlot = ({
  state,
  renderSlot,
}: {
  state: AiChatState;
  renderSlot?: (state: AiChatState) => ReactNode;
}) => {
  const api = useAssistantApi();
  const composerText = useAssistantState(({ composer }) => composer.text ?? "");

  const bridgedState = useMemo<AiChatState>(
    () => ({
      ...state,
      input: composerText,
      currentInput: composerText,
      setInput: (next) => {
        const resolved =
          typeof next === "function" ? next(composerText) : next;
        api.composer().setText(resolved);
        state.setInput(resolved);
      },
    }),
    [api, composerText, state],
  );

  return <>{renderSlot?.(bridgedState)}</>;
};

const ComposerSync = ({
  onTextChange,
  resetSignal,
}: {
  onTextChange: (value: string) => void;
  resetSignal: number;
}) => {
  const api = useAssistantApi();
  const composerText = useAssistantState(({ composer }) => composer.text ?? "");

  useEffect(() => {
    onTextChange(composerText);
  }, [composerText, onTextChange]);

  useEffect(() => {
    api.composer().setText("");
  }, [api, resetSignal]);

  return null;
};

const AttachmentPicker = ({
  disabled,
  onAttachmentsSelect,
  setAttachments,
}: {
  disabled?: boolean;
  onAttachmentsSelect?: AiChatProps["onAttachmentsSelect"];
  setAttachments: Dispatch<SetStateAction<AiChatFile[]>>;
}) => {
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    const result = await onAttachmentsSelect?.(files);
    if (Array.isArray(result)) {
      setAttachments(result);
      return;
    }
    const nextFiles = files.map((file) => ({
      id: createId(),
      name: file.name,
      size: file.size,
      status: "uploading" as AiChatFileStatus,
      progress: 0,
    }));
    setAttachments((prev) => [...prev, ...nextFiles]);
  };

  return (
    <label className="flex cursor-pointer items-center gap-1 rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-50">
      上传文件
      <input
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />
    </label>
  );
};

export const AiChat = forwardRef<AiChatHandle, AiChatProps>(
  (
    {
      className,
      title = "标题文案",
      mode = "standard",
      sidePanel,
      sidePanelClassName,
      headerExtra,
      inputLeftSlot,
      inputRightSlot,
      composerFooterSlot,
      customRenderers,
      messages,
      defaultMessages = [],
      onMessagesChange,
      attachments,
      defaultAttachments = [],
      onAttachmentsChange,
      onSendMessage,
      onInputChange,
      onAttachmentsSelect,
      onCancelUpload,
      placeholder = "我有什么可以帮您的吗？",
      disabled = false,
    },
    ref,
  ) => {
    const runtime = useChatRuntime({
      transport: new AssistantChatTransport({
        api: "/api/chat",
        fetch: async () => {
          throw new Error("Mock mode: 使用本地数据");
        },
      }),
    });

    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [composerResetSignal, setComposerResetSignal] = useState(0);
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
        setComposerResetSignal((prev) => prev + 1);
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
        currentInput: input,
        messages: messageList,
        attachments: attachmentList,
        isSending,
        setInput: (next) => {
          const resolved = typeof next === "function" ? next(input) : next;
          setInput(resolved);
          onInputChange?.(resolved);
        },
        setAttachments: setAttachmentList,
        appendMessage,
        clearMessages,
        sendMessage,
      }),
      [
        appendMessage,
        attachmentList,
        clearMessages,
        input,
        isSending,
        messageList,
        onInputChange,
        sendMessage,
        setAttachmentList,
      ],
    );

    const handleComposerTextChange = useCallback(
      (value: string) => {
        setInput(value);
        onInputChange?.(value);
      },
      [onInputChange],
    );

    const threadMessages = useMemo(
      () => toThreadMessages(messageList, customRenderers),
      [customRenderers, messageList],
    );

    useEffect(() => {
      runtime.thread.reset(threadMessages);
    }, [runtime, threadMessages]);

    const customToolComponents = useMemo(() => {
      if (!customRenderers) return undefined;
      return {
        tools: {
          by_name: {
            workflow: WorkflowToolCard,
            "resource-summary": ResourceSummaryToolCard,
            ...Object.fromEntries(
              Object.entries(customRenderers).map(([key, renderer]) => [
                key,
                () => <CustomToolCall renderer={renderer} state={state} />,
              ]),
            ),
          },
        },
      } as ComponentProps<typeof Thread>["assistantPartComponents"];
    }, [customRenderers, state]);

    const renderInputLeftSlot = useCallback(
      (slotState: AiChatState) => (
        <>
          {onAttachmentsSelect ? (
            <AttachmentPicker
              disabled={disabled}
              onAttachmentsSelect={onAttachmentsSelect}
              setAttachments={setAttachmentList}
            />
          ) : null}
          {inputLeftSlot?.(slotState)}
        </>
      ),
      [disabled, inputLeftSlot, onAttachmentsSelect, setAttachmentList],
    );

    const renderInputRightSlot = useCallback(
      (slotState: AiChatState) =>
        inputRightSlot?.(slotState) ?? (
          <button
            type="button"
            onClick={() => void slotState.sendMessage()}
            disabled={disabled || slotState.isSending}
            className="rounded-full bg-blue-600 px-3 py-1 text-xs text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            发送
          </button>
        ),
      [disabled, inputRightSlot],
    );

    return (
      <AssistantRuntimeProvider runtime={runtime}>
        <ComposerSync
          onTextChange={handleComposerTextChange}
          resetSignal={composerResetSignal}
        />
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
              {headerExtra?.(state)}
            </div>
          </header>

          <div
            className={cn(
              "flex flex-1 flex-col bg-white",
              mode === "wide" && "md:flex-row",
            )}
          >
            <div className="flex min-h-0 flex-1 flex-col">
              {attachmentList.length ? (
                <div className="border-b border-slate-100 bg-white px-4 py-3">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {attachmentList.map((file) => (
                      <AttachmentCard
                        key={file.id}
                        file={file}
                        onCancel={(target) => {
                          if (onCancelUpload) {
                            onCancelUpload(target);
                            return;
                          }
                          setAttachmentList((prev) =>
                            prev.filter((item) => item.id !== target.id),
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              <Thread
                messageComponents={undefined}
                assistantPartComponents={customToolComponents}
                composerAttachments={null}
                composerAttachment={null}
                composerActionLeftSlot={
                  <ComposerSlot state={state} renderSlot={renderInputLeftSlot} />
                }
                composerActionRightSlot={
                  <ComposerSlot
                    state={state}
                    renderSlot={renderInputRightSlot}
                  />
                }
                hideComposerSendButton
                composerInputPlaceholder={placeholder}
                composerFooter={
                  composerFooterSlot ? (
                    <div className="px-4 pb-3">
                      {composerFooterSlot(state)}
                    </div>
                  ) : null
                }
              />
            </div>

            {mode === "wide" && sidePanel ? (
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
      </AssistantRuntimeProvider>
    );
  },
);

AiChat.displayName = "AiChat";

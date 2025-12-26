import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  PencilIcon,
  RefreshCwIcon,
  Square,
  TriangleAlert,
  FileArchive,
  FileImage,
  FileText,
} from "lucide-react";

import {
  ActionBarPrimitive,
  BranchPickerPrimitive,
  ComposerPrimitive,
  ErrorPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
} from "@assistant-ui/react";
import FileChat from './FileChat.tsx'

import type { ComponentProps, FC, ReactNode } from "react";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import * as m from "motion/react-m";

import { Button } from "@/components/ui/button";
import { MarkdownText } from "@/components/assistant-ui/markdown-text";
import { Reasoning, ReasoningGroup } from "@/components/assistant-ui/reasoning";
import { ToolFallback } from "@/components/assistant-ui/tool-fallback";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import {
  ComposerAddAttachment,
  ComposerAttachments,
  UserMessageAttachments,
} from "@/components/assistant-ui/attachment";
import {
  type ComposerActionModule,
  ComposerActionModules,
} from "@/components/assistant-ui/composer-action-modules";

import { cn } from "@/lib/utils";

// 定义附件类型
export type ThreadFileStatus = "idle" | "uploading" | "success" | "error";
export type ThreadFileKind = "image" | "pdf" | "doc" | "archive" | "other";

export type ThreadFile = {
  id: string;
  name: string;
  size: number;
  status?: ThreadFileStatus;
  progress?: number;
  kind?: ThreadFileKind;
  url?: string;
  errorMessage?: string;
};

type ThreadProps = {
  messageComponents?: ComponentProps<typeof ThreadPrimitive.Messages>["components"];
  assistantPartComponents?: ComponentProps<typeof MessagePrimitive.Parts>["components"];
  composerActionModules?: ComposerActionModule[];
  composerAttachment?: ReactNode;
  composerAttachments?: ReactNode;
  composerActionSlot?: ReactNode;
  composerActionLeftSlot?: ReactNode;
  composerActionRightSlot?: ReactNode;
  hideComposerSendButton?: boolean;
  composerInputPlaceholder?: string;
  composerFooter?: ReactNode;
  attachments?: ThreadFile[];
  onAttachmentsChange?: (files: ThreadFile[]) => void;
};

export const Thread: FC<ThreadProps> = ({
  messageComponents,
  assistantPartComponents,
  composerActionModules,
  composerAttachment,
  composerAttachments,
  composerActionSlot,
  composerActionLeftSlot,
  composerActionRightSlot,
  hideComposerSendButton,
  composerInputPlaceholder,
  composerFooter,
  attachments = [],
  onAttachmentsChange,
}) => {
  const AssistantMessageSlot: FC = () => (
    <AssistantMessage partComponents={assistantPartComponents} />
  );

  const handleAttachmentCancel = (target: ThreadFile) => {
    if (onAttachmentsChange) {
      const updatedAttachments = attachments.filter((item) => item.id !== target.id);
      onAttachmentsChange(updatedAttachments);
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <ThreadPrimitive.Root
          className="aui-root aui-thread-root @container flex h-full flex-col bg-slate-50"
          style={{
            ["--thread-max-width" as string]: "100%",
          }}
        >
          <ThreadPrimitive.Viewport className="aui-thread-viewport relative flex flex-1 flex-col overflow-x-auto overflow-y-scroll bg-slate-50 px-4">
            <ThreadPrimitive.If empty>
              <ThreadWelcome />
            </ThreadPrimitive.If>

            <ThreadPrimitive.If empty={false}>
              <ThreadPrimitive.Messages
                components={{
                  UserMessage,
                  EditComposer,
                  AssistantMessage: AssistantMessageSlot,
                  ...messageComponents,
                }}
              />
              <div className="aui-thread-viewport-spacer min-h-8 grow" />
            </ThreadPrimitive.If>
             {/* 附件展示区域 */}
            {attachments && attachments.length > 0 && (
               <FileChat align="left">

               
              <div className="border-b border-slate-100 bg-slate-50">
                <div className="flex gap-2.5 px-4">
                  {attachments.map((file) => (
                    <AttachmentCard
                      key={file.id}
                      file={file}
                      onCancel={handleAttachmentCancel}
                    />
                  ))}
                </div>
              </div>
              </FileChat>
            )}

            <Composer
              composerActionModules={composerActionModules}
              composerAttachment={composerAttachment}
              composerAttachments={composerAttachments}
              composerActionSlot={composerActionSlot}
              composerActionLeftSlot={composerActionLeftSlot}
              composerActionRightSlot={composerActionRightSlot}
              hideComposerSendButton={hideComposerSendButton}
              composerInputPlaceholder={composerInputPlaceholder}
              composerFooter={composerFooter}
            />
          </ThreadPrimitive.Viewport>
        </ThreadPrimitive.Root>
      </MotionConfig>
    </LazyMotion>
  );
};

// 辅助函数：格式化文件大小
const formatSize = (size: number) => {
  if (size <= 0) return "0KB";
  const kb = size / 1024;
  if (kb < 1024) return `${kb.toFixed(0)}KB`;
  return `${(kb / 1024).toFixed(1)}MB`;
};

// 辅助函数：根据文件类型返回对应类型
const resolveFileKind = (file: ThreadFile): ThreadFileKind => {
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

// 文件图标组件
const FileIcon = ({ kind }: { kind: ThreadFileKind }) => {
  if (kind === "pdf") return <FileText className="size-4 text-emerald-500" />;
  if (kind === "doc") return <FileText className="size-4 text-sky-500" />;
  if (kind === "archive")
    return <FileArchive className="size-4 text-amber-500" />;
  if (kind === "image") return <FileImage className="size-4 text-blue-500" />;
  return <FileText className="size-4 text-slate-400" />;
};

// 附件卡片组件
const AttachmentCard = ({
  file,
  onCancel,
}: {
  file: ThreadFile;
  onCancel?: (file: ThreadFile) => void;
}) => {
  const kind = resolveFileKind(file);
  const isError = file.status === "error";
  const isUploading = file.status === "uploading";
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border bg-white px-3 py-2 text-xs shadow-sm w-[160px] h-[54px]",
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

const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        className="aui-thread-scroll-to-bottom absolute -top-12 z-10 self-center rounded-full p-4 disabled:invisible dark:bg-background dark:hover:bg-accent"
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

const ThreadWelcome: FC = () => {
  return (
    <div className="aui-thread-welcome-root mx-auto my-auto flex w-full max-w-[var(--thread-max-width)] flex-grow flex-col">
      <div className="aui-thread-welcome-center flex w-full flex-grow flex-col items-center justify-center">
        <div className="aui-thread-welcome-message flex size-full flex-col justify-center px-8">
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="aui-thread-welcome-message-motion-1 text-2xl font-semibold"
          >
            Hello there!
          </m.div>
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.1 }}
            className="aui-thread-welcome-message-motion-2 text-2xl text-muted-foreground/65"
          >
            How can I help you today?
          </m.div>
        </div>
      </div>
      <ThreadSuggestions />
    </div>
  );
};

const ThreadSuggestions: FC = () => {
  return (
    <div className="aui-thread-welcome-suggestions grid w-full gap-2 pb-4 @md:grid-cols-2">
      {[
        {
          title: "What's the weather",
          label: "in San Francisco?",
          action: "What's the weather in San Francisco?",
        },
        {
          title: "Explain React hooks",
          label: "like useState and useEffect",
          action: "Explain React hooks like useState and useEffect",
        },
        {
          title: "Write a SQL query",
          label: "to find top customers",
          action: "Write a SQL query to find top customers",
        },
        {
          title: "Create a meal plan",
          label: "for healthy weight loss",
          action: "Create a meal plan for healthy weight loss",
        },
      ].map((suggestedAction, index) => (
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className="aui-thread-welcome-suggestion-display [&:nth-child(n+3)]:hidden @md:[&:nth-child(n+3)]:block"
        >
          <ThreadPrimitive.Suggestion
            prompt={suggestedAction.action}
            send
            asChild
          >
            <Button
              variant="ghost"
              className="aui-thread-welcome-suggestion h-auto w-full flex-1 flex-wrap items-start justify-start gap-1 rounded-3xl border px-5 py-4 text-left text-sm @md:flex-col dark:hover:bg-accent/60"
              aria-label={suggestedAction.action}
            >
              <span className="aui-thread-welcome-suggestion-text-1 font-medium">
                {suggestedAction.title}
              </span>
              <span className="aui-thread-welcome-suggestion-text-2 text-muted-foreground">
                {suggestedAction.label}
              </span>
            </Button>
          </ThreadPrimitive.Suggestion>
        </m.div>
      ))}
    </div>
  );
};

type ComposerProps = {
  composerActionModules?: ComposerActionModule[];
  composerAttachment?: ReactNode;
  composerAttachments?: ReactNode;
  composerActionSlot?: ReactNode;
  composerActionLeftSlot?: ReactNode;
  composerActionRightSlot?: ReactNode;
  hideComposerSendButton?: boolean;
  composerInputPlaceholder?: string;
  composerFooter?: ReactNode;
};

const Composer: FC<ComposerProps> = ({
  composerActionModules,
  composerAttachment,
  composerAttachments,
  composerActionSlot,
  composerActionLeftSlot,
  composerActionRightSlot,
  hideComposerSendButton,
  composerInputPlaceholder,
  composerFooter,
}) => {
  return (
    <div className="aui-composer-wrapper sticky bottom-0 mx-auto flex w-full max-w-[var(--thread-max-width)] flex-col gap-4 overflow-visible rounded-t-3xl bg-background pb-4 md:pb-6">
      <ThreadScrollToBottom />
      <ComposerPrimitive.Root className="aui-composer-root relative flex w-full flex-col">

        <ComposerPrimitive.AttachmentDropzone className="aui-composer-attachment-dropzone group/input-group flex w-full flex-col rounded-3xl border border-input bg-background px-1 pt-2 shadow-xs transition-[color,box-shadow] outline-none has-[textarea:focus-visible]:border-ring has-[textarea:focus-visible]:ring-[3px] has-[textarea:focus-visible]:ring-ring/50 data-[dragging=true]:border-dashed data-[dragging=true]:border-ring data-[dragging=true]:bg-accent/50 dark:bg-background">
          {composerAttachments ?? <ComposerAttachments />}

          <ComposerPrimitive.Input
            placeholder={composerInputPlaceholder ?? "Send a message..."}
            className="aui-composer-input mb-1 max-h-32 min-h-16 w-full resize-none bg-transparent px-3.5 pt-1.5 pb-3 text-base outline-none placeholder:text-muted-foreground focus-visible:ring-0"
            rows={1}
            autoFocus
            aria-label="Message input"
          />
          <ComposerAction
            composerActionModules={composerActionModules}
            composerAttachment={composerAttachment}
            composerActionSlot={composerActionSlot}
            composerActionLeftSlot={composerActionLeftSlot}
            composerActionRightSlot={composerActionRightSlot}
            hideComposerSendButton={hideComposerSendButton}
          />
        </ComposerPrimitive.AttachmentDropzone>
      </ComposerPrimitive.Root>
      {composerFooter}
    </div>
  );
};
// 按钮
type ComposerActionProps = {
  composerActionModules?: ComposerActionModule[];
  composerAttachment?: ReactNode;
  composerActionSlot?: ReactNode;
  composerActionLeftSlot?: ReactNode;
  composerActionRightSlot?: ReactNode;
  hideComposerSendButton?: boolean;
};

const ComposerAction: FC<ComposerActionProps> = ({
  composerActionModules,
  composerAttachment,
  composerActionSlot,
  composerActionLeftSlot,
  composerActionRightSlot,
  hideComposerSendButton,
}) => {
  return (
    <div className="aui-composer-action-wrapper relative mx-1 mt-2 mb-2 flex items-center justify-between">
      <div className="aui-composer-action-left flex items-center gap-2">
        {composerAttachment ?? <ComposerAddAttachment />}
        <ComposerActionModules modules={composerActionModules} />
        {composerActionSlot}
        {composerActionLeftSlot}
      </div>

      <div className="aui-composer-action-right flex items-center gap-2">
        {composerActionRightSlot}
        {hideComposerSendButton ? null : (
          <ThreadPrimitive.If running={false}>
            <ComposerPrimitive.Send asChild>
              <TooltipIconButton
                tooltip="Send message"
                side="bottom"
                type="submit"
                variant="default"
                size="icon"
                className="aui-composer-send size-[34px] rounded-full p-1"
                aria-label="Send message"
              >
                <ArrowUpIcon className="aui-composer-send-icon size-5" />
              </TooltipIconButton>
            </ComposerPrimitive.Send>
          </ThreadPrimitive.If>
        )}
        <ThreadPrimitive.If running>
          <ComposerPrimitive.Cancel asChild>
            <Button
              type="button"
              variant="default"
              size="icon"
              className="aui-composer-cancel size-[34px] rounded-full border border-muted-foreground/60 hover:bg-primary/75 dark:border-muted-foreground/90"
              aria-label="Stop generating"
            >
              <Square className="aui-composer-cancel-icon size-3.5 fill-white dark:fill-black" />
            </Button>
          </ComposerPrimitive.Cancel>
        </ThreadPrimitive.If>
      </div>
    </div>
  );
};

const MessageError: FC = () => {
  return (
    <MessagePrimitive.Error>
      <ErrorPrimitive.Root className="aui-message-error-root mt-2 rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive dark:bg-destructive/5 dark:text-red-200">
        <ErrorPrimitive.Message className="aui-message-error-message line-clamp-2" />
      </ErrorPrimitive.Root>
    </MessagePrimitive.Error>
  );
};

type AssistantMessageProps = {
  partComponents?: ComponentProps<typeof MessagePrimitive.Parts>["components"];
};

const AssistantMessage: FC<AssistantMessageProps> = ({ partComponents }) => {
  const tools =
    partComponents?.tools && "Override" in partComponents.tools
      ? partComponents.tools
      : { Fallback: ToolFallback, ...(partComponents?.tools ?? {}) };

  return (
    <MessagePrimitive.Root asChild>
      <div
        className="aui-assistant-message-root relative mx-auto w-full max-w-[var(--thread-max-width)] animate-in py-4 duration-150 ease-out fade-in slide-in-from-bottom-1 last:mb-24"
        data-role="assistant"
      >
        <div className="aui-assistant-message-content mx-2 leading-7 break-words text-foreground">
          <MessagePrimitive.Parts
            components={{
              Text: MarkdownText,
              Reasoning: Reasoning,
              ReasoningGroup: ReasoningGroup,
              ...partComponents,
              tools,
            }}
          />
          <MessageError />
        </div>

        <div className="aui-assistant-message-footer mt-2 ml-2 flex">
          <BranchPicker />
          <AssistantActionBar />
        </div>
      </div>
    </MessagePrimitive.Root>
  );
};

const AssistantActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
      className="aui-assistant-action-bar-root col-start-3 row-start-2 -ml-1 flex gap-1 text-muted-foreground data-floating:absolute data-floating:rounded-md data-floating:border data-floating:bg-background data-floating:p-1 data-floating:shadow-sm"
    >
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip="Copy">
          <MessagePrimitive.If copied>
            <CheckIcon />
          </MessagePrimitive.If>
          <MessagePrimitive.If copied={false}>
            <CopyIcon />
          </MessagePrimitive.If>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton tooltip="Refresh">
          <RefreshCwIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Reload>
    </ActionBarPrimitive.Root>
  );
};

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root asChild>
      <div
        className="aui-user-message-root mx-auto grid w-full max-w-[var(--thread-max-width)] animate-in auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 px-2 py-4 duration-150 ease-out fade-in slide-in-from-bottom-1 first:mt-3 last:mb-5 [&:where(>*)]:col-start-2"
        data-role="user"
      >
        <UserMessageAttachments />

        <div className="aui-user-message-content-wrapper relative col-start-2 min-w-0">
          <div className="aui-user-message-content rounded-3xl bg-muted px-5 py-2.5 break-words text-foreground">
            <MessagePrimitive.Parts />
          </div>
          <div className="aui-user-action-bar-wrapper absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 pr-2">
            <UserActionBar />
          </div>
        </div>

        <BranchPicker className="aui-user-branch-picker col-span-full col-start-1 row-start-3 -mr-1 justify-end" />
      </div>
    </MessagePrimitive.Root>
  );
};

const UserActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="aui-user-action-bar-root flex flex-col items-end"
    >
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton tooltip="Edit" className="aui-user-action-edit p-4">
          <PencilIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};

const EditComposer: FC = () => {
  return (
    <div className="aui-edit-composer-wrapper mx-auto flex w-full max-w-[var(--thread-max-width)] flex-col gap-4 px-2 first:mt-4">
      <ComposerPrimitive.Root className="aui-edit-composer-root ml-auto flex w-full max-w-7/8 flex-col rounded-xl bg-muted">
        <ComposerPrimitive.Input
          className="aui-edit-composer-input flex min-h-[60px] w-full resize-none bg-transparent p-4 text-foreground outline-none"
          autoFocus
        />

        <div className="aui-edit-composer-footer mx-3 mb-3 flex items-center justify-center gap-2 self-end">
          <ComposerPrimitive.Cancel asChild>
            <Button variant="ghost" size="sm" aria-label="Cancel edit">
              Cancel
            </Button>
          </ComposerPrimitive.Cancel>
          <ComposerPrimitive.Send asChild>
            <Button size="sm" aria-label="Update message">
              Update
            </Button>
          </ComposerPrimitive.Send>
        </div>
      </ComposerPrimitive.Root>
    </div>
  );
};

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
  className,
  ...rest
}) => {
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn(
        "aui-branch-picker-root mr-2 -ml-2 inline-flex items-center text-xs text-muted-foreground",
        className,
      )}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton tooltip="Previous">
          <ChevronLeftIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className="aui-branch-picker-state font-medium">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton tooltip="Next">
          <ChevronRightIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};

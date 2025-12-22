import type { FC } from "react";
import { useState, useEffect } from "react";
import {
  ThreadListItemPrimitive,
  ThreadListPrimitive,
  useAssistantState,
} from "@assistant-ui/react";
import { ArchiveIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { Skeleton } from "@/components/ui/skeleton";

// 定义线程类型
interface Thread {
  id: string;
  title: string;
  createdAt: Date;
}

// 创建一个自定义的线程列表组件
const CustomThreadListItems: FC = () => {
  // 获取线程状态
  const threads = useAssistantState(({ threads }) => threads.all);
  const isLoading = useAssistantState(({ threads }) => threads.isLoading);
  const [apiThreads, setApiThreads] = useState<Thread[]>([
    {
      id: '1',
      title: "112",
      createdAt: undefined
    }
  ]);
  const [apiLoading, setApiLoading] = useState(true);

  // 从 API 获取线程列表
  // useEffect(() => {
  //   const fetchThreads = async () => {
  //     try {
  //       setApiLoading(true);
  //       // 调用你的线程列表 API
  //       const response = await fetch('/api/threads');
  //       const data = await response.json();
  //       const data = []
  //       setApiThreads(data);
  //     } catch (error) {
  //       console.error('Failed to fetch threads:', error);
  //     } finally {
  //       setApiLoading(false);
  //     }
  //   };

  //   fetchThreads();
  // }, []);
  // if (isLoading || apiLoading) {
  //   return <ThreadListSkeleton />;
  // }
  // 合并本地线程和 API 线程
  // const allThreads = [...threads.map(t => ({ id: t.id, title: t.title || 'New Chat' })), ...apiThreads];
  console.log(threads, 'threadsthreads');
  
  const allThreads = [...apiThreads];

  return (
    <>
      {allThreads.map(thread => (
        <div key={thread.id} className="aui-thread-list-item flex items-center gap-2 rounded-lg transition-all hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-active:bg-muted">
          <button 
            className="aui-thread-list-item-trigger flex-grow px-3 py-2 text-start"
            onClick={() => {
              // 触发会话切换逻辑
              // 这里可以调用一个全局状态管理器来设置当前会话ID
              window.dispatchEvent(new CustomEvent('thread-change', { detail: thread.id }));
            }}
          >
            <span className="aui-thread-list-item-title text-sm">
              {thread.title}
            </span>
          </button>
          <TooltipIconButton
            className="aui-thread-list-item-archive mr-3 ml-auto size-4 p-0 text-foreground hover:text-primary"
            variant="ghost"
            tooltip="Archive thread"
          >
            <ArchiveIcon />
          </TooltipIconButton>
        </div>
      ))}
    </>
  );
};

export const ThreadList: FC = () => {
  return (
    <ThreadListPrimitive.Root className="aui-root aui-thread-list-root flex flex-col items-stretch gap-1.5">
      <ThreadListNew />
      {/* ThreadListItems */}
      <CustomThreadListItems />
    </ThreadListPrimitive.Root>
  );
};

const ThreadListNew: FC = () => {
  return (
    <ThreadListPrimitive.New asChild>
      <Button
        className="aui-thread-list-new flex items-center justify-start gap-1 rounded-lg px-2.5 py-2 text-start hover:bg-muted data-active:bg-muted"
        variant="ghost"
      >
        <PlusIcon />
        新会话
      </Button>
    </ThreadListPrimitive.New>
  );
};

const ThreadListItems: FC = () => {
  const isLoading = useAssistantState(({ threads }) => threads.isLoading);

  if (isLoading) {
    return <ThreadListSkeleton />;
  }

  return <ThreadListPrimitive.Items components={{ ThreadListItem }} />;
};

const ThreadListSkeleton: FC = () => {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          role="status"
          aria-label="Loading threads"
          aria-live="polite"
          className="aui-thread-list-skeleton-wrapper flex items-center gap-2 rounded-md px-3 py-2"
        >
          <Skeleton className="aui-thread-list-skeleton h-[22px] flex-grow" />
        </div>
      ))}
    </>
  );
};

// 移除旧的 ThreadListItem 组件，因为我们现在在 CustomThreadListItems 中直接渲染

const ThreadListItem: FC = () => {
  return (
    <ThreadListItemPrimitive.Root className="aui-thread-list-item flex items-center gap-2 rounded-lg transition-all hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-active:bg-muted">
      <ThreadListItemPrimitive.Trigger className="aui-thread-list-item-trigger flex-grow px-3 py-2 text-start">
        <ThreadListItemTitle />
      </ThreadListItemPrimitive.Trigger>
      <ThreadListItemArchive />
    </ThreadListItemPrimitive.Root>
  );
};

const ThreadListItemTitle: FC = () => {
  return (
    <span className="aui-thread-list-item-title text-sm">
      <ThreadListItemPrimitive.Title fallback="New Chat" />
    </span>
  );
};

const ThreadListItemArchive: FC = () => {
  return (
    <ThreadListItemPrimitive.Archive asChild>
      <TooltipIconButton
        className="aui-thread-list-item-archive mr-3 ml-auto size-4 p-0 text-foreground hover:text-primary"
        variant="ghost"
        tooltip="Archive thread"
      >
        <ArchiveIcon />
      </TooltipIconButton>
    </ThreadListItemPrimitive.Archive>
  );
};

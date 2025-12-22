"use client";

import { useEffect, useState, useCallback } from "react";
import { AssistantRuntimeProvider, useAssistantRuntime } from "@assistant-ui/react";
import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThreadListSidebar } from "@/components/assistant-ui/threadlist-sidebar";
import { Separator } from "@/components/ui/separator";
import { mockMessages } from "./mockData/mockData";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// 创建一个组件来处理会话历史加载
// const ThreadLoader = ({ threadId }: { threadId?: string }) => {
//   const runtime = useAssistantRuntime();
  
//   useEffect(() => {
//     if (!threadId || !runtime) return;
    
//     // 从 API 加载会话历史
//     const loadThreadHistory = async () => {
//       try {
//         // 这里调用你的会话历史 API
//         const response = await fetch(`/api/threads/${threadId}`);
//         const history = await response.json();
        
//         // 清空当前会话
//         runtime.thread.clear();
        
//         // 将历史消息添加到会话中
//         history.messages.forEach((message: any) => {
//           runtime.thread.append({
//             role: message.role,
//             content: [{ type: "text", text: message.content }]
//           });
//         });
//       } catch (error) {
//         console.error("Failed to load thread history:", error);
//       }
//     };
    
//     loadThreadHistory();
//   }, [threadId, runtime]);
  
//   return null;
// };

export const Assistant = () => {
  // 启用真实的 API 调用
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: "/api/chat",
      // 禁用实际网络请求，完全使用 mock 数据
      fetch: async () => {
        throw new Error("Mock mode: 使用本地数据");
      }
    }),
  });
  
  // 管理当前会话 ID
  // const [currentThreadId, setCurrentThreadId] = useState<string | undefined>(undefined);
  
  // // 处理会话切换
  // const handleThreadChange = useCallback((event: Event) => {
  //   const customEvent = event as CustomEvent;
  //   setCurrentThreadId(customEvent.detail);
  // }, []);

  // 监听会话切换事件
  // useEffect(() => {
  //   window.addEventListener('thread-change', handleThreadChange as EventListener);
  //   return () => {
  //     window.removeEventListener('thread-change', handleThreadChange as EventListener);
  //   };
  useEffect(() => {
  if (runtime && runtime.thread) {
    mockMessages.forEach((message) => {
      const textContent = message.parts
        .filter(part => part.type === 'text' && 'content' in part)
        .map(part => (part as { type: string; content: string }).content)
        .join('\n');
      
      runtime.thread.append({
        role: message.role as "user" | "assistant",
        content: [{
            type: "text" as const,
            text: textContent || ''
          }]
      });
    });
  }
  }, [runtime]);
  // }, [handleThreadChange]);

  return (
    <>
    <AssistantRuntimeProvider runtime={runtime}>
      {/* 加载会话历史 */}
      {/* <ThreadLoader threadId={currentThreadId} /> */}
      
      <SidebarProvider>
        <div className="flex h-dvh w-full pr-0.5">
          <ThreadListSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink
                      href="https://www.assistant-ui.com/docs/getting-started"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Build Your Own ChatGPT UX
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Starter Template</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <div className="flex-1 overflow-hidden">
              {/* Thread 组件会自动渲染所有消息，包括：
                   1. 从会话历史加载的消息
                   2. 用户新发送的消息
                   3. AI 流式响应的消息 */}
              <Thread />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AssistantRuntimeProvider>
    </>
  );
};

"use client";

import { useEffect } from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
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

export const Assistant = () => {
  // 使用本地 mock 数据，禁用 API 调用
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: "/api/chat",
      // 禁用实际网络请求，完全使用 mock 数据
      fetch: async () => {
        throw new Error("Mock mode: 使用本地数据");
      }
    }),
  });
  // const runtime = useChatRuntime({
  //   transport: new AssistantChatTransport({
  //     api: "/api/chat", // 保持原API配置
  //   }),
  // });

  // 在组件加载时，将 mockMessages 设置为初始消息
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

  return (
    <>
    <AssistantRuntimeProvider runtime={runtime}>
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
              {/* Thread 组件渲染聊天内容 */}
              <Thread />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AssistantRuntimeProvider>
    </>
  );
};

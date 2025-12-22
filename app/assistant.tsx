"use client";

import { FileText, Folder, Home, Search, Share2 } from "lucide-react";

import { ChatWidget } from "@/components/assistant-ui/chat-widget";
import { cn } from "@/lib/utils";

const mockFolders = [
  { id: "folder-1", label: "个人资源库" },
  { id: "folder-2", label: "一级文件夹" },
  { id: "folder-3", label: "二级文件夹" },
  { id: "folder-4", label: "三级文件夹" },
  { id: "folder-5", label: "四级文件夹" },
  { id: "folder-6", label: "企业空间" },
];

export const Assistant = () => {
  return (
    <div className="min-h-dvh bg-[#f5f7fb] text-slate-700">
      <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
        <div className="flex items-center gap-6 text-sm font-semibold">
          <span className="text-lg font-bold text-blue-600">DRIVEFLOW</span>
          <nav className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1 text-blue-600">
              <Home className="size-4" />
              我的应用
            </span>
            <span className="flex items-center gap-1">
              <Share2 className="size-4" />
              数智小星
            </span>
            <span className="flex items-center gap-1">
              <FileText className="size-4" />
              助理
            </span>
            <span className="flex items-center gap-1">
              <Folder className="size-4" />
              工作流
            </span>
            <span className="rounded-md bg-blue-50 px-2 py-1 text-blue-600">
              知识库
            </span>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex size-8 items-center justify-center rounded-full bg-slate-100">
            <span className="text-slate-500">🐔</span>
          </div>
          鸡米花
        </div>
      </header>

      <div className="flex h-[calc(100dvh-56px)]">
        <aside className="w-64 border-r border-slate-200 bg-white px-4 py-4">
          <div className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-400">
            <Search className="size-4" />
            请输入搜索内容
          </div>
          <div className="mt-4 space-y-2 text-xs font-medium text-slate-600">
            {mockFolders.map((folder, index) => (
              <div
                key={folder.id}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-2",
                  index === 4 && "bg-blue-50 text-blue-600",
                )}
              >
                <Folder className="size-4" />
                {folder.label}
              </div>
            ))}
          </div>
        </aside>

        <main className="flex flex-1 justify-end gap-6 px-6 py-6">
          <div className="flex-1 rounded-xl border border-dashed border-slate-200 bg-white/60" />
          <div className="w-[420px]">
            <ChatWidget />
          </div>
        </main>
      </div>
    </div>
  );
};

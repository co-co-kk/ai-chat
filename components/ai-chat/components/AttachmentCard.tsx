import React from "react";
import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { AiChatFile, AiChatFileKind } from "../types";
import { resolveFileKind, formatSize } from "../utils";

// 📎 附件卡片组件
// 用于展示单个附件文件的状态、进度和取消操作

interface AttachmentCardProps {
  file: AiChatFile;
  onCancel?: (file: AiChatFile) => void;
}

// 文件图标组件
const FileIcon: React.FC<{ kind: AiChatFileKind }> = ({ kind }) => {
  const iconMap = {
    pdf: { icon: "📄", color: "text-emerald-500" },
    doc: { icon: "📝", color: "text-sky-500" },
    archive: { icon: "📦", color: "text-amber-500" },
    image: { icon: "🖼️", color: "text-blue-500" },
    other: { icon: "📄", color: "text-slate-400" },
  };

  const config = iconMap[kind];
  return <span className={`${config.color} text-lg`}>{config.icon}</span>;
};

export const AttachmentCard: React.FC<AttachmentCardProps> = ({ file, onCancel }) => {
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
            {file.status === "uploading" && "上传中"}
            {file.status === "success" && "完成"}
            {file.status === "error" && "失败"}
          </span>
          {isUploading && onCancel && (
            <button
              type="button"
              className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] text-slate-500 hover:bg-slate-100"
              onClick={() => onCancel(file)}
            >
              取消
            </button>
          )}
        </div>
      </div>

      {isUploading && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-blue-100">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{ width: `${Math.min(file.progress ?? 0, 100)}%` }}
          />
        </div>
      )}

      {isError && file.errorMessage && (
        <div className="text-[11px] text-red-500">{file.errorMessage}</div>
      )}
    </div>
  );
};
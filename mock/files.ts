import type { AiChatFile } from "@/components/ai-chat/ai-chat";

export const mockFiles: AiChatFile[] = [
  {
    id: "file-1",
    name: "经营数据报告.pdf",
    size: 135 * 1024,
    status: "success",
  },
  {
    id: "file-2",
    name: "客户画像.docx",
    size: 320 * 1024,
    status: "uploading",
    progress: 50,
  },
  {
    id: "file-3",
    name: "销售分析图.png",
    size: 540 * 1024,
    status: "success",
  },
  {
    id: "file-4",
    name: "归档资料.zip",
    size: 2_048 * 1024,
    status: "error",
    errorMessage: "上传失败",
  },
];

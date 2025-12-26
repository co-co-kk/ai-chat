import React from "react";
import { FileText, FileArchive, FileImage } from "lucide-react";
import { AiChatFileKind } from "../types";

// 📁 文件图标组件
// 根据文件类型显示对应的图标

interface FileIconProps {
  kind: AiChatFileKind;
  className?: string;
}

export const FileIcon: React.FC<FileIconProps> = ({ kind, className = "size-4" }) => {
  const iconConfig = {
    pdf: {
      icon: <FileText className={`${className} text-emerald-500`} />,
      label: "PDF文件",
    },
    doc: {
      icon: <FileText className={`${className} text-sky-500`} />,
      label: "文档文件",
    },
    archive: {
      icon: <FileArchive className={`${className} text-amber-500`} />,
      label: "压缩文件",
    },
    image: {
      icon: <FileImage className={`${className} text-blue-500`} />,
      label: "图片文件",
    },
    other: {
      icon: <FileText className={`${className} text-slate-400`} />,
      label: "其他文件",
    },
  };

  const config = iconConfig[kind];
  
  return (
    <div className="flex items-center justify-center" title={config.label}>
      {config.icon}
    </div>
  );
};
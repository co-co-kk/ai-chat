// 🛠️ AiChat 工具函数
// 提供组件内部使用的各种工具函数

/**
 * 生成唯一ID
 * 优先使用crypto.randomUUID，降级使用时间戳+随机数
 */
export const createId = (): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

/**
 * 格式化文件大小
 * @param size - 文件大小（字节）
 * @returns 格式化后的字符串（如：1.5MB）
 */
export const formatSize = (size: number): string => {
  if (size <= 0) return "0KB";
  const kb = size / 1024;
  if (kb < 1024) return `${kb.toFixed(0)}KB`;
  return `${(kb / 1024).toFixed(1)}MB`;
};

/**
 * 根据文件名解析文件类型
 * @param file - 文件对象
 * @returns 文件类型枚举值
 */
export const resolveFileKind = (
  file: Pick<import("../types").AiChatFile, "name" | "kind">
): import("../types").AiChatFileKind => {
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

/**
 * 可控状态Hook的辅助类型
 */
export interface UseControllableStateProps<T> {
  value?: T;
  defaultValue: T;
  onChange?: (next: T) => void;
}

/**
 * 展平嵌套消息结构
 * @param messages - 消息数组
 * @param depth - 当前深度（用于缩进）
 * @returns 展平后的消息数组，包含深度信息
 */
export const flattenMessages = (
  messages: import("../types").AiChatMessage[],
  depth = 0
): Array<{ message: import("../types").AiChatMessage; depth: number }> =>
  messages.flatMap((message) => [
    { message, depth },
    ...(message.children ? flattenMessages(message.children, depth + 1) : []),
  ]);
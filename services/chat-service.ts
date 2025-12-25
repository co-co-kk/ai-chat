import type { AiChatFile, AiChatMessage } from "@/components/ai-chat/ai-chat";
import { mockFiles } from "@/mock/files";
import { mockMessages } from "@/mock/messages";

const sleep = (min = 500, max = 1000) =>
  new Promise((resolve) => {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    setTimeout(resolve, delay);
  });

let messagesStore = [...mockMessages];
let filesStore = [...mockFiles];

export const chatService = {
  async listMessages() {
    await sleep();
    return [...messagesStore];
  },
  async sendMessage(input: string, attachments: AiChatFile[]) {
    await sleep();
    const newMessage: AiChatMessage = {
      id: `msg-${Date.now()}`,
      role: "assistant",
      type: "text",
      content: `收到你的问题：${input || "（无文本）"}`,
      files: attachments.length ? attachments : undefined,
      createdAt: new Date().toISOString(),
    };
    messagesStore = [...messagesStore, newMessage];
    return newMessage;
  },
  async uploadFiles(files: AiChatFile[]) {
    await sleep();
    filesStore = files.map((file) => ({
      ...file,
      status: "success",
      progress: 100,
    }));
    return [...filesStore];
  },
  async cancelUpload(fileId: string) {
    await sleep();
    filesStore = filesStore.filter((file) => file.id !== fileId);
    return [...filesStore];
  },
};

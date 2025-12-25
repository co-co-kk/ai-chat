import type { AiChatMessage } from "@/components/ai-chat/ai-chat";

export const mockMessages: AiChatMessage[] = [
  {
    id: "msg-1",
    role: "assistant",
    type: "text",
    content: "你好，我是XXX，有什么可以帮助你的吗？",
    createdAt: "2025-01-02T08:00:00.000Z",
  },
  {
    id: "msg-2",
    role: "user",
    type: "text",
    content: "在进行企业数字化转型时，应该优先考虑哪些关键因素？",
    createdAt: "2025-01-02T08:01:00.000Z",
  },
  {
    id: "msg-3",
    role: "assistant",
    type: "analysis-card",
    content: "思考完成",
    meta: {
      title: "思考完成",
      subtitle: "本财年公司的整体业绩情况",
      duration: "1.5s",
      sections: [
        {
          title: "正在检索",
          description:
            "检索发现，销售数据集、财务分析数据集与公司业绩指标相关性高，即将进行进一步分析。",
        },
      ],
    },
  },
  {
    id: "msg-4",
    role: "assistant",
    type: "text",
    content:
      "以下为初步分析结论：核心业务指标保持平稳，建议聚焦流程标准化与数据治理。",
    createdAt: "2025-01-02T08:03:00.000Z",
  },
];

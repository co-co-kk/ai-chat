import type { AiChatMessage } from "@/components/ai-chat/ai-chat";

export const mockSessionMessages: Record<string, AiChatMessage[]> = {
  "session-1": [
    {
      id: "msg-1",
      role: "assistant",
      type: "text",
      content: "你好，我是XXX，有什么可以帮助你的吗？",
    },
    {
      id: "msg-2",
      role: "user",
      type: "text",
      content: "在进行企业数字化转型时，应该优先考虑哪些关键因素？",
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
      meta: {
        footer: "AI 生成，仅供参考",
      },
    },
  ],
  "session-2": [
    {
      id: "msg-2-1",
      role: "assistant",
      type: "text",
      content: "这里是新的会话示例。",
    },
  ],
  "session-3": [
    {
      id: "msg-3-1",
      role: "assistant",
      type: "nested",
      content: "知识库搭建建议",
      meta: {
        title: "知识库搭建建议",
      },
      children: [
        {
          id: "msg-3-1-1",
          role: "assistant",
          type: "text",
          content: "1. 梳理业务知识结构",
        },
        {
          id: "msg-3-1-2",
          role: "assistant",
          type: "text",
          content: "2. 标注高频问题与知识",
        },
      ],
    },
  ],
};

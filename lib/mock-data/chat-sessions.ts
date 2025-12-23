export type MockChatSession = {
  id: string;
  title: string;
  timeLabel: string;
  group: "今天" | "昨天" | "本周" | "本月" | "更早";
};

export type MockChatMessagePart =
  | {
      type: "text";
      content: string;
    }
  | {
      type: "tool-call";
      toolName: "workflow" | "resource-summary";
      args: Record<string, unknown>;
    };

export type MockChatMessage = {
  id: string;
  role: "user" | "assistant";
  parts: MockChatMessagePart[];
};

export const mockChatSessions: MockChatSession[] = [
  {
    id: "session-001",
    title: "全国天气情况及出行建议公司…",
    timeLabel: "10:32",
    group: "今天",
  },
  {
    id: "session-002",
    title: "全国天气情况及出行建议公司…",
    timeLabel: "10:32",
    group: "今天",
  },
  {
    id: "session-003",
    title: "全国天气情况及出行建议公司…",
    timeLabel: "10:32",
    group: "今天",
  },
  {
    id: "session-004",
    title: "全国天气情况及出行建议公司…",
    timeLabel: "10:32",
    group: "今天",
  },
  {
    id: "session-005",
    title: "全国天气情况及出行建议公司…",
    timeLabel: "17:56",
    group: "昨天",
  },
  {
    id: "session-006",
    title: "全国天气情况及出行建议公司…",
    timeLabel: "11/12",
    group: "本周",
  },
  {
    id: "session-007",
    title: "全国天气情况及出行建议公司…",
    timeLabel: "11/10",
    group: "本月",
  },
  {
    id: "session-008",
    title: "全国天气情况及出行建议公司…",
    timeLabel: "2025/10/11",
    group: "更早",
  },
  {
    id: "session-009",
    title: "全国天气情况及出行建议公司…",
    timeLabel: "2025/10/10",
    group: "更早",
  },
];

export const mockChatMessagesBySessionId: Record<string, MockChatMessage[]> = {
  "session-001": [
    {
      id: "msg-001",
      role: "user",
      parts: [
        {
          type: "text",
          content: "我是一个博主，帮我写一篇关于猫的小红书文章，需要符合该平台写作风格。",
        },
      ],
    },
    {
      id: "msg-002",
      role: "assistant",
      parts: [
        {
          type: "text",
          content:
            "已收到你的需求，我会围绕“小红书风格、拟人化、情绪化标题、分段+表情符号”来输出，稍等片刻。",
        },
      ],
    },
  ],
  "session-002": [
    {
      id: "msg-003",
      role: "user",
      parts: [{ type: "text", content: "帮我写一份企业数字化转型的要点清单。" }],
    },
    {
      id: "msg-004",
      role: "assistant",
      parts: [
        {
          type: "text",
          content:
            "当然可以，重点包括：战略目标、业务流程重构、数据治理、IT 架构升级、组织与人才保障。",
        },
      ],
    },
  ],
  "session-003": [
    {
      id: "msg-005",
      role: "user",
      parts: [{ type: "text", content: "生成一段关于 AI 赋能知识库的介绍。" }],
    },
    {
      id: "msg-006",
      role: "assistant",
      parts: [
        {
          type: "text",
          content:
            "AI 赋能的知识库能够让检索更精准、内容更结构化，并支持面向场景的智能问答与决策辅助。",
        },
        {
          type: "tool-call",
          toolName: "workflow",
          args: {
            title: "知识库问答处理流程",
            steps: [
              {
                id: "step-1",
                label: "权限验证完成",
                status: "done",
                detail: "已确认用户具备访问权限。",
                duration: "1.5s",
              },
              {
                id: "step-2",
                label: "正在思考",
                status: "running",
                detail: "总结本次检索的关键要点。",
              },
              {
                id: "step-3",
                label: "检索完成",
                status: "pending",
                detail: "等待补充资料以完善回复。",
              },
            ],
          },
        },
      ],
    },
  ],
  "session-004": [
    {
      id: "msg-007",
      role: "assistant",
      parts: [
        {
          type: "text",
          content:
            "你可以试试：\n1. 设定角色和语气\n2. 给出目标读者\n3. 明确输出格式\n4. 增加示例素材",
        },
      ],
    },
  ],
  "session-005": [
    {
      id: "msg-008",
      role: "user",
      parts: [{ type: "text", content: "输出一份数据分析简报。" }],
    },
    {
      id: "msg-009",
      role: "assistant",
      parts: [
        {
          type: "text",
          content:
            "本期收入 1.58 亿元，同比增长 28.5%，净利润 2.5 亿元，同比增长 32%。",
        },
        {
          type: "tool-call",
          toolName: "resource-summary",
          args: {
            title: "参考资料",
            resources: [
              { id: "res-1", name: "经营数据分析报表.pdf", type: "pdf" },
              { id: "res-2", name: "数据洞察要点.docx", type: "doc" },
              { id: "res-3", name: "数据仓库指标说明", type: "link" },
            ],
          },
        },
      ],
    },
  ],
  "session-006": [
    {
      id: "msg-010",
      role: "assistant",
      parts: [
        {
          type: "text",
          content: "本周重点：梳理需求、输出原型、评审上线节奏。",
        },
      ],
    },
  ],
  "session-007": [
    {
      id: "msg-011",
      role: "assistant",
      parts: [{ type: "text", content: "本月重点：完成知识库全量迁移。" }],
    },
  ],
  "session-008": [
    {
      id: "msg-012",
      role: "assistant",
      parts: [{ type: "text", content: "整理历史资料完成。" }],
    },
  ],
  "session-009": [
    {
      id: "msg-013",
      role: "assistant",
      parts: [{ type: "text", content: "归档信息更新完毕。" }],
    },
  ],
};

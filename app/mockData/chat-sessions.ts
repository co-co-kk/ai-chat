export type ChatSession = {
  id: string;
  title: string;
  group: string;
  timeLabel: string;
};

export const mockChatSessions: ChatSession[] = [
  {
    id: "session-1",
    title: "全国天气情况及出行建议全国天气...",
    group: "今天",
    timeLabel: "10:32",
  },
  {
    id: "session-2",
    title: "企业数字化转型关键因素分析",
    group: "今天",
    timeLabel: "09:05",
  },
  {
    id: "session-3",
    title: "知识库内容规划与落地方案",
    group: "昨天",
    timeLabel: "18:22",
  },
  {
    id: "session-4",
    title: "销售指标回顾与预测",
    group: "本周",
    timeLabel: "11/10",
  },
  {
    id: "session-5",
    title: "渠道运营复盘",
    group: "本周",
    timeLabel: "11/07",
  },
  {
    id: "session-6",
    title: "客户画像更新建议",
    group: "本月",
    timeLabel: "11/01",
  },
];

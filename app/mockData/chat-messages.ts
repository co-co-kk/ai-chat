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
     "id": "msg-1-plan",
      "role": "assistant",
      "type": "tool-call",
      "content": "Implementation Plan",
      "meta": {
        "toolName": "plan",
        "args": {
        "id": "plan-comprehensive",
        "title": "Feature Implementation Plan",
        "description": "Step-by-step guide...",
        "todos": []
        } 
      }
    },
    {
      id: "msg-2",
      role: "user",
      type: "text",
      content: "全国天气情况及出行建议",
    },
    {
      id: "msg-3",
      role: "assistant",
      type: "analysis-card",
      content: "思考完成",
      meta: {
        title: "全国天气情况及出行建议",
        subtitle: "今日全国天气情况概览",
        duration: "1.5s",
        sections: [
          {
            title: "正在分析",
            description:
              "分析发现，北方地区有降温，南方地区有雨，即将为您提供详细天气信息。",
          },
        ],
      },
    },
    {
      id: "msg-4",
      role: "assistant",
      type: "text",
      content:
        "根据最新气象数据，北方地区气温下降明显，建议外出人员注意保暖；南方地区有降雨，出行请携带雨具。华东地区天气晴好，适宜户外活动。",
      meta: {
        footer: "AI 生成，仅供参考",
      },
    },
  ],
  "session-2": [
    {
      id: "msg-2-1",
      role: "user",
      type: "text",
      content: "在进行企业数字化转型时，应该优先考虑哪些关键因素？",
    },
    {
      id: "msg-2-2",
      role: "assistant",
      type: "text",
      content: "企业数字化转型的关键因素分析",
    },
    {
      id: "msg-2-3",
      role: "assistant",
      type: "analysis-card",
      content: "思考完成",
      meta: {
        title: "企业数字化转型关键因素分析",
        subtitle: "核心要素总结",
        duration: "2.1s",
        sections: [
          {
            title: "正在检索",
            description:
              "检索到多个相关数据源，包括数字化转型报告、成功案例和最佳实践。",
          },
        ],
      },
    },
    {
      id: "msg-2-4",
      role: "assistant",
      type: "text",
      content:
        "企业数字化转型应优先考虑以下关键因素：\n\n1. 战略规划：明确数字化转型目标和路线图\n2. 组织文化：培养创新和敏捷的组织文化\n3. 技术基础：构建灵活、可扩展的技术架构\n4. 数据治理：建立完善的数据收集、存储和分析体系\n5. 人才储备：培养具备数字化技能的人才队伍\n6. 客户体验：以提升客户体验为核心目标\n7. 流程优化：简化业务流程，提升运营效率",
      meta: {
        footer: "AI 生成，仅供参考",
      },
    },
  ],
  "session-3": [
    {
      id: "msg-3-1",
      role: "user",
      type: "text",
      content: "知识库内容规划与落地方案",
    },
    {
      id: "msg-3-2",
      role: "assistant",
      type: "nested",
      content: "知识库搭建建议",
      meta: {
        title: "知识库内容规划与落地方案",
      },
      children: [
        {
          id: "msg-3-2-1",
          role: "assistant",
          type: "text",
          content: "1. 梳理业务知识结构",
        },
        {
          id: "msg-3-2-2",
          role: "assistant",
          type: "text",
          content: "2. 标注高频问题与知识",
        },
        {
          id: "msg-3-2-3",
          role: "assistant",
          type: "text",
          content: "3. 设计检索与推荐机制",
        },
        {
          id: "msg-3-2-4",
          role: "assistant",
          type: "text",
          content: "4. 制定内容更新维护机制",
        },
      ],
    },
    {
      id: "msg-3-3",
      role: "assistant",
      type: "text",
      content: "以上是知识库内容规划的主要建议，可根据具体业务需求进行调整。",
      meta: {
        footer: "AI 生成，仅供参考",
      },
    },
  ],
  "session-4": [
    {
      id: "msg-4-1",
      role: "user",
      type: "text",
      content: "销售指标回顾与预测",
    },
    {
      id: "msg-4-2",
      role: "assistant",
      type: "analysis-card",
      content: "数据检索完成",
      meta: {
        title: "销售指标回顾与预测",
        subtitle: "本季度销售业绩分析",
        duration: "1.8s",
        sections: [
          {
            title: "正在分析",
            description:
              "分析销售数据集、客户转化率和产品销售情况，生成回顾与预测报告。",
          },
        ],
      },
    },
    {
      id: "msg-4-3",
      role: "assistant",
      type: "text",
      content: "根据历史销售数据分析，本季度总销售额同比增长12%，主要增长来源于新产品线。预计下季度销售额将继续增长8%-10%，建议加强供应链管理以应对需求增长。",
      meta: {
        footer: "AI 生成，仅供参考",
      },
    },
  ],
  "session-5": [
    {
      id: "msg-5-1",
      role: "user",
      type: "text",
      content: "渠道运营复盘",
    },
    {
      id: "msg-5-2",
      role: "assistant",
      type: "text",
      content: "渠道运营复盘报告",
    },
    {
      id: "msg-5-3",
      role: "assistant",
      type: "analysis-card",
      content: "复盘分析完成",
      meta: {
        title: "渠道运营复盘",
        subtitle: "各渠道表现概览",
        duration: "2.0s",
        sections: [
          {
            title: "正在复盘",
            description:
              "复盘各渠道运营数据，分析转化率、用户留存和ROI等关键指标。",
          },
        ],
      },
    },
    {
      id: "msg-5-4",
      role: "assistant",
      type: "text",
      content: "经过对各渠道的复盘分析，发现线上广告渠道ROI较高，但用户留存有待提升；线下渠道用户忠诚度高，但获客成本较高。建议优化线上渠道用户体验，提升留存率；同时探索线下渠道的降本增效方案。",
      meta: {
        footer: "AI 生成，仅供参考",
      },
    },
  ],
  "session-6": [
    {
      id: "msg-6-1",
      role: "user",
      type: "text",
      content: "客户画像更新建议",
    },
    {
      id: "msg-6-2",
      role: "assistant",
      type: "text",
      content: "客户画像更新建议",
    },
    {
      id: "msg-6-3",
      role: "assistant",
      type: "analysis-card",
      content: "画像分析完成",
      meta: {
        title: "客户画像更新建议",
        subtitle: "基于最新数据的用户画像",
        duration: "1.7s",
        sections: [
          {
            title: "正在分析",
            description:
              "分析用户行为数据、消费习惯和偏好变化，生成新的客户画像。",
          },
        ],
      },
    },
    {
      id: "msg-6-4",
      role: "assistant",
      type: "text",
      content: "根据最新数据，建议对客户画像进行以下更新：\n\n1. 年龄段分布：年轻用户群体增长明显\n2. 消费偏好：更注重个性化和定制化产品\n3. 购买渠道：移动端购买占比持续提升\n4. 关注因素：环保和可持续发展成为重要考量\n\n建议基于新画像调整营销策略和产品设计。",
      meta: {
        footer: "AI 生成，仅供参考",
      },
    },
  ],
};
import type { ThreadMessageLike } from "@assistant-ui/react";

/**
 * 把你自定义的 AiChatMessage 转成 assistant-ui Thread 可渲染的消息格式。
 * 重点：把原始结构挂到 message.custom.raw，方便你后续自定义节点渲染用。
 */
export function aiChatMessagesToThreadMessages(input: any[]): ThreadMessageLike[] {
  return input.map((m) => {
    // 先把所有类型都保证能显示（text / analysis-card / nested）
    // 你之后要做“真正的自定义块渲染”，可以继续利用 custom.raw 做更精细的组件映射
    let text = "";

    if (m.type === "text" || !m.type) {
      text = String(m.content ?? "");
    } else if (m.type === "analysis-card") {
      const title = m.meta?.title ?? "分析";
      const subtitle = m.meta?.subtitle ? `\n${m.meta.subtitle}` : "";
      const sections =
        m.meta?.sections?.map((s) => `\n- ${s.title}: ${s.description}`).join("") ?? "";
      const duration = m.meta?.duration ? `\n耗时：${m.meta.duration}` : "";
      text = `[AnalysisCard] ${title}${subtitle}${sections}${duration}`;
    } else if (m.type === "nested") {
      const title = m.meta?.title ?? String(m.content ?? "Nested");
      const children = m.children?.map((c) => `\n- ${c.content}`).join("") ?? "";
      text = `[Nested] ${title}${children}`;
    } else {
      // 兜底：未知类型也别丢
      text = `[${m.type}] ${String(m.content ?? "")}`;
    }

    const msg: ThreadMessageLike = {
      role: m.role,
      content: [{ type: "text", text }],
      custom: {
        raw: m, // ✅保留原始结构，后面自定义节点/卡片渲染全靠它
      },
    };

    return msg;
  });
}

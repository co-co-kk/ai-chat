"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  type AssistantRuntime,
  type AppendMessage,
  type ThreadMessageLike,
  useExternalStoreRuntime,
} from "@assistant-ui/react";

import type { AiChatFile, AiChatMessage, AiChatSession } from "../types";

type UseMockAssistantRuntimeArgs = {
  initialSessionId: string;
  sessions: AiChatSession[];
  sessionMessages: Record<string, AiChatMessage[]>; // 作为初始数据灌进去
  onSendMessage?: (args: {
    text: string;
    attachments?: AiChatFile[];
    message: AiChatMessage;
    sessionId: string;
  }) => Promise<void> | void;
};

// 🎯 核心修改在这里
function convertMessage(m: AiChatMessage): ThreadMessageLike {
  // 1. 如果是 Tool Call，必须返回 type: "tool-call" 的结构
  if (m.type === "tool-call" && m.meta?.toolName) {
    return {
      id: m.id,
      role: "assistant", // Tool Call 通常是 assistant 发起的
      content: [
        {
          type: "tool-call",
          toolName: m.meta.toolName,
          toolCallId: m.id, // 必须有唯一 ID
          args: m.meta.args ?? {}, // 你的 mock args
        },
      ],
      createdAt: m.createdAt ? new Date(m.createdAt) : undefined,
      custom: { raw: m },
    };
  }

  // 2. 只有 text 类型才走原来的逻辑
  const text =
    typeof m.content === "string" ? m.content : JSON.stringify(m.content ?? "");

  return {
    id: m.id,
    role: m.role,
    content: [{ type: "text", text }],
    createdAt: m.createdAt ? new Date(m.createdAt) : undefined,
    custom: { raw: m },
  };
}


function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function useMockAssistantRuntime(args: UseMockAssistantRuntimeArgs): {
  runtime: AssistantRuntime;
  activeSessionId: string;
  switchSession: (sessionId: string) => void;
  // 可选：你要在外面也能读到 store，就暴露出去
  // messagesBySession: Record<string, AiChatMessage[]>;
} {
  const { initialSessionId, sessionMessages, onSendMessage } = args;

  // ✅ 可写 store：把 import 的 mock 常量灌进来
  const [messagesBySession, setMessagesBySession] = useState<
    Record<string, AiChatMessage[]>
  >(() => {
    // 深拷贝一层，避免误改原对象引用
    const initial: Record<string, AiChatMessage[]> = {};
    for (const k of Object.keys(sessionMessages)) {
      initial[k] = [...(sessionMessages[k] ?? [])];
    }
    return initial;
  });

  const [activeSessionId, setActiveSessionId] = useState(initialSessionId);

  // 防止打字机定时器在切会话/卸载后还在跑
  const typingAbortRef = useRef<{ aborted: boolean }>({ aborted: false });

  const currentRawMessages = useMemo(
    () => messagesBySession[activeSessionId] ?? [],
    [messagesBySession, activeSessionId]
  );

  const appendMessage = useCallback((sessionId: string, msg: AiChatMessage) => {
    setMessagesBySession((prev) => {
      const next = { ...prev };
      const arr = next[sessionId] ? [...next[sessionId]] : [];
      arr.push(msg);
      next[sessionId] = arr;
      return next;
    });
  }, []);

  const updateAssistantMessageText = useCallback(
    (sessionId: string, assistantId: string, newText: string) => {
      setMessagesBySession((prev) => {
        const arr = prev[sessionId] ?? [];
        const idx = arr.findIndex((m) => m.id === assistantId);
        if (idx === -1) return prev;

        const next = { ...prev };
        const nextArr = [...arr];
        const target = nextArr[idx];

        nextArr[idx] = {
          ...target,
          content: newText,
          // 你也可以加 type: "text"
        };

        next[sessionId] = nextArr;
        return next;
      });
    },
    []
  );

  const ensureSession = useCallback((sessionId: string) => {
    setMessagesBySession((prev) => {
      if (prev[sessionId]) return prev;
      return { ...prev, [sessionId]: [] };
    });
  }, []);

  // ✅ 打字机：逐步更新同一条 assistant message
  const typewriterReply = useCallback(
    async (sessionId: string, assistantId: string, fullText: string) => {
      // 中止上一轮（例如快速切会话/再次发送）
      typingAbortRef.current.aborted = true;
      typingAbortRef.current = { aborted: false };
      const token = typingAbortRef.current;

      // 你可以调速度：每次吐 N 个字符，每隔 delay ms
      const step = 8; // 每次吐 8 个字
      const delay = 60; // 60ms

      let cur = "";
      for (let i = 0; i < fullText.length; i += step) {
        if (token.aborted) return;
        cur += fullText.slice(i, i + step);
        updateAssistantMessageText(sessionId, assistantId, cur);
        await sleep(delay);
      }
    },
    [updateAssistantMessageText]
  );
  const [isRunning, setIsRunning] = useState(false);

  const onNew = useCallback(
    async (msg: AppendMessage) => {

       if (isRunning) return; // ✅ 输入层的最后一道防线

  setIsRunning(true);

  try {
    
      const first = msg.content?.[0];
      if (!first || first.type !== "text") return;

      const text = first.text?.trim?.() ?? "";
      if (!text) return;

      const sessionId = activeSessionId;

      // 1) 追加 user 消息
      const userMsg: AiChatMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        type: "text",
        content: text,
        createdAt: new Date().toISOString(),
      };
      appendMessage(sessionId, userMsg);

      await onSendMessage?.({
        text,
        attachments: [],
        message: userMsg,
        sessionId,
      });

      // 2) 先插入一条空的 assistant 消息（用于后续逐步填充）
      const assistantId = `a-${Date.now()}`;
      const assistantMsg: AiChatMessage = {
        id: assistantId,
        role: "assistant",
        type: "text",
        content: "", // 先空
        createdAt: new Date().toISOString(),
      };
      appendMessage(sessionId, assistantMsg);

      // 3) mock 一个“比较长”的回复
      const longReply =
        "这是一个 mock 的长回复，用来模拟流式输出（打字机效果）。\n\n" +
        "你可以把这段替换成后续真实接口返回的内容：\n" +
        "1. 先追加 user\n" +
        "2. 再追加 assistant 占位\n" +
        "3. 不断更新这条 assistant 的 content\n\n" +
        "如果你希望更像 ChatGPT，还可以按 token/句子分段吐出，或者加一点随机停顿。";

      // 4) 打字机逐步更新
      void typewriterReply(sessionId, assistantId, longReply);
  } finally {
    setIsRunning(false); // ✅ 回复完成，解锁输入
  }
  
    },
    [activeSessionId, appendMessage, onSendMessage, typewriterReply]
  );

  const runtime = useExternalStoreRuntime<AiChatMessage>({
    messages: currentRawMessages,
    convertMessage,
    onNew,
    isRunning, // ✅ 关键
  });

  const switchSession = useCallback(
    (sessionId: string) => {
      // 切会话时中止打字机，避免串台
      typingAbortRef.current.aborted = true;
      ensureSession(sessionId);
      setActiveSessionId(sessionId);
    },
    [ensureSession]
  );

  return { runtime, activeSessionId, switchSession };
}

"use client";
import { makeAssistantToolUI } from "@assistant-ui/react";
import { useMemo } from "react";
import type { AiChatTool } from "../types";

export const DynamicToolRegistry = ({ tools }: { tools: AiChatTool[] }) => {
  // 使用 useMemo 生成注册组件列表，防止重复创建
  const RegisteredTools = useMemo(() => {
    return tools.map((tool) => {
      return makeAssistantToolUI({
        toolName: tool.toolName,
        render: ({ args }) => {
          // 如果有数据转换函数，先清洗数据
          const props = tool.dataTransformer ? tool.dataTransformer(args) : args;
          // 渲染用户的组件
          const Component = tool.component;
          return <Component {...props} />;
        },
      });
    });
  }, [tools]);

  return (
    <>
      {RegisteredTools.map((Tool, index) => (
        <Tool key={index} />
      ))}
    </>
  );
};

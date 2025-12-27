"use client";
import React from "react";
import { makeAssistantToolUI } from "@assistant-ui/react";
import { Plan } from "@/components/ui/plan";

function normalizePlanArgs(args: any) {
  if (!args || typeof args !== "object") return null;

  const todos = Array.isArray(args.todos) ? args.todos : [];

  return {
    id: String(args.id ?? "plan"),
    title: String(args.title ?? "Plan"),
    description: args.description ? String(args.description) : undefined,
    todos: todos.map((t: any, idx: number) => ({
      id: String(t?.id ?? `todo-${idx}`), // ✅ 稳定
      label: String(t?.label ?? ""),
      description: t?.description ? String(t.description) : undefined,
      status: t?.status === "completed" || t?.status === "in_progress" || t?.status === "pending"
        ? t.status
        : "pending",
    })),
  };
}


export const PlanToolUI = makeAssistantToolUI({
  toolName: "plan",
  render: function PlanToolUI({ args }) {
    const data = normalizePlanArgs(args);
    console.log(data, 'datadata');
    
    // 这里的 data 处理得很好，不需要改动
    if (!data) {
      return (
        <div className="rounded-lg border bg-white p-4 text-sm text-slate-500">
          Plan 数据加载中…
        </div>
      );
    }
    return <Plan {...data} />;
  },
});

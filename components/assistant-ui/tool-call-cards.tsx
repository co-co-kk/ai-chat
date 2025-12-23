"use client";

import type { FC } from "react";
import type { ToolCallMessagePartProps } from "@assistant-ui/react";
import { CheckCircle2, FileText, Link2, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type WorkflowStep = {
  id: string;
  label: string;
  status: "done" | "running" | "pending";
  detail?: string;
  duration?: string;
};

type WorkflowArgs = {
  title: string;
  steps: WorkflowStep[];
};

type ResourceArgs = {
  title: string;
  resources: { id: string; name: string; type: "pdf" | "doc" | "link" }[];
};

const statusConfig = {
  done: {
    icon: CheckCircle2,
    label: "完成",
    className: "text-emerald-500",
  },
  running: {
    icon: Loader2,
    label: "进行中",
    className: "text-blue-500",
  },
  pending: {
    icon: CheckCircle2,
    label: "待处理",
    className: "text-slate-300",
  },
} as const;

export const WorkflowToolCard: FC<ToolCallMessagePartProps<WorkflowArgs>> = ({
  args,
}) => {
  if (!args?.steps?.length) return null;

  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="text-sm font-semibold text-slate-700">{args.title}</div>
      <div className="mt-3 space-y-3">
        {args.steps.map((step) => {
          const config = statusConfig[step.status];
          const Icon = config.icon;

          return (
            <div
              key={step.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600"
            >
              <div className="flex items-start gap-2">
                <Icon
                  className={cn(
                    "mt-0.5 size-4",
                    step.status === "running" && "animate-spin",
                    config.className,
                  )}
                />
                <div>
                  <div className="font-medium text-slate-700">{step.label}</div>
                  {step.detail ? (
                    <div className="mt-1 text-[11px] text-slate-500">
                      {step.detail}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>{config.label}</span>
                {step.duration ? <span>{step.duration}</span> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ResourceSummaryToolCard: FC<ToolCallMessagePartProps<ResourceArgs>> = ({
  args,
}) => {
  if (!args?.resources?.length) return null;

  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="text-sm font-semibold text-slate-700">{args.title}</div>
      <div className="mt-3 space-y-2">
        {args.resources.map((resource) => {
          const Icon = resource.type === "link" ? Link2 : FileText;
          return (
            <div
              key={resource.id}
              className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600"
            >
              <div className="flex items-center gap-2">
                <Icon className="size-4 text-blue-500" />
                <span className="line-clamp-1">{resource.name}</span>
              </div>
              <span className="text-[10px] uppercase text-slate-400">
                {resource.type}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

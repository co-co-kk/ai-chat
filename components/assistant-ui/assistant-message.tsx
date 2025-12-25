"use client";

import { MessagePrimitive, BranchPickerPrimitive, ActionBarPrimitive } from "@assistant-ui/react";

export const AssistantMessage = () => {
  return (
    <MessagePrimitive.Root className="grid w-full max-w-[var(--thread-max-width)] py-4">
      <div className="max-w-[80%] leading-7">
        <MessagePrimitive.Parts />
      </div>
      <BranchPickerPrimitive.Root hideWhenSingleBranch className="inline-flex items-center text-xs">
        <BranchPickerPrimitive.Previous asChild>
          <button>←</button>
        </BranchPickerPrimitive.Previous>
        <span>
          <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
        </span>
        <BranchPickerPrimitive.Next asChild>
          <button>→</button>
        </BranchPickerPrimitive.Next>
      </BranchPickerPrimitive.Root>
      <ActionBarPrimitive.Root
        hideWhenRunning
        autohide="not-last"
        className="flex items-end"
      >
        <ActionBarPrimitive.Edit asChild>
          <button>编辑</button>
        </ActionBarPrimitive.Edit>
      </ActionBarPrimitive.Root>
    </MessagePrimitive.Root>
  );
};
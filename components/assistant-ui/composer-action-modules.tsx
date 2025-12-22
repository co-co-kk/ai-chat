"use client";

import type { FC, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { cn } from "@/lib/utils";

export type ComposerActionModule =
  | {
      id: string;
      type: "icon";
      label: string;
      icon: ReactNode;
      onClick?: () => void;
      disabled?: boolean;
    }
  | {
      id: string;
      type: "button";
      label: string;
      icon?: ReactNode;
      onClick?: () => void;
      disabled?: boolean;
    };

export type ComposerActionModulesProps = {
  modules?: ComposerActionModule[];
  className?: string;
};

export const ComposerActionModules: FC<ComposerActionModulesProps> = ({
  modules = [],
  className,
}) => {
  if (modules.length === 0) {
    return null;
  }

  return (
    <div className={cn("aui-composer-action-modules flex items-center gap-2", className)}>
      {modules.map((module) => {
        if (module.type === "icon") {
          return (
            <TooltipIconButton
              key={module.id}
              tooltip={module.label}
              variant="ghost"
              className="aui-composer-action-module-icon size-8 rounded-lg text-muted-foreground"
              onClick={module.onClick}
              disabled={module.disabled}
            >
              {module.icon}
            </TooltipIconButton>
          );
        }

        return (
          <Button
            key={module.id}
            type="button"
            variant="outline"
            size="sm"
            className="aui-composer-action-module-button h-8 rounded-full border-muted-foreground/20 px-3 text-xs text-muted-foreground"
            onClick={module.onClick}
            disabled={module.disabled}
          >
            {module.icon ? (
              <span className="mr-1 flex items-center">{module.icon}</span>
            ) : null}
            <span>{module.label}</span>
            <ChevronDown className="ml-1 size-3 text-muted-foreground" />
          </Button>
        );
      })}
    </div>
  );
};

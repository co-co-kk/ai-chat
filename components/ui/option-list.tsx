import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface Option {
  id: string;
  label: string;
  description?: string;
}

interface ResponseAction {
  id: string;
  label: string;
  variant?: "default" | "ghost" | "destructive" | "outline" | "secondary" | "link";
}

interface OptionListProps {
  options: Option[];
  selectionMode?: "single" | "multi";
  maxSelections?: number;
  responseActions?: ResponseAction[];
  onConfirm?: (selection: string[]) => void;
  className?: string;
}

export function OptionList({
  options,
  selectionMode = "single",
  maxSelections,
  responseActions = [],
  onConfirm,
  className,
}: OptionListProps) {
  const [selected, setSelected] = React.useState<string[]>([]);

  const handleSelect = (id: string) => {
    if (selectionMode === "multi") {
      if (selected.includes(id)) {
        setSelected(selected.filter((s) => s !== id));
      } else if (!maxSelections || selected.length < maxSelections) {
        setSelected([...selected, id]);
      }
    } else {
      setSelected([id]);
    }
  };

  const handleAction = (actionId: string) => {
    if (actionId === "confirm" && onConfirm) {
      onConfirm(selected);
    } else if (actionId === "cancel") {
      setSelected([]);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        {options.map((option) => {
          const isSelected = selected.includes(option.id);
          return (
            <div
              key={option.id}
              className={cn(
                "relative flex items-start space-x-3 rounded-lg border p-4 cursor-pointer transition-colors",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-accent/50"
              )}
              onClick={() => handleSelect(option.id)}
            >
              <div className="flex h-6 items-center">
                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded border-2 transition-colors",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border"
                  )}
                >
                  {isSelected && <Check className="h-3 w-3" />}
                </div>
              </div>
              <div className="flex-1">
                <div className="font-medium">{option.label}</div>
                {option.description && (
                  <div className="text-sm text-muted-foreground">
                    {option.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {responseActions.length > 0 && (
        <div className="flex gap-2 justify-end">
          {responseActions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant || "default"}
              size="sm"
              onClick={() => handleAction(action.id)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

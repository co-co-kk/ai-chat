import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, Circle, Play, RotateCcw } from "lucide-react";

interface Todo {
  id: string;
  label: string;
  description?: string;
  status: "completed" | "in_progress" | "pending";
}

interface PlanProps {
  id: string;
  title: string;
  description?: string;
  todos: Todo[];
  className?: string;
}

export function Plan({
  id,
  title,
  description,
  todos,
  className,
}: PlanProps) {
  const getStatusIcon = (status: Todo["status"]) => {
    switch (status) {
      case "completed":
        return <Check className="h-4 w-4 text-green-500" />;
      case "in_progress":
        return <Play className="h-4 w-4 text-blue-500" />;
      case "pending":
        return <Circle className="h-4 w-4 text-gray-300" />;
      default:
        return <Circle className="h-4 w-4 text-gray-300" />;
    }
  };

  const getStatusText = (status: Todo["status"]) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in_progress":
        return "In Progress";
      case "pending":
        return "Pending";
      default:
        return "";
    }
  };

  const getStatusClassName = (status: Todo["status"]) => {
    switch (status) {
      case "completed":
        return "border-green-500 bg-green-50";
      case "in_progress":
        return "border-blue-500 bg-blue-50";
      case "pending":
        return "border-gray-200 bg-gray-50";
      default:
        return "border-gray-200";
    }
  };

  return (
    <div id={id} className={cn("rounded-lg border p-6 space-y-4", className)}>
      12121221
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      
      <div className="space-y-3">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={cn(
              "flex items-start space-x-3 rounded-lg border p-4 transition-colors",
              getStatusClassName(todo.status)
            )}
          >
            <div className="mt-0.5">
              {getStatusIcon(todo.status)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-medium">{todo.label}</div>
                <span className="text-xs px-2 py-1 rounded-full bg-white border">
                  {getStatusText(todo.status)}
                </span>
              </div>
              {todo.description && (
                <div className="text-sm text-muted-foreground mt-1">
                  {todo.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
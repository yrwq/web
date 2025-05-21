import React from "react";
import { cn } from "@/lib/utils";
import { Check, Circle } from "lucide-react";

interface TodoProps {
  children: React.ReactNode;
  className?: string;
  done?: boolean;
}

export function Todo({
  children,
  className,
  done = false,
  ...props
}: TodoProps) {
  return (
    <div className={cn("flex", className)}>
      <div className={cn("p-2  flex items-center gap-3")}>
        <span className={cn("flex-shrink-0 mt-0.5")}>
          {done ? <Check size={18} /> : <Circle size={18} />}
        </span>
        <div
          className={cn(
            "text-lg transition-all duration-200",
            done && "text-slate-400 line-through",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default Todo;

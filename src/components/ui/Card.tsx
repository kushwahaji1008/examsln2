import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({
  children,
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-slate-900/80 border border-border/10 text-slate-100 shadow-lg p-6 backdrop-blur-xl",
        className
      )}
    >
      {children}
    </div>
  );
}

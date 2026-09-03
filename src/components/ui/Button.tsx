import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline";
}

export default function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-sky-500 text-primary-foreground hover:bg-sky-400 shadow-md shadow-sky-500/20",
    secondary:
      "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700",
    danger:
      "bg-rose-500 text-primary-foreground hover:bg-rose-600",
    outline:
      "border border-slate-700 text-slate-200 hover:bg-slate-800",
  };

  return (
    <button
      className={cn(
        "px-4 py-2 rounded-xl font-medium transition duration-200 disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

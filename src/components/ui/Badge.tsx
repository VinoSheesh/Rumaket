import { HTMLAttributes } from "react";

type BadgeVariant = "default" | "warmth" | "success" | "danger";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "border-brand-200 bg-brand-50 text-brand-700",
  warmth: "border-warmth-200 bg-warmth-100 text-warmth-600",
  success: "border-emerald-200 bg-emerald-100 text-emerald-700",
  danger: "border-rose-200 bg-rose-100 text-rose-700",
};

export function Badge({
  variant = "default",
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}

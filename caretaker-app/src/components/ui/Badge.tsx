import { HTMLAttributes } from "react";

export function Badge({
  className = "",
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium ${className}`}
      {...props}
    />
  );
}

import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-700 text-white hover:bg-brand-800 active:bg-brand-900 disabled:bg-brand-200",
  secondary:
    "bg-white text-brand-700 border border-brand-200 hover:border-brand-700 hover:bg-brand-50 disabled:text-slate-300 disabled:border-slate-200",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 disabled:text-slate-300",
  danger:
    "bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 disabled:text-slate-300 disabled:border-slate-200",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-100 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

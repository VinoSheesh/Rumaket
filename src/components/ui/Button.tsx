import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "inverse" | "inverseOutline" | "warmth";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-700 text-white hover:bg-brand-800 active:bg-brand-900 disabled:bg-brand-200 shadow-sm",
  secondary:
    "bg-white text-brand-700 border border-brand-200 hover:border-brand-700 hover:bg-brand-50 disabled:text-slate-300 disabled:border-slate-200",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 disabled:text-slate-300",
  danger:
    "bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 disabled:text-slate-300 disabled:border-slate-200",
  // Varian baru untuk Hero Section (Dark Theme)
  inverse:
    "bg-white text-brand-900 hover:bg-slate-100 active:bg-slate-200 shadow-md",
  inverseOutline:
    "bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/40 backdrop-blur-sm",
  warmth:
    "bg-warmth-500 text-white hover:bg-warmth-600 active:bg-warmth-600 shadow-sm",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-10 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base",
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
        className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  loading = false,
  icon,
  iconPosition = "right",
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-medium";
  
  const variantStyles = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "text-gray-300 bg-gray-700 hover:bg-gray-600 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600",
    ghost: "text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600",
  };

  // Combine styles and ensure the button is disabled when loading
  const buttonClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    
      <button
        className={buttonClassName}
        disabled={disabled || loading} // Disable button if `disabled` prop is true OR if `loading` is true
        {...props}
        >
        {loading && <Loader2 className="h-5 w-5 animate-spin" />} {/* Correct conditional rendering with a wrapper */}

        {!loading && iconPosition === "left" && icon}

        {children}

        {!loading && iconPosition === "right" && icon}
        </button>
    
  );
}
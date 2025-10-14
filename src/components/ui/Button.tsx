'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'ghost' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-ring btn-hover rounded-xl border';
  
  const variantClasses = {
    primary: 'bg-gradient-to-b from-purple-400 to-blue-500 text-slate-900 border-transparent hover:from-purple-500 hover:to-blue-600 shadow-lg',
    secondary: 'bg-gradient-to-b from-slate-400 to-slate-600 text-slate-900 border-transparent hover:from-slate-500 hover:to-slate-700 shadow-lg',
    success: 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-emerald-900 border-transparent hover:from-emerald-500 hover:to-emerald-700 shadow-lg',
    error: 'bg-gradient-to-b from-red-400 to-red-600 text-white border-transparent hover:from-red-500 hover:to-red-700 shadow-lg',
    ghost: 'bg-transparent border-dashed border-white/30 text-white hover:bg-white/10 hover:border-white/50',
    outline: 'bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white/50'
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        isDisabled && 'opacity-50 cursor-not-allowed transform-none',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;

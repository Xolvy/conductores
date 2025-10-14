'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled';
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  variant = 'default',
  fullWidth = false,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substring(7)}`;
  
  const baseClasses = 'px-3 py-2 border rounded-xl transition-all duration-200 focus-ring';
  const variantClasses = {
    default: 'bg-white/10 border-white/30 text-white placeholder-gray-400 focus:bg-white/15 focus:border-white/50',
    filled: 'bg-white/5 border-transparent text-white placeholder-gray-400 focus:bg-white/10'
  };

  return (
    <div className={cn(fullWidth && 'w-full')}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          {label}
        </label>
      )}
      
      <input
        ref={ref}
        id={inputId}
        className={cn(
          baseClasses,
          variantClasses[variant],
          error && 'border-red-400 focus:border-red-400',
          fullWidth && 'w-full',
          className
        )}
        {...props}
      />
      
      {(error || helperText) && (
        <div className="mt-1 text-sm">
          {error && (
            <p className="text-red-400">{error}</p>
          )}
          {!error && helperText && (
            <p className="text-gray-400">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

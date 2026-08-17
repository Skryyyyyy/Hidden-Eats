'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-bold transition-all rounded-xl cursor-pointer disabled:opacity-50';
  
  const variantClasses = {
    default: 'bg-[#f59e0b] hover:bg-[#d97706] text-black shadow-lg shadow-[#f59e0b]/20',
    secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/15',
    outline: 'border border-white/20 hover:bg-white/10 text-white',
    ghost: 'hover:bg-white/10 text-white/80 hover:text-white',
  }[variant];

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-xs',
    lg: 'px-6 py-3 text-sm',
  }[size];

  return (
    <button
      type="button"
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

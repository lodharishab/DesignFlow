'use client';

import { Button as HeroButton, type ButtonProps as HeroButtonProps } from '@heroui/react';
import { cn } from '@/lib/utils';
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  isLoading?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'default', className, children, asChild, isLoading, startContent, endContent, ...props }, ref) => {
    const heroVariant = {
      default: 'solid' as const,
      destructive: 'solid' as const,
      outline: 'bordered' as const,
      secondary: 'flat' as const,
      ghost: 'light' as const,
      link: 'light' as const,
    }[variant];

    const heroColor = {
      default: 'primary' as const,
      destructive: 'danger' as const,
      outline: 'default' as const,
      secondary: 'secondary' as const,
      ghost: 'default' as const,
      link: 'primary' as const,
    }[variant];

    const heroSize = {
      default: 'md' as const,
      sm: 'sm' as const,
      lg: 'lg' as const,
      icon: 'sm' as const,
    }[size];

    return (
      <HeroButton
        ref={ref}
        variant={heroVariant}
        color={heroColor}
        size={heroSize}
        radius="lg"
        isLoading={isLoading}
        startContent={startContent}
        endContent={endContent}
        className={cn(
          'font-medium transition-all duration-200',
          size === 'icon' && 'min-w-0 w-9 h-9 p-0',
          variant === 'link' && 'underline-offset-4 hover:underline px-0 data-[hover=true]:bg-transparent',
          className,
        )}
        {...(props as any)}
      >
        {children}
      </HeroButton>
    );
  }
);
Button.displayName = 'Button';

function buttonVariants({ variant = 'default', size = 'default' }: { variant?: string; size?: string } = {}) {
  return cn(
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
    variant === 'default' && 'bg-primary text-white',
    variant === 'destructive' && 'bg-danger text-white',
    variant === 'outline' && 'border border-default-300',
    variant === 'secondary' && 'bg-secondary/20 text-secondary',
    variant === 'ghost' && 'hover:bg-default-100',
    variant === 'link' && 'text-primary underline-offset-4 hover:underline',
    size === 'sm' && 'h-8 px-3 text-xs',
    size === 'default' && 'h-10 px-4 text-sm',
    size === 'lg' && 'h-12 px-6 text-base',
    size === 'icon' && 'h-9 w-9',
  );
}

export { Button, buttonVariants };

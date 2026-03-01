'use client';

import { Button as HeroButton } from '@heroui/react';
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

function getButtonClasses(variant: string, size: string) {
  return cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200',
    variant === 'default' && 'bg-primary text-primary-foreground hover:opacity-90',
    variant === 'destructive' && 'bg-danger text-white hover:opacity-90',
    variant === 'outline' && 'border border-default-300 bg-transparent hover:bg-default-100 text-foreground',
    variant === 'secondary' && 'bg-default-100 text-foreground hover:bg-default-200',
    variant === 'ghost' && 'hover:bg-default-100 text-foreground',
    variant === 'link' && 'text-primary underline-offset-4 hover:underline',
    size === 'default' && 'h-10 px-4 py-2 text-sm',
    size === 'sm' && 'h-8 px-3 text-xs rounded-md',
    size === 'lg' && 'h-12 px-6 text-base',
    size === 'icon' && 'h-9 w-9 min-w-0 p-0 flex items-center justify-center',
  );
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'default', className, children, asChild, isLoading, startContent, endContent, ...props }, ref) => {
    // Handle asChild - render child element directly with button styling (like Radix Slot)
    if (asChild && React.isValidElement(children)) {
      const childProps = (children as React.ReactElement<any>).props;
      return React.cloneElement(children as React.ReactElement<any>, {
        ref,
        className: cn(getButtonClasses(variant, size), className, childProps?.className),
        ...props,
      });
    }

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
  return getButtonClasses(variant, size);
}

export { Button, buttonVariants };

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variant === 'default' && 'bg-primary text-primary-foreground',
        variant === 'secondary' && 'bg-secondary/20 text-secondary',
        variant === 'destructive' && 'bg-danger text-white',
        variant === 'outline' && 'border border-default-300 text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

function badgeVariants({ variant = 'default' }: { variant?: string } = {}) {
  return cn(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
    variant === 'default' && 'bg-primary text-primary-foreground',
    variant === 'secondary' && 'bg-secondary/20 text-secondary',
    variant === 'destructive' && 'bg-danger text-white',
    variant === 'outline' && 'border border-default-300 text-foreground',
  );
}

export { Badge, badgeVariants };

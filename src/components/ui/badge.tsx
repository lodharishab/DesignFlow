import * as React from 'react';
import { Chip, type ChipProps } from '@heroui/react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

const variantToColor: Record<string, ChipProps['color']> = {
  default: 'primary',
  secondary: 'secondary',
  destructive: 'danger',
  outline: 'default',
};

const variantToChipVariant: Record<string, ChipProps['variant']> = {
  default: 'solid',
  secondary: 'flat',
  destructive: 'solid',
  outline: 'bordered',
};

function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <Chip
      color={variantToColor[variant]}
      variant={variantToChipVariant[variant]}
      size="sm"
      radius="full"
      className={cn('px-2.5 py-0.5 text-xs font-semibold', className)}
      {...(props as any)}
    >
      {children}
    </Chip>
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

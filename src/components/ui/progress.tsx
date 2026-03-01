'use client';

import * as React from 'react';
import { Progress as HeroProgress } from '@heroui/react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => (
    <HeroProgress
      ref={ref as any}
      value={value}
      maxValue={max}
      size="sm"
      radius="full"
      color="primary"
      className={cn(className)}
      classNames={{
        track: 'bg-default-200',
        indicator: 'bg-gradient-to-r from-primary to-secondary',
      }}
      {...(props as any)}
    />
  )
);
Progress.displayName = 'Progress';

export { Progress };

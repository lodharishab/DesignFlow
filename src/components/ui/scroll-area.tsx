'use client';

import * as React from 'react';
import { ScrollShadow } from '@heroui/react';
import { cn } from '@/lib/utils';

const ScrollArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { orientation?: 'vertical' | 'horizontal' }>(
  ({ className, children, orientation = 'vertical', ...props }, ref) => (
    <ScrollShadow
      ref={ref as any}
      orientation={orientation}
      className={cn('relative overflow-auto', className)}
      {...(props as any)}
    >
      {children}
    </ScrollShadow>
  )
);
ScrollArea.displayName = 'ScrollArea';

const ScrollBar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { orientation?: 'vertical' | 'horizontal' }>(
  ({ className, orientation = 'vertical', ...props }, ref) => (
    <div ref={ref} className={cn('flex touch-none select-none transition-colors', className)} {...props} />
  )
);
ScrollBar.displayName = 'ScrollBar';

export { ScrollArea, ScrollBar };

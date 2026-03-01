'use client';

import * as React from 'react';
import { Popover as HeroPopover, PopoverTrigger as HeroPopoverTrigger, PopoverContent as HeroPopoverContent } from '@heroui/react';
import { cn } from '@/lib/utils';

const Popover = ({ children, ...props }: any) => <>{children}</>;

const PopoverTrigger = React.forwardRef<HTMLElement, any>(
  ({ children, asChild, ...props }, ref) => <>{children}</>
);
PopoverTrigger.displayName = 'PopoverTrigger';

const PopoverContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { sideOffset?: number; align?: string; side?: string }>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'z-50 w-72 rounded-lg border border-default-200 bg-content1 p-4 shadow-lg outline-none',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
PopoverContent.displayName = 'PopoverContent';

export { Popover, PopoverTrigger, PopoverContent };

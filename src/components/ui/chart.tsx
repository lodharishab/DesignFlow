'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

// Chart components stub - reusing the same exports for recharts integration
const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { config?: any }>(
  ({ className, children, config, ...props }, ref) => (
    <div ref={ref} className={cn('w-full', className)} {...props}>
      {children}
    </div>
  )
);
ChartContainer.displayName = 'ChartContainer';

const ChartTooltip = ({ children, ...props }: any) => <>{children}</>;
const ChartTooltipContent = ({ className, ...props }: any) => (
  <div className={cn('rounded-lg bg-content1 border border-default-200 px-3 py-2 shadow-lg text-sm', className)} {...props} />
);
const ChartLegend = ({ children, ...props }: any) => <>{children}</>;
const ChartLegendContent = ({ className, ...props }: any) => (
  <div className={cn('flex items-center gap-4 text-sm', className)} {...props} />
);

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent };

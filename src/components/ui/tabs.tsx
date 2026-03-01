'use client';

import * as React from 'react';
import { Tabs as HeroTabs, Tab } from '@heroui/react';
import { cn } from '@/lib/utils';

const Tabs = ({ className, children, defaultValue, value, onValueChange, ...props }: any) => {
  return (
    <div className={cn('w-full', className)} data-value={value || defaultValue}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as any, { activeTab: value || defaultValue, onValueChange });
        }
        return child;
      })}
    </div>
  );
};

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { activeTab?: string; onValueChange?: (v: string) => void }>(
  ({ className, children, activeTab, onValueChange, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-lg bg-default-100 p-1 text-default-500',
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as any, { activeTab, onValueChange });
        }
        return child;
      })}
    </div>
  )
);
TabsList.displayName = 'TabsList';

const TabsTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { value?: string; activeTab?: string; onValueChange?: (v: string) => void }>(
  ({ className, value, activeTab, onValueChange, children, ...props }, ref) => {
    const isActive = activeTab === value;
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          isActive
            ? 'bg-background text-foreground shadow-sm'
            : 'text-default-500 hover:text-foreground hover:bg-default-200/50',
          className
        )}
        onClick={() => onValueChange?.(value || '')}
        data-state={isActive ? 'active' : 'inactive'}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value?: string }>(
  ({ className, value, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mt-2 ring-offset-background focus-visible:outline-none', className)}
      role="tabpanel"
      data-value={value}
      {...props}
    />
  )
);
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };

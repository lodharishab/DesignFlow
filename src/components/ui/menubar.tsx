import * as React from 'react';
import { cn } from '@/lib/utils';

const Menubar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex h-10 items-center space-x-1 rounded-lg border border-default-200 bg-content1 p-1', className)} {...props} />
  )
);
Menubar.displayName = 'Menubar';

const MenubarMenu = ({ children, ...props }: any) => <div {...props}>{children}</div>;
const MenubarTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button ref={ref} className={cn('flex cursor-default select-none items-center rounded-md px-3 py-1.5 text-sm font-medium outline-none hover:bg-default-100', className)} {...props} />
  )
);
MenubarTrigger.displayName = 'MenubarTrigger';

const MenubarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('z-50 min-w-[12rem] overflow-hidden rounded-lg border border-default-200 bg-content1 p-1 shadow-lg', className)} {...props} />
  )
);
MenubarContent.displayName = 'MenubarContent';

const MenubarItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }>(
  ({ className, inset, ...props }, ref) => (
    <div ref={ref} className={cn('relative flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none hover:bg-default-100', inset && 'pl-8', className)} {...props} />
  )
);
MenubarItem.displayName = 'MenubarItem';

const MenubarSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('-mx-1 my-1 h-px bg-default-200', className)} {...props} />
  )
);
MenubarSeparator.displayName = 'MenubarSeparator';

export { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator };

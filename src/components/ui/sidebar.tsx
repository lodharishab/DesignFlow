'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { PanelLeft } from 'lucide-react';

// Sidebar context
interface SidebarContextType {
  isOpen: boolean;
  setOpen: (v: boolean) => void;
  isCollapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

const SidebarContext = React.createContext<SidebarContextType>({
  isOpen: true,
  setOpen: () => {},
  isCollapsed: false,
  setCollapsed: () => {},
});

export function useSidebar() {
  return React.useContext(SidebarContext);
}

const SidebarProvider = ({ children, defaultOpen = true, ...props }: { children: React.ReactNode; defaultOpen?: boolean } & React.HTMLAttributes<HTMLDivElement>) => {
  const [isOpen, setOpen] = React.useState(defaultOpen);
  const [isCollapsed, setCollapsed] = React.useState(false);

  return (
    <SidebarContext.Provider value={{ isOpen, setOpen, isCollapsed, setCollapsed }}>
      <div className={cn('flex min-h-screen w-full', props.className)} {...props}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
};

const Sidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { side?: 'left' | 'right'; collapsible?: 'none' | 'icon' | 'offcanvas' }>(
  ({ className, children, side = 'left', collapsible = 'offcanvas', ...props }, ref) => {
    const { isOpen } = useSidebar();

    return (
      <motion.aside
        ref={ref}
        initial={false}
        animate={{ width: isOpen ? 256 : 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          'relative z-30 flex-shrink-0 overflow-hidden bg-content1 border-r border-default-200',
          side === 'right' && 'order-last border-l border-r-0',
          className
        )}
        {...(props as any)}
      >
        <div className="flex h-full w-64 flex-col">
          {children}
        </div>
      </motion.aside>
    );
  }
);
Sidebar.displayName = 'Sidebar';

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-2 p-4', className)} {...props} />
  )
);
SidebarHeader.displayName = 'SidebarHeader';

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-1 flex-col gap-1 overflow-auto p-4 scrollbar-thin', className)} {...props} />
  )
);
SidebarContent.displayName = 'SidebarContent';

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-2 p-4 border-t border-default-200', className)} {...props} />
  )
);
SidebarFooter.displayName = 'SidebarFooter';

const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1', className)} {...props} />
  )
);
SidebarGroup.displayName = 'SidebarGroup';

const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-2 py-1.5 text-xs font-semibold text-default-500 uppercase tracking-wider', className)} {...props} />
  )
);
SidebarGroupLabel.displayName = 'SidebarGroupLabel';

const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-0.5', className)} {...props} />
  )
);
SidebarGroupContent.displayName = 'SidebarGroupContent';

const SidebarMenu = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('flex flex-col gap-0.5', className)} {...props} />
  )
);
SidebarMenu.displayName = 'SidebarMenu';

const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn(className)} {...props} />
  )
);
SidebarMenuItem.displayName = 'SidebarMenuItem';

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean; tooltip?: string; asChild?: boolean }>(
  ({ className, isActive, tooltip, asChild, children, ...props }, ref) => {
    const Comp = asChild ? 'span' : 'button';
    return (
      <Comp
        ref={ref as any}
        className={cn(
          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200',
          'hover:bg-default-100 active:bg-default-200',
          isActive && 'bg-primary/10 text-primary font-medium',
          !isActive && 'text-default-600',
          className
        )}
        title={tooltip}
        {...(props as any)}
      >
        {children}
      </Comp>
    );
  }
);
SidebarMenuButton.displayName = 'SidebarMenuButton';

const SidebarMenuSub = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('ml-4 flex flex-col gap-0.5 border-l border-default-200 pl-3', className)} {...props} />
  )
);
SidebarMenuSub.displayName = 'SidebarMenuSub';

const SidebarMenuSubItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn(className)} {...props} />
  )
);
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem';

const SidebarMenuSubButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean; asChild?: boolean }>(
  ({ className, isActive, asChild, children, ...props }, ref) => {
    const Comp = asChild ? 'span' : 'button';
    return (
      <Comp
        ref={ref as any}
        className={cn(
          'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
          'hover:bg-default-100',
          isActive && 'text-primary font-medium',
          !isActive && 'text-default-500',
          className
        )}
        {...(props as any)}
      >
        {children}
      </Comp>
    );
  }
);
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton';

const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { isOpen, setOpen } = useSidebar();
    return (
      <button
        ref={ref}
        onClick={() => setOpen(!isOpen)}
        className={cn('inline-flex items-center justify-center rounded-lg p-2 hover:bg-default-100 transition-colors', className)}
        {...props}
      >
        <PanelLeft className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </button>
    );
  }
);
SidebarTrigger.displayName = 'SidebarTrigger';

const SidebarInset = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-1 flex-col overflow-hidden', className)} {...props} />
  )
);
SidebarInset.displayName = 'SidebarInset';

const SidebarRail = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('absolute inset-y-0 right-0 w-1 transition-colors hover:bg-default-300', className)} {...props} />
  )
);
SidebarRail.displayName = 'SidebarRail';

export {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
  SidebarInset,
  SidebarRail,
};

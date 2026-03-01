'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const TooltipProvider = ({ children }: { children: React.ReactNode; delayDuration?: number }) => <>{children}</>;

interface TooltipContextType {
  isOpen: boolean;
  setOpen: (v: boolean) => void;
}

const TooltipContext = React.createContext<TooltipContextType>({
  isOpen: false,
  setOpen: () => {},
});

interface TooltipProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
}

const Tooltip = ({ children, open, onOpenChange, delayDuration, ...props }: TooltipProps) => {
  const [isOpen, setIsOpen] = React.useState(open ?? false);
  React.useEffect(() => { if (open !== undefined) setIsOpen(open); }, [open]);
  const setOpen = React.useCallback((v: boolean) => {
    setIsOpen(v);
    onOpenChange?.(v);
  }, [onOpenChange]);
  return (
    <TooltipContext.Provider value={{ isOpen, setOpen }}>
      <div className="relative inline-flex">{children}</div>
    </TooltipContext.Provider>
  );
};

const TooltipTrigger = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & { asChild?: boolean }>(
  ({ children, asChild, ...props }, ref) => {
    const { setOpen } = React.useContext(TooltipContext);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

    const handleEnter = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setOpen(true), 200);
    };
    const handleLeave = () => {
      clearTimeout(timeoutRef.current);
      setOpen(false);
    };

    React.useEffect(() => {
      return () => clearTimeout(timeoutRef.current);
    }, []);

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as any, {
        onMouseEnter: handleEnter,
        onMouseLeave: handleLeave,
        onFocus: handleEnter,
        onBlur: handleLeave,
        ref,
      });
    }
    return (
      <span onMouseEnter={handleEnter} onMouseLeave={handleLeave} onFocus={handleEnter} onBlur={handleLeave} ref={ref as any} {...props}>
        {children}
      </span>
    );
  }
);
TooltipTrigger.displayName = 'TooltipTrigger';

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  children: React.ReactNode;
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, children, side = 'top', sideOffset = 4, ...props }, ref) => {
    const { isOpen } = React.useContext(TooltipContext);
    if (!isOpen) return null;
    return (
      <div
        ref={ref}
        role="tooltip"
        className={cn(
          'absolute z-50 overflow-hidden rounded-lg bg-foreground px-3 py-1.5 text-xs text-background shadow-lg pointer-events-none whitespace-nowrap',
          side === 'top' && 'bottom-full left-1/2 -translate-x-1/2 mb-2',
          side === 'bottom' && 'top-full left-1/2 -translate-x-1/2 mt-2',
          side === 'left' && 'right-full top-1/2 -translate-y-1/2 mr-2',
          side === 'right' && 'left-full top-1/2 -translate-y-1/2 ml-2',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TooltipContent.displayName = 'TooltipContent';

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

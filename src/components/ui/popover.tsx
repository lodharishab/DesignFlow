'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface PopoverContextType {
  isOpen: boolean;
  setOpen: (v: boolean) => void;
}

const PopoverContext = React.createContext<PopoverContextType>({
  isOpen: false,
  setOpen: () => {},
});

const Popover = ({ children, open, onOpenChange, ...props }: { children: React.ReactNode; open?: boolean; onOpenChange?: (v: boolean) => void }) => {
  const [isOpen, setIsOpen] = React.useState(open ?? false);
  React.useEffect(() => { if (open !== undefined) setIsOpen(open); }, [open]);
  const setOpen = React.useCallback((v: boolean) => {
    setIsOpen(v);
    onOpenChange?.(v);
  }, [onOpenChange]);
  return (
    <PopoverContext.Provider value={{ isOpen, setOpen }}>
      <div className="relative inline-flex">{children}</div>
    </PopoverContext.Provider>
  );
};

const PopoverTrigger = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & { asChild?: boolean }>(
  ({ children, asChild, ...props }, ref) => {
    const { isOpen, setOpen } = React.useContext(PopoverContext);
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setOpen(!isOpen);
    };
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as any, { onClick: handleClick, ref, 'aria-expanded': isOpen });
    }
    return <button onClick={handleClick} ref={ref as any} aria-expanded={isOpen} {...props}>{children}</button>;
  }
);
PopoverTrigger.displayName = 'PopoverTrigger';

const PopoverContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { sideOffset?: number; align?: string; side?: string }>(
  ({ className, children, sideOffset = 4, align = 'center', side = 'bottom', ...props }, ref) => {
    const { isOpen, setOpen } = React.useContext(PopoverContext);
    const innerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (!isOpen) return;
      const handleClickOutside = (e: MouseEvent) => {
        const wrapper = innerRef.current?.closest('.relative');
        if (wrapper && !wrapper.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
      };
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
      }, 0);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }, [isOpen, setOpen]);

    if (!isOpen) return null;

    return (
      <div
        ref={(node) => {
          (innerRef as any).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as any).current = node;
        }}
        className={cn(
          'absolute z-50 w-72 rounded-lg border border-default-200 bg-content1 p-4 shadow-lg outline-none',
          side === 'bottom' && 'top-full mt-1',
          side === 'top' && 'bottom-full mb-1',
          side === 'left' && 'right-full mr-1 top-0',
          side === 'right' && 'left-full ml-1 top-0',
          (side === 'bottom' || side === 'top') && align === 'end' && 'right-0',
          (side === 'bottom' || side === 'top') && align === 'start' && 'left-0',
          (side === 'bottom' || side === 'top') && align === 'center' && 'left-1/2 -translate-x-1/2',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
PopoverContent.displayName = 'PopoverContent';

const PopoverAnchor = ({ children, ...props }: any) => <>{children}</>;

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };

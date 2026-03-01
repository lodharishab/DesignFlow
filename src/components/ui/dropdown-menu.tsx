'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check, ChevronRight, Circle } from 'lucide-react';

interface DropdownMenuContextType {
  isOpen: boolean;
  setOpen: (v: boolean) => void;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType>({
  isOpen: false,
  setOpen: () => {},
});

const DropdownMenu = ({ children, open, onOpenChange }: { children?: React.ReactNode; open?: boolean; onOpenChange?: (v: boolean) => void }) => {
  const [isOpen, setIsOpen] = React.useState(open ?? false);
  React.useEffect(() => { if (open !== undefined) setIsOpen(open); }, [open]);
  const setOpen = React.useCallback((v: boolean) => {
    setIsOpen(v);
    onOpenChange?.(v);
  }, [onOpenChange]);
  return (
    <DropdownMenuContext.Provider value={{ isOpen, setOpen }}>
      <div className="relative inline-flex">{children}</div>
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & { asChild?: boolean }>(
  ({ children, asChild, ...props }, ref) => {
    const { isOpen, setOpen } = React.useContext(DropdownMenuContext);
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
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

const DropdownMenuContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { sideOffset?: number; align?: string; side?: string }>(
  ({ className, children, sideOffset = 4, align = 'end', side, ...props }, ref) => {
    const { isOpen, setOpen } = React.useContext(DropdownMenuContext);
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
          'absolute top-full z-50 mt-1 min-w-[8rem] overflow-hidden rounded-lg border border-default-200 bg-content1 p-1 shadow-lg',
          align === 'end' ? 'right-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0',
          className
        )}
        role="menu"
        {...props}
      >
        {children}
      </div>
    );
  }
);
DropdownMenuContent.displayName = 'DropdownMenuContent';

const DropdownMenuItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { inset?: boolean; asChild?: boolean; disabled?: boolean }>(
  ({ className, inset, asChild, children, onClick, disabled, ...props }, ref) => {
    const { setOpen } = React.useContext(DropdownMenuContext);

    if (disabled) {
      return (
        <div
          ref={ref}
          className={cn(
            'relative flex cursor-not-allowed select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm opacity-50',
            inset && 'pl-8',
            className
          )}
          {...props}
        >
          {asChild && React.isValidElement(children) ? (children as any).props.children : children}
        </div>
      );
    }

    if (asChild && React.isValidElement(children)) {
      const childProps = (children as any).props;
      return React.cloneElement(children as any, {
        ref,
        className: cn(
          'relative flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-default-100',
          inset && 'pl-8',
          className,
          childProps?.className,
        ),
        onClick: (e: any) => {
          childProps?.onClick?.(e);
          onClick?.(e as any);
          setOpen(false);
        },
      });
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-default-100 focus:bg-default-100',
          inset && 'pl-8',
          className
        )}
        role="menuitem"
        onClick={(e) => {
          onClick?.(e);
          setOpen(false);
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DropdownMenuItem.displayName = 'DropdownMenuItem';

const DropdownMenuCheckboxItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { checked?: boolean; onCheckedChange?: (v: boolean) => void }>(
  ({ className, children, checked, onCheckedChange, ...props }, ref) => {
    const { setOpen } = React.useContext(DropdownMenuContext);
    return (
      <div
        ref={ref}
        className={cn(
          'relative flex cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-default-100',
          className
        )}
        onClick={() => {
          onCheckedChange?.(!checked);
          setOpen(false);
        }}
        {...props}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          {checked && <Check className="h-4 w-4" />}
        </span>
        {children}
      </div>
    );
  }
);
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';

const DropdownMenuRadioItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-default-100',
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <Circle className="h-2 w-2 fill-current" />
      </span>
      {children}
    </div>
  )
);
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';

const DropdownMenuLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }>(
  ({ className, inset, ...props }, ref) => (
    <div ref={ref} className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)} {...props} />
  )
);
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('-mx-1 my-1 h-px bg-default-200', className)} {...props} />
  )
);
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn('ml-auto text-xs tracking-widest opacity-60', className)} {...props} />
);
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

const DropdownMenuGroup = ({ children, ...props }: any) => <div {...props}>{children}</div>;
const DropdownMenuPortal = ({ children }: any) => <>{children}</>;
const DropdownMenuSub = ({ children }: any) => <>{children}</>;

const DropdownMenuSubContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('z-50 min-w-[8rem] overflow-hidden rounded-lg border border-default-200 bg-content1 p-1 shadow-lg', className)} {...props} />
  )
);
DropdownMenuSubContent.displayName = 'DropdownMenuSubContent';

const DropdownMenuSubTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }>(
  ({ className, inset, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none hover:bg-default-100',
        inset && 'pl-8',
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto h-4 w-4" />
    </div>
  )
);
DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';

const DropdownMenuRadioGroup = ({ children, ...props }: any) => <div {...props}>{children}</div>;

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};

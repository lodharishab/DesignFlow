'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';

interface SelectContextType {
  value: string;
  onValueChange: (v: string) => void;
  isOpen: boolean;
  setOpen: (v: boolean) => void;
  displayText: string;
  setDisplayText: (v: string) => void;
}

const SelectContext = React.createContext<SelectContextType>({
  value: '',
  onValueChange: () => {},
  isOpen: false,
  setOpen: () => {},
  displayText: '',
  setDisplayText: () => {},
});

const Select = ({ children, onValueChange, value, defaultValue, ...props }: any) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || '');
  const [isOpen, setOpen] = React.useState(false);
  const [displayText, setDisplayText] = React.useState('');
  const currentValue = value !== undefined ? value : internalValue;

  const handleChange = React.useCallback((v: string) => {
    if (value === undefined) setInternalValue(v);
    onValueChange?.(v);
    setOpen(false);
  }, [value, onValueChange]);

  return (
    <SelectContext.Provider value={{ value: currentValue, onValueChange: handleChange, isOpen, setOpen, displayText, setDisplayText }}>
      <div className="relative inline-flex w-full">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectGroup = ({ children, ...props }: any) => <div {...props}>{children}</div>;

const SelectValue = ({ placeholder, ...props }: any) => {
  const { displayText } = React.useContext(SelectContext);
  return <span className={cn(!displayText && 'text-default-400')} {...props}>{displayText || placeholder}</span>;
};

const SelectTrigger = React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }>(
  ({ className, children, ...props }, ref) => {
    const { isOpen, setOpen } = React.useContext(SelectContext);
    const wrapperRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (!isOpen) return;
      const handleClickOutside = (e: MouseEvent) => {
        const wrapper = wrapperRef.current?.closest('.relative');
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

    return (
      <div ref={wrapperRef} className="w-full">
        <button
          ref={ref}
          type="button"
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-lg border border-default-200 bg-transparent px-3 py-2 text-sm placeholder:text-default-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          onClick={(e) => {
            e.preventDefault();
            setOpen(!isOpen);
          }}
          aria-expanded={isOpen}
          {...props}
        >
          {children}
          <ChevronDown className={cn('h-4 w-4 opacity-50 transition-transform', isOpen && 'rotate-180')} />
        </button>
      </div>
    );
  }
);
SelectTrigger.displayName = 'SelectTrigger';

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { isOpen } = React.useContext(SelectContext);
    if (!isOpen) return null;
    return (
      <div
        ref={ref}
        className={cn(
          'absolute top-full left-0 z-50 mt-1 w-full min-w-[8rem] overflow-hidden rounded-lg border border-default-200 bg-content1 shadow-lg py-1 max-h-60 overflow-y-auto',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SelectContent.displayName = 'SelectContent';

const SelectLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold text-default-600', className)} {...props} />
  )
);
SelectLabel.displayName = 'SelectLabel';

const SelectItemComponent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value?: string }>(
  ({ className, children, value: itemValue, ...props }, ref) => {
    const { value, onValueChange, setDisplayText } = React.useContext(SelectContext);
    const isSelected = value === itemValue;
    const textContent = typeof children === 'string' ? children : '';

    // Update display text when this item's value matches
    React.useEffect(() => {
      if (isSelected && textContent) {
        setDisplayText(textContent);
      }
    }, [isSelected, textContent, setDisplayText]);

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-default-100 focus:bg-default-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          isSelected && 'bg-default-100',
          className
        )}
        onClick={() => {
          if (itemValue !== undefined) {
            onValueChange(itemValue);
            if (textContent) setDisplayText(textContent);
          }
        }}
        {...props}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          {isSelected && <Check className="h-4 w-4" />}
        </span>
        {children}
      </div>
    );
  }
);
SelectItemComponent.displayName = 'SelectItem';

const SelectSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('-mx-1 my-1 h-px bg-default-200', className)} {...props} />
  )
);
SelectSeparator.displayName = 'SelectSeparator';

const SelectScrollUpButton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex cursor-default items-center justify-center py-1', className)} {...props}>
      <ChevronUp className="h-4 w-4" />
    </div>
  )
);
SelectScrollUpButton.displayName = 'SelectScrollUpButton';

const SelectScrollDownButton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex cursor-default items-center justify-center py-1', className)} {...props}>
      <ChevronDown className="h-4 w-4" />
    </div>
  )
);
SelectScrollDownButton.displayName = 'SelectScrollDownButton';

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItemComponent as SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};

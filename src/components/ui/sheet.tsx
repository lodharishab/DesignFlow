'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SheetContextType {
  isOpen: boolean;
  setOpen: (v: boolean) => void;
}

const SheetContext = React.createContext<SheetContextType>({ isOpen: false, setOpen: () => {} });

const Sheet = ({ children, open, onOpenChange }: { children: React.ReactNode; open?: boolean; onOpenChange?: (v: boolean) => void }) => {
  const [isOpen, setIsOpen] = React.useState(open || false);
  React.useEffect(() => { if (open !== undefined) setIsOpen(open); }, [open]);
  const setOpen = (v: boolean) => { setIsOpen(v); onOpenChange?.(v); };
  return <SheetContext.Provider value={{ isOpen, setOpen }}>{children}</SheetContext.Provider>;
};

const SheetTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
  const { setOpen } = React.useContext(SheetContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, { onClick: () => setOpen(true) });
  }
  return <button onClick={() => setOpen(true)}>{children}</button>;
};

const SheetClose = ({ children, ...props }: React.HTMLAttributes<HTMLButtonElement>) => {
  const { setOpen } = React.useContext(SheetContext);
  return <button onClick={() => setOpen(false)} {...(props as any)}>{children}</button>;
};

const SheetContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { side?: 'top' | 'right' | 'bottom' | 'left' }>(
  ({ className, children, side = 'right', ...props }, ref) => {
    const { isOpen, setOpen } = React.useContext(SheetContext);

    const slideVariants = {
      right: { hidden: { x: '100%' }, visible: { x: 0 }, exit: { x: '100%' } },
      left: { hidden: { x: '-100%' }, visible: { x: 0 }, exit: { x: '-100%' } },
      top: { hidden: { y: '-100%' }, visible: { y: 0 }, exit: { y: '-100%' } },
      bottom: { hidden: { y: '100%' }, visible: { y: 0 }, exit: { y: '100%' } },
    };

    const positionClasses = {
      right: 'inset-y-0 right-0 h-full w-3/4 max-w-sm border-l',
      left: 'inset-y-0 left-0 h-full w-3/4 max-w-sm border-r',
      top: 'inset-x-0 top-0 w-full border-b',
      bottom: 'inset-x-0 bottom-0 w-full border-t',
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              ref={ref}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={slideVariants[side]}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={cn(
                'fixed z-50 bg-content1 shadow-2xl',
                positionClasses[side],
                'border-default-200',
                className
              )}
              {...(props as any)}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }
);
SheetContent.displayName = 'SheetContent';

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
);

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);

const SheetTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn('text-lg font-semibold text-foreground', className)} {...props} />
  )
);
SheetTitle.displayName = 'SheetTitle';

const SheetDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-default-500', className)} {...props} />
  )
);
SheetDescription.displayName = 'SheetDescription';

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription };

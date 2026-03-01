'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const AlertDialogContext = React.createContext<{
  isOpen: boolean;
  setOpen: (v: boolean) => void;
}>({ isOpen: false, setOpen: () => {} });

const AlertDialog = ({ children, open, onOpenChange }: { children: React.ReactNode; open?: boolean; onOpenChange?: (v: boolean) => void }) => {
  const [isOpen, setIsOpen] = React.useState(open || false);
  React.useEffect(() => { if (open !== undefined) setIsOpen(open); }, [open]);
  const setOpen = React.useCallback((v: boolean) => { setIsOpen(v); onOpenChange?.(v); }, [onOpenChange]);
  return <AlertDialogContext.Provider value={{ isOpen, setOpen }}>{children}</AlertDialogContext.Provider>;
};

const AlertDialogTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
  const { setOpen } = React.useContext(AlertDialogContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, { onClick: (e: any) => { (children as any).props?.onClick?.(e); setOpen(true); } });
  }
  return <button onClick={() => setOpen(true)}>{children}</button>;
};

const AlertDialogContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const { isOpen } = React.useContext(AlertDialogContext);
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'relative w-full max-w-lg rounded-xl border border-default-200 bg-content1 p-6 shadow-2xl',
                className
              )}
              onClick={(e) => e.stopPropagation()}
              {...(props as any)}
            >
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left mb-4', className)} {...props} />
);

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4', className)} {...props} />
);

const AlertDialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => <h2 ref={ref} className={cn('text-lg font-semibold', className)} {...props} />
);
AlertDialogTitle.displayName = 'AlertDialogTitle';

const AlertDialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn('text-sm text-default-500', className)} {...props} />
);
AlertDialogDescription.displayName = 'AlertDialogDescription';

const AlertDialogAction = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, onClick, ...props }, ref) => {
    const { setOpen } = React.useContext(AlertDialogContext);
    return (
      <button
        ref={ref}
        className={cn('inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition-all', className)}
        onClick={(e) => { onClick?.(e); setOpen(false); }}
        {...props}
      >
        {children}
      </button>
    );
  }
);
AlertDialogAction.displayName = 'AlertDialogAction';

const AlertDialogCancel = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, onClick, ...props }, ref) => {
    const { setOpen } = React.useContext(AlertDialogContext);
    return (
      <button
        ref={ref}
        className={cn('inline-flex items-center justify-center rounded-lg border border-default-300 bg-transparent px-4 py-2 text-sm font-medium hover:bg-default-100 transition-all', className)}
        onClick={(e) => { onClick?.(e); setOpen(false); }}
        {...props}
      >
        {children}
      </button>
    );
  }
);
AlertDialogCancel.displayName = 'AlertDialogCancel';

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};

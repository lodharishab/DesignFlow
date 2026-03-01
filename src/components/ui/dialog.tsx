'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DialogContextType {
  isOpen: boolean;
  setOpen: (v: boolean) => void;
}

const DialogContext = React.createContext<DialogContextType>({
  isOpen: false,
  setOpen: () => {},
});

const Dialog = ({ children, open, onOpenChange }: { children: React.ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void }) => {
  const [isOpen, setIsOpen] = React.useState(open ?? false);
  React.useEffect(() => { if (open !== undefined) setIsOpen(open); }, [open]);
  const setOpen = React.useCallback((v: boolean) => {
    setIsOpen(v);
    onOpenChange?.(v);
  }, [onOpenChange]);
  return (
    <DialogContext.Provider value={{ isOpen, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

const DialogTrigger = ({ children, asChild, ...props }: { children: React.ReactNode; asChild?: boolean } & React.HTMLAttributes<HTMLButtonElement>) => {
  const { setOpen } = React.useContext(DialogContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, { onClick: (e: any) => { (children as any).props?.onClick?.(e); setOpen(true); } });
  }
  return <button onClick={() => setOpen(true)} {...props}>{children}</button>;
};

const DialogPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const DialogOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('fixed inset-0 z-50 bg-black/60 backdrop-blur-sm', className)} {...props} />
);
DialogOverlay.displayName = 'DialogOverlay';

const DialogClose = ({ children, ...props }: React.HTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) => {
  const { setOpen } = React.useContext(DialogContext);
  const asChild = (props as any).asChild;
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, { onClick: (e: any) => { (children as any).props?.onClick?.(e); setOpen(false); } });
  }
  return <button onClick={() => setOpen(false)} {...props}>{children}</button>;
};

const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }>(
  ({ className, children, ...props }, ref) => {
    const { isOpen, setOpen } = React.useContext(DialogContext);
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                ref={ref}
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
                <button
                  onClick={() => setOpen(false)}
                  className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </button>
                {children}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    );
  }
);
DialogContent.displayName = 'DialogContent';

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left mb-4', className)} {...props} />
);

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4', className)} {...props} />
);

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
  )
);
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-default-500', className)} {...props} />
  )
);
DialogDescription.displayName = 'DialogDescription';

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};

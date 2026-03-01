'use client';

import * as React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { cn } from '@/lib/utils';

const AlertDialogContext = React.createContext<{
  isOpen: boolean;
  setOpen: (v: boolean) => void;
}>({ isOpen: false, setOpen: () => {} });

const AlertDialog = ({ children, open, onOpenChange }: { children: React.ReactNode; open?: boolean; onOpenChange?: (v: boolean) => void }) => {
  const [isOpen, setIsOpen] = React.useState(open || false);
  React.useEffect(() => { if (open !== undefined) setIsOpen(open); }, [open]);
  const setOpen = (v: boolean) => { setIsOpen(v); onOpenChange?.(v); };
  return <AlertDialogContext.Provider value={{ isOpen, setOpen }}>{children}</AlertDialogContext.Provider>;
};

const AlertDialogTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
  const { setOpen } = React.useContext(AlertDialogContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, { onClick: () => setOpen(true) });
  }
  return <button onClick={() => setOpen(true)}>{children}</button>;
};

const AlertDialogContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const { isOpen, setOpen } = React.useContext(AlertDialogContext);
  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen} backdrop="blur" radius="lg" hideCloseButton>
      <ModalContent className={cn('bg-content1 border border-default-200', className)}>
        {children}
      </ModalContent>
    </Modal>
  );
};

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <ModalHeader className={cn('flex flex-col gap-1', className)} {...(props as any)} />
);

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <ModalFooter className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...(props as any)} />
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
  ({ className, ...props }, ref) => {
    const { setOpen } = React.useContext(AlertDialogContext);
    return <Button ref={ref} color="primary" className={cn(className)} onPress={() => setOpen(false)} {...(props as any)} />;
  }
);
AlertDialogAction.displayName = 'AlertDialogAction';

const AlertDialogCancel = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { setOpen } = React.useContext(AlertDialogContext);
    return <Button ref={ref} variant="bordered" className={cn(className)} onPress={() => setOpen(false)} {...(props as any)} />;
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

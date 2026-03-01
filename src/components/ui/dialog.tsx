'use client';

import * as React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const DialogContext = React.createContext<{
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
}>({
  isOpen: false,
  onOpen: () => {},
  onClose: () => {},
  onOpenChange: () => {},
});

const Dialog = ({ children, open, onOpenChange, ...props }: { children: React.ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void }) => {
  const disclosure = useDisclosure({ isOpen: open, onOpenChange });
  return (
    <DialogContext.Provider value={{ ...disclosure, onOpenChange: onOpenChange || disclosure.onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

const DialogTrigger = ({ children, asChild, ...props }: { children: React.ReactNode; asChild?: boolean }) => {
  const { onOpen } = React.useContext(DialogContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, { onClick: onOpen });
  }
  return <button onClick={onOpen} {...props}>{children}</button>;
};

const DialogPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const DialogOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('fixed inset-0 z-50 bg-black/60 backdrop-blur-sm', className)} {...props} />
);
DialogOverlay.displayName = 'DialogOverlay';

const DialogClose = ({ children, ...props }: React.HTMLAttributes<HTMLButtonElement>) => {
  const { onClose } = React.useContext(DialogContext);
  return <button onClick={onClose} {...props}>{children}</button>;
};

const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }>(
  ({ className, children, ...props }, ref) => {
    const { isOpen, onOpenChange } = React.useContext(DialogContext);
    return (
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        radius="lg"
        shadow="lg"
        size="lg"
        classNames={{
          base: cn('bg-content1 border border-default-200', className),
          closeButton: 'hover:bg-default-100 active:bg-default-200',
        }}
      >
        <ModalContent>
          {(onClose) => <>{children}</>}
        </ModalContent>
      </Modal>
    );
  }
);
DialogContent.displayName = 'DialogContent';

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <ModalHeader className={cn('flex flex-col gap-1', className)} {...(props as any)} />
);

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <ModalFooter className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...(props as any)} />
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

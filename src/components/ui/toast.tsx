// Toast compatibility layer - now using sonner
// These exports exist for backward compatibility with files that import from here
import * as React from 'react';

// Minimal stubs — the actual toast is now handled by sonner's <Toaster /> in layout.tsx
const ToastProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const ToastViewport = () => null;
const Toast = React.forwardRef<HTMLDivElement, any>(({ ...props }, ref) => <div ref={ref} {...props} />);
Toast.displayName = 'Toast';
const ToastTitle = React.forwardRef<HTMLDivElement, any>(({ ...props }, ref) => <div ref={ref} {...props} />);
ToastTitle.displayName = 'ToastTitle';
const ToastDescription = React.forwardRef<HTMLDivElement, any>(({ ...props }, ref) => <div ref={ref} {...props} />);
ToastDescription.displayName = 'ToastDescription';
const ToastClose = React.forwardRef<HTMLButtonElement, any>(({ ...props }, ref) => <button ref={ref} {...props} />);
ToastClose.displayName = 'ToastClose';
const ToastAction = React.forwardRef<HTMLButtonElement, any>(({ ...props }, ref) => <button ref={ref} {...props} />);
ToastAction.displayName = 'ToastAction';

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  type ToastProps,
  type ToastActionElement,
};

'use client';

import * as React from 'react';
import { Textarea as HeroTextarea } from '@heroui/react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  errorMessage?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, description, errorMessage, ...props }, ref) => {
    return (
      <HeroTextarea
        ref={ref}
        label={label}
        description={description}
        errorMessage={errorMessage}
        variant="bordered"
        radius="lg"
        minRows={3}
        classNames={{
          inputWrapper: cn('border-default-200 data-[hover=true]:border-primary data-[focus=true]:border-primary', className),
          input: 'text-sm',
        }}
        {...(props as any)}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };

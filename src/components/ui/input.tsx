'use client';

import * as React from 'react';
import { Input as HeroInput } from '@heroui/react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  errorMessage?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, description, errorMessage, startContent, endContent, ...props }, ref) => {
    return (
      <HeroInput
        ref={ref}
        type={type}
        label={label}
        description={description}
        errorMessage={errorMessage}
        startContent={startContent}
        endContent={endContent}
        variant="bordered"
        radius="lg"
        size="md"
        classNames={{
          inputWrapper: cn('border-default-200 data-[hover=true]:border-primary data-[focus=true]:border-primary', className),
          input: 'text-sm',
        }}
        {...(props as any)}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };

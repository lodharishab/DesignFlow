'use client';

import * as React from 'react';
import { RadioGroup as HeroRadioGroup, Radio } from '@heroui/react';
import { cn } from '@/lib/utils';

const RadioGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value?: string; onValueChange?: (v: string) => void; defaultValue?: string }>(
  ({ className, value, onValueChange, defaultValue, ...props }, ref) => (
    <HeroRadioGroup
      ref={ref as any}
      value={value}
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      className={cn('grid gap-2', className)}
      {...(props as any)}
    />
  )
);
RadioGroup.displayName = 'RadioGroup';

const RadioGroupItem = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { value: string }>(
  ({ className, value, children, ...props }, ref) => (
    <Radio
      ref={ref as any}
      value={value}
      size="sm"
      color="primary"
      className={cn(className)}
      {...(props as any)}
    >
      {children}
    </Radio>
  )
);
RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };

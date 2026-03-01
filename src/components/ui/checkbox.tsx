'use client';

import * as React from 'react';
import { Checkbox as HeroCheckbox } from '@heroui/react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, disabled, id, ...props }, ref) => {
    return (
      <HeroCheckbox
        ref={ref as any}
        isSelected={checked}
        onValueChange={onCheckedChange}
        isDisabled={disabled}
        id={id}
        size="sm"
        radius="sm"
        color="primary"
        className={cn(className)}
        {...(props as any)}
      />
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };

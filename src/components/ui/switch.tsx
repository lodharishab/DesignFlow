'use client';

import * as React from 'react';
import { Switch as HeroSwitch } from '@heroui/react';
import { cn } from '@/lib/utils';

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => (
    <HeroSwitch
      ref={ref as any}
      isSelected={checked}
      onValueChange={onCheckedChange}
      isDisabled={disabled}
      size="sm"
      color="primary"
      className={cn(className)}
      {...(props as any)}
    />
  )
);
Switch.displayName = 'Switch';

export { Switch };

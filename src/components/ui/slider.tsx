'use client';

import * as React from 'react';
import { Slider as HeroSlider } from '@heroui/react';
import { cn } from '@/lib/utils';

interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number[];
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, value, onValueChange, min = 0, max = 100, step = 1, defaultValue, ...props }, ref) => (
    <HeroSlider
      ref={ref as any}
      value={value?.[0]}
      onChange={(v) => onValueChange?.([v as number])}
      minValue={min}
      maxValue={max}
      step={step}
      defaultValue={defaultValue?.[0]}
      size="sm"
      color="primary"
      className={cn('max-w-full', className)}
      {...(props as any)}
    />
  )
);
Slider.displayName = 'Slider';

export { Slider };

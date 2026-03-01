'use client';

import * as React from 'react';
import { Avatar as HeroAvatar } from '@heroui/react';
import { cn } from '@/lib/utils';

const Avatar = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement> & { src?: string; alt?: string; name?: string; fallback?: string }>(
  ({ className, src, alt, name, fallback, children, ...props }, ref) => {
    // If used in compound pattern (with AvatarImage/AvatarFallback children), render container
    if (children) {
      return (
        <span
          ref={ref}
          className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
          {...props}
        >
          {children}
        </span>
      );
    }

    return (
      <HeroAvatar
        ref={ref as any}
        src={src}
        alt={alt}
        name={name || fallback}
        showFallback
        size="md"
        isBordered={false}
        className={cn(className)}
        {...(props as any)}
      />
    );
  }
);
Avatar.displayName = 'Avatar';

const AvatarImage = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
  ({ className, src, alt, ...props }, ref) => (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={cn('aspect-square h-full w-full object-cover', className)}
      {...props}
    />
  )
);
AvatarImage.displayName = 'AvatarImage';

const AvatarFallback = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-default-100 text-default-600 text-sm font-medium',
        className
      )}
      {...props}
    />
  )
);
AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback };

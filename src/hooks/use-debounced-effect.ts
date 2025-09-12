
'use client';

import { useEffect, useRef } from 'react';

type EffectCallback = () => void | (() => void);
type DependencyList = readonly any[];

interface DebounceOptions {
  delay: number;
}

/**
 * A custom React hook that mimics `useEffect` but debounces the execution of the effect.
 *
 * @param effect The effect callback to execute after the debounce delay.
 * @param deps An array of dependencies that trigger the effect.
 * @param options Options object, containing the `delay` in milliseconds.
 */
export function useDebouncedEffect(
  effect: EffectCallback,
  deps: DependencyList,
  options: DebounceOptions
) {
  const handler = useRef<NodeJS.Timeout>();
  const cleanupFn = useRef<void | (() => void)>();

  useEffect(() => {
    // Clear the previous timeout and run the cleanup function if it exists
    if (handler.current) {
      clearTimeout(handler.current);
      if (typeof cleanupFn.current === 'function') {
        cleanupFn.current();
      }
    }

    // Set a new timeout
    handler.current = setTimeout(() => {
      cleanupFn.current = effect();
    }, options.delay);

    // Cleanup on unmount or when dependencies change significantly
    return () => {
      if (handler.current) {
        clearTimeout(handler.current);
      }
      if (typeof cleanupFn.current === 'function') {
        cleanupFn.current();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, options.delay]);
}


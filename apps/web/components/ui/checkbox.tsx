import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}

/**
 * Checkbox component with custom styling.
 * Compatible with react-hook-form via forwardRef.
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        className={cn(
          'h-4 w-4 rounded border-gray-300 text-[#1392ec] focus:ring-[#1392ec] focus:ring-offset-0 cursor-pointer',
          'dark:border-gray-600 dark:bg-[#1a2630] dark:checked:bg-[#1392ec]',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };

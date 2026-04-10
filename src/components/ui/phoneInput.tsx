'use client';

import * as React from 'react';
import { Input } from '~/components/ui/input';
import { formatPhoneNumber } from '~/lib/utils';

const PhoneInput = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  function PhoneInput({ value, onChange, placeholder, ...props }, ref) {
    const rawValue = typeof value === 'string' ? value : String(value ?? '');
    const displayValue = rawValue ? formatPhoneNumber(rawValue) : '';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const stripped = e.target.value.replace(/[^\d+]/g, '');
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: stripped },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
    };

    return (
      <Input
        ref={ref}
        type="tel"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder ?? '096 393 9343'}
        {...props}
      />
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export { PhoneInput };

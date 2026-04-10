import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhoneNumber(value: string): string {
  if (!value) return '';
  const hasPlus = value.startsWith('+');
  const digits = value.replace(/\D/g, '');
  if (!digits) return hasPlus ? '+' : '';

  let formatted: string;
  if (digits.length <= 3) {
    formatted = digits;
  } else if (digits.length <= 6) {
    formatted = `${digits.slice(0, 3)} ${digits.slice(3)}`;
  } else {
    formatted = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }

  return hasPlus ? `+${formatted}` : formatted;
}

export function stripPhoneNumber(value: string): string {
  return value.replace(/[^\d+]/g, '');
}

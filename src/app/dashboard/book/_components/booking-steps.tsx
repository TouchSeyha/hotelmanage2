'use client';

import { Check, BedDouble, User, CreditCard } from 'lucide-react';
import { cn } from '~/lib/utils';
import { useBooking } from './booking-context';

const steps = [
  { number: 1, label: 'Room & Dates', icon: BedDouble },
  { number: 2, label: 'Guest Details', icon: User },
  { number: 3, label: 'Payment', icon: CreditCard },
] as const;

export function BookingSteps() {
  const { state, goToStep } = useBooking();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = state.step > step.number;
          const isCurrent = state.step === step.number;
          const isClickable = step.number < state.step;

          return (
            <div key={step.number} className="flex flex-1 items-center">
              {/* Step Circle */}
              <button
                type="button"
                onClick={() => isClickable && goToStep(step.number)}
                disabled={!isClickable}
                className={cn(
                  'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300',
                  isCompleted && 'border-primary bg-primary text-primary-foreground',
                  isCurrent &&
                    'border-primary bg-background text-primary shadow-primary/10 scale-105 shadow-lg',
                  !isCompleted && !isCurrent && 'border-muted bg-background text-muted-foreground',
                  isClickable && 'hover:bg-primary/10 cursor-pointer'
                )}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
              </button>

              {/* Step Label */}
              <div className="ml-3 hidden sm:block">
                <p
                  className={cn(
                    'text-sm font-medium',
                    isCurrent ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="mx-4 flex-1">
                  <div
                    className={cn(
                      'h-0.5 w-full rounded-full transition-all duration-300',
                      isCompleted ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

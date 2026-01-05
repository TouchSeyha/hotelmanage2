'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

import { BookingProvider, useBooking } from './_components/booking-context';
import { BookingSteps } from './_components/booking-steps';
import { Step1Room } from './_components/step-1-room';
import { Step2Guest } from './_components/step-2-guest';
import { Step3Payment } from './_components/step-3-payment';
import { api } from '~/trpc/react';
import { Breadcrumb } from '~/components/shared/breadcrumb';

function BookingContent() {
  const { state } = useBooking();

  // Get user session for pre-filling guest info
  const { data: profile } = api.user.getProfile.useQuery();

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Book a Room' }]} />

      {/* Progress Steps */}
      <div className="mb-8">
        <BookingSteps />
      </div>

      {/* Step Content */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          </div>
        }
      >
        {state.step === 1 && <Step1Room />}
        {state.step === 2 && <Step2Guest userEmail={profile?.email} userName={profile?.name} />}
        {state.step === 3 && <Step3Payment />}
      </Suspense>
    </div>
  );
}

export default function BookingPage() {
  return (
    <BookingProvider>
      <BookingContent />
    </BookingProvider>
  );
}

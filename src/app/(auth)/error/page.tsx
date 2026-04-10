import { Suspense } from 'react';
import { Hotel } from 'lucide-react';

import { Card, CardHeader, CardTitle } from '~/components/ui/card';

import { AuthErrorContent } from './errorContent';

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <Hotel className="text-muted-foreground h-6 w-6" />
            </div>
            <CardTitle className="text-2xl">Loading...</CardTitle>
          </CardHeader>
        </Card>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}

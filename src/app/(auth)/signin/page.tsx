import { Suspense } from 'react';
import { Hotel } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

import { SignInContent } from './signInContent';

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <Hotel className="text-primary h-6 w-6" />
            </div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted h-10 w-full animate-pulse rounded-md" />
            <div className="bg-muted h-10 w-full animate-pulse rounded-md" />
          </CardContent>
        </Card>
      }
    >
      <SignInContent />
    </Suspense>
  );
}

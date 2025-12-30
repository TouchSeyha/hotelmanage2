'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { AlertCircle, ArrowLeft, Hotel } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: 'Server Configuration Error',
    description:
      'There is a problem with the server configuration. Please contact support if this persists.',
  },
  AccessDenied: {
    title: 'Access Denied',
    description:
      'You do not have permission to sign in. Please contact the administrator if you believe this is an error.',
  },
  Verification: {
    title: 'Verification Error',
    description:
      'The verification link may have expired or already been used. Please try signing in again.',
  },
  OAuthSignin: {
    title: 'OAuth Sign In Error',
    description: 'There was a problem signing in with the OAuth provider. Please try again.',
  },
  OAuthCallback: {
    title: 'OAuth Callback Error',
    description: 'There was a problem with the OAuth callback. Please try signing in again.',
  },
  OAuthCreateAccount: {
    title: 'Account Creation Error',
    description:
      'Could not create an account with the OAuth provider. Please try again or use a different provider.',
  },
  EmailCreateAccount: {
    title: 'Email Account Error',
    description: 'Could not create an account with that email. Please try again.',
  },
  Callback: {
    title: 'Callback Error',
    description: 'There was a problem with the authentication callback. Please try again.',
  },
  OAuthAccountNotLinked: {
    title: 'Account Not Linked',
    description:
      'This email is already associated with another account. Please sign in with the original provider you used.',
  },
  SessionRequired: {
    title: 'Session Required',
    description: 'Please sign in to access this page.',
  },
  Default: {
    title: 'Authentication Error',
    description: 'An unexpected error occurred during authentication. Please try again.',
  },
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') ?? 'Default';

  const { title, description } = errorMessages[error] ?? errorMessages.Default!;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <div className="bg-destructive/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
          <AlertCircle className="text-destructive h-6 w-6" />
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full" asChild>
          <Link href="/signin">Try Again</Link>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <p className="text-muted-foreground text-center text-sm">
          If this problem persists, please{' '}
          <Link href="/contact" className="hover:text-primary underline">
            contact support
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  );
}

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
      <ErrorContent />
    </Suspense>
  );
}

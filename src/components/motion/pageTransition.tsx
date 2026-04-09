'use client';

import { usePathname, useSearchParams } from 'next/navigation';

import { cn } from '~/lib/utils';

type PageTransitionProps = {
  children: React.ReactNode;
  variant: 'public' | 'app' | 'auth';
  includeSearch?: boolean;
  className?: string;
};

const variantClassMap = {
  public: 'motion-page-public',
  app: 'motion-page-app',
  auth: 'motion-page-auth',
} as const;

export function PageTransition({
  children,
  variant,
  includeSearch = false,
  className,
}: PageTransitionProps) {
  return includeSearch ? (
    <SearchAwarePageTransition variant={variant} className={className}>
      {children}
    </SearchAwarePageTransition>
  ) : (
    <PathnamePageTransition variant={variant} className={className}>
      {children}
    </PathnamePageTransition>
  );
}

function PathnamePageTransition({
  children,
  variant,
  className,
}: Omit<PageTransitionProps, 'includeSearch'>) {
  const pathname = usePathname();

  return (
    <div key={pathname} className={cn('motion-page', variantClassMap[variant], className)}>
      {children}
    </div>
  );
}

function SearchAwarePageTransition({
  children,
  variant,
  className,
}: Omit<PageTransitionProps, 'includeSearch'>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;

  return (
    <div key={routeKey} className={cn('motion-page', variantClassMap[variant], className)}>
      {children}
    </div>
  );
}

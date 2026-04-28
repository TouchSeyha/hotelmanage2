'use client';

import { useEffect } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';

import { cn } from '~/lib/utils';

type AnimatedListProps = React.ComponentProps<'div'> & {
  children: React.ReactNode;
};

export function AnimatedList({ children, className, ...props }: AnimatedListProps) {
  const [parentRef, enable] = useAutoAnimate<HTMLDivElement>({
    duration: 220,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    disrespectUserMotionPreference: false,
  });

  useEffect(() => {
    enable(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, [enable]);

  return (
    <div ref={parentRef} className={cn(className)} {...props}>
      {children}
    </div>
  );
}

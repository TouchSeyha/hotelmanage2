import { cn } from '~/lib/utils';

type RevealProps = {
  children: React.ReactNode;
  delay?: 0 | 1 | 2 | 3 | 4;
  variant?: 'soft' | 'hero' | 'panel';
  className?: string;
};

const variantClassMap = {
  soft: 'motion-reveal-soft',
  hero: 'motion-reveal-hero',
  panel: 'motion-reveal-panel',
} as const;

export function Reveal({ children, delay = 0, variant = 'soft', className }: RevealProps) {
  return (
    <div
      className={cn('motion-reveal', variantClassMap[variant], `motion-delay-${delay}`, className)}
    >
      {children}
    </div>
  );
}

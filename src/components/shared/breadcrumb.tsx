import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

import { cn } from '~/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('mb-4 flex items-center text-sm', className)}>
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index === 0 && (
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="h-4 w-4" />
              </Link>
            )}
            {index > 0 && (
              <>
                <ChevronRight className="text-muted-foreground mx-2 h-4 w-4" />
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium">{item.label}</span>
                )}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

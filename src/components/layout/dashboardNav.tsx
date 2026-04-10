'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Star, Calendar } from 'lucide-react';
import { cn } from '~/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/bookings', label: 'My Bookings', icon: Calendar },
  { href: '/dashboard/reviews', label: 'My Reviews', icon: Star },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

export function DashboardNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <nav className="hidden md:flex md:gap-4">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          data-active={isActive(item.href)}
          className={cn(
            'motion-nav-link flex items-center gap-2 text-sm font-medium',
            isActive(item.href) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

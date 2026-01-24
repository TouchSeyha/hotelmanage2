'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  BedDouble,
  Users,
  CreditCard,
  ClipboardList,
  Sparkles,
  Star,
} from 'lucide-react';

import { cn } from '~/lib/utils';

const sidebarItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/frontdesk', label: 'Front Desk', icon: ClipboardList },
  { href: '/admin/pos', label: 'POS', icon: CreditCard },
  { href: '/admin/room-types', label: 'Room Types', icon: BedDouble },
  { href: '/admin/rooms', label: 'Rooms', icon: BedDouble },
  { href: '/admin/amenities', label: 'Amenities', icon: Sparkles },
  { href: '/admin/users', label: 'Users', icon: Users },
];

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 p-4">
      {sidebarItems.map((item) => {
        // Handle active state logic
        // For the root admin path, we want exact match to avoid highlighting it for sub-routes
        // For other paths, we want to highlight if the current path starts with the item href
        const isActive =
          item.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200',
              isActive
                ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <item.icon className={cn('h-4 w-4', isActive ? 'text-primary-foreground' : '')} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

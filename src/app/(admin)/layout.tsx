import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Hotel,
  LayoutDashboard,
  Calendar,
  BedDouble,
  Users,
  CreditCard,
  ClipboardList,
  Settings,
  LogOut,
} from 'lucide-react';

import { auth, signOut } from '~/server/auth';
import { Button } from '~/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

const sidebarItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/frontdesk', label: 'Front Desk', icon: ClipboardList },
  { href: '/admin/pos', label: 'POS', icon: CreditCard },
  { href: '/admin/room-types', label: 'Room Types', icon: BedDouble },
  { href: '/admin/rooms', label: 'Rooms', icon: BedDouble },
  { href: '/admin/users', label: 'Users', icon: Users },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/signin');
  }

  if (session.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="bg-muted/30 hidden w-64 shrink-0 border-r lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b px-6 font-bold">
            <Hotel className="h-6 w-6" />
            <span>Hotel Admin</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Profile */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user.image ?? undefined} />
                <AvatarFallback>{session.user.name?.charAt(0).toUpperCase() ?? 'A'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">{session.user.name}</p>
                <p className="text-muted-foreground truncate text-xs">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Header */}
        <header className="bg-background sticky top-0 z-50 flex h-16 items-center justify-between border-b px-6">
          {/* Mobile menu button would go here */}
          <div className="flex items-center gap-4 lg:hidden">
            <Link href="/admin" className="flex items-center gap-2 font-bold">
              <Hotel className="h-6 w-6" />
              <span>Admin</span>
            </Link>
          </div>

          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">View Site</Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image ?? undefined} />
                    <AvatarFallback>
                      {session.user.name?.charAt(0).toUpperCase() ?? 'A'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{session.user.name}</p>
                    <p className="text-muted-foreground text-xs">{session.user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <form
                    action={async () => {
                      'use server';
                      await signOut({ redirectTo: '/' });
                    }}
                  >
                    <button className="text-destructive flex w-full items-center gap-2">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

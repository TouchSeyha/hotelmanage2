import Link from 'next/link';
import { Hotel } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Simple Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Hotel className="text-primary h-6 w-6" />
            <span className="font-(family-name:--font-playfair) text-xl font-semibold tracking-wide">
              <span className="text-primary">Luxe</span>
              <span className="italic">Stay</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center p-4">{children}</main>

      {/* Simple Footer */}
      <footer className="border-t py-4">
        <div className="text-muted-foreground container text-center text-sm">
          &copy; {new Date().getFullYear()} LuxeStay. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

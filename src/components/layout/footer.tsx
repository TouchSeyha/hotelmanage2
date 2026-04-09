import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const quickLinks = [
  { href: '/rooms', label: 'Our Rooms' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

const legalLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
];

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Description */}
          <div className="space-y-4">
            <Link
              href="/"
              className="font-[family-name:var(--font-playfair)] text-xl font-semibold tracking-wide"
            >
              <span className="text-primary">Luxe</span>
              <span className="italic">Stay</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Experience luxury and comfort at our beautiful hotel. Perfect for business and leisure
              travelers alike.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="motion-link-fade text-muted-foreground hover:text-primary"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="motion-link-fade text-muted-foreground hover:text-primary"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="motion-link-fade text-muted-foreground hover:text-primary"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="motion-link-fade text-muted-foreground hover:text-primary text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 font-semibold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="text-muted-foreground flex items-start gap-2 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>325 Sisowath Quay, Phnom Penh, Cambodia</span>
              </li>
              <li className="text-muted-foreground flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 shrink-0" />
                <a href="tel:+855234567890" className="motion-link-fade hover:text-primary">
                  +855 (234) 567-890
                </a>
              </li>
              <li className="text-muted-foreground flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 shrink-0" />
                <a href="mailto:info@hotel.com" className="motion-link-fade hover:text-primary">
                  info@hotel.com
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 font-semibold">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="motion-link-fade text-muted-foreground hover:text-primary text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} LuxeStay. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

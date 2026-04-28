import type { Metadata } from 'next';
import { AlertTriangle } from 'lucide-react';
import { Reveal } from '~/components/motion/reveal';

export const metadata: Metadata = {
  title: 'Terms of Service | LuxeStay',
  description: 'Terms and conditions for using the LuxeStay hotel booking platform',
};

export default function TermsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-base-200 from-primary/50 via-secondary/50 to-accent/50 relative overflow-hidden border-b bg-linear-to-br py-16">
        <div className="hero-orbit" />
        <Reveal variant="hero" className="relative container text-center">
          <h1 className="text-4xl font-semibold sm:text-5xl">Terms of Service</h1>
          <p className="text-base-content/70 mt-4">
            The rules and guidelines for using our platform.
          </p>
        </Reveal>
      </section>

      {/* Demo Disclaimer */}
      <Reveal delay={1} className="container py-12">
        <div className="border-yellow-500/30 bg-yellow-500/10 flex items-start gap-4 rounded-2xl border p-6">
          <AlertTriangle className="text-yellow-600 mt-0.5 h-6 w-6 shrink-0" />
          <div>
            <h2 className="text-lg font-semibold text-yellow-800">Demo Project Notice</h2>
            <p className="mt-2 text-yellow-800/80">
              LuxeStay is a student portfolio project created for educational purposes only. This
              website is not a real hotel booking platform, and no actual reservations, payments, or
              services can be fulfilled. All content, pricing, and availability shown here are
              simulated for demonstration purposes. Please do not enter real payment information or
              expect any real-world transactions to occur.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Content */}
      <Reveal delay={2} className="container pb-16">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground mt-4">
            By accessing or using the LuxeStay website, you agree to be bound by these Terms of
            Service. If you do not agree to these terms, please do not use our platform.
          </p>

          <h2 className="mt-8 text-2xl font-semibold">2. Use of the Platform</h2>
          <p className="text-muted-foreground mt-4">
            You agree to use LuxeStay only for lawful purposes and in a way that does not infringe
            the rights of others or restrict their use and enjoyment of the site. You must not use
            the platform to transmit any harmful, offensive, or illegal content.
          </p>

          <h2 className="mt-8 text-2xl font-semibold">3. Booking and Payments</h2>
          <p className="text-muted-foreground mt-4">
            All bookings made through this platform are simulated and for demonstration purposes
            only. No real payments are processed, and no actual reservations are confirmed. Any
            payment details entered are not stored or used for real transactions.
          </p>

          <h2 className="mt-8 text-2xl font-semibold">4. Intellectual Property</h2>
          <p className="text-muted-foreground mt-4">
            All content on this website, including text, images, logos, and designs, is the property
            of LuxeStay or its creators and is protected by copyright and other intellectual
            property laws. You may not reproduce, distribute, or create derivative works without
            prior written consent.
          </p>

          <h2 className="mt-8 text-2xl font-semibold">5. Limitation of Liability</h2>
          <p className="text-muted-foreground mt-4">
            LuxeStay is provided on an &ldquo;as is&rdquo; basis for educational demonstration. We
            make no warranties about the accuracy, reliability, or availability of the platform and
            disclaim all liability for any damages arising from your use of the site.
          </p>

          <h2 className="mt-8 text-2xl font-semibold">6. Changes to These Terms</h2>
          <p className="text-muted-foreground mt-4">
            We reserve the right to update or modify these Terms of Service at any time without
            prior notice. Your continued use of the platform after changes constitutes acceptance of
            the revised terms.
          </p>

          <h2 className="mt-8 text-2xl font-semibold">7. Contact Us</h2>
          <p className="text-muted-foreground mt-4">
            If you have any questions about these Terms of Service, please contact us through the
            information provided on our Contact page.
          </p>
        </div>
      </Reveal>
    </div>
  );
}

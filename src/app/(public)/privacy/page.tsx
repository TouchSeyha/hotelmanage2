import type { Metadata } from 'next';
import { AlertTriangle } from 'lucide-react';
import { Reveal } from '~/components/motion/reveal';

export const metadata: Metadata = {
  title: 'Privacy Policy | LuxeStay',
  description: 'Learn how LuxeStay handles your personal information and data',
};

export default function PrivacyPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-base-200 from-primary/50 via-secondary/50 to-accent/50 relative overflow-hidden border-b bg-linear-to-br py-16">
        <div className="hero-orbit" />
        <Reveal variant="hero" className="relative container text-center">
          <h1 className="text-4xl font-semibold sm:text-5xl">Privacy Policy</h1>
          <p className="text-base-content/70 mt-4">
            How we handle your information on our platform.
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
          <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
          <p className="text-muted-foreground mt-4">
            We may collect personal information such as your name, email address, phone number, and
            booking preferences when you interact with our platform. However, since this is a demo
            project, any data submitted is used solely for demonstration and testing purposes.
          </p>

          <h2 className="mt-8 text-2xl font-semibold">2. How We Use Your Information</h2>
          <p className="text-muted-foreground mt-4">
            Any information collected is used to simulate the booking experience and demonstrate
            platform functionality. We do not use your data for marketing, advertising, or any
            real-world service fulfillment.
          </p>

          <h2 className="mt-8 text-2xl font-semibold">3. Data Security</h2>
          <p className="text-muted-foreground mt-4">
            While we implement reasonable security measures to protect demo data, this platform is
            not intended for sensitive information. Please do not submit real payment details,
            passwords, or confidential personal data.
          </p>

          <h2 className="mt-8 text-2xl font-semibold">4. Sharing of Information</h2>
          <p className="text-muted-foreground mt-4">
            We do not sell, trade, or otherwise transfer your information to outside parties. Any
            data shown in this demo is fictional or voluntarily provided for testing purposes only.
          </p>

          <h2 className="mt-8 text-2xl font-semibold">5. Cookies and Tracking</h2>
          <p className="text-muted-foreground mt-4">
            This site may use cookies and similar technologies to enhance user experience and
            analyze demo traffic patterns. You can disable cookies through your browser settings if
            you prefer.
          </p>

          <h2 className="mt-8 text-2xl font-semibold">6. Third-Party Links</h2>
          <p className="text-muted-foreground mt-4">
            Our platform may contain links to third-party websites for demonstration purposes. We
            are not responsible for the privacy practices or content of those external sites.
          </p>

          <h2 className="mt-8 text-2xl font-semibold">7. Changes to This Policy</h2>
          <p className="text-muted-foreground mt-4">
            We may update this Privacy Policy from time to time to reflect changes in our demo
            project. We encourage you to review this page periodically for any updates.
          </p>

          <h2 className="mt-8 text-2xl font-semibold">8. Contact Us</h2>
          <p className="text-muted-foreground mt-4">
            If you have any questions about this Privacy Policy or how your information is handled,
            please reach out through our Contact page.
          </p>
        </div>
      </Reveal>
    </div>
  );
}

import { Shield, Eye, Lock, Server, Users, Bell, FileText, Clock } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Reveal } from '~/components/motion/reveal';

export const metadata: Metadata = {
  title: 'Privacy Policy | LuxeStay',
  description:
    'Learn how LuxeStay collects, uses, and protects your personal information. Your privacy matters to us.',
};

const sections = [
  {
    icon: Eye,
    title: 'Information We Collect',
    id: 'information-we-collect',
    content: [
      {
        subtitle: 'Personal Information',
        text: 'When you make a reservation or create an account, we collect your name, email address, phone number, mailing address, date of birth, and payment information. This data is essential for processing bookings and delivering our hospitality services.',
      },
      {
        subtitle: 'Automatically Collected Data',
        text: 'As you browse our website, we automatically collect your IP address, browser type, device information, pages visited, time spent on each page, and referring URLs. This information helps us optimize your experience and maintain site security.',
      },
      {
        subtitle: 'Voluntary Information',
        text: 'You may choose to provide additional details such as dietary preferences, special occasions, accessibility requirements, or feedback through our contact forms and surveys. This allows us to personalize and enhance your stay.',
      },
    ],
  },
  {
    icon: Server,
    title: 'How We Use Your Information',
    id: 'how-we-use-your-information',
    content: [
      {
        subtitle: 'Service Delivery',
        text: 'We use your data to process reservations, manage your stay preferences, communicate booking confirmations, and handle check-in/check-out procedures. Your information ensures a seamless and personalized experience from reservation to departure.',
      },
      {
        subtitle: 'Communication & Marketing',
        text: 'With your consent, we may send promotional offers, seasonal packages, and personalized recommendations. You can opt out of marketing communications at any time while still receiving essential booking-related messages.',
      },
      {
        subtitle: 'Improvement & Security',
        text: 'We analyze usage patterns to improve our website performance, develop new services, prevent fraudulent activity, and maintain the security of our platform. Your data helps us create a safer, more refined experience for all guests.',
      },
    ],
  },
  {
    icon: Users,
    title: 'Information Sharing',
    id: 'information-sharing',
    content: [
      {
        subtitle: 'Trusted Partners',
        text: 'We share information only with trusted service providers who assist in delivering our services — payment processors, booking platform partners, and email service providers. Each partner is contractually bound to protect your data.',
      },
      {
        subtitle: 'Legal Requirements',
        text: 'We may disclose information when required by law, regulation, or legal process, or when we believe disclosure is necessary to protect our rights, your safety, or the safety of others, investigate fraud, or respond to a government request.',
      },
      {
        subtitle: 'Business Transfers',
        text: 'In the event of a merger, acquisition, or sale of assets, your personal information may be transferred as part of that transaction. We will notify you via email of any change in ownership or uses of your personal data.',
      },
    ],
  },
  {
    icon: Lock,
    title: 'Data Security',
    id: 'data-security',
    content: [
      {
        subtitle: 'Encryption & Protection',
        text: 'We employ industry-standard encryption (SSL/TLS) for all data transmissions and store sensitive information on secured servers with firewalls and intrusion detection systems. Payment data is processed through PCI-DSS compliant processors.',
      },
      {
        subtitle: 'Access Controls',
        text: 'Employee access to personal information is limited to authorized personnel who need it to perform their job duties. All staff members receive regular training on data protection and privacy best practices.',
      },
      {
        subtitle: 'Data Retention',
        text: 'We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, or as required by law. Booking records are retained for up to 7 years for tax and legal compliance.',
      },
    ],
  },
  {
    icon: Bell,
    title: 'Cookies & Tracking',
    id: 'cookies-and-tracking',
    content: [
      {
        subtitle: 'Essential Cookies',
        text: 'We use essential cookies to maintain your session, remember your preferences, and enable core functionality such as secure booking processes. These cookies cannot be disabled as the site cannot function properly without them.',
      },
      {
        subtitle: 'Analytics Cookies',
        text: 'We use analytics tools to understand how visitors interact with our website, identify popular content, and measure the effectiveness of our marketing campaigns. This data is aggregated and anonymized whenever possible.',
      },
      {
        subtitle: 'Managing Cookies',
        text: 'You can manage your cookie preferences through your browser settings at any time. Please note that disabling certain cookies may affect the functionality and personalization of our website during your visit.',
      },
    ],
  },
  {
    icon: Shield,
    title: 'Your Rights',
    id: 'your-rights',
    content: [
      {
        subtitle: 'Access & Correction',
        text: 'You have the right to access the personal information we hold about you and request corrections to any inaccurate or incomplete data. Simply contact our privacy team and we will respond within 30 days.',
      },
      {
        subtitle: 'Deletion & Portability',
        text: 'You may request deletion of your personal data, subject to legal retention requirements. You also have the right to receive your data in a structured, machine-readable format and transfer it to another service provider.',
      },
      {
        subtitle: 'Consent & Complaints',
        text: 'Where processing is based on consent, you may withdraw your consent at any time. If you believe your data rights have been violated, you have the right to lodge a complaint with the relevant data protection authority.',
      },
    ],
  },
  {
    icon: FileText,
    title: 'Third-Party Links',
    id: 'third-party-links',
    content: [
      {
        subtitle: 'External Websites',
        text: 'Our website may contain links to third-party websites, including tourism boards, transport providers, and local attractions. We are not responsible for the privacy practices of these external sites and encourage you to review their policies.',
      },
      {
        subtitle: 'Embedded Content',
        text: 'We may embed maps, social media widgets, or review platforms that collect data independently. Interactions with embedded content are subject to the respective third party\u2019s privacy policy.',
      },
    ],
  },
  {
    icon: Clock,
    title: 'Policy Updates',
    id: 'policy-updates',
    content: [
      {
        subtitle: 'Revisions',
        text: 'We may update this Privacy Policy periodically to reflect changes in our practices, technology, or legal requirements. The revised date will always appear at the top of this page. We encourage you to review this policy regularly.',
      },
      {
        subtitle: 'Notification',
        text: 'For material changes affecting how we collect or use your data, we will provide notice via email or a prominent notice on our website at least 15 days before the changes take effect.',
      },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 py-20">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <Reveal
          variant="hero"
          className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs tracking-[0.3em] text-white/80 uppercase">
            <Shield className="h-4 w-4" />
            Privacy Policy
          </div>
          <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl">Your Privacy Matters</h1>
          <p className="mt-4 text-lg text-white/60">
            We are committed to protecting your personal information and ensuring transparency in
            how we handle your data.
          </p>
          <p className="mt-3 text-sm text-white/40">Last updated: April 10, 2026</p>
        </Reveal>
      </section>

      <Reveal delay={1} className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <nav className="bg-muted/30 mb-12 rounded-2xl border p-6">
          <h2 className="text-muted-foreground mb-4 text-sm font-semibold tracking-[0.2em] uppercase">
            Table of Contents
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="group text-muted-foreground hover:text-primary flex items-center gap-2 text-sm transition-colors"
                >
                  <section.icon className="h-4 w-4 shrink-0" />
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-16">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <div className="mb-6 flex items-center gap-3">
                <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                  <section.icon className="text-primary h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold">{section.title}</h2>
              </div>
              <div className="space-y-6">
                {section.content.map((item) => (
                  <div key={item.subtitle}>
                    <h3 className="mb-2 font-semibold">{item.subtitle}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section className="bg-muted/30 rounded-2xl border p-8">
            <h2 className="mb-4 text-2xl font-bold">Contact Our Privacy Team</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our
              data practices, please reach out to us:
            </p>
            <ul className="text-muted-foreground mt-4 space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-primary font-semibold">Email:</span>
                <a
                  href="mailto:privacy@luxestay.com"
                  className="decoration-primary/30 hover:text-primary underline underline-offset-4 transition-colors"
                >
                  privacy@luxestay.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary font-semibold">Phone:</span>
                <a
                  href="tel:+855234567890"
                  className="decoration-primary/30 hover:text-primary underline underline-offset-4 transition-colors"
                >
                  +855 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary font-semibold">Address:</span>
                325 Sisowath Quay, Phnom Penh, Cambodia
              </li>
            </ul>
            <p className="text-muted-foreground mt-6 text-sm">
              By continuing to use our website and services, you acknowledge that you have read and
              understood this Privacy Policy. See also our{' '}
              <Link
                href="/terms"
                className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
              >
                Terms of Service
              </Link>
              .
            </p>
          </section>
        </div>
      </Reveal>
    </div>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Award, Heart, Users, MapPin, Linkedin, Github } from 'lucide-react';
import type { Metadata } from 'next';

import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';

export const metadata: Metadata = {
  title: 'About Us | LuxeStay',
  description: "Learn about our hotel's story, values, and commitment to exceptional hospitality",
};

const stats = [
  { value: '15+', label: 'Years of Excellence' },
  { value: '50+', label: 'Rooms & Suites' },
  { value: '10,000+', label: 'Happy Guests' },
  { value: '4.8', label: 'Average Rating' },
];

const values = [
  {
    icon: Heart,
    title: 'Genuine Hospitality',
    description:
      'We believe in creating warm, welcoming experiences that make every guest feel at home.',
  },
  {
    icon: Award,
    title: 'Excellence in Service',
    description: 'Our dedicated team strives to exceed expectations in every interaction.',
  },
  {
    icon: Users,
    title: 'Community Focus',
    description: "We're committed to supporting our local community and sustainable practices.",
  },
  {
    icon: MapPin,
    title: 'Prime Location',
    description:
      'Situated in the heart of the city, offering easy access to attractions and business centers.',
  },
];

const team = [
  {
    name: 'Touch Seyha',
    role: 'Developer & Founder',
    image: '/assets/about/p1.png',
    linkedin: 'https://www.linkedin.com/in/seyha-touch-141799265/',
    github: 'https://github.com/TouchSeyha',
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-100 w-full">
        <div className="absolute inset-0 bg-linear-to-r from-black/70 to-black/40">
          <Image
            src="/assets/hotel/about.png"
            alt="Hotel lobby"
            fill
            className="-z-10 object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="relative container flex h-full flex-col items-start justify-center text-white">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">About Our Hotel</h1>
          <p className="max-w-xl text-lg text-gray-200">
            A legacy of luxury, comfort, and exceptional service since 2025.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 container -mt-12">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-primary text-3xl font-bold md:text-4xl">{stat.value}</div>
                  <div className="text-muted-foreground mt-1 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Story Section */}
      <section className="container py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="mb-4 text-3xl font-bold">Our Story</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                Founded in 2025, our hotel began with a simple vision: to create a sanctuary where
                travelers could experience the perfect blend of luxury, comfort, and authentic
                hospitality.
              </p>
              <p>
                What started as a boutique property with just 20 rooms has grown into a beloved
                destination, now offering over 50 meticulously designed rooms and suites. Through
                the years, we&apos;ve hosted thousands of guests from around the world, each one
                leaving with cherished memories.
              </p>
              <p>
                Our commitment to excellence has earned us numerous accolades, but our greatest
                reward remains the smiles of our satisfied guests and the stories they share about
                their stay with us.
              </p>
            </div>
            <Button className="mt-6" asChild>
              <Link href="/rooms">
                Explore Our Rooms
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="relative aspect-4/3 overflow-hidden rounded-lg">
            <Image
              src="/assets/about/history.png"
              alt="Hotel history"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Our Values</h2>
            <p className="text-muted-foreground mx-auto max-w-2xl">
              These core principles guide everything we do, from how we greet our guests to how we
              maintain our facilities.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card key={value.title} className="text-center">
                <CardContent className="p-6">
                  <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                    <value.icon className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-semibold">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Meet the Maker</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            The passionate mind behind creating exceptional hotel experiences.
          </p>
        </div>
        <div className="mx-auto max-w-md">
          {team.map((member) => (
            <Card key={member.name} className="overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-primary mt-1 text-sm font-medium">{member.role}</p>
                <div className="mt-3 flex items-center justify-center gap-3">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold">Experience Our Hospitality</h2>
          <p className="mx-auto mb-8 max-w-2xl">
            We&apos;d love to welcome you to our hotel. Whether you&apos;re traveling for business
            or leisure, we promise an unforgettable stay.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/rooms">
                Book Your Stay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="default" className="hover:bg-white/50" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

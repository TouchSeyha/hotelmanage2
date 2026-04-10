import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { ArrowRight, Wifi, Car, Coffee, Utensils, Waves, Dumbbell, Star } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { api } from '~/trpc/server';
import { RoomCard } from '~/components/shared/roomCard';
import { Reveal } from '~/components/motion/reveal';

const amenities = [
  { icon: Wifi, label: 'Free WiFi', description: 'High-speed internet throughout' },
  { icon: Car, label: 'Free Parking', description: 'Secure on-site parking' },
  { icon: Coffee, label: 'Breakfast', description: 'Complimentary breakfast' },
  { icon: Utensils, label: 'Restaurant', description: 'Fine dining experience' },
  { icon: Waves, label: 'Swimming Pool', description: 'Outdoor heated pool' },
  { icon: Dumbbell, label: 'Fitness Center', description: '24/7 gym access' },
];

async function FeaturedRoomsSection() {
  const roomTypes = await api.roomType.getAll({
    isActive: true,
    sortBy: 'basePrice',
    order: 'asc',
  });

  const featuredRooms = roomTypes.slice(0, 3);

  return featuredRooms.length > 0 ? (
    <div className="motion-stagger grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {featuredRooms.map((room) => (
        <RoomCard
          key={room.id}
          id={room.id}
          name={room.name}
          slug={room.slug}
          shortDescription={room.shortDescription}
          basePrice={Number(room.basePrice)}
          capacity={room.capacity}
          size={room.size}
          images={room.images as string[]}
          amenities={room.amenities}
          availableRooms={room._count.rooms}
        />
      ))}
    </div>
  ) : (
    <Card className="p-12 text-center">
      <p className="text-muted-foreground">No rooms available at the moment.</p>
    </Card>
  );
}

/**
 * Testimonials section that displays real guest reviews
 * Returns null if no approved reviews exist (hides section completely)
 */
async function TestimonialsSection() {
  const { reviews } = await api.review.getApproved({
    limit: 3,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Hide section completely if no reviews
  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="container py-16">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold">What Our Guests Say</h2>
        <p className="text-muted-foreground mt-2">Read reviews from our satisfied guests</p>
      </div>

      <div className="motion-stagger grid gap-6 md:grid-cols-3">
        {reviews.map((review) => (
          <Card key={review.id} className="motion-card-hover transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              {/* Star Rating */}
              <div className="mb-4 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'
                    }`}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-muted-foreground mb-4 line-clamp-4">
                &ldquo;{review.comment}&rdquo;
              </p>

              {/* Guest Info */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.user.image ?? undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {review.user.name?.charAt(0).toUpperCase() ?? 'G'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{review.user.name}</p>
                  <p className="text-muted-foreground text-xs">Stayed in {review.roomType.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default async function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-150 w-full">
        <div className="absolute inset-0 bg-linear-to-r from-black/70 to-black/30">
          <Image
            src="/assets/hotel/home.png"
            alt="Hotel exterior"
            fill
            className="-z-10 object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <Reveal
          variant="hero"
          className="relative container flex h-full flex-col items-start justify-center text-white"
        >
          <h1 className="mb-4 max-w-2xl text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
            Experience Luxury & Comfort
          </h1>
          <p className="mb-8 max-w-xl text-lg text-gray-200 md:text-xl">
            Discover your perfect stay at our beautiful hotel. Exceptional service, stunning views,
            and unforgettable memories await.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/rooms">
                View Rooms
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 text-white hover:bg-white/20"
              asChild
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </Reveal>
      </section>

      {/* Quick Booking Widget */}
      <Reveal delay={1} className="relative z-10 container -mt-16">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="flex-1">
                <label className="mb-2 block text-sm font-medium">Check-in</label>
                <input
                  type="date"
                  className="w-full rounded-md border p-2"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="flex-1">
                <label className="mb-2 block text-sm font-medium">Check-out</label>
                <input type="date" className="w-full rounded-md border p-2" />
              </div>
              <div className="flex-1">
                <label className="mb-2 block text-sm font-medium">Guests</label>
                <select className="w-full rounded-md border p-2">
                  <option>1 Guest</option>
                  <option>2 Guests</option>
                  <option>3 Guests</option>
                  <option>4+ Guests</option>
                </select>
              </div>
              <Button size="lg" className="md:w-auto" asChild>
                <Link href="/rooms">Search Rooms</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* Featured Rooms */}
      <Reveal delay={2} className="container py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Featured Rooms</h2>
            <p className="text-muted-foreground mt-2">
              Choose from our selection of beautifully appointed rooms
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/rooms">
              View All Rooms
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Suspense fallback={<div>Loading featured rooms...</div>}>
          <FeaturedRoomsSection />
        </Suspense>
      </Reveal>

      {/* Amenities Section */}
      <Reveal delay={3} className="bg-muted/50 py-16">
        <div className="container">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold">Hotel Amenities</h2>
            <p className="text-muted-foreground mt-2">Everything you need for a comfortable stay</p>
          </div>

          <div className="motion-stagger grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {amenities.map((amenity) => (
              <Card
                key={amenity.label}
                className="motion-card-hover transition-shadow hover:shadow-md"
              >
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="bg-primary/10 rounded-full p-3">
                    <amenity.icon className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{amenity.label}</h3>
                    <p className="text-muted-foreground text-sm">{amenity.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Testimonials - Only shown when reviews exist */}
      <Suspense fallback={null}>
        <TestimonialsSection />
      </Suspense>

      {/* CTA Section */}
      <Reveal delay={4} className="bg-primary text-primary-foreground py-16">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Book Your Stay?</h2>
          <p className="mx-auto mb-8 max-w-2xl">
            Don&apos;t miss out on an unforgettable experience. Book your room today and enjoy
            exclusive offers.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/rooms">
              Book Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </Reveal>
    </div>
  );
}

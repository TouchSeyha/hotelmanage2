import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Wifi, Car, Coffee, Utensils, Waves, Dumbbell } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { api } from '~/trpc/server';
import { RoomCard } from '~/components/shared/roomCard';

const amenities = [
  { icon: Wifi, label: 'Free WiFi', description: 'High-speed internet throughout' },
  { icon: Car, label: 'Free Parking', description: 'Secure on-site parking' },
  { icon: Coffee, label: 'Breakfast', description: 'Complimentary breakfast' },
  { icon: Utensils, label: 'Restaurant', description: 'Fine dining experience' },
  { icon: Waves, label: 'Swimming Pool', description: 'Outdoor heated pool' },
  { icon: Dumbbell, label: 'Fitness Center', description: '24/7 gym access' },
];

export default async function HomePage() {
  // Fetch featured room types
  const roomTypes = await api.roomType.getAll({
    isActive: true,
    sortBy: 'basePrice',
    order: 'asc',
  });

  const featuredRooms = roomTypes.slice(0, 3);

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
        <div className="relative container flex h-full flex-col items-start justify-center text-white">
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
        </div>
      </section>

      {/* Quick Booking Widget */}
      <section className="relative z-10 container -mt-16">
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
      </section>

      {/* Featured Rooms */}
      <section className="container py-16">
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

        {featuredRooms.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                amenities={room.amenities as string[]}
                availableRooms={room._count.rooms}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No rooms available at the moment.</p>
          </Card>
        )}
      </section>

      {/* Amenities Section */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold">Hotel Amenities</h2>
            <p className="text-muted-foreground mt-2">Everything you need for a comfortable stay</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {amenities.map((amenity) => (
              <Card key={amenity.label} className="transition-shadow hover:shadow-md">
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
      </section>

      {/* Testimonials */}
      <section className="container py-16">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold">What Our Guests Say</h2>
          <p className="text-muted-foreground mt-2">Read reviews from our satisfied guests</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              name: 'Sarah Johnson',
              rating: 5,
              text: 'Absolutely wonderful experience! The staff went above and beyond to make our stay memorable. Will definitely return.',
            },
            {
              name: 'Michael Chen',
              rating: 5,
              text: 'The rooms are spacious and beautifully decorated. The view from our balcony was breathtaking. Highly recommend!',
            },
            {
              name: 'Emily Davis',
              rating: 5,
              text: "Perfect location, amazing breakfast, and the most comfortable bed I've ever slept in. Five stars all around!",
            },
          ].map((testimonial, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="mb-4 flex text-yellow-400">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <span key={j}>★</span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                <p className="font-semibold">{testimonial.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
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
      </section>
    </div>
  );
}

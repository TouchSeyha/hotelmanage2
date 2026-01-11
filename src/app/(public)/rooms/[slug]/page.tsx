import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Users, Maximize, Check, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

import { api } from '~/trpc/server';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { RoomGallery } from '~/components/shared/roomGallery';

interface RoomDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: RoomDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const roomType = await api.roomType.getBySlug({ slug });
    return {
      title: `${roomType.name}`,
      description: roomType.shortDescription,
    };
  } catch {
    return {
      title: 'Room Not Found',
    };
  }
}

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const { slug } = await params;

  let roomType;
  try {
    roomType = await api.roomType.getBySlug({ slug });
  } catch {
    notFound();
  }

  const images = roomType.images as string[];
  const amenities = roomType.amenities as string[];
  const availableRooms = roomType.rooms.length;

  // Transform images for the gallery component
  const galleryImages = images.map((image, index) => ({
    src: image,
    alt: `${roomType.name} - Image ${index + 1}`,
    title: index === 0 ? 'Main View' : undefined,
  }));

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/rooms"
          className="text-muted-foreground hover:text-primary inline-flex items-center text-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Rooms
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery with Hero + Thumbnails Layout */}
        <RoomGallery images={galleryImages} roomName={roomType.name} maxThumbnails={4} />

        {/* Room Details */}
        <div>
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{roomType.name}</h1>
              <p className="text-muted-foreground mt-2">{roomType.shortDescription}</p>
            </div>
            <Badge variant={availableRooms > 0 ? 'default' : 'destructive'}>
              {availableRooms > 0 ? `${availableRooms} available` : 'Sold out'}
            </Badge>
          </div>

          {/* Price & Details */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="mb-4 flex items-baseline gap-2">
                <span className="text-4xl font-bold">${Number(roomType.basePrice)}</span>
                <span className="text-muted-foreground">/ night</span>
              </div>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="text-muted-foreground h-5 w-5" />
                  <span>Up to {roomType.capacity} guests</span>
                </div>
                {roomType.size && (
                  <div className="flex items-center gap-2">
                    <Maximize className="text-muted-foreground h-5 w-5" />
                    <span>{roomType.size} m²</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <div className="mb-6">
            <h2 className="mb-3 text-xl font-semibold">Description</h2>
            <p className="text-muted-foreground">{roomType.description}</p>
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 text-xl font-semibold">Amenities</h2>
              <div className="grid grid-cols-2 gap-2">
                {amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Booking CTA */}
          <div className="flex gap-4">
            <Button size="lg" className="flex-1" disabled={availableRooms === 0} asChild>
              <Link href={`/book?room=${roomType.slug}`}>
                {availableRooms > 0 ? 'Book Now' : 'Not Available'}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Policies */}
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-2 font-semibold">Check-in</h3>
            <p className="text-muted-foreground text-sm">From 2:00 PM</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-2 font-semibold">Check-out</h3>
            <p className="text-muted-foreground text-sm">Until 11:00 AM</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-2 font-semibold">Cancellation</h3>
            <p className="text-muted-foreground text-sm">
              Free cancellation up to 24 hours before check-in
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

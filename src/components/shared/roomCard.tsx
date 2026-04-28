import Image from 'next/image';
import Link from 'next/link';
import { Users, Maximize, Wifi, Wind, Tv } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardFooter } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { cn } from '~/lib/utils';

interface Amenity {
  id: string;
  name: string;
  icon?: string | null;
}

interface RoomCardProps {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  basePrice: number;
  capacity: number;
  size?: number | null;
  images: string[];
  amenities: Amenity[];
  availableRooms?: number;
  className?: string;
}

// Map amenity names to icons
const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-4 w-4" />,
  'Air Conditioning': <Wind className="h-4 w-4" />,
  TV: <Tv className="h-4 w-4" />,
};

export function RoomCard({
  name,
  slug,
  shortDescription,
  basePrice,
  capacity,
  size,
  images,
  amenities,
  availableRooms,
  className,
}: RoomCardProps) {
  const mainImage = images[0] ?? '/placeholder-room.jpg';
  const displayAmenities = amenities.slice(0, 3);

  return (
    <Card
      className={cn(
        'motion-card-hover overflow-hidden pt-0 transition-shadow hover:shadow-lg',
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={mainImage}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {availableRooms !== undefined && (
          <Badge
            variant={availableRooms > 0 ? 'default' : 'destructive'}
            className="absolute top-2 right-2"
          >
            {availableRooms > 0 ? `${availableRooms} available` : 'Sold out'}
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        {/* Title & Description */}
        <h3 className="mb-2 text-lg font-semibold">{name}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">{shortDescription}</p>

        {/* Details */}
        <div className="text-muted-foreground mb-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{capacity} guests</span>
          </div>
          {size && (
            <div className="flex items-center gap-1">
              <Maximize className="h-4 w-4" />
              <span>{size} m²</span>
            </div>
          )}
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2">
          {displayAmenities.map((amenity) => (
            <div
              key={amenity.id}
              className="bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs"
            >
              {amenityIcons[amenity.name] ?? null}
              <span>{amenity.name}</span>
            </div>
          ))}
          {amenities.length > 3 && (
            <div className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs">
              +{amenities.length - 3} more
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t p-4">
        <div>
          <span className="text-2xl font-bold">${basePrice}</span>
          <span className="text-muted-foreground text-sm"> / night</span>
        </div>
        <Button asChild>
          <Link href={`/rooms/${slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

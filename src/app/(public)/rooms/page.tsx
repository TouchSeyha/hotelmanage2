import { Suspense } from 'react';
import { api } from '~/trpc/server';
import { RoomCard } from '~/components/shared/roomCard';
import { RoomGridSkeleton } from '~/components/shared/loadingSkeleton';
import { EmptyState } from '~/components/shared/emptyState';
import { BedDouble } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Rooms',
  description: 'Browse our selection of comfortable and luxurious rooms',
};

interface RoomsPageProps {
  searchParams: Promise<{
    sort?: string;
    order?: string;
  }>;
}

async function RoomsList({ sortBy, order }: { sortBy: string; order: 'asc' | 'desc' }) {
  const roomTypes = await api.roomType.getAll({
    isActive: true,
    sortBy: sortBy as 'name' | 'basePrice' | 'capacity' | 'createdAt',
    order,
  });

  if (roomTypes.length === 0) {
    return (
      <EmptyState
        icon={BedDouble}
        title="No rooms available"
        description="We're currently updating our room inventory. Please check back soon."
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {roomTypes.map((room) => (
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
  );
}

export default async function RoomsPage({ searchParams }: RoomsPageProps) {
  const params = await searchParams;
  const sortBy = params.sort ?? 'basePrice';
  const order = (params.order ?? 'asc') as 'asc' | 'desc';

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Our Rooms</h1>
        <p className="text-muted-foreground mt-2">
          Choose from our selection of beautifully appointed rooms and suites
        </p>
      </div>

      {/* Filters & Sort */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground text-sm">Sort by:</span>
          <div className="flex gap-2">
            <a
              href={`/rooms?sort=basePrice&order=${sortBy === 'basePrice' && order === 'asc' ? 'desc' : 'asc'}`}
              className={`rounded-md px-3 py-1.5 text-sm ${
                sortBy === 'basePrice'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              Price {sortBy === 'basePrice' && (order === 'asc' ? '↑' : '↓')}
            </a>
            <a
              href={`/rooms?sort=capacity&order=${sortBy === 'capacity' && order === 'asc' ? 'desc' : 'asc'}`}
              className={`rounded-md px-3 py-1.5 text-sm ${
                sortBy === 'capacity'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              Capacity {sortBy === 'capacity' && (order === 'asc' ? '↑' : '↓')}
            </a>
            <a
              href={`/rooms?sort=name&order=${sortBy === 'name' && order === 'asc' ? 'desc' : 'asc'}`}
              className={`rounded-md px-3 py-1.5 text-sm ${
                sortBy === 'name'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              Name {sortBy === 'name' && (order === 'asc' ? '↑' : '↓')}
            </a>
          </div>
        </div>
      </div>

      {/* Room Grid */}
      <Suspense fallback={<RoomGridSkeleton count={6} />}>
        <RoomsList sortBy={sortBy} order={order} />
      </Suspense>
    </div>
  );
}

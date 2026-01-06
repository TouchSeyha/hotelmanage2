'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, MoreHorizontal, Pencil, Trash2, Eye, BedDouble } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '~/trpc/react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { ConfirmDialog } from '~/components/shared/confirmDialog';
import { Badge } from '~/components/ui/badge';
import { Skeleton } from '~/components/ui/skeleton';

export default function RoomTypesPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: roomTypes, isLoading, refetch } = api.roomType.getAll.useQuery();

  const deleteRoomType = api.roomType.delete.useMutation({
    onSuccess: () => {
      toast.success('Room type deleted successfully');
      setDeleteId(null);
      void refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Room Types</h1>
          <p className="text-muted-foreground">Manage room categories and pricing</p>
        </div>
        <Button asChild>
          <Link href="/admin/room-types/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Room Type
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : roomTypes && roomTypes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roomTypes.map((roomType) => (
            <Card key={roomType.id} className="overflow-hidden">
              <div className="bg-muted relative h-48 w-full">
                {Array.isArray(roomType.images) && roomType.images[0] ? (
                  <Image
                    src={roomType.images[0] as string}
                    alt={roomType.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <BedDouble className="text-muted-foreground h-12 w-12" />
                  </div>
                )}
              </div>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {roomType.name}
                    <Badge variant="outline">{roomType._count.rooms} rooms</Badge>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    ${Number(roomType.basePrice)}/night • Up to {roomType.capacity} guests
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/rooms/${roomType.slug}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Public Page
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/room-types/${roomType.id}/edit`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => setDeleteId(roomType.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {roomType.description ?? 'No description available'}
                </p>
                {Array.isArray(roomType.amenities) && roomType.amenities.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {(roomType.amenities as string[]).slice(0, 4).map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {roomType.amenities.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{roomType.amenities.length - 4} more
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BedDouble className="text-muted-foreground mb-4 h-12 w-12" />
            <h3 className="text-lg font-medium">No room types yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first room type
            </p>
            <Button asChild>
              <Link href="/admin/room-types/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Room Type
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Are you sure?"
        description="This will permanently delete this room type. Rooms associated with this type will need to be reassigned. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => deleteId && deleteRoomType.mutate({ id: deleteId })}
        variant="destructive"
        loading={deleteRoomType.isPending}
      />
    </div>
  );
}

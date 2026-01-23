'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, MoreHorizontal, Pencil, Trash2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '~/trpc/react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
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
import { TableSkeleton } from '~/components/shared/loadingSkeleton';

export default function AmenitiesPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: amenities, isLoading, refetch } = api.amenity.getAll.useQuery();

  const deleteAmenity = api.amenity.delete.useMutation({
    onSuccess: () => {
      toast.success('Amenity deleted successfully');
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
          <h1 className="text-2xl font-bold">Amenities</h1>
          <p className="text-muted-foreground">Manage hotel amenities</p>
        </div>
        <Button asChild>
          <Link href="/admin/amenities/new">
            <Plus className="mr-2 h-4 w-4" />
            New Amenity
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Amenities</CardTitle>
          <CardDescription>{amenities?.length ?? 0} total amenities</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton rows={5} columns={5} />
          ) : amenities && amenities.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {amenities.map((amenity) => (
                  <TableRow key={amenity.id}>
                    <TableCell className="font-medium">{amenity.name}</TableCell>
                    <TableCell className="text-muted-foreground">{amenity.icon ?? '-'}</TableCell>
                    <TableCell>
                      {amenity.category ? (
                        <Badge variant="outline">{amenity.category}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={amenity.isActive ? 'default' : 'secondary'}>
                        {amenity.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
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
                            <Link href={`/admin/amenities/${amenity.id}/edit`}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteId(amenity.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Sparkles className="text-muted-foreground mb-4 h-12 w-12" />
              <h3 className="text-lg font-medium">No amenities yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first amenity
              </p>
              <Button asChild>
                <Link href="/admin/amenities/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Amenity
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Are you sure?"
        description="This will permanently delete this amenity. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => deleteId && deleteAmenity.mutate({ id: deleteId })}
        variant="destructive"
        loading={deleteAmenity.isPending}
      />
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { use, useEffect } from 'react';

import { api } from '~/trpc/react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Skeleton } from '~/components/ui/skeleton';
import {
  roomTypeFormSchema,
  transformRoomTypeFormToApi,
  transformRoomTypeApiToForm,
  type RoomTypeFormData,
} from '~/lib/schemas';

export default function EditRoomTypePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const { data: roomType, isLoading } = api.roomType.getById.useQuery({ id });

  const form = useForm<RoomTypeFormData>({
    resolver: zodResolver(roomTypeFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      basePrice: 0,
      capacity: 2,
      size: undefined,
      amenities: '',
      images: '',
    },
  });

  // Populate form when data loads
  useEffect(() => {
    if (roomType) {
      form.reset(transformRoomTypeApiToForm(roomType));
    }
  }, [roomType, form]);

  const updateRoomType = api.roomType.update.useMutation({
    onSuccess: () => {
      toast.success('Room type updated successfully');
      router.push('/admin/room-types');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    form.setValue('slug', slug);
  };

  const onSubmit = (formData: RoomTypeFormData) => {
    updateRoomType.mutate({
      id,
      data: transformRoomTypeFormToApi(formData),
    });
  };

  if (isLoading) {
    return (
      <div>
        <Skeleton className="mb-4 h-6 w-32" />
        <Skeleton className="mb-6 h-8 w-64" />
        <Card className="max-w-2xl">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/room-types"
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center text-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Room Types
        </Link>
        <h1 className="text-2xl font-bold">Edit Room Type</h1>
        <p className="text-muted-foreground">Update room type details</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Room Type Details</CardTitle>
          <CardDescription>Edit information for this room type</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Deluxe Suite"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleNameChange(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="deluxe-suite" {...field} />
                      </FormControl>
                      <FormDescription>URL-friendly identifier</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Input placeholder="A brief summary of room type..." {...field} />
                    </FormControl>
                    <FormDescription>Max 200 characters, used in listings</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A spacious suite with panoramic views..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="basePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price (per night)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="text-muted-foreground absolute top-2.5 left-3">$</span>
                          <Input
                            type="number"
                            min={0}
                            step={0.01}
                            className="pl-7"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={20}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormDescription>Maximum number of guests</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="amenities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amenities</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="WiFi, Air Conditioning, Mini Bar, Ocean View"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Comma-separated list of amenities</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URLs</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>One URL per line</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button type="submit" disabled={updateRoomType.isPending}>
                  {updateRoomType.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/room-types">Cancel</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

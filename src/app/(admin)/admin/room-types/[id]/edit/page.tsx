'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft, ChevronsUpDown, X } from 'lucide-react';
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
import { ImageUpload } from '~/components/image-upload';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Checkbox } from '~/components/ui/checkbox';
import { Badge } from '~/components/ui/badge';
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
  const { data: amenities = [] } = api.amenity.getAll.useQuery();

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
      amenityIds: [],
      images: [],
    },
  });

  const isDirty = form.formState.isDirty;

  useEffect(() => {
    if (roomType) {
      form.reset(transformRoomTypeApiToForm(roomType));
    }
  }, [roomType, form]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const updateRoomType = api.roomType.update.useMutation({
    onSuccess: () => {
      form.reset();
      toast.success('Room type updated successfully');
      router.push('/admin/room-types');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

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
      <div className="touch-manipulation">
        <div className="mb-8">
          <Skeleton className="mb-4 h-5 w-32" />
          <Skeleton className="mb-2 h-8 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Card className="max-w-2xl shadow-sm">
          <CardHeader className="space-y-1">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <div className="grid gap-6 sm:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="touch-manipulation">
      <div className="mb-8">
        <Link
          href="/admin/room-types"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 mb-4 inline-flex items-center gap-2 rounded-md text-sm outline-none focus-visible:ring-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Room Types
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Edit Room Type</h1>
        <p className="text-muted-foreground mt-1">Update the details for this room type</p>
      </div>

      <Card className="max-w-2xl shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">Room Type Details</CardTitle>
          <CardDescription>Edit the information for this room type</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Deluxe Suite…"
                          autoComplete="off"
                          spellCheck={false}
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
                      <FormLabel required>Slug</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. deluxe-suite…"
                          autoComplete="off"
                          spellCheck={false}
                          {...field}
                        />
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
                    <FormLabel required>Short Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="A brief summary of room type…"
                        autoComplete="off"
                        {...field}
                      />
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
                    <FormLabel required>Full Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A spacious suite with panoramic views…"
                        rows={4}
                        autoComplete="off"
                        className="resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Detailed description shown on room detail page
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="basePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Base Price (per night)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span
                            className="text-muted-foreground pointer-events-none absolute inset-y-0 left-3 flex items-center"
                            aria-hidden="true"
                          >
                            $
                          </span>
                          <Input
                            type="number"
                            inputMode="decimal"
                            min={0}
                            step={0.01}
                            className="pl-7 tabular-nums"
                            autoComplete="off"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>Base price per night in USD</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Capacity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          max={20}
                          autoComplete="off"
                          className="tabular-nums"
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
                name="amenityIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amenities</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="h-auto min-h-10 w-full justify-between font-normal"
                          >
                            {field.value && field.value.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {field.value.map((id) => {
                                  const amenity = amenities.find((a) => a.id === id);
                                  return amenity ? (
                                    <Badge
                                      key={id}
                                      variant="secondary"
                                      className="mr-1"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        field.onChange(field.value?.filter((v) => v !== id));
                                      }}
                                    >
                                      {amenity.name}
                                      <X className="ml-1 h-3 w-3 cursor-pointer" />
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Select amenities…</span>
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <div className="max-h-60 overflow-auto p-2">
                          {amenities.length === 0 ? (
                            <p className="text-muted-foreground py-4 text-center text-sm">
                              No amenities available
                            </p>
                          ) : (
                            amenities.map((amenity) => (
                              <div
                                key={amenity.id}
                                className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5"
                                onClick={() => {
                                  const current = field.value ?? [];
                                  if (current.includes(amenity.id)) {
                                    field.onChange(current.filter((id) => id !== amenity.id));
                                  } else {
                                    field.onChange([...current, amenity.id]);
                                  }
                                }}
                              >
                                <Checkbox
                                  checked={field.value?.includes(amenity.id)}
                                  onCheckedChange={(checked) => {
                                    const current = field.value ?? [];
                                    if (checked) {
                                      field.onChange([...current, amenity.id]);
                                    } else {
                                      field.onChange(current.filter((id) => id !== amenity.id));
                                    }
                                  }}
                                />
                                <span className="text-sm">{amenity.name}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Select the amenities for this room type</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Room Images</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        maxImages={5}
                        folder="room-types"
                        disabled={updateRoomType.isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload up to 5 images. The first image will be the primary showcase image.
                      Click the star icon to set a different image as primary.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-4 border-t pt-4">
                <Button type="submit" disabled={updateRoomType.isPending}>
                  {updateRoomType.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Saving…
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

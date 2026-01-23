'use client';

import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useEffect } from 'react';

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
import { Switch } from '~/components/ui/switch';
import { Skeleton } from '~/components/ui/skeleton';
import {
  amenityFormSchema,
  defaultAmenityFormData,
  transformAmenityApiToForm,
  type AmenityFormData,
} from '~/lib/schemas';

export default function EditAmenityPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const form = useForm<AmenityFormData & { isActive?: boolean }>({
    resolver: zodResolver(amenityFormSchema),
    defaultValues: defaultAmenityFormData,
  });

  const { data: amenity, isLoading } = api.amenity.getById.useQuery(
    { id: params.id },
    { enabled: !!params.id }
  );

  useEffect(() => {
    if (amenity) {
      form.reset({
        ...transformAmenityApiToForm(amenity),
        isActive: amenity.isActive,
      });
    }
  }, [amenity, form]);

  const updateAmenity = api.amenity.update.useMutation({
    onSuccess: () => {
      toast.success('Amenity updated successfully');
      router.push('/admin/amenities');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (formData: AmenityFormData & { isActive?: boolean }) => {
    updateAmenity.mutate({
      id: params.id,
      data: {
        name: formData.name,
        icon: formData.icon ?? null,
        category: formData.category ?? null,
        isActive: formData.isActive,
      },
    });
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <Skeleton className="mb-4 h-5 w-32" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-1 h-5 w-64" />
        </div>
        <Card className="max-w-2xl">
          <CardHeader>
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-5 w-56" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!amenity) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-lg font-medium">Amenity not found</h3>
        <p className="text-muted-foreground mb-4">
          The amenity you&apos;re looking for doesn&apos;t exist
        </p>
        <Button asChild>
          <Link href="/admin/amenities">Back to Amenities</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/amenities"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 mb-4 inline-flex items-center gap-2 rounded-md text-sm outline-none focus-visible:ring-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Amenities
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Edit Amenity</h1>
        <p className="text-muted-foreground mt-1">Update amenity details</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Amenity Details</CardTitle>
          <CardDescription>Update the information for this amenity</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Free WiFi, Swimming Pool..."
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. wifi, swimming-pool..."
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Icon name from Lucide icons (optional)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Technology, Comfort, Recreation..."
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Group amenities by category (optional)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <FormDescription>
                        Inactive amenities won&apos;t be shown to guests
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-4 border-t pt-4">
                <Button type="submit" disabled={updateAmenity.isPending}>
                  {updateAmenity.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/amenities">Cancel</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

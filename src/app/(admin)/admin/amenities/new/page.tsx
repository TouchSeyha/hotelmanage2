'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

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
import {
  amenityFormSchema,
  defaultAmenityFormData,
  transformAmenityFormToApi,
  type AmenityFormData,
} from '~/lib/schemas';

export default function NewAmenityPage() {
  const router = useRouter();

  const form = useForm<AmenityFormData>({
    resolver: zodResolver(amenityFormSchema),
    defaultValues: defaultAmenityFormData,
  });

  const createAmenity = api.amenity.create.useMutation({
    onSuccess: () => {
      form.reset();
      toast.success('Amenity created successfully');
      router.push('/admin/amenities');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (formData: AmenityFormData) => {
    createAmenity.mutate(transformAmenityFormToApi(formData));
  };

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
        <h1 className="text-2xl font-bold tracking-tight">Create Amenity</h1>
        <p className="text-muted-foreground mt-1">Add a new amenity to your hotel</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Amenity Details</CardTitle>
          <CardDescription>Enter the information for this amenity</CardDescription>
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

              <div className="flex items-center gap-4 border-t pt-4">
                <Button type="submit" disabled={createAmenity.isPending}>
                  {createAmenity.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Creating...
                    </>
                  ) : (
                    'Create Amenity'
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

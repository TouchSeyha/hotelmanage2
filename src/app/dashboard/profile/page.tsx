'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, User, Mail, Phone, Calendar, Shield, Sun, Moon, Monitor } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

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
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Skeleton } from '~/components/ui/skeleton';
import { Breadcrumb } from '~/components/shared/breadcrumb';
import { profileFormSchema, transformProfileFormToApi, type ProfileFormData } from '~/lib/schemas';
import { Reveal } from '~/components/motion/reveal';

export default function ProfilePage() {
  const { data: profile, isLoading, refetch } = api.user.getProfile.useQuery();

  const updateProfile = api.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      void refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    values: {
      name: profile?.name ?? '',
      phone: profile?.phone ?? '',
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfile.mutate(transformProfileFormToApi(data));
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <Reveal className="mb-6">
          <h1 className="text-2xl font-bold">Profile</h1>
        </Reveal>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardContent className="flex flex-col items-center py-8">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="mt-4 h-6 w-32" />
              <Skeleton className="mt-2 h-4 w-48" />
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-32" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <Reveal>
        <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Profile' }]} />
      </Reveal>

      <Reveal delay={1}>
        <h1 className="mb-6 text-2xl font-bold">Profile</h1>
      </Reveal>

      <Reveal delay={2} variant="panel" className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="motion-card-hover lg:col-span-1">
          <CardContent className="flex flex-col items-center py-8">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.image ?? undefined} alt={profile.name ?? 'User'} />
              <AvatarFallback className="text-2xl">
                {profile.name?.charAt(0).toUpperCase() ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <h2 className="mt-4 text-xl font-semibold">{profile.name}</h2>
            <p className="text-muted-foreground">{profile.email}</p>
            <Badge variant="outline" className="mt-3">
              <Shield className="mr-1 h-3 w-3" />
              {profile.role === 'admin' ? 'Administrator' : 'Guest'}
            </Badge>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="motion-card-hover lg:col-span-2">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                          <Input className="pl-9" placeholder="Your name" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Email</FormLabel>
                  <div className="relative mt-2">
                    <Mail className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                    <Input className="pl-9" value={profile.email ?? ''} disabled />
                  </div>
                  <FormDescription>
                    Email is managed by your authentication provider
                  </FormDescription>
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                          <Input
                            className="pl-9"
                            placeholder="+1 (555) 000-0000"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Used for booking confirmations and important updates
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="motion-card-hover lg:col-span-3">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the application looks</CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeSelector />
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="motion-card-hover lg:col-span-3">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3">
                <div className="bg-muted rounded-full p-2">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Member Since</p>
                  <p className="text-muted-foreground text-sm">
                    {profile.createdAt ? format(new Date(profile.createdAt), 'MMMM yyyy') : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-muted rounded-full p-2">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Account Type</p>
                  <p className="text-muted-foreground text-sm">
                    {profile.role === 'admin' ? 'Administrator' : 'Guest'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}

function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {themes.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`hover:bg-muted flex flex-col items-center justify-center gap-2 rounded-lg border p-4 transition-all ${
            theme === value ? 'border-primary bg-muted ring-primary ring-1' : 'border-border'
          }`}
        >
          <Icon className="h-6 w-6" />
          <span className="text-sm font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}

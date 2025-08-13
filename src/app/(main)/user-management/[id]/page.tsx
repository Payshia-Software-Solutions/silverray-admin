
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { User, Shield, Upload, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { getUserById, updateUser, type UserFromApi } from '@/lib/services/api';
import { useRouter, useParams } from 'next/navigation';

const userSchema = z.object({
  full_name: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  company_id: z.string().min(1, "Company ID is required"),
  status: z.enum(['Active', 'Inactive']),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function EditAdminPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const { toast } = useToast();

    const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
    });

    useEffect(() => {
        if(id) {
            async function fetchUser() {
                try {
                    const userData = await getUserById(id);
                    reset(userData);
                } catch(error: any) {
                     toast({
                        variant: 'destructive',
                        title: 'Error fetching user',
                        description: error.message || 'An unexpected error occurred.',
                    });
                }
            }
            fetchUser();
        }
    }, [id, reset, toast]);

  const handleUpdateAccount: SubmitHandler<UserFormValues> = async (data) => {
    try {
        await updateUser(id, data);
        toast({
            title: 'Success!',
            description: 'User updated successfully.',
        });
        router.push('/user-management');
    } catch(error: any) {
        toast({
            variant: 'destructive',
            title: 'Error updating user',
            description: error.message || 'An unexpected error occurred.',
        });
    }
  };

  return (
    <>
    <Toaster />
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/user-management">User Management</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit User</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <form onSubmit={handleSubmit(handleUpdateAccount)}>
        <div className="space-y-8 max-w-4xl mx-auto">
            <Card>
            <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <span className="p-2 bg-primary/10 rounded-full">
                        <User className="h-5 w-5 text-primary" />
                    </span>
                    <h2 className="text-lg font-semibold">User Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    <div className="col-span-1 flex flex-col items-center text-center gap-4">
                        <Label htmlFor="profile-picture">Profile Picture (Optional)</Label>
                        <div className="flex flex-col items-center justify-center h-32 w-32 border-2 border-dashed rounded-full bg-muted/50">
                            <UserPlus className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <Button variant="outline" size="sm" asChild type="button">
                            <label htmlFor="profile-picture-upload">
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Photo
                            </label>
                        </Button>
                        <Input id="profile-picture-upload" type="file" className="hidden" />
                        <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
                    </div>
                    <div className="col-span-2 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="full-name">Full Name *</Label>
                            <Input id="full-name" {...register('full_name')} />
                             {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input id="email" type="email" {...register('email')} />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                    </div>
                </div>
            </CardContent>
            </Card>

            <Card>
            <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <span className="p-2 bg-primary/10 rounded-full">
                        <Shield className="h-5 w-5 text-primary" />
                    </span>
                    <h2 className="text-lg font-semibold">Role & Status</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="role-assignment">Role Assignment *</Label>
                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="role-assignment">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                                    <SelectItem value="Booking Manager">Booking Manager</SelectItem>
                                    <SelectItem value="Restaurant Manager">Restaurant Manager</SelectItem>
                                    <SelectItem value="Front Desk">Front Desk</SelectItem>
                                    <SelectItem value="Housekeeping">Housekeeping</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="company_id">Company ID *</Label>
                    <Input id="company_id" {...register('company_id')} />
                    {errors.company_id && <p className="text-red-500 text-sm">{errors.company_id.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label>Account Status</Label>
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                             <div className="flex items-center space-x-2 pt-2">
                                <Switch id="account-status" checked={field.value === 'Active'} onCheckedChange={(checked) => field.onChange(checked ? 'Active' : 'Inactive')} />
                                <Label htmlFor="account-status" className="font-normal">{field.value}</Label>
                            </div>
                        )}
                    />
                </div>
                </div>
            </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
            <Button variant="outline" asChild type="button">
                <Link href="/user-management">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            </div>
        </div>
      </form>
    </div>
    </>
  );
}

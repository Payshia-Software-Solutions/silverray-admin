

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
import { User, Shield, Upload, UserPlus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { getUserById, updateUser, type UserFromApi, getRoles, type RoleFromApi, getUserImage, CONTENT_PROVIDER_BASE_URL, uploadUserImage } from '@/lib/services/api';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

const userSchema = z.object({
  full_name: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  company_id: z.string(),
  status: z.enum(['Active', 'Inactive']),
  avatar_url: z.string().optional().nullable(),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function EditAdminPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const { toast } = useToast();
    const [roles, setRoles] = useState<RoleFromApi[]>([]);
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);


    const { register, handleSubmit, control, reset, setValue, formState: { errors, isSubmitting } } = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
    });

    useEffect(() => {
        async function fetchInitialData() {
            setLoadingRoles(true);
            try {
                const [userData, rolesData] = await Promise.all([
                    getUserById(id),
                    getRoles()
                ]);
                reset(userData);
                
                const userImage = await getUserImage(userData.company_id, userData.id);
                if (userImage && userImage.image_url) {
                    setImagePreview(CONTENT_PROVIDER_BASE_URL + userImage.image_url);
                }
                
                setRoles(rolesData);
            } catch (error: any) {
                 toast({
                    variant: 'destructive',
                    title: 'Error fetching data',
                    description: error.message || 'An unexpected error occurred.',
                });
            } finally {
                setLoadingRoles(false);
            }
        }

        if(id) {
            fetchInitialData();
        }
    }, [id, reset, toast]);

  const handleUpdateAccount: SubmitHandler<UserFormValues> = async (data) => {
    try {
        const { avatar_url, ...userData } = data;
        await updateUser(id, userData);

        if (imageFile) {
            await uploadUserImage(id, '1', imageFile);
        }

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
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
      setImageFile(null);
      setImagePreview(null);
      setValue('avatar_url', null);
      const fileInput = document.getElementById('profile-picture-upload') as HTMLInputElement;
      if (fileInput) {
          fileInput.value = '';
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
                        <div className="relative h-32 w-32 rounded-full border-2 border-dashed bg-muted/50 flex items-center justify-center">
                            {imagePreview ? (
                                <>
                                    <Image src={imagePreview} alt="Profile Preview" layout="fill" className="rounded-full object-cover" />
                                    <Button variant="destructive" size="icon" className="absolute top-0 right-0 h-7 w-7 rounded-full" onClick={removeImage}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </>
                            ) : (
                                 <UserPlus className="h-12 w-12 text-muted-foreground" />
                            )}
                        </div>

                        <Button variant="outline" size="sm" asChild type="button">
                            <label htmlFor="profile-picture-upload">
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Photo
                            </label>
                        </Button>
                        <Input id="profile-picture-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
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
                            <Select onValueChange={field.onChange} value={field.value} disabled={loadingRoles}>
                                <SelectTrigger id="role-assignment">
                                    <SelectValue placeholder={loadingRoles ? "Loading roles..." : "Select a role"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map(role => (
                                        <SelectItem key={role.id} value={role.name}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
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



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
import { User, Shield, Upload, Eye, EyeOff, UserPlus, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { createUser, getRoles, type RoleFromApi } from '@/lib/services/api';
import { useRouter } from 'next/navigation';

const userSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  full_name: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  role: z.string().min(1, "Role is required"),
  company_id: z.string().min(1, "Company ID is required"),
  status: z.enum(['Active', 'Inactive']),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type UserFormValues = z.infer<typeof userSchema>;

export default function AddNewAdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [roles, setRoles] = useState<RoleFromApi[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<UserFormValues>({
      resolver: zodResolver(userSchema),
      defaultValues: {
          status: 'Active',
          company_id: 'comp_001', // Default value
      }
  });

  useEffect(() => {
    async function fetchRoles() {
        try {
            setLoadingRoles(true);
            const data = await getRoles();
            setRoles(data);
        } catch (err: any) {
            toast({
                variant: 'destructive',
                title: 'Error fetching roles',
                description: err.message,
            });
        } finally {
            setLoadingRoles(false);
        }
    }
    fetchRoles();
  }, [toast]);

  const handleCreateAccount: SubmitHandler<UserFormValues> = async (data) => {
    try {
        const { confirmPassword, ...userData } = data;
        await createUser(userData);
        setShowSuccessDialog(true);
    } catch(error: any) {
        toast({
            variant: 'destructive',
            title: 'Error Creating User',
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
            <BreadcrumbPage>Add New Admin</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <form onSubmit={handleSubmit(handleCreateAccount)}>
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
                            <Label htmlFor="user-id">User ID *</Label>
                            <Input id="user-id" placeholder="e.g., user_010" {...register('id')} />
                            {errors.id && <p className="text-red-500 text-sm">{errors.id.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="full-name">Full Name *</Label>
                            <Input id="full-name" placeholder="Saman Edirimuni" {...register('full_name')} />
                            {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input id="email" type="email" placeholder="admin@grandsilverray.com" {...register('email')} />
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
                    <h2 className="text-lg font-semibold">Security & Role Assignment</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 relative">
                    <Label htmlFor="password">Password *</Label>
                    <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...register('password')}/>
                    <Button variant="ghost" size="icon" className="absolute right-1 top-7 h-8 w-8" onClick={() => setShowPassword(!showPassword)} type="button">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>
                <div className="space-y-2 relative">
                    <Label htmlFor="confirm-password">Confirm Password *</Label>
                    <Input id="confirm-password" type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••" {...register('confirmPassword')}/>
                    <Button variant="ghost" size="icon" className="absolute right-1 top-7 h-8 w-8" onClick={() => setShowConfirmPassword(!showConfirmPassword)} type="button">
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                     {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                </div>
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
                <UserPlus className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Creating...' : 'Create Account'}
            </Button>
            </div>
        </div>
      </form>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="sm:max-w-md">
             <DialogHeader className="sr-only">
                <DialogTitle>Account Created</DialogTitle>
                <DialogDescription>The new admin account has been successfully created.</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center text-center p-8 pt-0">
                  <div className="p-4 bg-blue-100 rounded-full mb-4">
                      <div className="p-2 bg-blue-200 rounded-full">
                         <CheckCircle2 className="h-8 w-8 text-blue-600" />
                      </div>
                  </div>
                  <h2 className="text-xl font-bold mb-2">Successfully Admin Account Created !</h2>
                  <p className="text-muted-foreground">The new admin account is ready to be used.</p>
                  <DialogClose asChild>
                      <Button className="mt-6 w-full" onClick={() => router.push('/user-management')}>Done</Button>
                  </DialogClose>
              </div>
          </DialogContent>
      </Dialog>
    </div>
    </>
  );
}

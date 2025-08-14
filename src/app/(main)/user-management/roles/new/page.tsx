

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Key, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { createRole } from '@/lib/services/api';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';

const roleSchema = z.object({
  id: z.string().min(1, "Role ID is required"),
  name: z.string().min(1, "Role Name is required"),
  description: z.string().optional(),
  permissions: z.string().min(1, "At least one permission is required"),
  is_active: z.boolean().default(true),
  company_id: z.string().min(1, "Company ID is required"),
});

type RoleFormValues = z.infer<typeof roleSchema>;

export default function AddNewRolePage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<RoleFormValues>({
      resolver: zodResolver(roleSchema),
      defaultValues: {
          is_active: true,
          company_id: 'company_123', // Default value
      }
  });

  const handleCreateRole: SubmitHandler<RoleFormValues> = async (data) => {
    try {
        const dataToSend = { ...data, is_active: data.is_active ? 1 : 0, created_by: 'admin_user' };
        await createRole(dataToSend);
        toast({ title: 'Success', description: 'New role created successfully.'});
        router.push('/user-management?tab=roles');
    } catch(error: any) {
        toast({
            variant: 'destructive',
            title: 'Error Creating Role',
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
             <BreadcrumbLink href="/user-management?tab=roles">Roles & Permissions</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add New Role</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <form onSubmit={handleSubmit(handleCreateRole)}>
        <div className="space-y-8 max-w-4xl mx-auto">
            <Card>
            <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <span className="p-2 bg-primary/10 rounded-full">
                        <Key className="h-5 w-5 text-primary" />
                    </span>
                    <h2 className="text-lg font-semibold">Role Information</h2>
                </div>
                
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="role-id">Role ID *</Label>
                            <Input id="role-id" placeholder="e.g., role_006" {...register('id')} />
                            {errors.id && <p className="text-red-500 text-sm">{errors.id.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role-name">Role Name *</Label>
                            <Input id="role-name" placeholder="e.g., Housekeeping Staff" {...register('name')} />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Briefly describe this role's responsibilities" {...register('description')} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="permissions">Permissions *</Label>
                        <Textarea id="permissions" placeholder="Comma-separated list, e.g., view_bookings, edit_rooms" {...register('permissions')} />
                        {errors.permissions && <p className="text-red-500 text-sm">{errors.permissions.message}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="company_id">Company ID *</Label>
                            <Input id="company_id" {...register('company_id')} />
                            {errors.company_id && <p className="text-red-500 text-sm">{errors.company_id.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Controller
                                name="is_active"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex items-center space-x-2 pt-2">
                                        <Switch id="is_active" checked={field.value} onCheckedChange={field.onChange} />
                                        <Label htmlFor="is_active" className="font-normal">{field.value ? 'Active' : 'Inactive'}</Label>
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
            <Button variant="outline" asChild type="button">
                <Link href="/user-management?tab=roles">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
                <UserPlus className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Creating...' : 'Create Role'}
            </Button>
            </div>
        </div>
      </form>
    </div>
    </>
  );
}



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
import { Key } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { getRoleById, updateRole } from '@/lib/services/api';
import { useRouter, useParams } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';

const roleSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Role Name is required"),
  description: z.string().optional(),
  permissions: z.string().min(1, "At least one permission is required"),
  is_active: z.boolean(),
  company_id: z.string().min(1, "Company ID is required"),
});

type RoleFormValues = z.infer<typeof roleSchema>;

export default function EditRolePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();
  
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<RoleFormValues>({
      resolver: zodResolver(roleSchema),
  });

  useEffect(() => {
    if (id) {
        async function fetchRole() {
            try {
                const roleData = await getRoleById(id);
                reset({
                    ...roleData,
                    is_active: roleData.is_active === 1,
                });
            } catch (error: any) {
                toast({
                    variant: 'destructive',
                    title: 'Error fetching role',
                    description: error.message,
                })
            }
        }
        fetchRole();
    }
  }, [id, reset, toast]);

  const handleUpdateRole: SubmitHandler<RoleFormValues> = async (data) => {
    try {
        const dataToSend = { ...data, is_active: data.is_active ? 1 : 0, updated_by: 'admin_user' };
        await updateRole(id, dataToSend);
        toast({ title: 'Success', description: 'Role updated successfully.'});
        router.push('/user-management?tab=roles');
    } catch(error: any) {
        toast({
            variant: 'destructive',
            title: 'Error Updating Role',
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
            <BreadcrumbPage>Edit Role</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <form onSubmit={handleSubmit(handleUpdateRole)}>
        <div className="space-y-8 max-w-4xl mx-auto">
            <Card>
            <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <span className="p-2 bg-primary/10 rounded-full">
                        <Key className="h-5 w-5 text-primary" />
                    </span>
                    <h2 className="text-lg font-semibold">Edit Role Information</h2>
                </div>
                
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="role-id">Role ID</Label>
                            <Input id="role-id" {...register('id')} readOnly />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role-name">Role Name *</Label>
                            <Input id="role-name" {...register('name')} />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" {...register('description')} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="permissions">Permissions *</Label>
                        <Textarea id="permissions" {...register('permissions')} />
                        {errors.permissions && <p className="text-red-500 text-sm">{errors.permissions.message}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
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
                {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
            </div>
        </div>
      </form>
    </div>
    </>
  );
}

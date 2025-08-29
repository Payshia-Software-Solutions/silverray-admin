

'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { getCustomerById, updateCustomer } from '@/lib/services/api';

const customerSchema = z.object({
  customer_id: z.string().min(1, 'Customer ID is required'),
  customer_type: z.enum(['individual', 'corporate', 'vip', 'group']),
  full_name: z.string().min(1, 'Full Name is required'),
  email: z.string().email('Invalid email address'),
  phone_number: z.string().min(1, 'Phone Number is required'),
  address: z.string().optional(),
  special_requests: z.string().optional(),
  account_status: z.enum(['active', 'inactive', 'suspended', 'pending']),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export default function EditCustomerPage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);
    const { toast } = useToast();
    const { register, handleSubmit, formState: { errors, isSubmitting }, control, reset } = useForm<CustomerFormValues>({
        resolver: zodResolver(customerSchema),
    });

    useEffect(() => {
        if (id) {
            async function fetchCustomer() {
                try {
                    const customer = await getCustomerById(id);
                    reset(customer);
                } catch (error: any) {
                    toast({
                        variant: 'destructive',
                        title: 'Error fetching customer',
                        description: error.message || 'An unexpected error occurred.',
                    });
                }
            }
            fetchCustomer();
        }
    }, [id, reset, toast]);

    const onSubmit: SubmitHandler<CustomerFormValues> = async (data) => {
        try {
            const dataToSend = { ...data, updated_by: 'admin_user' };
            await updateCustomer(id, dataToSend);
            toast({
                title: 'Success!',
                description: 'Customer updated successfully.',
            });
            router.push('/customers');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error updating customer',
                description: error.message || 'An unexpected error occurred.',
            });
        }
    };
    
    return (
        <>
            <Toaster />
            <div className="space-y-6 max-w-4xl mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Edit Customer</CardTitle>
                            <CardDescription>Update customer identification and contact details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="customer-id">Customer ID *</Label>
                                    <Input id="customer-id" {...register('customer_id')} />
                                    {errors.customer_id && <p className="text-red-500 text-sm">{errors.customer_id.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="customer-type">Customer Type *</Label>
                                    <Controller
                                      name="customer_type"
                                      control={control}
                                      render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger id="customer-type">
                                                <SelectValue placeholder="Select customer type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="individual">Individual</SelectItem>
                                                <SelectItem value="corporate">Corporate</SelectItem>
                                                <SelectItem value="vip">VIP</SelectItem>
                                                <SelectItem value="group">Group</SelectItem>
                                            </SelectContent>
                                        </Select>
                                      )}
                                    />
                                    {errors.customer_type && <p className="text-red-500 text-sm">{errors.customer_type.message}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="full-name">Full Name *</Label>
                                <Input id="full-name" {...register('full_name')} />
                                {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name.message}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input id="email" type="email" {...register('email')} />
                                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <Input id="phone" type="tel" {...register('phone_number')} />
                                    {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number.message}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea id="address" {...register('address')} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="special-requests">Special Requests / Notes</Label>
                                <Textarea id="special-requests" {...register('special_requests')} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Account Status</CardTitle>
                            <CardDescription>Manage the customer's account status.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="space-y-2">
                                <Label htmlFor="account-status">Status</Label>
                                <Controller
                                  name="account_status"
                                  control={control}
                                  render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger id="account-status">
                                            <SelectValue placeholder="Select account status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                            <SelectItem value="suspended">Suspended</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                  )}
                                />
                                {errors.account_status && <p className="text-red-500 text-sm">{errors.account_status.message}</p>}
                            </div>
                        </CardContent>
                    </Card>
                    
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" asChild type="button">
                            <Link href="/customers">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

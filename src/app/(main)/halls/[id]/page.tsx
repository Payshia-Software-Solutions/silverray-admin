
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { getHallById, updateHall, type HallFromApi } from '@/lib/services/api';
import { useParams, useRouter } from 'next/navigation';

const hallSchema = z.object({
    hall_name: z.string().min(1, 'Hall Name is required'),
    description: z.string().min(1, 'Description is required'),
    is_active: z.boolean().default(true),
    updated_by: z.string().min(1, 'Updated By is required'),
});

type HallFormValues = z.infer<typeof hallSchema>;

export default function EditHallPage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params?.id);
    const { toast } = useToast();
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, control } = useForm<HallFormValues>({
        resolver: zodResolver(hallSchema),
        defaultValues: {
            updated_by: 'admin'
        }
    });

    useEffect(() => {
        if (id) {
            async function fetchHall() {
                try {
                    const hall = await getHallById(id);
                    reset({
                        ...hall,
                        is_active: hall.is_active === 1,
                    });
                } catch (error: any) {
                    toast({
                        variant: 'destructive',
                        title: 'Error fetching hall',
                        description: error.message || 'An unexpected error occurred.',
                    });
                }
            }
            fetchHall();
        }
    }, [id, reset, toast]);

    const onSubmit: SubmitHandler<HallFormValues> = async (data) => {
        try {
            const dataToSubmit = { 
                ...data, 
                updated_by: 'admin',
                is_active: data.is_active ? 1 : 0,
            };
            await updateHall(id, dataToSubmit as any);
            toast({
                title: 'Success!',
                description: 'Hall updated successfully.',
            });
            router.push('/halls');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error updating hall',
                description: error.message || 'An unexpected error occurred.',
            });
        }
    };
    
    return (
        <>
            <Toaster />
            <div className="space-y-6 max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Hall</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="hall_name">Hall Name</Label>
                                <Input id="hall_name" {...register('hall_name')} />
                                {errors.hall_name && <p className="text-red-500 text-sm">{errors.hall_name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" {...register('description')} />
                                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                            </div>
                            <div className="flex items-center space-x-2">
                                <Controller
                                    name="is_active"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch
                                            id="is_active"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    )}
                                />
                                <Label htmlFor="is_active">Active</Label>
                            </div>
                            
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" asChild>
                                    <Link href="/halls">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

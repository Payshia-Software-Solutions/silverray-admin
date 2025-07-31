
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
import { getAmenityById, updateAmenity, type AmenityFromApi } from '@/lib/services/api';
import { useParams, useRouter } from 'next/navigation';

const amenitySchema = z.object({
    amenity_name: z.string().min(1, 'Amenity Name is required'),
    description: z.string().min(1, 'Description is required'),
    is_active: z.boolean().default(true),
    updated_by: z.string().min(1, 'Updated By is required'),
});

type AmenityFormValues = z.infer<typeof amenitySchema>;

export default function EditAmenityPage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);
    const { toast } = useToast();
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, control } = useForm<AmenityFormValues>({
        resolver: zodResolver(amenitySchema),
        defaultValues: {
            updated_by: 'admin'
        }
    });

    useEffect(() => {
        if (id) {
            async function fetchAmenity() {
                try {
                    const amenity = await getAmenityById(id);
                    reset({
                        ...amenity,
                        is_active: amenity.is_active === 1,
                    });
                } catch (error: any) {
                    toast({
                        variant: 'destructive',
                        title: 'Error fetching amenity',
                        description: error.message || 'An unexpected error occurred.',
                    });
                }
            }
            fetchAmenity();
        }
    }, [id, reset, toast]);

    const onSubmit: SubmitHandler<AmenityFormValues> = async (data) => {
        try {
            const dataToSubmit = { 
                ...data, 
                updated_by: 'admin',
                is_active: data.is_active ? 1 : 0,
            };
            await updateAmenity(id, dataToSubmit as any);
            toast({
                title: 'Success!',
                description: 'Amenity updated successfully.',
            });
            router.push('/amenities');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error updating amenity',
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
                        <CardTitle>Edit Amenity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="amenity_name">Amenity Name</Label>
                                <Input id="amenity_name" {...register('amenity_name')} />
                                {errors.amenity_name && <p className="text-red-500 text-sm">{errors.amenity_name.message}</p>}
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
                                    <Link href="/amenities">Cancel</Link>
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

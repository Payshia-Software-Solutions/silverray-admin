
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
import { getRestaurantFeatureById, updateRestaurantFeature, type RestaurantFeatureFromApi } from '@/lib/services/api';
import { useParams, useRouter } from 'next/navigation';

const featureSchema = z.object({
    feature_name: z.string().min(1, 'Feature Name is required'),
    description: z.string().min(1, 'Description is required'),
    is_active: z.boolean().default(true),
});

type FeatureFormValues = z.infer<typeof featureSchema>;

export default function EditRestaurantFeaturePage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);
    const { toast } = useToast();
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, control } = useForm<FeatureFormValues>({
        resolver: zodResolver(featureSchema),
    });

    useEffect(() => {
        if (id) {
            async function fetchFeature() {
                try {
                    const feature = await getRestaurantFeatureById(id);
                    reset({
                        ...feature,
                        is_active: feature.is_active === 1,
                    });
                } catch (error: any) {
                    toast({
                        variant: 'destructive',
                        title: 'Error fetching feature',
                        description: error.message || 'An unexpected error occurred.',
                    });
                }
            }
            fetchFeature();
        }
    }, [id, reset, toast]);

    const onSubmit: SubmitHandler<FeatureFormValues> = async (data) => {
        try {
            const dataToSubmit = { 
                ...data, 
                updated_by: 'admin',
                is_active: data.is_active ? 1 : 0,
            };
            await updateRestaurantFeature(id, dataToSubmit);
            toast({
                title: 'Success!',
                description: 'Feature updated successfully.',
            });
            router.push('/restaurant?tab=features');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error updating feature',
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
                        <CardTitle>Edit Restaurant Feature</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="feature_name">Feature Name</Label>
                                <Input id="feature_name" {...register('feature_name')} />
                                {errors.feature_name && <p className="text-red-500 text-sm">{errors.feature_name.message}</p>}
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
                                    <Link href="/restaurant?tab=features">Cancel</Link>
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


'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { createRestaurantFeature } from '@/lib/services/api';
import { useRouter } from 'next/navigation';

const featureSchema = z.object({
    feature_id: z.string().min(1, 'Feature ID is required'),
    feature_name: z.string().min(1, 'Feature Name is required'),
    description: z.string().min(1, 'Description is required'),
    is_active: z.boolean().default(true),
    company_id: z.string().min(1, 'Company ID is required'),
    created_by: z.string().min(1, 'Created By is required'),
});

type FeatureFormValues = z.infer<typeof featureSchema>;

export default function NewRestaurantFeaturePage() {
    const router = useRouter();
    const { toast } = useToast();
    const { register, handleSubmit, formState: { errors, isSubmitting }, control } = useForm<FeatureFormValues>({
        resolver: zodResolver(featureSchema),
        defaultValues: {
            company_id: '1',
            created_by: 'admin',
            is_active: true,
        }
    });

    const onSubmit: SubmitHandler<FeatureFormValues> = async (data) => {
        const dataToSend = {
            ...data,
            is_active: data.is_active ? 1 : 0,
        };

        try {
            await createRestaurantFeature(dataToSend as any);
            toast({
                title: 'Success!',
                description: 'New feature created successfully.',
            });
            router.push('/restaurant/features');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error creating feature',
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
                        <CardTitle>Create New Restaurant Feature</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="feature_id">Feature ID</Label>
                                <Input id="feature_id" {...register('feature_id')} />
                                {errors.feature_id && <p className="text-red-500 text-sm">{errors.feature_id.message}</p>}
                            </div>
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
                                <Switch id="is_active" {...register('is_active')} defaultChecked={true} />
                                <Label htmlFor="is_active">Active</Label>
                            </div>
                            
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" asChild>
                                    <Link href="/restaurant/features">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Creating...' : 'Create Feature'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}


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
import { createAmenity } from '@/lib/services/api';
import { useRouter } from 'next/navigation';

const amenitySchema = z.object({
    amenities_id: z.coerce.number().min(1, 'Amenity ID is required'),
    amenity_name: z.string().min(1, 'Amenity Name is required'),
    description: z.string().min(1, 'Description is required'),
    is_active: z.boolean().default(true),
    company_id: z.string().min(1, 'Company ID is required'),
    created_by: z.string().min(1, 'Created By is required'),
});

type AmenityFormValues = z.infer<typeof amenitySchema>;

export default function NewAmenityPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { register, handleSubmit, formState: { errors, isSubmitting }, control } = useForm<AmenityFormValues>({
        resolver: zodResolver(amenitySchema),
        defaultValues: {
            company_id: 'C001',
            created_by: 'admin',
            is_active: true,
        }
    });

    const onSubmit: SubmitHandler<AmenityFormValues> = async (data) => {
        const dataToSend = {
            ...data,
            is_active: data.is_active ? 1 : 0,
        };

        try {
            await createAmenity(dataToSend as any);
            toast({
                title: 'Success!',
                description: 'New amenity created successfully.',
            });
            router.push('/amenities');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error creating amenity',
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
                        <CardTitle>Create New Amenity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="amenities_id">Amenity ID</Label>
                                <Input id="amenities_id" type="number" {...register('amenities_id')} />
                                {errors.amenities_id && <p className="text-red-500 text-sm">{errors.amenities_id.message}</p>}
                            </div>
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
                                <Switch id="is_active" {...register('is_active')} defaultChecked={true} />
                                <Label htmlFor="is_active">Active</Label>
                            </div>
                            
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" asChild>
                                    <Link href="/amenities">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Creating...' : 'Create Amenity'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

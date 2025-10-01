
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { createPackageInclusion } from '@/lib/services/api';
import { useRouter } from 'next/navigation';

const inclusionSchema = z.object({
    inclusion_id: z.string().min(1, 'Inclusion ID is required'),
    inclusion_type: z.string().min(1, 'Inclusion Type is required'),
    description: z.string().min(1, 'Description is required'),
});

type InclusionFormValues = z.infer<typeof inclusionSchema>;

export default function NewInclusionPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<InclusionFormValues>({
        resolver: zodResolver(inclusionSchema),
    });

    const onSubmit: SubmitHandler<InclusionFormValues> = async (data) => {
        const dataToSend = {
            ...data,
            company_id: '1', // This should be dynamic in a real app
            created_by: 'admin_user',
            updated_by: 'admin_user',
        };

        try {
            await createPackageInclusion(dataToSend);
            toast({
                title: 'Success!',
                description: 'New inclusion created successfully.',
            });
            router.push('/weddingpackages/new');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error creating inclusion',
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
                        <CardTitle>Create New Package Inclusion</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="inclusion_id">Inclusion ID</Label>
                                <Input id="inclusion_id" {...register('inclusion_id')} />
                                {errors.inclusion_id && <p className="text-red-500 text-sm">{errors.inclusion_id.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="inclusion_type">Inclusion Type</Label>
                                <Input id="inclusion_type" {...register('inclusion_type')} />
                                {errors.inclusion_type && <p className="text-red-500 text-sm">{errors.inclusion_type.message}</p>}
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" {...register('description')} />
                                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                            </div>
                            
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" asChild>
                                    <Link href="/package-inclusions">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Creating...' : 'Create Inclusion'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

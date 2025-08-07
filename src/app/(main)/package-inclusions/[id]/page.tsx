
'use client';

import { useState, useEffect } from 'react';
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
import { getPackageInclusions, updatePackageInclusion, type PackageInclusionFromApi } from '@/lib/services/api';
import { useParams, useRouter } from 'next/navigation';

const inclusionSchema = z.object({
    inclusion_type: z.string().min(1, 'Inclusion Type is required'),
    description: z.string().min(1, 'Description is required'),
});

type InclusionFormValues = z.infer<typeof inclusionSchema>;

export default function EditInclusionPage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params?.id);
    const { toast } = useToast();
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<InclusionFormValues>({
        resolver: zodResolver(inclusionSchema),
    });

    useEffect(() => {
        if (id) {
            async function fetchInclusion() {
                try {
                    const inclusion = await getPackageInclusions().then(inclusions => inclusions.find(i => i.id === id));
                    if(inclusion) {
                       reset(inclusion);
                    } else {
                        throw new Error('Inclusion not found');
                    }
                } catch (error: any) {
                    toast({
                        variant: 'destructive',
                        title: 'Error fetching inclusion',
                        description: error.message || 'An unexpected error occurred.',
                    });
                }
            }
            fetchInclusion();
        }
    }, [id, reset, toast]);

    const onSubmit: SubmitHandler<InclusionFormValues> = async (data) => {
        try {
             const dataToSubmit = {
                ...data,
                company_id: 'comm4',
                updated_by: 'admin_user',
            };
            await updatePackageInclusion(id, dataToSubmit);
            toast({
                title: 'Success!',
                description: 'Inclusion updated successfully.',
            });
            router.push('/package-inclusions');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error updating inclusion',
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
                        <CardTitle>Edit Package Inclusion</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

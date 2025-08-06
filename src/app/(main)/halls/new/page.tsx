
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
import { createHall } from '@/lib/services/api';
import { useRouter } from 'next/navigation';

const hallSchema = z.object({
    hall_id: z.string().min(1, 'Hall ID is required'),
    hall_name: z.string().min(1, 'Hall Name is required'),
    description: z.string().min(1, 'Description is required'),
    is_active: z.boolean().default(true),
    created_by: z.string().min(1, 'Created By is required'),
});

type HallFormValues = z.infer<typeof hallSchema>;

export default function NewHallPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<HallFormValues>({
        resolver: zodResolver(hallSchema),
        defaultValues: {
            created_by: 'admin',
            is_active: true,
        }
    });

    const onSubmit: SubmitHandler<HallFormValues> = async (data) => {
        const dataToSend = {
            ...data,
            is_active: data.is_active ? 1 : 0,
        };

        try {
            await createHall(dataToSend as any);
            toast({
                title: 'Success!',
                description: 'New hall created successfully.',
            });
            router.push('/halls');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error creating hall',
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
                        <CardTitle>Create New Hall</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="hall_id">Hall ID</Label>
                                <Input id="hall_id" {...register('hall_id')} />
                                {errors.hall_id && <p className="text-red-500 text-sm">{errors.hall_id.message}</p>}
                            </div>
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
                                <Switch id="is_active" {...register('is_active')} defaultChecked={true} />
                                <Label htmlFor="is_active">Active</Label>
                            </div>
                            
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" asChild>
                                    <Link href="/halls">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Creating...' : 'Create Hall'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

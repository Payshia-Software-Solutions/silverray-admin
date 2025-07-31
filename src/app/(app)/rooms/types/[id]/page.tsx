
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { getRoomTypeById, updateRoomType, type RoomTypeFromApi } from '@/lib/services/api';
import { useParams, useRouter } from 'next/navigation';

const roomTypeSchema = z.object({
    room_type_id: z.string().min(1, 'Room Type ID is required'),
    type_name: z.string().min(1, 'Type Name is required'),
    company_id: z.string().min(1, 'Company ID is required'),
    updated_by: z.string().min(1, 'Updated By is required'),
});

type RoomTypeFormValues = z.infer<typeof roomTypeSchema>;

export default function EditRoomTypePage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);
    const { toast } = useToast();
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<RoomTypeFormValues>({
        resolver: zodResolver(roomTypeSchema),
        defaultValues: {
            updated_by: 'admin'
        }
    });

    useEffect(() => {
        if (id) {
            async function fetchRoomType() {
                try {
                    const roomType = await getRoomTypeById(id);
                    reset(roomType);
                } catch (error: any) {
                    toast({
                        variant: 'destructive',
                        title: 'Error fetching room type',
                        description: error.message || 'An unexpected error occurred.',
                    });
                }
            }
            fetchRoomType();
        }
    }, [id, reset, toast]);

    const onSubmit: SubmitHandler<RoomTypeFormValues> = async (data) => {
        try {
            await updateRoomType(id, data);
            toast({
                title: 'Success!',
                description: 'Room type updated successfully.',
            });
            router.push('/rooms?tab=room-types');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error updating room type',
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
                        <CardTitle>Edit Room Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="room_type_id">Room Type ID</Label>
                                <Input id="room_type_id" {...register('room_type_id')} />
                                {errors.room_type_id && <p className="text-red-500 text-sm">{errors.room_type_id.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type_name">Type Name</Label>
                                <Input id="type_name" {...register('type_name')} />
                                {errors.type_name && <p className="text-red-500 text-sm">{errors.type_name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company_id">Company ID</Label>
                                <Input id="company_id" {...register('company_id')} readOnly />
                                {errors.company_id && <p className="text-red-500 text-sm">{errors.company_id.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="updated_by">Updated By</Label>
                                <Input id="updated_by" {...register('updated_by')} />
                                {errors.updated_by && <p className="text-red-500 text-sm">{errors.updated_by.message}</p>}
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" asChild>
                                    <Link href="/rooms?tab=room-types">Cancel</Link>
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

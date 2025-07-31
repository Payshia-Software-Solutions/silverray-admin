
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
});

type RoomTypeFormValues = z.infer<typeof roomTypeSchema>;

export default function EditRoomTypePage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);
    const { toast } = useToast();
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<RoomTypeFormValues>({
        resolver: zodResolver(roomTypeSchema),
    });

    useEffect(() => {
        if (id) {
            async function fetchRoomType() {
                try {
                    const roomType = await getRoomTypeById(id);
                    // Reset the form with fetched data
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
    }, [id, reset, toast, setValue]);

    const onSubmit: SubmitHandler<RoomTypeFormValues> = async (data) => {
        try {
            // Ensure updated_by and company_id are set
            const dataToSubmit = { 
                ...data, 
                updated_by: 'admin',
                company_id: 'C001'
            };
            await updateRoomType(id, dataToSubmit);
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

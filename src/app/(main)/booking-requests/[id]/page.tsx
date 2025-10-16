
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { getBookingRequestById, updateBookingRequest, getRoomTypes, type RoomTypeFromApi } from '@/lib/services/api';
import { useParams, useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const requestSchema = z.object({
    room_type: z.string().min(1, 'Room type is required'),
    num_guests: z.coerce.number().min(1, 'Number of guests is required'),
    check_in_date: z.date({ required_error: "Check-in date is required." }),
    check_out_date: z.date({ required_error: "Check-out date is required." }),
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email'),
    phone_number: z.string().min(1, 'Phone number is required'),
    special_requests: z.string().optional(),
    total_price: z.coerce.number().min(0),
    booking_status: z.enum(['Pending', 'Confirmed', 'Cancelled']),
});

type RequestFormValues = z.infer<typeof requestSchema>;

export default function EditBookingRequestPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const { toast } = useToast();
    const [roomTypes, setRoomTypes] = useState<RoomTypeFromApi[]>([]);

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, control } = useForm<RequestFormValues>({
        resolver: zodResolver(requestSchema),
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const [requestData, roomTypeData] = await Promise.all([
                    getBookingRequestById(id),
                    getRoomTypes()
                ]);
                setRoomTypes(roomTypeData);
                reset({
                    ...requestData,
                    check_in_date: new Date(requestData.check_in_date),
                    check_out_date: new Date(requestData.check_out_date),
                    total_price: parseFloat(requestData.total_price),
                    num_guests: parseInt(requestData.num_guests, 10),
                });
            } catch (error: any) {
                toast({
                    variant: 'destructive',
                    title: 'Error fetching data',
                    description: error.message || 'An unexpected error occurred.',
                });
            }
        }
        if(id) fetchData();
    }, [id, reset, toast]);

    const onSubmit: SubmitHandler<RequestFormValues> = async (data) => {
        try {
            const dataToSubmit = {
                ...data,
                check_in_date: format(data.check_in_date, 'yyyy-MM-dd'),
                check_out_date: format(data.check_out_date, 'yyyy-MM-dd'),
            };
            await updateBookingRequest(id, dataToSubmit as any);
            toast({
                title: 'Success!',
                description: 'Booking request updated successfully.',
            });
            router.push('/booking-requests');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error updating request',
                description: error.message || 'An unexpected error occurred.',
            });
        }
    };
    
    return (
        <>
            <Toaster />
            <div className="space-y-6 max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Booking Request</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">First Name</Label>
                                    <Input id="first_name" {...register('first_name')} />
                                    {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last_name">Last Name</Label>
                                    <Input id="last_name" {...register('last_name')} />
                                    {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" {...register('email')} />
                                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone_number">Phone Number</Label>
                                    <Input id="phone_number" {...register('phone_number')} />
                                    {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="room_type">Room Type</Label>
                                    <Controller name="room_type" control={control} render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select Room Type" /></SelectTrigger>
                                            <SelectContent>{roomTypes.map(rt => <SelectItem key={rt.id} value={rt.type_name}>{rt.type_name}</SelectItem>)}</SelectContent>
                                        </Select>
                                    )} />
                                    {errors.room_type && <p className="text-red-500 text-sm">{errors.room_type.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="num_guests">Number of Guests</Label>
                                    <Input id="num_guests" type="number" {...register('num_guests')} />
                                    {errors.num_guests && <p className="text-red-500 text-sm">{errors.num_guests.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="check_in_date">Check-in Date</Label>
                                    <Controller name="check_in_date" control={control} render={({ field }) => (
                                        <Popover><PopoverTrigger asChild>
                                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                                <CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>
                                    )} />
                                    {errors.check_in_date && <p className="text-red-500 text-sm">{errors.check_in_date.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="check_out_date">Check-out Date</Label>
                                    <Controller name="check_out_date" control={control} render={({ field }) => (
                                        <Popover><PopoverTrigger asChild>
                                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                                <CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>
                                    )} />
                                    {errors.check_out_date && <p className="text-red-500 text-sm">{errors.check_out_date.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="total_price">Total Price</Label>
                                    <Input id="total_price" type="number" step="0.01" {...register('total_price')} />
                                    {errors.total_price && <p className="text-red-500 text-sm">{errors.total_price.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="booking_status">Booking Status</Label>
                                    <Controller name="booking_status" control={control} render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Confirmed">Confirmed</SelectItem><SelectItem value="Cancelled">Cancelled</SelectItem></SelectContent></Select>
                                    )} />
                                    {errors.booking_status && <p className="text-red-500 text-sm">{errors.booking_status.message}</p>}
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="special_requests">Special Requests</Label>
                                    <Textarea id="special_requests" {...register('special_requests')} />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" asChild>
                                    <Link href="/booking-requests">Cancel</Link>
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

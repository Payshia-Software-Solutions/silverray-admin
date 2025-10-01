
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { createBooking, getCustomers, getRoomTypes, getRooms, CustomerFromApi, RoomTypeFromApi, RoomFromApi } from '@/lib/services/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const bookingSchema = z.object({
    booking_id: z.string().min(1, 'Booking ID is required'),
    room_type_id: z.string().min(1, 'Room type is required'),
    customer_id: z.string().min(1, 'Customer is required'),
    room_number: z.string().min(1, 'Room number is required'),
    check_in_date: z.date({ required_error: "Check-in date is required." }),
    check_out_date: z.date({ required_error: "Check-out date is required." }),
    adults: z.coerce.number().min(1, 'At least one adult is required'),
    children: z.coerce.number().min(0),
    total_amount: z.coerce.number().min(0),
    amount_paid: z.coerce.number().min(0),
    payment_status: z.enum(['Paid', 'Pending', 'Due']),
    payment_method: z.enum(['Credit Card', 'Cash', 'Bank Transfer', 'Online']),
    booking_status: z.enum(['Confirmed', 'Pending', 'CheckedIn', 'CheckedOut', 'Cancelled']),
    booking_source: z.enum(['Online', 'Phone', 'Walk-in']),
    discount_code: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function NewBookingPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [customers, setCustomers] = useState<CustomerFromApi[]>([]);
    const [roomTypes, setRoomTypes] = useState<RoomTypeFromApi[]>([]);
    const [rooms, setRooms] = useState<RoomFromApi[]>([]);

    const { register, handleSubmit, formState: { errors, isSubmitting }, control } = useForm<BookingFormValues>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            adults: 1,
            children: 0,
            payment_status: 'Pending',
            booking_status: 'Pending',
            booking_source: 'Online',
            payment_method: 'Credit Card',
        }
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const [customerData, roomTypeData, roomData] = await Promise.all([
                    getCustomers(),
                    getRoomTypes(),
                    getRooms()
                ]);
                setCustomers(customerData);
                setRoomTypes(roomTypeData);
                setRooms(roomData);
            } catch (error) {
                toast({ variant: 'destructive', title: 'Error fetching data', description: 'Could not load necessary data for the form.' });
            }
        }
        fetchData();
    }, [toast]);

    const onSubmit: SubmitHandler<BookingFormValues> = async (data) => {
        const dataToSend = {
            ...data,
            check_in_date: format(data.check_in_date, 'yyyy-MM-dd'),
            check_out_date: format(data.check_out_date, 'yyyy-MM-dd'),
            company_id: '1',
            balance_due: (data.total_amount - data.amount_paid).toFixed(2),
            // This would likely be calculated based on dates
            numbers_of_night: 1,
        };

        try {
            await createBooking(dataToSend);
            toast({
                title: 'Success!',
                description: 'New booking created successfully.',
            });
            router.push('/bookings');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error creating booking',
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
                        <CardTitle>Create New Booking</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="booking_id">Booking ID</Label>
                                    <Input id="booking_id" {...register('booking_id')} />
                                    {errors.booking_id && <p className="text-red-500 text-sm">{errors.booking_id.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="customer_id">Customer</Label>
                                    <Controller name="customer_id" control={control} render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select Customer" /></SelectTrigger>
                                            <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.customer_id}>{c.full_name}</SelectItem>)}</SelectContent>
                                        </Select>
                                    )} />
                                    {errors.customer_id && <p className="text-red-500 text-sm">{errors.customer_id.message}</p>}
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="room_type_id">Room Type</Label>
                                    <Controller name="room_type_id" control={control} render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select Room Type" /></SelectTrigger>
                                            <SelectContent>{roomTypes.map(rt => <SelectItem key={rt.id} value={rt.room_type_id}>{rt.type_name}</SelectItem>)}</SelectContent>
                                        </Select>
                                    )} />
                                    {errors.room_type_id && <p className="text-red-500 text-sm">{errors.room_type_id.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="room_number">Room Number</Label>
                                    <Controller name="room_number" control={control} render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select Room" /></SelectTrigger>
                                            <SelectContent>{rooms.map(r => <SelectItem key={r.id} value={r.room_number}>{r.room_number} ({r.descriptive_title})</SelectItem>)}</SelectContent>
                                        </Select>
                                    )} />
                                    {errors.room_number && <p className="text-red-500 text-sm">{errors.room_number.message}</p>}
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
                                    <Label htmlFor="adults">Adults</Label>
                                    <Input id="adults" type="number" {...register('adults')} />
                                    {errors.adults && <p className="text-red-500 text-sm">{errors.adults.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="children">Children</Label>
                                    <Input id="children" type="number" {...register('children')} />
                                    {errors.children && <p className="text-red-500 text-sm">{errors.children.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="total_amount">Total Amount</Label>
                                    <Input id="total_amount" type="number" step="0.01" {...register('total_amount')} />
                                    {errors.total_amount && <p className="text-red-500 text-sm">{errors.total_amount.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="amount_paid">Amount Paid</Label>
                                    <Input id="amount_paid" type="number" step="0.01" {...register('amount_paid')} />
                                    {errors.amount_paid && <p className="text-red-500 text-sm">{errors.amount_paid.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="payment_status">Payment Status</Label>
                                    <Controller name="payment_status" control={control} render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Paid">Paid</SelectItem><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Due">Due</SelectItem></SelectContent></Select>
                                    )} />
                                    {errors.payment_status && <p className="text-red-500 text-sm">{errors.payment_status.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="payment_method">Payment Method</Label>
                                    <Controller name="payment_method" control={control} render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Credit Card">Credit Card</SelectItem><SelectItem value="Cash">Cash</SelectItem><SelectItem value="Bank Transfer">Bank Transfer</SelectItem><SelectItem value="Online">Online</SelectItem></SelectContent></Select>
                                    )} />
                                    {errors.payment_method && <p className="text-red-500 text-sm">{errors.payment_method.message}</p>}
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="booking_status">Booking Status</Label>
                                    <Controller name="booking_status" control={control} render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Confirmed">Confirmed</SelectItem><SelectItem value="Pending">Pending</SelectItem><SelectItem value="CheckedIn">CheckedIn</SelectItem><SelectItem value="CheckedOut">CheckedOut</SelectItem><SelectItem value="Cancelled">Cancelled</SelectItem></SelectContent></Select>
                                    )} />
                                    {errors.booking_status && <p className="text-red-500 text-sm">{errors.booking_status.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="booking_source">Booking Source</Label>
                                    <Controller name="booking_source" control={control} render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Online">Online</SelectItem><SelectItem value="Phone">Phone</SelectItem><SelectItem value="Walk-in">Walk-in</SelectItem></SelectContent></Select>
                                    )} />
                                    {errors.booking_source && <p className="text-red-500 text-sm">{errors.booking_source.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="discount_code">Discount Code</Label>
                                    <Input id="discount_code" {...register('discount_code')} />
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" asChild>
                                    <Link href="/bookings">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Creating...' : 'Create Booking'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

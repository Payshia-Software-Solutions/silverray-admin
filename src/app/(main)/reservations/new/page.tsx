
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Calendar as CalendarIcon, User, BedDouble, Wallet, Info, Minus, Plus, CheckCircle, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';
import Link from 'next/link';
import { getCustomers, getRoomTypes, getRooms, createBooking, type CustomerFromApi, type RoomTypeFromApi, type RoomFromApi } from '@/lib/services/api';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useRouter } from 'next/navigation';

const reservationSchema = z.object({
  booking_id: z.string().min(1, 'Booking ID is required'),
  customer_id: z.string().min(1, 'Customer is required'),
  room_type_id: z.string().min(1, 'Room type is required'),
  room_number: z.string().min(1, 'Room number is required'),
  check_in_date: z.date({ required_error: "Check-in date is required." }),
  check_out_date: z.date({ required_error: "Check-out date is required." }),
  adults: z.coerce.number().min(1, 'At least one adult is required'),
  children: z.coerce.number().min(0, 'Children cannot be negative'),
  numbers_of_night: z.coerce.number().min(0),
  total_amount: z.coerce.number().min(0, 'Total amount is required'),
  amount_paid: z.coerce.number().min(0, 'Amount paid is required'),
  payment_status: z.enum(['Paid', 'Pending', 'Due']),
  payment_method: z.enum(['Credit Card', 'Cash', 'Bank Transfer', 'Online']),
  booking_status: z.enum(['Confirmed', 'Pending', 'Cancelled']),
  booking_source: z.enum(['Online', 'Phone Call', 'Walk-in']),
  discount_code: z.string().optional().nullable(),
});

type ReservationFormValues = z.infer<typeof reservationSchema>;


export default function NewBookingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [customers, setCustomers] = useState<CustomerFromApi[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [roomTypes, setRoomTypes] = useState<RoomTypeFromApi[]>([]);
  const [loadingRoomTypes, setLoadingRoomTypes] = useState(true);
  const [rooms, setRooms] = useState<RoomFromApi[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  const { register, handleSubmit, control, formState: { errors, isSubmitting }, watch, setValue } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
        adults: 2,
        children: 0,
        payment_status: 'Pending',
        booking_status: 'Pending',
        booking_source: 'Online',
        payment_method: 'Credit Card',
        amount_paid: 0,
        numbers_of_night: 0,
    }
  });

  const checkInDate = watch('check_in_date');
  const checkOutDate = watch('check_out_date');
  const totalAmount = watch('total_amount');
  const amountPaid = watch('amount_paid');
  const customerId = watch('customer_id');
  
  const balanceDue = (totalAmount || 0) - (amountPaid || 0);
  
  useEffect(() => {
    if (checkInDate && checkOutDate) {
        const nights = differenceInDays(checkOutDate, checkInDate);
        setValue('numbers_of_night', nights > 0 ? nights : 0);
    }
  }, [checkInDate, checkOutDate, setValue]);

  const nights = watch('numbers_of_night');

  useEffect(() => {
    if (customerId) {
      if (customerId.toUpperCase().includes('CUST')) {
        setValue('booking_source', 'Online');
      } else {
        setValue('booking_source', 'Phone Call');
      }
    }
  }, [customerId, setValue]);


  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoadingCustomers(true);
        setLoadingRoomTypes(true);
        setLoadingRooms(true);
        const [customersData, roomTypesData, roomsData] = await Promise.all([
          getCustomers(),
          getRoomTypes(),
          getRooms(),
        ]);
        setCustomers(customersData);
        setRoomTypes(roomTypesData);
        setRooms(roomsData);
      } catch (err: any) {
        toast({ variant: 'destructive', title: "Error", description: "Could not load required data." });
      } finally {
        setLoadingCustomers(false);
        setLoadingRoomTypes(false);
        setLoadingRooms(false);
      }
    }
    fetchInitialData();
  }, [toast]);

  const handleCreateBooking: SubmitHandler<ReservationFormValues> = async (data) => {
    const dataToSend = {
        ...data,
        check_in_date: format(data.check_in_date, 'yyyy-MM-dd'),
        check_out_date: format(data.check_out_date, 'yyyy-MM-dd'),
        balance_due: balanceDue.toFixed(2),
        company_id: 'COMP001', // Example company_id
    };

    try {
        await createBooking(dataToSend);
        setShowSuccessDialog(true);
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Error creating booking',
            description: error.message || 'An unexpected error occurred.',
        });
    }
  };

  return (
    <div className="space-y-6">
      <Toaster />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/reservations">Booking Management</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add New Booking</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <Card>
        <CardContent className="p-6">
            <form onSubmit={handleSubmit(handleCreateBooking)}>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Create New Booking</h1>
                    <p className="text-muted-foreground">Fill in the details to create a new room or suite booking</p>
                </div>
                 <Link href="/reservations">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <X className="h-5 w-5"/>
                    </Button>
                 </Link>
            </div>

            <div className="space-y-8">
                {/* Customer Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2"><User className="h-5 w-5 text-primary"/> Customer Information</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                             <Label htmlFor="booking_id">Booking ID *</Label>
                             <Input id="booking_id" {...register('booking_id')} />
                             {errors.booking_id && <p className="text-sm text-red-500">{errors.booking_id.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="customer_id">Full Name *</Label>
                             <Controller
                                name="customer_id"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value} disabled={loadingCustomers}>
                                        <SelectTrigger id="customer_id">
                                            <SelectValue placeholder={loadingCustomers ? "Loading customers..." : "Select a customer"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {customers.map((customer) => (
                                            <SelectItem key={customer.customer_id} value={customer.customer_id}>
                                                {customer.full_name} ({customer.customer_id})
                                            </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                             />
                             {errors.customer_id && <p className="text-sm text-red-500">{errors.customer_id.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Room & Stay Details */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2"><BedDouble className="h-5 w-5 text-primary"/> Room & Stay Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         <div className="space-y-2">
                            <Label htmlFor="room_type_id">Room Type *</Label>
                            <Controller
                                name="room_type_id"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value} disabled={loadingRoomTypes}>
                                        <SelectTrigger id="room-type">
                                        <SelectValue placeholder={loadingRoomTypes ? "Loading types..." : "Select Room Type"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roomTypes.map((type) => (
                                            <SelectItem key={type.room_type_id} value={type.room_type_id}>
                                                {type.type_name}
                                            </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.room_type_id && <p className="text-sm text-red-500">{errors.room_type_id.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="room_number">Specific Room Number *</Label>
                             <Controller
                                name="room_number"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value} disabled={loadingRooms}>
                                        <SelectTrigger id="room-number"><SelectValue placeholder={loadingRooms ? "Loading rooms..." : "Select Room Number"} /></SelectTrigger>
                                        <SelectContent>
                                            {rooms.map((room) => (
                                            <SelectItem key={room.id} value={room.room_number}>
                                                Room {room.room_number}
                                            </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.room_number && <p className="text-sm text-red-500">{errors.room_number.message}</p>}
                        </div>
                        <div />
                         <div className="space-y-2">
                            <Label htmlFor="checkin-date">Check-in Date *</Label>
                             <Controller
                                name="check_in_date"
                                control={control}
                                render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value ? format(field.value, 'PPP') : <span>mm/dd/yyyy</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                                    </Popover>
                                )}
                            />
                             {errors.check_in_date && <p className="text-sm text-red-500">{errors.check_in_date.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="checkout-date">Check-out Date *</Label>
                            <Controller
                                name="check_out_date"
                                control={control}
                                render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value ? format(field.value, 'PPP') : <span>mm/dd/yyyy</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                                    </Popover>
                                )}
                            />
                            {errors.check_out_date && <p className="text-sm text-red-500">{errors.check_out_date.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="nights">Number of Nights</Label>
                            <Input id="nights" type="number" {...register('numbers_of_night')} readOnly />
                             {errors.numbers_of_night && <p className="text-sm text-red-500">{errors.numbers_of_night.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="adults">Adults *</Label>
                            <div className="flex items-center space-x-2">
                                <Button type="button" variant="outline" size="icon" className="h-9 w-9"><Minus className="h-4 w-4" /></Button>
                                <Input id="adults" type="number" {...register('adults')} className="w-16 text-center" />
                                <Button type="button" variant="outline" size="icon" className="h-9 w-9"><Plus className="h-4 w-4" /></Button>
                            </div>
                            {errors.adults && <p className="text-sm text-red-500">{errors.adults.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="children">Children</Label>
                            <div className="flex items-center space-x-2">
                                <Button type="button" variant="outline" size="icon" className="h-9 w-9"><Minus className="h-4 w-4" /></Button>
                                <Input id="children" type="number" {...register('children')} className="w-16 text-center" />
                                <Button type="button" variant="outline" size="icon" className="h-9 w-9"><Plus className="h-4 w-4" /></Button>
                            </div>
                             {errors.children && <p className="text-sm text-red-500">{errors.children.message}</p>}
                        </div>
                    </div>
                     <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">5 rooms available for selected dates</span>
                    </div>
                </div>

                 {/* Pricing & Payment */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2"><Wallet className="h-5 w-5 text-primary"/> Pricing & Payment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="total_amount">Total Price *</Label>
                            <Input id="total_amount" type="number" placeholder="0.00" {...register('total_amount')} />
                            {errors.total_amount && <p className="text-sm text-red-500">{errors.total_amount.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="discount_code">Discount Code</Label>
                            <Input id="discount_code" placeholder="Enter discount code" {...register('discount_code')} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="payment_status">Payment Status *</Label>
                             <Controller
                                name="payment_status"
                                control={control}
                                render={({ field }) => (
                                     <Select onValueChange={field.onChange} value={field.value}><SelectTrigger id="payment-status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Paid">Paid</SelectItem><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Due">Due</SelectItem></SelectContent></Select>
                                )}
                             />
                             {errors.payment_status && <p className="text-sm text-red-500">{errors.payment_status.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="amount_paid">Amount Paid *</Label>
                            <Input id="amount_paid" type="number" placeholder="0.00" {...register('amount_paid')} />
                             {errors.amount_paid && <p className="text-sm text-red-500">{errors.amount_paid.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="payment_method">Payment Method *</Label>
                            <Controller
                                name="payment_method"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}><SelectTrigger id="payment-method"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Credit Card">Credit Card</SelectItem><SelectItem value="Cash">Cash</SelectItem><SelectItem value="Bank Transfer">Bank Transfer</SelectItem><SelectItem value="Online">Online</SelectItem></SelectContent></Select>
                                )}
                             />
                             {errors.payment_method && <p className="text-sm text-red-500">{errors.payment_method.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label>Balance Due</Label>
                            <div className="p-2 rounded-md bg-yellow-50 border border-yellow-200 font-semibold text-yellow-800">
                                LKR {balanceDue.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>

                 {/* Booking Status & Source */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2"><Info className="h-5 w-5 text-primary"/> Booking Status & Source</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <Label htmlFor="booking-status">Initial Booking Status *</Label>
                             <Controller
                                name="booking_status"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}><SelectTrigger id="booking-status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Confirmed">Confirmed</SelectItem><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Cancelled">Cancelled</SelectItem></SelectContent></Select>
                                )}
                            />
                            {errors.booking_status && <p className="text-sm text-red-500">{errors.booking_status.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="booking-source">Booking Source *</Label>
                             <Controller
                                name="booking_source"
                                control={control}
                                render={({ field }) => (
                                     <Select onValueChange={field.onChange} value={field.value}><SelectTrigger id="booking-source"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Online">Online</SelectItem><SelectItem value="Phone Call">Phone Call</SelectItem><SelectItem value="Walk-in">Walk-in</SelectItem></SelectContent></Select>
                                )}
                            />
                             {errors.booking_source && <p className="text-sm text-red-500">{errors.booking_source.message}</p>}
                        </div>
                    </div>
                </div>
                
                 <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" asChild><Link href="/reservations">Cancel</Link></Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating...' : '+ Create Booking'}
                    </Button>
                </div>
            </div>
            </form>
        </CardContent>
      </Card>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="sm:max-w-md">
              <DialogHeader className="sr-only">
                  <DialogTitle>Success</DialogTitle>
                  <DialogDescription>A new booking has been successfully created.</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center text-center p-8">
                  <div className="p-4 bg-blue-100 rounded-full mb-4">
                      <div className="p-2 bg-blue-200 rounded-full">
                         <CheckCircle2 className="h-8 w-8 text-blue-600" />
                      </div>
                  </div>
                  <h2 className="text-xl font-bold mb-2">Successfully Created Booking!</h2>
                  <DialogClose asChild>
                      <Button className="mt-6" onClick={() => router.push('/reservations')}>Done</Button>
                  </DialogClose>
              </div>
          </DialogContent>
      </Dialog>
    </div>
  );
}

    

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Calendar as CalendarIcon, User, BedDouble, Wallet, Info, CheckCircle, Clock, Mail, Printer, Check, AlertTriangle, X, Trash2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle as DialogTitleComponent
} from '@/components/ui/dialog';
import { getBookingById, updateBooking, deleteBookingById, getCustomers, getRoomTypes, getRooms, type BookingFromApi, type CustomerFromApi, type RoomTypeFromApi, type RoomFromApi } from '@/lib/services/api';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const activityLog = [
    { text: 'Email confirmation sent', time: 'May 10, 2025 - 10:16 AM' },
    { text: 'Payment of LKR 20,000 recorded', time: 'May 10, 2025 - 10:15 AM' },
    { text: 'Status changed to Confirmed', time: 'May 8, 2025 - 2:35 PM' },
    { text: 'Booking created by Admin John', time: 'May 8, 2025 - 2:30 PM' },
];

const bookingSchema = z.object({
  booking_id: z.string(),
  customer_id: z.string().min(1, 'Customer is required'),
  room_type_id: z.string().min(1, 'Room type is required'),
  room_number: z.string().min(1, 'Room number is required'),
  check_in_date: z.date({ required_error: "Check-in date is required." }),
  check_out_date: z.date({ required_error: "Check-out date is required." }),
  adults: z.coerce.number().min(1),
  children: z.coerce.number().min(0),
  total_amount: z.coerce.number(),
  amount_paid: z.coerce.number(),
  payment_status: z.enum(['Paid', 'Pending', 'Due']),
  payment_method: z.enum(['Credit Card', 'Cash', 'Bank Transfer', 'Online']),
  booking_status: z.enum(['Confirmed', 'Pending', 'CheckedIn', 'CheckedOut', 'Cancelled']),
  booking_source: z.enum(['Online', 'Phone', 'Walk-in']),
  discount_code: z.string().optional().nullable(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function BookingDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);
    const { toast } = useToast();

    const [customers, setCustomers] = useState<CustomerFromApi[]>([]);
    const [roomTypes, setRoomTypes] = useState<RoomTypeFromApi[]>([]);
    const [rooms, setRooms] = useState<RoomFromApi[]>([]);
    const [loading, setLoading] = useState(true);

    const [showSaveConfirmDialog, setShowSaveConfirmDialog] = useState(false);
    const [showSaveSuccessDialog, setShowSaveSuccessDialog] = useState(false);
    const [showCancelSuccessDialog, setShowCancelSuccessDialog] = useState(false);
    const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);

    const { register, handleSubmit, control, reset, watch } = useForm<BookingFormValues>({
        resolver: zodResolver(bookingSchema),
    });

    const checkInDate = watch('check_in_date');
    const checkOutDate = watch('check_out_date');

    const balanceDue = (watch('total_amount') || 0) - (watch('amount_paid') || 0);
    const nights = checkInDate && checkOutDate ? differenceInDays(checkOutDate, checkInDate) : 0;

    useEffect(() => {
        async function fetchBookingData() {
            try {
                setLoading(true);
                const [bookingData, customerData, roomTypeData, roomData] = await Promise.all([
                    getBookingById(id),
                    getCustomers(),
                    getRoomTypes(),
                    getRooms()
                ]);
                setCustomers(customerData);
                setRoomTypes(roomTypeData);
                setRooms(roomData);

                reset({
                    ...bookingData,
                    check_in_date: new Date(bookingData.check_in_date),
                    check_out_date: new Date(bookingData.check_out_date),
                    total_amount: parseFloat(bookingData.total_amount),
                    amount_paid: parseFloat(bookingData.amount_paid),
                });
            } catch (error: any) {
                toast({ variant: 'destructive', title: 'Error fetching data', description: error.message });
            } finally {
                setLoading(false);
            }
        }
        if(id) fetchBookingData();
    }, [id, reset, toast]);


  const handleSaveChanges: SubmitHandler<BookingFormValues> = async (data) => {
    try {
        const dataToSubmit = {
            ...data,
            check_in_date: format(data.check_in_date, 'yyyy-MM-dd'),
            check_out_date: format(data.check_out_date, 'yyyy-MM-dd'),
            balance_due: balanceDue.toFixed(2),
            numbers_of_night: nights > 0 ? nights : 0,
        };
        await updateBooking(id, dataToSubmit as any);
        setShowSaveConfirmDialog(false);
        setShowSaveSuccessDialog(true);
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error updating booking', description: error.message });
        setShowSaveConfirmDialog(false);
    }
  }

  const handleCancelBooking = async () => {
    try {
        await updateBooking(id, { booking_status: 'Cancelled' });
        setShowCancelSuccessDialog(true);
    } catch(error: any) {
        toast({ variant: 'destructive', title: 'Error cancelling booking', description: error.message });
    }
  }

  const handleDeleteBooking = async () => {
      try {
        await deleteBookingById(id);
        setShowDeleteSuccessDialog(true);
      } catch(error: any) {
         toast({ variant: 'destructive', title: 'Error deleting booking', description: error.message });
      }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Toaster />
      <div className="flex-1 space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/reservations">Booking Management</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>#{watch('booking_id')}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex items-center gap-2 flex-wrap">
            <AlertDialog open={showSaveConfirmDialog} onOpenChange={setShowSaveConfirmDialog}>
                <AlertDialogTrigger asChild>
                    <Button onClick={handleSubmit(() => setShowSaveConfirmDialog(true))}>Save Changes</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-center text-2xl font-bold">Do you want to Update this Booking ?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmit(handleSaveChanges)}>Save Changes</AlertDialogAction>
                    </AlertDialogFooter>
                    <button onClick={() => setShowSaveConfirmDialog(false)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted">
                        <X className="h-5 w-5" />
                    </button>
                </AlertDialogContent>
            </AlertDialog>
            <Button variant="outline">Cancel</Button>
            <div className="flex-grow"/>
            <Button variant="outline" className="bg-green-600 text-white hover:bg-green-700 hover:text-white">Record Payment</Button>
            <Button variant="outline"><Mail className="mr-2 h-4 w-4"/>Send Email</Button>
            <Button variant="outline"><Printer className="mr-2 h-4 w-4"/>Print Invoice</Button>
            <Button variant="outline"><Check className="mr-2 h-4 w-4"/>Check In</Button>
        </div>

        <form>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><User className="h-5 w-5 text-primary"/> Guest Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="customer_id">Customer</Label>
                  <Controller name="customer_id" control={control} render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.customer_id}>{c.full_name}</SelectItem>)}</SelectContent></Select>
                  )} />
                </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><BedDouble className="h-5 w-5 text-primary"/> Room & Stay Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="room_type_id">Room Type</Label>
                    <Controller name="room_type_id" control={control} render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{roomTypes.map(rt => <SelectItem key={rt.id} value={rt.room_type_id}>{rt.type_name}</SelectItem>)}</SelectContent></Select>
                    )} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="room_number">Room Number</Label>
                    <Controller name="room_number" control={control} render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{rooms.map(r => <SelectItem key={r.id} value={r.room_number}>{r.room_number}</SelectItem>)}</SelectContent></Select>
                    )} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="check_in_date">Check-in Date</Label>
                    <Controller name="check_in_date" control={control} render={({ field }) => (
                        <Popover><PopoverTrigger asChild><Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>
                    )} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="check_out_date">Check-out Date</Label>
                    <Controller name="check_out_date" control={control} render={({ field }) => (
                        <Popover><PopoverTrigger asChild><Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>
                    )} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="adults">Adults</Label>
                    <Input id="adults" type="number" {...register('adults')} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="children">Children</Label>
                    <Input id="children" type="number" {...register('children')} />
                </div>
            </div>
             <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Room available for selected dates</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><Wallet className="h-5 w-5 text-primary"/> Pricing & Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="discount_code">Discount Code</Label>
                    <Input id="discount_code" {...register('discount_code')} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="payment_status">Payment Status</Label>
                    <Controller name="payment_status" control={control} render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Paid">Paid</SelectItem><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Due">Due</SelectItem></SelectContent></Select>
                    )} />
                </div>
            </div>
            <div className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                    <p className="text-muted-foreground">Subtotal ({nights} nights)</p>
                    <Input {...register('total_amount')} className="w-24 h-8 text-right" />
                </div>
                 <div className="flex justify-between text-sm">
                    <p className="text-muted-foreground">Amount Paid</p>
                    <Input {...register('amount_paid')} className="w-24 h-8 text-right" />
                </div>
                 <div className="flex justify-between text-sm text-red-500 font-semibold">
                    <p>Balance Due</p>
                    <p>LKR {balanceDue.toFixed(2)}</p>
                </div>
            </div>
            <div>
                <h4 className="font-medium mb-2">Payment History</h4>
                <div className="border rounded-lg">
                    <div className="p-3 flex justify-between items-center">
                        <div>
                            <p className="font-medium">LKR {watch('amount_paid')}</p>
                            <p className="text-sm text-muted-foreground">Credit Card</p>
                        </div>
                         <div>
                            <p className="text-sm text-muted-foreground text-right">Dec 10, 2024</p>
                            <p className="text-sm text-green-600 font-semibold text-right">Completed</p>
                        </div>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
        </form>
      </div>

      <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Info className="h-5 w-5 text-primary"/> Booking Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="booking_status">Current Status</Label>
                    <Controller name="booking_status" control={control} render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Confirmed">Confirmed</SelectItem><SelectItem value="Pending">Pending</SelectItem><SelectItem value="CheckedIn">Checked In</SelectItem><SelectItem value="CheckedOut">Checked Out</SelectItem><SelectItem value="Cancelled">Cancelled</SelectItem></SelectContent></Select>
                    )} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="booking_source">Booking Source</Label>
                    <Controller name="booking_source" control={control} render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Online">Online</SelectItem><SelectItem value="Phone">Phone</SelectItem><SelectItem value="Walk-in">Walk-in</SelectItem></SelectContent></Select>
                    )} />
                </div>
                 <div className="text-sm text-muted-foreground space-y-1 pt-2">
                    <p>Booking ID: <span className="font-medium text-foreground">#{watch('booking_id')}</span></p>
                    <p>Nights: <span className="font-medium text-foreground">{nights}</span></p>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Clock className="h-5 w-5 text-primary"/> Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-border"></div>
                    <div className="space-y-6">
                        {activityLog.map((item, index) => (
                             <div key={index} className="flex items-start gap-3 relative">
                                <div className="h-2 w-2 rounded-full bg-primary mt-1.5 border-2 border-background"></div>
                                <div>
                                    <p className="text-sm text-foreground">{item.text}</p>
                                    <p className="text-xs text-muted-foreground">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="border-red-500 bg-red-50">
             <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-red-700"><AlertTriangle className="h-5 w-5"/> Danger Zone</CardTitle>
            </CardHeader>
             <CardContent className="space-y-3">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full"><X className="mr-2 h-4 w-4"/> Cancel Booking</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle className="text-center text-2xl font-bold">Do you want to Cancel this Booking?</AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-red-500 text-lg">
                           BK-{watch('booking_id')}
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="sm:justify-center">
                        <AlertDialogCancel>Go Back</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleCancelBooking}>Cancel Booking</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700"><Trash2 className="mr-2 h-4 w-4"/> Delete Booking</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-center text-2xl font-bold">Do you want to Delete this Booking?</AlertDialogTitle>
                            <AlertDialogDescription className="text-center text-red-500 text-lg">
                                BK-{watch('booking_id')}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="sm:justify-center">
                            <AlertDialogCancel>Go Back</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeleteBooking}>Delete Booking</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
      </div>

       <Dialog open={showSaveSuccessDialog} onOpenChange={setShowSaveSuccessDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="sr-only">
              <DialogTitleComponent>Successfully Updated!</DialogTitleComponent>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center text-center p-8">
              <div className="mx-auto bg-blue-100 rounded-full h-20 w-20 flex items-center justify-center mb-4">
                <div className="p-2 bg-blue-200 rounded-full">
                  <CheckCircle2 className="h-10 w-10 text-blue-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold mb-2">Successfully Updated Booking !</h2>
            </div>
            <DialogClose asChild>
                <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted" onClick={() => {setShowSaveSuccessDialog(false); router.push('/reservations');}}>
                    <X className="h-5 w-5" />
                </button>
            </DialogClose>
          </DialogContent>
      </Dialog>
      <Dialog open={showCancelSuccessDialog} onOpenChange={setShowCancelSuccessDialog}>
          <DialogContent>
            <DialogHeader className='sr-only'>
              <DialogTitleComponent>Booking Cancelled</DialogTitleComponent>
              <DialogDescription>The booking has been successfully cancelled.</DialogDescription>
            </DialogHeader>
            <div className="text-center p-6">
              <div className="mx-auto bg-red-100 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                  <Trash2 className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold mb-2">Successfully Cancelled BK-{watch('booking_id')} !</h2>
              <DialogClose asChild>
                  <Button className="mt-6" onClick={() => {setShowCancelSuccessDialog(false); router.push('/reservations');}}>Done</Button>
              </DialogClose>
            </div>
          </DialogContent>
      </Dialog>
      
      <Dialog open={showDeleteSuccessDialog} onOpenChange={setShowDeleteSuccessDialog}>
          <DialogContent>
            <DialogHeader className='sr-only'>
              <DialogTitleComponent>Booking Deleted</DialogTitleComponent>
              <DialogDescription>The booking has been successfully deleted.</DialogDescription>
            </DialogHeader>
            <div className="text-center p-6">
              <div className="mx-auto bg-red-100 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                  <Trash2 className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold mb-2">Successfully Deleted BK-{watch('booking_id')} !</h2>
              <DialogClose asChild>
                  <Button className="mt-6" onClick={() => {setShowDeleteSuccessDialog(false); router.push('/reservations');}}>Done</Button>
              </DialogClose>
            </div>
          </DialogContent>
      </Dialog>

    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, DollarSign, Clock, UserCheck, Search, Plus, Eye, Trash2, X, Terminal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  DialogContent,
  DialogHeader as DialogHeaderComponent,
  DialogTitle as DialogTitleComponent,
  DialogDescription as DialogDescriptionComponent,
  DialogClose,
} from '@/components/ui/dialog';
import { getReservations, type ReservationFromApi, deleteBooking } from '@/lib/services/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';


const stats = [
  {
    title: 'Total Bookings',
    value: '1,247',
    icon: CalendarIcon,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Checked In',
    value: '89',
    icon: UserCheck,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    title: 'Pending',
    value: '23',
    icon: Clock,
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
  {
    title: 'Revenue',
    value: 'LKR. 45,890',
    icon: DollarSign,
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
];

const paymentVariant = {
  Paid: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Due: 'bg-red-100 text-red-700',
} as const;

const statusVariant = {
  Confirmed: 'bg-blue-100 text-blue-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  CheckedIn: 'bg-indigo-100 text-indigo-700',
  CheckedOut: 'bg-gray-100 text-gray-700',
  Cancelled: 'bg-red-100 text-red-700',
} as const;

export default function ReservationsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [reservations, setReservations] = useState<ReservationFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<ReservationFromApi | null>(null);
  const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);
  const [deletedBookingId, setDeletedBookingId] = useState('');

  useEffect(() => {
    async function fetchReservations() {
      try {
        setLoading(true);
        setError(null);
        const data = await getReservations();
        setReservations(data);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred while fetching reservations.');
      } finally {
        setLoading(false);
      }
    }
    fetchReservations();
  }, []);

  const handleDeleteClick = (reservation: ReservationFromApi) => {
    setBookingToDelete(reservation);
  };

  const handleCancelDelete = () => {
    setBookingToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (bookingToDelete) {
      try {
        await deleteBooking(bookingToDelete.id);
        setDeletedBookingId(bookingToDelete.id);
        setReservations(prev => prev.filter(res => res.id !== bookingToDelete.id));
        setShowDeleteSuccessDialog(true);
      } catch (error: any) {
         toast({
          variant: "destructive",
          title: "Error Deleting Booking",
          description: error.message || "An unexpected error occurred.",
        });
      } finally {
        setBookingToDelete(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Toaster />
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={cn('p-2 rounded-md', stat.bgColor)}>
                <stat.icon className={cn('h-4 w-4', stat.iconColor)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by guest name, booking ID..."
                className="pl-8"
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[180px] justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>mm/dd/yyyy</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button onClick={() => router.push('/reservations/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Booking
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <AlertDialog open={!!bookingToDelete} onOpenChange={(open) => !open && handleCancelDelete()}>
        <Card>
          <CardContent className="p-0">
             {loading && <p className="p-4 text-center">Loading reservations...</p>}
             {error && (
              <Alert variant="destructive" className="m-4">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error Fetching Data</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {!loading && !error && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead className="w-[200px]">Guest</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((res) => (
                    <TableRow key={res.id}>
                      <TableCell className="font-semibold text-primary">{res.id}</TableCell>
                      <TableCell>
                        {res.guest ? (
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`https://placehold.co/40x40.png`} alt={res.guest.fullName} data-ai-hint="person face" />
                              <AvatarFallback>{res.guest.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{res.guest.fullName}</p>
                              <p className="text-xs text-muted-foreground">{res.guest.email}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {res.room && res.room.room_type_details ? (
                          <>
                            <p className="font-medium text-sm">{res.room.room_type_details.name}</p>
                            <p className="text-xs text-muted-foreground">{res.room.id}</p>
                          </>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>{format(new Date(res.checkInDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{format(new Date(res.checkOutDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{`${res.adults} Adults`}{res.children > 0 ? `, ${res.children} Children` : ''}</TableCell>
                      <TableCell>{`LKR. ${Number(res.totalAmount).toLocaleString()}`}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('border-transparent', paymentVariant[res.paymentStatus as keyof typeof paymentVariant])}>
                          {res.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('border-transparent', statusVariant[res.bookingStatus as keyof typeof statusVariant])}>
                          {res.bookingStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                         <div className="flex justify-end items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-primary/10" asChild>
                                <Link href={`/reservations/${res.id.replace('#', '')}`}>
                                  <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                  <span className="sr-only">View</span>
                                </Link>
                            </Button>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-red-100" onClick={() => handleDeleteClick(res)}>
                                  <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-red-500" />
                                  <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
           <CardFooter className="flex items-center justify-between border-t px-6 py-3">
              <div className="text-sm text-muted-foreground">
                  Showing 1 to {reservations.length} of {reservations.length} bookings
              </div>
              <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                      Previous
                  </Button>
                  <Button variant="default" size="sm">
                      1
                  </Button>
                  <Button variant="outline" size="sm">
                      2
                  </Button>
                  <Button variant="outline" size="sm">
                      Next
                  </Button>
              </div>
          </CardFooter>
        </Card>

        <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center text-2xl font-bold">Do you want to Delete this Booking ?</AlertDialogTitle>
              <AlertDialogDescription className="text-center text-red-500 text-lg">
                {bookingToDelete?.id}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center">
              <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
            </AlertDialogFooter>
            <button onClick={handleCancelDelete} className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted">
                <X className="h-5 w-5" />
            </button>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showDeleteSuccessDialog} onOpenChange={setShowDeleteSuccessDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeaderComponent className="sr-only">
                <DialogTitleComponent>Successfully Deleted</DialogTitleComponent>
                <DialogDescriptionComponent>The booking was successfully deleted.</DialogDescriptionComponent>
            </DialogHeaderComponent>
            <div className="flex flex-col items-center justify-center text-center p-6 pt-8">
                <div className="p-4 bg-red-100 rounded-full mb-4">
                   <div className="p-2 bg-red-100 rounded-full">
                        <Trash2 className="h-8 w-8 text-red-600" />
                    </div>
                </div>
                <h2 className="text-xl font-bold">Successfully Deleted {deletedBookingId} !</h2>
            </div>
            <DialogClose asChild>
              <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted" onClick={() => setShowDeleteSuccessDialog(false)}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
              </button>
            </DialogClose>
          </DialogContent>
      </Dialog>
    </div>
  );

    
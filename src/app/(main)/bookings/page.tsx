
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getBookings, deleteBookingById, type BookingFromApi } from '@/lib/services/api';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader as DialogHeaderComponent, DialogTitle as DialogTitleComponent, DialogClose } from '@/components/ui/dialog';
import { format } from 'date-fns';

const statusVariant: { [key: string]: string } = {
  Confirmed: 'bg-blue-100 text-blue-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  CheckedIn: 'bg-indigo-100 text-indigo-700',
  CheckedOut: 'bg-gray-100 text-gray-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const paymentStatusVariant: { [key: string]: string } = {
  Paid: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Due: 'bg-red-100 text-red-700',
};

export default function BookingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<BookingFromApi | null>(null);
  const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);
  const [deletedItemName, setDeletedItemName] = useState<string>('');

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        setError(null);
        const data = await getBookings();
        setBookings(data);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred while fetching bookings.');
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const handleDeleteClick = (booking: BookingFromApi) => {
    setItemToDelete(booking);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await deleteBookingById(itemToDelete.id);
        setDeletedItemName(itemToDelete.booking_id);
        setBookings(prev => prev.filter(item => item.id !== itemToDelete.id));
        setShowDeleteSuccessDialog(true);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error Deleting Booking",
          description: error.message || "An unexpected error occurred.",
        });
      } finally {
        setItemToDelete(null);
      }
    }
  };

  return (
    <>
      <Toaster />
      <div className="flex justify-end mb-6">
        <Button onClick={() => router.push('/bookings/new')}>
          <Plus className="mr-2 h-4 w-4" /> Add New Booking
        </Button>
      </div>
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <Card>
            <CardHeader>
                <CardTitle>All Bookings</CardTitle>
            </CardHeader>
          <CardContent className="p-0">
            {loading && <p className="p-4 text-center">Loading bookings...</p>}
            {error && <p className="p-4 text-center text-red-500">{error}</p>}
            {!loading && !error && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Room Type</TableHead>
                    <TableHead>Room No.</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Booking Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.booking_id}</TableCell>
                      <TableCell>{item.customer?.full_name || 'N/A'}</TableCell>
                      <TableCell>{item.roomType?.type_name || 'N/A'}</TableCell>
                      <TableCell>{item.room_number}</TableCell>
                      <TableCell>{format(new Date(item.check_in_date), 'MMM dd')} - {format(new Date(item.check_out_date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={paymentStatusVariant[item.payment_status]}>
                            {item.payment_status}
                        </Badge>
                      </TableCell>
                       <TableCell>
                        <Badge variant="outline" className={statusVariant[item.booking_status]}>
                            {item.booking_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-primary/10" asChild>
                            <Link href={`/bookings/${item.id}`}>
                              <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                              <span className="sr-only">View/Edit</span>
                            </Link>
                          </Button>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-red-100" onClick={() => handleDeleteClick(item)}>
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
              Showing 1 to {bookings.length} of {bookings.length} bookings
            </div>
          </CardFooter>
        </Card>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold">Delete Booking?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg">
                Are you sure you want to delete booking: <strong className="text-red-500">{itemToDelete?.booking_id}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
       <Dialog open={showDeleteSuccessDialog} onOpenChange={setShowDeleteSuccessDialog}>
        <DialogContent className="sm:max-w-md">
            <DialogHeaderComponent className="sr-only">
                <DialogTitleComponent>Successfully Deleted</DialogTitleComponent>
            </DialogHeaderComponent>
            <div className="flex flex-col items-center justify-center text-center p-6 pt-8">
                <div className="p-4 bg-red-100 rounded-full mb-4">
                    <Trash2 className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-xl font-bold">Successfully Deleted {deletedItemName}!</h2>
            </div>
            <DialogClose asChild>
              <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted" onClick={() => setShowDeleteSuccessDialog(false)}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
              </button>
            </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}

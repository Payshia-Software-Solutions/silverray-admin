
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Trash2, Search, Calendar as CalendarIcon, Filter, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getBookingRequests, deleteBookingRequest, type BookingRequestFromApi } from '@/lib/services/api';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader as DialogHeaderComponent, DialogTitle as DialogTitleComponent, DialogClose } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const statusVariant: { [key: string]: string } = {
  Confirmed: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function BookingRequestsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [requests, setRequests] = useState<BookingRequestFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<BookingRequestFromApi | null>(null);
  const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);
  const [deletedItemId, setDeletedItemId] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    async function fetchBookingRequests() {
      try {
        setLoading(true);
        setError(null);
        const data = await getBookingRequests();
        setRequests(data);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred while fetching booking requests.');
      } finally {
        setLoading(false);
      }
    }
    fetchBookingRequests();
  }, []);

  const handleDeleteClick = (request: BookingRequestFromApi) => {
    setItemToDelete(request);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await deleteBookingRequest(itemToDelete.id);
        setDeletedItemId(itemToDelete.id);
        setRequests(prev => prev.filter(item => item.id !== itemToDelete.id));
        setShowDeleteSuccessDialog(true);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error Deleting Request",
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
      <div className="space-y-4">
        <div className="flex items-center gap-4">
            <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search by name, email..."
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
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
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
            <Button>
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
            </Button>
            <Button asChild>
                <Link href="/booking-requests/new">
                    <Plus className="mr-2 h-4 w-4" /> Add New Request
                </Link>
            </Button>
        </div>

        <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
            <Card>
                <CardHeader>
                    <CardTitle>All Booking Requests</CardTitle>
                </CardHeader>
            <CardContent className="p-0">
                {loading && <p className="p-4 text-center">Loading requests...</p>}
                {error && <p className="p-4 text-center text-red-500">{error}</p>}
                {!loading && !error && (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Guest</TableHead>
                        <TableHead>Room Type</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Total Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {requests.map((item) => (
                        <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.first_name} {item.last_name}</TableCell>
                        <TableCell>{item.room_type}</TableCell>
                        <TableCell>{format(new Date(item.check_in_date), 'MMM dd')} - {format(new Date(item.check_out_date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>LKR {item.total_price}</TableCell>
                        <TableCell>
                            <Badge variant="outline" className={statusVariant[item.booking_status]}>
                                {item.booking_status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-primary/10" asChild>
                                <Link href={`/booking-requests/${item.id}`}>
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
                Showing 1 to {requests.length} of {requests.length} requests
                </div>
            </CardFooter>
            </Card>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle className="text-center text-2xl font-bold">Delete Booking Request?</AlertDialogTitle>
                <AlertDialogDescription className="text-center text-lg">
                    Are you sure you want to delete the request from: <strong className="text-red-500">{itemToDelete?.first_name} {itemToDelete?.last_name}</strong>?
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
                    <h2 className="text-xl font-bold">Successfully Deleted Request!</h2>
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
    </>
  );
}

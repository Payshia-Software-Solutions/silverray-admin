
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getEvents, deleteEvent, type EventFromApi, getHalls, type HallFromApi } from '@/lib/services/api';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader as DialogHeaderComponent, DialogTitle as DialogTitleComponent, DialogClose } from '@/components/ui/dialog';
import { format } from 'date-fns';

const statusColors: { [key: string]: string } = {
    Confirmed: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Cancelled: 'bg-red-100 text-red-700',
};

export default function EventManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [events, setEvents] = useState<EventFromApi[]>([]);
  const [halls, setHalls] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<EventFromApi | null>(null);
  const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);
  const [deletedItemName, setDeletedItemName] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const [eventData, hallData] = await Promise.all([
          getEvents(),
          getHalls()
        ]);
        setEvents(eventData);
        const hallMap = new Map(hallData.map(h => [String(h.id), h.hall_name]));
        setHalls(hallMap);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getHallNames = (hallIds: string) => {
    if (!hallIds) return 'N/A';
    return hallIds.split(',').map(id => halls.get(id.trim()) || 'Unknown Hall').join(', ');
  }

  const handleDeleteClick = (event: EventFromApi) => {
    setItemToDelete(event);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await deleteEvent(itemToDelete.id);
        setDeletedItemName(itemToDelete.event_name);
        setEvents(prev => prev.filter(item => item.id !== itemToDelete.id));
        setShowDeleteSuccessDialog(true);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error Deleting Event",
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
      <div className="space-y-6">
        <div className="flex justify-end">
            <Button onClick={() => router.push('/events/new')}>
            <Plus className="mr-2 h-4 w-4" /> Add New Event
            </Button>
        </div>
        <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
            <Card>
                <CardHeader>
                    <CardTitle>All Events</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                {loading && <p className="p-4 text-center">Loading events...</p>}
                {error && <p className="p-4 text-center text-red-500">{error}</p>}
                {!loading && !error && (
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Event Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Hall(s)</TableHead>
                            <TableHead>Guests</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {events.map((event) => (
                            <TableRow key={event.id}>
                            <TableCell className="font-medium">{event.event_name}</TableCell>
                            <TableCell>
                                <Badge variant="outline">{event.event_type}</Badge>
                            </TableCell>
                            <TableCell>{format(new Date(event.event_date), 'MMM dd, yyyy')}</TableCell>
                            <TableCell>{getHallNames(event.hall_id)}</TableCell>
                            <TableCell>{event.guest_count}</TableCell>
                            <TableCell>
                                <Badge variant='outline' className={statusColors[event.booking_status]}>
                                    {event.booking_status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end items-center gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-primary/10" asChild>
                                        <Link href={`/events/${event.id}`}>
                                            <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                            <span className="sr-only">View/Edit</span>
                                        </Link>
                                    </Button>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-red-100" onClick={() => handleDeleteClick(event)}>
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
                        Showing 1 to {events.length} of {events.length} events
                    </div>
                </CardFooter>
            </Card>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-center text-2xl font-bold">Delete Event?</AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-lg">
                        Are you sure you want to delete the event: <strong className="text-red-500">{itemToDelete?.event_name}</strong>?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-center">
                    <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </div>

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

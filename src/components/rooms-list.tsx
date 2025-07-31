
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getRooms, deleteRoom, type RoomFromApi } from '@/lib/services/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
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
  DialogHeader,
  DialogTitle,
  DialogDescription as DialogDescriptionComponent,
  DialogClose,
} from '@/components/ui/dialog';
import Link from 'next/link';

const statusVariant = {
  Available: 'bg-green-100 text-green-700',
  Booked: 'bg-red-100 text-red-700',
  'Under Maintenance': 'bg-yellow-100 text-yellow-700',
} as const;


export default function RoomsList() {
    const router = useRouter();
    const { toast } = useToast();
    const [rooms, setRooms] = useState<RoomFromApi[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [roomToDelete, setRoomToDelete] = useState<RoomFromApi | null>(null);
    const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);
    const [deletedRoomNumber, setDeletedRoomNumber] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRooms() {
            try {
                setLoading(true);
                setError(null);
                const data = await getRooms();
                if (Array.isArray(data)) {
                    setRooms(data);
                } else {
                    setError('Received unexpected data format from server.');
                    setRooms([]);
                }
            } catch (err: any) {
                setError(err.message || 'An unexpected error occurred.');
                setRooms([]);
            } finally {
                setLoading(false);
            }
        }
        fetchRooms();
    }, []);

    const handleDeleteClick = (room: RoomFromApi) => {
        setRoomToDelete(room);
    };

    const handleCancelDelete = () => {
        setRoomToDelete(null);
    };

    const handleDeleteConfirm = async () => {
        if (roomToDelete) {
            try {
                await deleteRoom(roomToDelete.id);
                setDeletedRoomNumber(roomToDelete.room_number);
                setRooms(currentRooms => currentRooms.filter(room => room.id !== roomToDelete.id));
                setShowDeleteSuccessDialog(true);
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Error Deleting Room",
                    description: error.message || "An unexpected error occurred.",
                });
            } finally {
                setRoomToDelete(null);
            }
        }
    };
    
    return (
        <>
            <Toaster />
            <AlertDialog open={!!roomToDelete} onOpenChange={(open) => !open && handleCancelDelete()}>
                <Card>
                    <CardContent className="p-0">
                        {loading && <p className="p-4 text-center">Loading rooms...</p>}
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
                                        <TableHead>Room Number</TableHead>
                                        <TableHead>Room Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Price/Night</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rooms.map((room) => (
                                        <TableRow key={room.id}>
                                            <TableCell className="font-medium">{room.room_number}</TableCell>
                                            <TableCell>{room.descriptive_title}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={cn('border-transparent', statusVariant[room.current_status as keyof typeof statusVariant])}>
                                                    {room.current_status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{`${room.currency} ${room.price_per_night}`}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end items-center gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-primary/10" asChild>
                                                        <Link href={`/rooms/${room.room_number}`}>
                                                            <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                                            <span className="sr-only">View</span>
                                                        </Link>
                                                    </Button>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-100" onClick={() => handleDeleteClick(room)}>
                                                            <Trash2 className="h-4 w-4" />
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
                            Showing 1 to {rooms.length} of {rooms.length} rooms
                        </div>
                    </CardFooter>
                </Card>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-center text-2xl font-bold">Do you want to Delete this Room ?</AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-lg">
                           Room Number <strong className="text-red-500">{roomToDelete?.room_number}</strong>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center">
                        <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Dialog open={showDeleteSuccessDialog} onOpenChange={setShowDeleteSuccessDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Success</DialogTitle>
                        <DialogDescriptionComponent>The room was successfully deleted.</DialogDescriptionComponent>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center text-center p-8">
                        <div className="p-4 bg-red-100 rounded-full mb-4">
                           <Trash2 className="h-8 w-8 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Successfully Deleted Room {deletedRoomNumber}!</h2>
                        <DialogClose asChild>
                            <Button className="mt-6 w-full" onClick={() => setShowDeleteSuccessDialog(false)}>Done</Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}


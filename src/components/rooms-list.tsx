
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Trash2, X, Users, DollarSign, BedDouble } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getRooms, deleteRoom, type RoomFromApi, getRoomImages, CONTENT_PROVIDER_BASE_URL } from '@/lib/services/api';
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
import Image from 'next/image';


const statusVariant = {
  Available: 'bg-green-500',
  Booked: 'bg-red-500',
  'Under Maintenance': 'bg-yellow-500',
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
        async function fetchRoomsAndImages() {
            try {
                setLoading(true);
                setError(null);
                const roomsData = await getRooms();
                if (Array.isArray(roomsData)) {
                    const roomsWithImages = await Promise.all(roomsData.map(async (room) => {
                        try {
                            const images = await getRoomImages(room.company_id, room.id);
                            const primaryImage = images.find(img => img.is_primary) || images[0];
                            return { ...room, image_url: primaryImage ? CONTENT_PROVIDER_BASE_URL + primaryImage.image_url : '/placeholder.png' };
                        } catch (imageError) {
                            console.error(`Failed to fetch images for room ${room.id}:`, imageError);
                            return { ...room, image_url: '/placeholder.png' }; // Fallback image
                        }
                    }));
                    setRooms(roomsWithImages);
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
        fetchRoomsAndImages();
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
                 {loading && <p className="p-4 text-center">Loading rooms...</p>}
                 {error && (
                     <Alert variant="destructive" className="m-4">
                         <Terminal className="h-4 w-4" />
                         <AlertTitle>Error Fetching Data</AlertTitle>
                         <AlertDescription>{error}</AlertDescription>
                     </Alert>
                 )}
                {!loading && !error && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <Card key={room.id} className="flex flex-col overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200">
                             <div className="relative w-full h-48">
                                <Image
                                    src={room.image_url || `https://picsum.photos/600/400?random=${room.id}`}
                                    alt={room.descriptive_title}
                                    fill
                                    className="object-cover"
                                    data-ai-hint="hotel room"
                                />
                                <Badge className={cn(
                                    'absolute top-3 right-3 text-sm text-white border-transparent',
                                    statusVariant[room.current_status as keyof typeof statusVariant] || 'bg-gray-500'
                                )}>
                                    {room.current_status}
                                </Badge>
                             </div>
                            <CardContent className="p-4 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold mb-2 text-foreground">{room.descriptive_title}</h3>
                                <p className="text-sm text-muted-foreground mb-4">Room {room.room_number}</p>

                                <div className="space-y-2 text-sm text-muted-foreground flex-grow">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        <span>{room.adults_capacity} Adults, {room.children_capacity} Children</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4" />
                                        <span>{room.currency} {room.price_per_night} / night</span>
                                    </div>
                                </div>

                            </CardContent>
                             <CardFooter className="flex justify-end items-center pt-2 gap-2 p-4 bg-muted/50 mt-auto">
                                <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-primary/10" asChild>
                                    <Link href={`/rooms/${room.id}`}>
                                        <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                        <span className="sr-only">View/Edit</span>
                                    </Link>
                                </Button>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-red-100" onClick={() => handleDeleteClick(room)}>
                                        <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-red-500" />
                                        <span className="sr-only">Delete</span>
                                    </Button>
                                </AlertDialogTrigger>
                            </CardFooter>
                        </Card>
                    ))}
                 </div>
                )}
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-center text-2xl font-bold">Do you want to Delete this Room ?</AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-lg">
                           Room Number <strong className="text-red-500">{roomToDelete?.room_number}</strong>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center">
                        <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-600" onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
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

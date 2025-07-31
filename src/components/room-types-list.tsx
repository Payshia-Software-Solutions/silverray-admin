
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Eye, Trash2, X } from 'lucide-react';
import { getRoomTypes, deleteRoomType, type RoomTypeFromApi } from '@/lib/services/api';
import Link from 'next/link';
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
  DialogHeader as DialogHeaderComponent,
  DialogTitle as DialogTitleComponent,
  DialogDescription as DialogDescriptionComponent,
  DialogClose,
} from '@/components/ui/dialog';

export default function RoomTypesList() {
    const router = useRouter();
    const { toast } = useToast();
    const [roomTypes, setRoomTypes] = useState<RoomTypeFromApi[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [typeToDelete, setTypeToDelete] = useState<RoomTypeFromApi | null>(null);
    const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);
    const [deletedTypeName, setDeletedTypeName] = useState('');

    useEffect(() => {
        async function fetchRoomTypes() {
            try {
                setLoading(true);
                const data = await getRoomTypes();
                setRoomTypes(data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch room types');
            } finally {
                setLoading(false);
            }
        }
        fetchRoomTypes();
    }, []);

    const handleDeleteClick = (roomType: RoomTypeFromApi) => {
        setTypeToDelete(roomType);
    };

    const handleDeleteConfirm = async () => {
        if (typeToDelete) {
            try {
                await deleteRoomType(typeToDelete.id);
                setDeletedTypeName(typeToDelete.type_name);
                setRoomTypes(prev => prev.filter(rt => rt.id !== typeToDelete.id));
                setShowDeleteSuccessDialog(true);
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Error Deleting Room Type",
                    description: error.message || "An unexpected error occurred.",
                });
            } finally {
                setTypeToDelete(null);
            }
        }
    };

    return (
        <>
            <Toaster />
            <AlertDialog open={!!typeToDelete} onOpenChange={(open) => !open && setTypeToDelete(null)}>
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Room Types</CardTitle>
                             <Button onClick={() => router.push('/rooms/types/new')}>
                                <Plus className="mr-2 h-4 w-4" /> Add New Room Type
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading && <p className="p-4 text-center">Loading room types...</p>}
                        {error && <p className="p-4 text-center text-red-500">{error}</p>}
                        {!loading && !error && (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type Name</TableHead>
                                        <TableHead>Type ID</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roomTypes.map((type) => (
                                        <TableRow key={type.id}>
                                            <TableCell className="font-medium">{type.type_name}</TableCell>
                                            <TableCell>{type.room_type_id}</TableCell>
                                            <TableCell>{new Date(type.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end items-center gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-primary/10" asChild>
                                                        <Link href={`/rooms/types/${type.id}`}>
                                                            <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                                        </Link>
                                                    </Button>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-red-100" onClick={() => handleDeleteClick(type)}>
                                                            <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-red-500" />
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
                            Showing 1 to {roomTypes.length} of {roomTypes.length} room types
                        </div>
                    </CardFooter>
                </Card>
                 <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-center text-2xl font-bold">Delete Room Type?</AlertDialogTitle>
                         <AlertDialogDescription className="text-center text-lg">
                            Are you sure you want to delete the room type: <strong className="text-red-500">{typeToDelete?.type_name}</strong>? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center">
                        <AlertDialogCancel onClick={() => setTypeToDelete(null)}>Cancel</AlertDialogCancel>
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
                        <h2 className="text-xl font-bold">Successfully Deleted {deletedTypeName}!</h2>
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


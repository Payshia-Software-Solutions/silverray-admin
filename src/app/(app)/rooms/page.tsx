
'use client';
import { useState } from 'react';
import { Plus, Search, Eye, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
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


const rooms = [
  { id: '101', type: 'Deluxe Double Room with Balcony', price: 'LKR. 29500', status: 'Available', occupancy: '2 Adults / 1 Child' },
  { id: '102', type: 'King Suite with Balcony', price: 'LKR. 29500', status: 'Booked', occupancy: '2 Adults / 2 Children' },
  { id: '201', type: 'Premium Suite', price: 'LKR. 29500', status: 'Under Maintenance', occupancy: '4 Adults / 2 Children' },
  { id: '202', type: 'Premium Suite', price: 'LKR. 29500', status: 'Under Maintenance', occupancy: '4 Adults / 2 Children' },
  { id: '203', type: 'Premium Suite', price: 'LKR. 29500', status: 'Under Maintenance', occupancy: '4 Adults / 2 Children' },
];

const statusVariant = {
  Available: 'bg-green-100 text-green-700',
  Booked: 'bg-red-100 text-red-700',
  'Under Maintenance': 'bg-yellow-100 text-yellow-700',
} as const;

export default function RoomsPage() {
  const router = useRouter();
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
  const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);
  const [deletedRoomId, setDeletedRoomId] = useState<string | null>(null);

  const handleDeleteClick = (roomId: string) => {
    setRoomToDelete(roomId);
  };

  const handleCancelDelete = () => {
    setRoomToDelete(null);
  };

  const handleDeleteConfirm = () => {
    if (roomToDelete) {
      console.log(`Deleting room ${roomToDelete}`);
      setDeletedRoomId(roomToDelete);
      // Add actual delete logic here
      setShowDeleteSuccessDialog(true);
      setRoomToDelete(null);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 p-4 bg-card rounded-lg shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by room number..."
            className="w-full rounded-lg bg-background pl-10"
          />
        </div>
        <Button onClick={() => router.push('/rooms/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Room
          </Button>
      </div>
      <AlertDialog open={!!roomToDelete} onOpenChange={(open) => !open && handleCancelDelete()}>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room Number</TableHead>
                  <TableHead>Room Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price/Night</TableHead>
                  <TableHead>Occupancy</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.id}</TableCell>
                    <TableCell>{room.type}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('border-transparent', statusVariant[room.status as keyof typeof statusVariant])}>
                        {room.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{room.price}</TableCell>
                    <TableCell>
                      {room.occupancy}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 group" asChild>
                            <Link href={`/rooms/${room.id}`}>
                              <Eye className="h-4 w-4 text-muted-foreground group-hover:text-blue-600" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteClick(room.id)}>
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
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t px-6 py-3">
              <div className="text-sm text-muted-foreground">
                  Showing 1 to 5 of 47 rooms
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
            <AlertDialogHeader className="sr-only">
                <AlertDialogTitle>Delete Room</AlertDialogTitle>
                <AlertDialogDescription>Are you sure you want to delete this room?</AlertDialogDescription>
            </AlertDialogHeader>
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Do you want to Delete this Room ?</h2>
              <p className="text-lg text-red-500">Room Number {roomToDelete}</p>
            </div>
            <AlertDialogFooter className="sm:justify-center">
                <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
            </AlertDialogFooter>
            <button onClick={handleCancelDelete} className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200">
              <X className="h-5 w-5" />
            </button>
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
                      <div className="p-2 bg-red-200 rounded-full">
                         <Trash2 className="h-8 w-8 text-red-600" />
                      </div>
                  </div>
                  <h2 className="text-xl font-bold mb-2">Successfully Deleted Room {deletedRoomId}!</h2>
                  <DialogClose asChild>
                      <Button className="mt-6 w-full" onClick={() => {
                        setShowDeleteSuccessDialog(false);
                      }}>Done</Button>
                  </DialogClose>
              </div>
          </DialogContent>
      </Dialog>
    </div>
  );
}

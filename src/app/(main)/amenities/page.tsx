
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAmenities, deleteAmenity, type AmenityFromApi } from '@/lib/services/api';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader as DialogHeaderComponent, DialogTitle as DialogTitleComponent, DialogDescription as DialogDescriptionComponent, DialogClose } from '@/components/ui/dialog';

export default function AmenitiesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [amenities, setAmenities] = useState<AmenityFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<AmenityFromApi | null>(null);
  const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);
  const [deletedItemName, setDeletedItemName] = useState<string>('');

  useEffect(() => {
    async function fetchAmenities() {
      try {
        setLoading(true);
        setError(null);
        const data = await getAmenities();
        setAmenities(data);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred while fetching amenities.');
      } finally {
        setLoading(false);
      }
    }
    fetchAmenities();
  }, []);

  const handleDeleteClick = (amenity: AmenityFromApi) => {
    setItemToDelete(amenity);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await deleteAmenity(itemToDelete.id);
        setDeletedItemName(itemToDelete.amenity_name);
        setAmenities(prev => prev.filter(item => item.id !== itemToDelete.id));
        setShowDeleteSuccessDialog(true);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error Deleting Amenity",
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
        <Button onClick={() => router.push('/amenities/new')}>
          <Plus className="mr-2 h-4 w-4" /> Add New Amenity
        </Button>
      </div>
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <Card>
            <CardHeader>
                <CardTitle>All Amenities</CardTitle>
            </CardHeader>
          <CardContent className="p-0">
            {loading && <p className="p-4 text-center">Loading amenities...</p>}
            {error && <p className="p-4 text-center text-red-500">{error}</p>}
            {!loading && !error && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Amenity Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {amenities.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.amenity_name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <Badge variant={item.is_active ? 'default' : 'secondary'} className={item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                            {item.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-primary/10" asChild>
                            <Link href={`/amenities/${item.id}`}>
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
              Showing 1 to {amenities.length} of {amenities.length} amenities
            </div>
          </CardFooter>
        </Card>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold">Delete Amenity?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg">
                Are you sure you want to delete the amenity: <strong className="text-red-500">{itemToDelete?.amenity_name}</strong>?
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


'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Eye, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getPackageInclusions, deletePackageInclusion, type PackageInclusionFromApi } from '@/lib/services/api';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader as DialogHeaderComponent, DialogTitle as DialogTitleComponent, DialogClose } from '@/components/ui/dialog';

export default function PackageInclusionsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [inclusions, setInclusions] = useState<PackageInclusionFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<PackageInclusionFromApi | null>(null);
  const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);
  const [deletedItemName, setDeletedItemName] = useState<string>('');

  useEffect(() => {
    async function fetchInclusions() {
      try {
        setLoading(true);
        setError(null);
        const data = await getPackageInclusions();
        if (Array.isArray(data)) {
            setInclusions(data);
        } else {
            setInclusions([]);
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred while fetching package inclusions.');
        setInclusions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchInclusions();
  }, []);

  const handleDeleteClick = (inclusion: PackageInclusionFromApi) => {
    setItemToDelete(inclusion);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await deletePackageInclusion(itemToDelete.id);
        setDeletedItemName(itemToDelete.inclusion_type);
        setInclusions(prev => prev.filter(item => item.id !== itemToDelete.id));
        setShowDeleteSuccessDialog(true);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error Deleting Inclusion",
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
        <Button onClick={() => router.push('/package-inclusions/new')}>
          <Plus className="mr-2 h-4 w-4" /> Add New Inclusion
        </Button>
      </div>
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <Card>
            <CardHeader>
                <CardTitle>All Package Inclusions</CardTitle>
            </CardHeader>
          <CardContent className="p-0">
            {loading && <p className="p-4 text-center">Loading inclusions...</p>}
            {error && <p className="p-4 text-center text-red-500">{error}</p>}
            {!loading && !error && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Inclusion Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inclusions.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.inclusion_type}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-primary/10" asChild>
                            <Link href={`/package-inclusions/${item.id}`}>
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
              Showing 1 to {inclusions.length} of {inclusions.length} inclusions
            </div>
          </CardFooter>
        </Card>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold">Delete Inclusion?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg">
                Are you sure you want to delete the inclusion: <strong className="text-red-500">{itemToDelete?.inclusion_type}</strong>?
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



'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Search, Plus, Trash2, Eye, X, Info, CheckCircle, Utensils, Users, Flower2, Cake, Camera, Car, Music, BedDouble } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription as DialogDescriptionComponent, DialogClose } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getWeddingPackages, deleteWeddingPackage, type WeddingPackageFromApi } from '@/lib/services/api';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';


export default function WeddingPackagesPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [packages, setPackages] = useState<WeddingPackageFromApi[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);
    const [packageToDelete, setPackageToDelete] = useState<WeddingPackageFromApi | null>(null);

    useEffect(() => {
        async function fetchPackages() {
            try {
                setLoading(true);
                const data = await getWeddingPackages();
                setPackages(data);
            } catch (err: any) {
                setError(err.message || "Failed to fetch wedding packages.");
            } finally {
                setLoading(false);
            }
        }
        fetchPackages();
    }, []);

    const handleDeleteClick = (pkg: WeddingPackageFromApi) => {
        setPackageToDelete(pkg);
        setShowDeleteDialog(true);
    }

    const handleDeleteConfirm = async () => {
        if (!packageToDelete) return;
        try {
            await deleteWeddingPackage(packageToDelete.id);
            setShowDeleteDialog(false);
            setShowDeleteSuccessDialog(true);
            setPackages(packages.filter(p => p.id !== packageToDelete.id));
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error deleting package',
                description: error.message
            })
        }
    }


  return (
    <div className="space-y-4">
        <Toaster />
      <Card>
        <CardContent className="p-4">
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search packages..."
                    className="w-full rounded-lg bg-background pl-8"
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
                <Button onClick={() => router.push('/weddings/packages/new')}>
                    <Plus className="mr-2 h-4 w-4" /> Add New Wedding Package
                </Button>
            </div>
        </CardContent>
      </Card>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Hall</TableHead>
                <TableHead>Max Guests</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {loading && <TableRow><TableCell colSpan={6} className="text-center">Loading packages...</TableCell></TableRow>}
            {error && <TableRow><TableCell colSpan={6} className="text-center text-red-500">{error}</TableCell></TableRow>}
            {!loading && !error && packages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Image src={pkg.image_urls || 'https://placehold.co/64x48'} alt={pkg.package_name} width={64} height={48} className="rounded-md object-cover" data-ai-hint="wedding hall gold" />
                    <div>
                      {pkg.package_name}
                      <p className="text-xs text-muted-foreground">{pkg.short_description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>LKR. {pkg.price}</TableCell>
                <TableCell>{pkg.hall_id}</TableCell>
                <TableCell>{pkg.max_guests}</TableCell>
                <TableCell>
                    <Badge variant="outline" className={pkg.status === 'Active' ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-700 border-gray-200"}>
                      {pkg.status}
                    </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-primary/10" asChild>
                        <Link href={`/weddings/packages/${pkg.id}`}>
                           <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        </Link>
                    </Button>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-red-100" onClick={() => handleDeleteClick(pkg)}>
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
        </CardContent>
      </Card>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-2xl font-bold">Do you want to Delete this Package ?</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-red-500 text-lg">
            {packageToDelete?.package_name}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
        <button onClick={() => setShowDeleteDialog(false)} className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200">
            <X className="h-5 w-5" />
          </button>
      </AlertDialogContent>
      </AlertDialog>
      <Dialog open={showDeleteSuccessDialog} onOpenChange={setShowDeleteSuccessDialog}>
          <DialogContent className="sm:max-w-md">
             <DialogHeader className="sr-only">
                  <DialogTitle>Success</DialogTitle>
                  <DialogDescriptionComponent>The package was successfully deleted.</DialogDescriptionComponent>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center text-center p-8">
                  <div className="p-4 bg-red-100 rounded-full mb-4">
                      <div className="p-2 bg-red-200 rounded-full">
                         <Trash2 className="h-8 w-8 text-red-600" />
                      </div>
                  </div>
                  <h2 className="text-xl font-bold mb-2">Successfully Deleted Package !</h2>
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

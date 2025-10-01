

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import { Search, Plus, Users, Check, Trash2, X, Eye } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getWeddingPackages, deleteWeddingPackage, type WeddingPackageFromApi, getPackageInclusions, type PackageInclusionFromApi, getWeddingPackageImages, CONTENT_PROVIDER_BASE_URL } from '@/lib/services/api';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import Link from 'next/link';
import { cn } from '@/lib/utils';


export default function WeddingPackagesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [packages, setPackages] = useState<WeddingPackageFromApi[]>([]);
  const [allInclusions, setAllInclusions] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [packageToDelete, setPackageToDelete] = useState<WeddingPackageFromApi | null>(null);
  const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);
  const [deletedPackageName, setDeletedPackageName] = useState('');

   useEffect(() => {
    async function fetchPackagesAndInclusions() {
      try {
        setLoading(true);
        setError(null);
        const [packagesData, inclusionsData] = await Promise.all([
          getWeddingPackages(),
          getPackageInclusions()
        ]);
        
        const packagesWithImages = await Promise.all(packagesData.map(async (pkg) => {
            try {
                const images = await getWeddingPackageImages(pkg.id);
                const primaryImage = images.find(img => img.is_primary) || images[0];
                return { ...pkg, image_urls: primaryImage ? CONTENT_PROVIDER_BASE_URL + primaryImage.image_url : null };
            } catch (e) {
                console.error(`Failed to load image for package ${pkg.id}`, e);
                return { ...pkg, image_urls: null };
            }
        }));

        setPackages(packagesWithImages);
        
        const inclusionMap = new Map(inclusionsData.map(inc => [String(inc.id), inc.inclusion_type]));
        setAllInclusions(inclusionMap);

      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    }
    fetchPackagesAndInclusions();
  }, []);

  const handleDeleteClick = (pkg: WeddingPackageFromApi) => {
    setPackageToDelete(pkg);
  };

  const handleDeleteConfirm = async () => {
    if (packageToDelete) {
      try {
        await deleteWeddingPackage(packageToDelete.id);
        setDeletedPackageName(packageToDelete.package_name);
        setPackages(prev => prev.filter(p => p.id !== packageToDelete.id));
        setShowDeleteSuccessDialog(true);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error Deleting Package",
          description: error.message || "An unexpected error occurred.",
        });
      } finally {
        setPackageToDelete(null);
      }
    }
  };


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
            <Button onClick={() => router.push('/weddingpackages/new')}>
              <Plus className="mr-2 h-4 w-4" /> Add New Package
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <AlertDialog open={!!packageToDelete} onOpenChange={(open) => !open && setPackageToDelete(null)}>
        {loading && <p>Loading packages...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden flex flex-col">
                <div className="relative w-full aspect-video">
                    <Image
                        src={pkg.image_urls || 'https://placehold.co/600x400.png'}
                        alt={pkg.package_name}
                        fill
                        className="object-cover"
                        data-ai-hint="wedding hall"
                    />
                     {pkg.status && (
                        <Badge className={cn(
                            'absolute top-3 right-3 text-sm text-white',
                            pkg.status === 'Active' && 'bg-green-500',
                            pkg.status === 'Seasonal' && 'bg-orange-500',
                            pkg.status === 'Inactive' && 'bg-gray-500'
                        )}>
                            {pkg.status}
                        </Badge>
                     )}
                </div>
                <CardContent className="p-4 flex-grow">
                    <h3 className="text-lg font-semibold mb-1">{pkg.package_name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{pkg.short_description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Users className="h-4 w-4" /> Up to {pkg.max_guests} Guests</span>
                    </div>
                    <div className="text-sm">
                    <p className="font-semibold mb-1">Key Inclusions:</p>
                    <ul className="space-y-1">
                        {(pkg.inclusions?.split(',') || []).slice(0,3).map((id, index) => (
                           <li key={index} className="flex items-center gap-2 text-muted-foreground">
                                <Check className="h-4 w-4 text-green-500" /> {allInclusions.get(id) || 'Unknown Inclusion'}
                           </li>
                        ))}
                    </ul>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center bg-muted/50 p-4 mt-auto">
                    <div>
                        <p className="text-xs text-muted-foreground">Starting From</p>
                        <p className="text-xl font-bold text-primary">LKR {Number(pkg.price).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-primary/10" asChild>
                            <Link href={`/weddingpackages/${pkg.id}`}>
                                <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                <span className="sr-only">Edit</span>
                            </Link>
                        </Button>
                         <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-red-100" onClick={() => handleDeleteClick(pkg)}>
                                <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-red-500" />
                                <span className="sr-only">Delete</span>
                            </Button>
                        </AlertDialogTrigger>
                    </div>
                </CardFooter>
                </Card>
            ))}
            </div>
        )}
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle className="text-center text-2xl font-bold">Delete Wedding Package?</AlertDialogTitle>
                <AlertDialogDescription className="text-center text-lg">
                    Are you sure you want to delete the package: <strong className="text-red-500">{packageToDelete?.package_name}</strong>?
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center">
                <AlertDialogCancel onClick={() => setPackageToDelete(null)}>Cancel</AlertDialogCancel>
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
                    <h2 className="text-xl font-bold">Successfully Deleted {deletedPackageName}!</h2>
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
  );
}



'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, Clock, Edit, Trash2, Utensils, CalendarCheck, Shield, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
import Link from 'next/link';
import RestaurantFeaturesPage from './features/page';
import MenuItemsPage from './menu/page';
import { getRestaurants, deleteRestaurant, RestaurantFromApi, getRestaurantImages, CONTENT_PROVIDER_BASE_URL } from '@/lib/services/api';
import { useToast } from '@/hooks/use-toast';

const statusColors: { [key: string]: string } = {
  Active: 'bg-green-500',
  Inactive: 'bg-gray-500',
  Seasonal: 'bg-orange-500',
};


export default function RestaurantPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [venues, setVenues] = useState<RestaurantFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [venueToDelete, setVenueToDelete] = useState<RestaurantFromApi | null>(null);
  const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('venues');

  useEffect(() => {
    async function fetchVenues() {
        try {
            setLoading(true);
            const data = await getRestaurants();
            const venuesWithImages = await Promise.all(data.map(async (venue) => {
                try {
                    const images = await getRestaurantImages(venue.id);
                    const primaryImage = images.find(img => img.is_primary) || images[0];
                    return { ...venue, images_url: primaryImage ? CONTENT_PROVIDER_BASE_URL + primaryImage.image_url : null };
                } catch (e) {
                    console.error(`Failed to load image for venue ${venue.id}`, e);
                    return { ...venue, images_url: null };
                }
            }));

            setVenues(venuesWithImages);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
            toast({
                variant: 'destructive',
                title: 'Failed to fetch venues',
                description: err.message,
            });
        } finally {
            setLoading(false);
        }
    }
    fetchVenues();
  }, [toast]);


  const handleDeleteClick = (venue: RestaurantFromApi) => {
    setVenueToDelete(venue);
  };

  const handleConfirmDelete = async () => {
    if (!venueToDelete) return;
    try {
        await deleteRestaurant(venueToDelete.id);
        toast({
            title: 'Success',
            description: `Venue "${venueToDelete.venue_name}" has been deleted.`,
        });
        setVenues(venues.filter(v => v.id !== venueToDelete.id));
        setShowDeleteSuccessDialog(true);
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Error Deleting Venue',
            description: error.message || 'An unexpected error occurred.',
        });
    } finally {
        setVenueToDelete(null);
    }
  }
  
  const getAddButtonLink = () => {
    switch (activeTab) {
        case 'venues': return '/restaurant/new';
        case 'menu': return '/restaurant/menu/new';
        case 'reservations': return '/restaurant/reservations/new';
        case 'features': return '/restaurant/features/new';
        default: return '/restaurant/new';
    }
  }

  const getAddButtonText = () => {
    switch (activeTab) {
        case 'venues': return 'Add New Venue';
        case 'menu': return 'Add New Menu Item';
        case 'reservations': return 'Add New Reservation';
        case 'features': return 'Add New Feature';
        default: return 'Add New Item';
    }
  };

  return (
    <div className="space-y-6">
        <Toaster />
      <Tabs defaultValue="venues" className="space-y-4" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
            <TabsList>
                <TabsTrigger value="venues"><Utensils className="mr-2 h-4 w-4" />Dining Venues</TabsTrigger>
                <TabsTrigger value="menu"><Utensils className="mr-2 h-4 w-4" />Menu Items</TabsTrigger>
                <TabsTrigger value="reservations"><CalendarCheck className="mr-2 h-4 w-4" />Reservations</TabsTrigger>
                <TabsTrigger value="features"><Shield className="mr-2 h-4 w-4" />Features</TabsTrigger>
            </TabsList>
             <Button asChild>
                <Link href={getAddButtonLink()}>
                    <Plus className="mr-2 h-4 w-4" /> {getAddButtonText()}
                </Link>
            </Button>
        </div>
        <AlertDialog open={!!venueToDelete} onOpenChange={(open) => !open && setVenueToDelete(null)}>
            <TabsContent value="venues">
                {loading && <p>Loading venues...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {venues.map((venue) => (
                        <Card key={`${venue.id}-${venue.venue_name}`} className="flex flex-col overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200">
                        <div className="relative w-full h-48">
                            <Image
                                src={venue.images_url || 'https://placehold.co/600x400.png'}
                                alt={venue.venue_name || 'Restaurant image'}
                                fill
                                className="object-cover"
                                data-ai-hint="restaurant interior"
                            />
                            <Badge className={cn('absolute top-3 right-3 text-sm text-white', statusColors[venue.status] || 'bg-gray-500')}>{venue.status}</Badge>
                        </div>
                        <CardContent className="p-4 flex flex-col flex-grow">
                            <h3 className="text-xl font-bold mb-2 text-foreground">{venue.venue_name}</h3>
                            <p className="text-sm text-muted-foreground mb-4 flex-grow">{venue.short_description}</p>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {venue.capacity} Capacity</span>
                                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> TODO</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end items-center p-2 bg-muted/50">
                            <Button variant="ghost" size="icon" className="group hover:bg-primary/10" onClick={() => router.push(`/restaurant/edit/${venue.id}`)}>
                                <Edit className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                            </Button>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="group hover:bg-red-100" onClick={() => handleDeleteClick(venue)}>
                                    <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-red-500" />
                                </Button>
                            </AlertDialogTrigger>
                        </CardFooter>
                        </Card>
                    ))}
                    </div>
                )}
            </TabsContent>
            <TabsContent value="menu">
                <MenuItemsPage />
            </TabsContent>
            <TabsContent value="reservations">
                <p>Reservations will be displayed here.</p>
            </TabsContent>
             <TabsContent value="features">
                <RestaurantFeaturesPage />
            </TabsContent>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-center text-2xl font-bold">Do you want to Delete this Venue ?</AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-red-500 text-lg">
                        {venueToDelete?.venue_name}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-center">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleConfirmDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
                 <button onClick={() => setVenueToDelete(null)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted">
                    <X className="h-5 w-5" />
                </button>
            </AlertDialogContent>
        </AlertDialog>

        <Dialog open={showDeleteSuccessDialog} onOpenChange={setShowDeleteSuccessDialog}>
          <DialogContent>
            <DialogHeaderComponent className='sr-only'>
              <DialogTitleComponent>Venue Deleted</DialogTitleComponent>
              <DialogDescriptionComponent>The venue has been successfully deleted.</DialogDescriptionComponent>
            </DialogHeaderComponent>
            <div className="text-center p-6 flex flex-col items-center">
                <div className="p-3 bg-red-100 rounded-full mb-4">
                    <Trash2 className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Successfully Deleted {venueToDelete?.venue_name || 'Venue'}!</h2>
            </div>
            <DialogClose asChild>
                <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted" onClick={() => setShowDeleteSuccessDialog(false)}>
                    <X className="h-5 w-5" />
                </button>
            </DialogClose>
          </DialogContent>
      </Dialog>
      </Tabs>
    </div>
  );
}

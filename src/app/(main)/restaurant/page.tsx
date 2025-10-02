

'use client';

import { useState } from 'react';
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

const statusColors: { [key: string]: string } = {
  Active: 'bg-green-500',
  Inactive: 'bg-gray-500',
  Seasonal: 'bg-orange-500',
};

const mockVenues = [
    {
        id: 1,
        venue_name: 'The Grand Palace',
        short_description: 'Exquisite fine dining with a panoramic view of the ocean.',
        capacity: 120,
        operating_hours_display: '6 PM - 11 PM',
        status: 'Active',
        restaurant_image: 'https://picsum.photos/seed/restaurant1/600/400'
    },
    {
        id: 2,
        venue_name: 'Poolside Grill & Bar',
        short_description: 'Casual dining with grilled specialties and refreshing cocktails by the pool.',
        capacity: 80,
        operating_hours_display: '11 AM - 10 PM',
        status: 'Active',
        restaurant_image: 'https://picsum.photos/seed/restaurant2/600/400'
    },
    {
        id: 3,
        venue_name: 'The Lighthouse Bistro',
        short_description: 'A cozy spot for breakfast, brunch, and artisanal coffee.',
        capacity: 40,
        operating_hours_display: '7 AM - 4 PM',
        status: 'Inactive',
        restaurant_image: 'https://picsum.photos/seed/restaurant3/600/400'
    }
];

type Venue = typeof mockVenues[0];

export default function RestaurantPage() {
  const router = useRouter();
  const [venueToDelete, setVenueToDelete] = useState<Venue | null>(null);
  const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);

  const handleDeleteClick = (venue: Venue) => {
    setVenueToDelete(venue);
  };

  const handleConfirmDelete = () => {
    // Here you would add the actual logic to delete the venue.
    console.log(`Deleting venue ${venueToDelete?.venue_name}`);
    setVenueToDelete(null); // Close the confirmation dialog
    setShowDeleteSuccessDialog(true); // Show the success dialog
  }

  return (
    <div className="space-y-6">
        <Toaster />
      <Tabs defaultValue="venues" className="space-y-4">
        <div className="flex justify-between items-center">
            <TabsList>
                <TabsTrigger value="venues"><Utensils className="mr-2 h-4 w-4" />Dining Venues</TabsTrigger>
                <TabsTrigger value="menu"><Utensils className="mr-2 h-4 w-4" />Menu Items</TabsTrigger>
                <TabsTrigger value="reservations"><CalendarCheck className="mr-2 h-4 w-4" />Reservations</TabsTrigger>
                <TabsTrigger value="features"><Shield className="mr-2 h-4 w-4" />Features</TabsTrigger>
            </TabsList>
             <Button onClick={() => router.push('/restaurant/new')}>
                <Plus className="mr-2 h-4 w-4" /> Add New Item
            </Button>
        </div>
        <AlertDialog open={!!venueToDelete} onOpenChange={(open) => !open && setVenueToDelete(null)}>
            <TabsContent value="venues">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockVenues.map((venue) => (
                    <Card key={venue.id} className="flex flex-col overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200">
                    <div className="relative w-full h-48">
                        <Image
                        src={venue.restaurant_image || 'https://placehold.co/600x400.png'}
                        alt={venue.venue_name}
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
                            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {venue.operating_hours_display}</span>
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
            </TabsContent>
            <TabsContent value="menu">
                <p>Menu items will be displayed here.</p>
            </TabsContent>
            <TabsContent value="reservations">
                <p>Reservations will be displayed here.</p>
            </TabsContent>
            <TabsContent value="features">
                <p>Features will be displayed here.</p>
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
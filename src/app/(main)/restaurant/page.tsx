

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, Clock, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getRestaurants, type RestaurantFromApi, deleteRestaurant, getOperatingHoursById, OperatingHoursFromApi } from '@/lib/services/api';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const statusColors: { [key: string]: string } = {
  Active: 'bg-green-500',
  Inactive: 'bg-gray-500',
  Seasonal: 'bg-orange-500',
};

type VenueWithHours = RestaurantFromApi & { operating_hours_display?: string };

export default function RestaurantPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [venues, setVenues] = useState<VenueWithHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVenues() {
      try {
        setLoading(true);
        const venuesData = await getRestaurants();
        const venuesWithHours = await Promise.all(
            venuesData.map(async (venue) => {
                try {
                    const hoursData = await getOperatingHoursById(venue.operating_hours_id);
                    // Find first available day to display
                    const firstDay = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].find(day => hoursData[`${day}_open` as keyof OperatingHoursFromApi]);
                    const displayHours = firstDay ? `${hoursData[`${firstDay}_open_time` as keyof OperatingHoursFromApi]} - ${hoursData[`${firstDay}_close_time` as keyof OperatingHoursFromApi]}` : 'N/A';
                    return { ...venue, operating_hours_display: displayHours };
                } catch(e) {
                    console.error(`Failed to fetch hours for venue ${venue.id}`, e);
                    return { ...venue, operating_hours_display: 'Not Available' };
                }
            })
        );
        setVenues(venuesWithHours);
      } catch (err: any) {
        setError(err.message);
        toast({
          variant: 'destructive',
          title: 'Failed to load dining venues',
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchVenues();
  }, [toast]);

  return (
    <div className="space-y-6">
        <Toaster />
      <Tabs defaultValue="venues" className="space-y-4">
        <div className="flex justify-between items-center">
            <TabsList>
                <TabsTrigger value="venues">Dining Venues</TabsTrigger>
                <TabsTrigger value="menu">Menu Items</TabsTrigger>
                <TabsTrigger value="reservations">Reservations</TabsTrigger>
            </TabsList>
             <Button onClick={() => router.push('/restaurant/new')}>
                <Plus className="mr-2 h-4 w-4" /> Add New Item
            </Button>
        </div>
        <TabsContent value="venues">
          {loading && <p>Loading venues...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue) => (
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
                     <Button variant="ghost" size="icon" className="group hover:bg-primary/10">
                        <Edit className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                     </Button>
                     <Button variant="ghost" size="icon" className="group hover:bg-red-100">
                        <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-red-500" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="menu">
            <p>Menu items will be displayed here.</p>
        </TabsContent>
        <TabsContent value="reservations">
             <p>Reservations will be displayed here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

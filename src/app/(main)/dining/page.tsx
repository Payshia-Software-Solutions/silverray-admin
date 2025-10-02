

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Trash2, Plus, Users, Clock, Utensils, ClipboardList, CalendarCheck, Pencil, BarChart, ChefHat, DollarSign } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
} from "@/components/ui/alert-dialog"
import Link from 'next/link';
import { getDiningVenues, deleteRestaurant, type RestaurantFromApi, getOperatingHoursById, OperatingHoursFromApi } from '@/lib/services/api';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';


const menuItems = [
    {
        id: 'grilled-salmon',
        name: 'Grilled Atlantic Salmon',
        subtext: 'Fresh, premium quality',
        image: 'https://placehold.co/40x40',
        imageHint: 'grilled salmon',
        category: 'Main Courses',
        categoryColor: 'bg-blue-100 text-blue-700',
        price: 'LKR. 2300',
        description: 'Perfectly grilled salmon with seasonal vegetables and lemon butter sauce',
        status: 'Available',
        statusColor: 'bg-green-100 text-green-700'
    },
];

type MenuItem = typeof menuItems[0];


const reservations = [
  {
    id: '#8K001',
    guest: 'John Smith',
    email: 'john@email.com',
    table: 'MR-TB-04',
    date: 'June 15, 2025',
    timeIn: '06.00 p.m',
    timeOut: '09.00 p.m',
    guests: 2,
    total: 'LKR. 7500',
    payment: 'Paid',
    status: 'Confirmed',
  },
];

type VenueWithHours = RestaurantFromApi & { operatingHours?: OperatingHoursFromApi };

interface StatCardProps {
    title: string;
    value: string;
    description?: string;
    Icon: React.ElementType;
    iconBgColor: string;
    iconColor: string;
}

function StatCard({ title, value, description, Icon, iconBgColor, iconColor }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className={cn("p-2 rounded-lg", iconBgColor)}>
                    <Icon className={cn("h-5 w-5", iconColor)} />
                </div>
            </CardHeader>
            <CardContent>
                <h3 className="text-3xl font-bold">{value}</h3>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </CardContent>
        </Card>
    );
}


export default function DiningManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dining-venues');
  
  const [venues, setVenues] = useState<VenueWithHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [venueToDelete, setVenueToDelete] = useState<RestaurantFromApi | null>(null);

  useEffect(() => {
    async function fetchVenues() {
      try {
        setLoading(true);
        const venueData = await getDiningVenues();
        const venuesWithHours = await Promise.all(
            venueData.map(async (venue) => {
                if(venue.operating_hours_id) {
                    try {
                        const hours = await getOperatingHoursById(venue.operating_hours_id);
                        return { ...venue, operatingHours: hours };
                    } catch (e) {
                         console.error(`Failed to fetch hours for venue ${venue.id}`, e);
                        return venue; // Return venue without hours if fetch fails
                    }
                }
                return venue;
            })
        );
        setVenues(venuesWithHours);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    }
    if (activeTab === 'dining-venues') {
      fetchVenues();
    }
  }, [activeTab]);

  const handleDeleteClick = (venue: RestaurantFromApi) => {
    setVenueToDelete(venue);
  }

  const handleDeleteConfirm = async () => {
    if (!venueToDelete) return;
    try {
        await deleteRestaurant(venueToDelete.id);
        toast({ title: "Success", description: `Venue "${venueToDelete.venue_name}" has been deleted.` });
        setVenues(venues.filter(v => v.id !== venueToDelete.id));
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error deleting venue', description: error.message });
    } finally {
        setVenueToDelete(null);
    }
  }
  
  const formatTime = (time: string): string => {
    if (!time) return '';
    const [h, m] = time.split(':');
    if(isNaN(parseInt(h)) || isNaN(parseInt(m))) return '';
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:${m} ${ampm}`;
  };

  const getOperatingHours = (hours?: OperatingHoursFromApi): string => {
    if (!hours) return 'N/A';
    const firstOpenDayKey = Object.keys(hours).find(key => key.endsWith('_open') && (hours as any)[key] === 1);
    if (firstOpenDayKey) {
        const day = firstOpenDayKey.replace('_open', '');
        const openTime = (hours as any)[`${day}_open_time`];
        const closeTime = (hours as any)[`${day}_close_time`];
        return `${formatTime(openTime)} - ${formatTime(closeTime)}`;
    }
    return 'Closed';
  };


  return (
    <div className="space-y-6">
      <Toaster />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
            title="Dining Venues" 
            value="4" 
            description="3 Active, 1 Seasonal" 
            Icon={Utensils}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
        />
        <StatCard 
            title="Today's Reservations" 
            value="32" 
            description="12 pending, 20 confirmed" 
            Icon={CalendarCheck}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
        />
        <StatCard 
            title="Total Menu Items" 
            value="88" 
            description="Across all venues"
            Icon={ChefHat}
            iconBgColor="bg-orange-100"
            iconColor="text-orange-600"
        />
        <StatCard 
            title="Today's Revenue" 
            value="LKR 12,500" 
            description="+8% from yesterday" 
            Icon={DollarSign}
            iconBgColor="bg-yellow-100"
            iconColor="text-yellow-600"
        />
      </div>
      <Tabs defaultValue="dining-venues" className="space-y-4" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="dining-venues">
              <Utensils className="mr-2 h-4 w-4" />
              Dining Venues
            </TabsTrigger>
            <TabsTrigger value="menu-items">
              <ClipboardList className="mr-2 h-4 w-4" />
              Menu Items
            </TabsTrigger>
            <TabsTrigger value="reservations">
              <CalendarCheck className="mr-2 h-4 w-4" />
              Reservations
            </TabsTrigger>
          </TabsList>
          {activeTab === 'dining-venues' && (
            <Button onClick={() => router.push('/restaurant/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Item
            </Button>
          )}
           {activeTab === 'menu-items' && (
            <Button onClick={() => router.push('/restaurant/menu/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Item
            </Button>
          )}
        </div>
        <TabsContent value="dining-venues" className="space-y-4">
          <AlertDialog open={!!venueToDelete} onOpenChange={(open) => !open && setVenueToDelete(null)}>
            {loading && <p>Loading venues...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {venues.map((venue) => (
                  <Card key={venue.id} className="flex flex-col overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200">
                      <div className="relative w-full h-48">
                        <Image
                            src={venue.restaurant_image || venue.images_url || 'https://placehold.co/600x400.png'}
                            alt={venue.venue_name}
                            fill
                            className="object-cover"
                            data-ai-hint="restaurant interior"
                        />
                        {venue.status && (
                        <Badge className={cn(
                            'absolute top-3 right-3 text-sm',
                            venue.status === 'Active' && 'bg-green-500',
                            venue.status === 'Seasonal' && 'bg-orange-500',
                            venue.status === 'Inactive' && 'bg-gray-500'
                        )}>
                            {venue.status}
                        </Badge>
                        )}
                    </div>
                    <CardContent className="p-4 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold mb-2 text-foreground">{venue.venue_name}</h3>
                        <p className="text-sm text-muted-foreground mb-4 flex-grow">{venue.short_description}</p>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4"/>
                                <span>{venue.capacity} Capacity</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4"/>
                                <span>{getOperatingHours(venue.operatingHours)}</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center pt-2 gap-2 p-4 bg-muted/50">
                        <Button className="w-full" variant="default" asChild>
                            <Link href={`/restaurant/edit/${venue.id}`}>
                                <Pencil className="mr-2 h-4 w-4"/>
                                Edit
                            </Link>
                        </Button>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="group hover:bg-red-100" onClick={() => handleDeleteClick(venue)}>
                                <Trash2 className="h-5 w-5 text-muted-foreground group-hover:text-red-500" />
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
                    <AlertDialogTitle>Delete Venue?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the venue "{venueToDelete?.venue_name}"? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setVenueToDelete(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>
        <TabsContent value="menu-items" className="space-y-4">
          <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-[250px]">Item Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {menuItems.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Image src={item.image} alt={item.name} width={40} height={40} className="rounded-md" data-ai-hint={item.imageHint} />
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">{item.subtext}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className={item.categoryColor}>{item.category}</Badge>
                            </TableCell>
                            <TableCell>{item.price}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className={item.statusColor}>{item.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" asChild>
                                  <Link href={`/restaurant/menu/${item.id}`}>
                                    <Edit className="h-4 w-4" />
                                  </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </CardContent>
           </Card>
        </TabsContent>
        <TabsContent value="reservations" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((res, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-semibold">{res.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{res.guest}</div>
                      </TableCell>
                      <TableCell>{res.date}</TableCell>
                      <TableCell>{res.timeIn}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={res.status === 'Confirmed' ? 'text-blue-700 bg-blue-100' : 'text-yellow-700 bg-yellow-100'}>
                          {res.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/restaurant/reservations/${res.id.replace('#', '')}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

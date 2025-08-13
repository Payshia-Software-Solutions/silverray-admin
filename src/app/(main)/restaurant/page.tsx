

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Trash2, Plus, Users, Clock, Utensils, ClipboardList, CalendarCheck, Settings, Search, Eye, X, CheckCircle2, Shield } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription as DialogDescriptionComponent, // Renamed to avoid conflict
  DialogClose,
} from '@/components/ui/dialog';
import Link from 'next/link';
import RestaurantFeaturesPage from './features/page';
import { getRestaurants, deleteRestaurant, type RestaurantFromApi } from '@/lib/services/api';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';


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
    {
        id: 'caesar-salad',
        name: 'Caesar Salad',
        subtext: 'Classic recipe',
        image: 'https://placehold.co/40x40',
        imageHint: 'caesar salad',
        category: 'Starters',
        categoryColor: 'bg-green-100 text-green-700',
        price: 'LKR. 800',
        description: 'Fresh romaine lettuce with parmesan cheese and croutons',
        status: 'Available',
        statusColor: 'bg-green-100 text-green-700'
    },
    {
        id: 'lava-cake',
        name: 'Chocolate Lava Cake',
        subtext: 'Signature dessert',
        image: 'https://placehold.co/40x40',
        imageHint: 'lava cake',
        category: 'Desserts',
        categoryColor: 'bg-purple-100 text-purple-700',
        price: 'LKR. 600',
        description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
        status: 'Seasonal',
        statusColor: 'bg-yellow-100 text-yellow-700'
    }
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
  {
    id: '#BK001',
    guest: 'John Smith',
    email: 'john@email.com',
    table: 'MR-TB-06',
    date: 'June 15, 2025',
    timeIn: '07.30 p.m',
    timeOut: '10.00 p.m',
    guests: 2,
    total: 'LKR. 7500',
    payment: 'Pending',
    status: 'Pending',
  },
  // Add more mock reservations if needed
];


export default function RestaurantDiningPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dining-venues');
  
  const [venues, setVenues] = useState<RestaurantFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [venueToDelete, setVenueToDelete] = useState<RestaurantFromApi | null>(null);
  const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);

  const [showDeleteItemDialog, setShowDeleteItemDialog] = useState(false);
  const [showDeleteItemSuccessDialog, setShowDeleteItemSuccessDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [showDeleteReservationDialog, setShowDeleteReservationDialog] = useState(false);
  const [showDeleteReservationSuccessDialog, setShowDeleteReservationSuccessDialog] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<typeof reservations[0] | null>(null);

  useEffect(() => {
    async function fetchVenues() {
      try {
        setLoading(true);
        const data = await getRestaurants();
        setVenues(data);
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
        setShowDeleteSuccessDialog(true);
        setVenues(venues.filter(v => v.id !== venueToDelete.id));
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error deleting venue', description: error.message });
    } finally {
        setVenueToDelete(null);
    }
  }

  const handleDeleteItemClick = (item: MenuItem) => {
    setItemToDelete(item);
    setShowDeleteItemDialog(true);
  };

  const handleDeleteItemConfirm = () => {
    console.log(`Deleting ${itemToDelete?.name}`);
    // Here you would add the logic to delete the item
    setShowDeleteItemDialog(false);
    setShowDeleteItemSuccessDialog(true);
  }

  const handleDeleteReservationClick = (reservation: typeof reservations[0]) => {
    setReservationToDelete(reservation);
    setShowDeleteReservationDialog(true);
  };

  const handleDeleteReservationConfirm = () => {
    console.log(`Deleting reservation ${reservationToDelete?.id}`);
    // Here you would add the logic to delete the reservation
    setShowDeleteReservationDialog(false);
    setShowDeleteReservationSuccessDialog(true);
  };

  return (
    <div className="space-y-6">
      <Toaster />
      <AlertDialog open={!!venueToDelete || showDeleteItemDialog || showDeleteReservationDialog} onOpenChange={(open) => {
          if (!open) {
            setVenueToDelete(null);
            setShowDeleteItemDialog(false);
            setShowDeleteReservationDialog(false);
          }
      }}>
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
              <TabsTrigger value="features">
                <Shield className="mr-2 h-4 w-4" />
                Restaurant Features
              </TabsTrigger>
            </TabsList>
            {activeTab === 'dining-venues' && (
              <Button onClick={() => router.push('/restaurant/new')}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Venue
              </Button>
            )}
          </div>
          <TabsContent value="dining-venues" className="space-y-4">
            {loading && <p>Loading venues...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {venues.map((venue) => (
                <Card key={venue.id} className="flex flex-col">
                  <div className="relative w-full aspect-video">
                    <Image
                      src={venue.images_url || 'https://placehold.co/600x400.png'}
                      alt={venue.venue_name}
                      fill
                      className="object-cover rounded-t-lg"
                      data-ai-hint="restaurant interior"
                    />
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {venue.status}
                    </span>
                  </div>
                  <CardContent className="p-4 flex-grow">
                    <h3 className="text-lg font-semibold mb-1">
                      {venue.venue_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {venue.short_description}
                    </p>
                    <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                      <div className='flex items-center gap-2'>
                        <Users className="h-4 w-4" />
                        <span>{venue.capacity} Capacity</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4 pt-0 gap-2">
                    <Button className="w-full" asChild>
                      <Link href={`/restaurant/${venue.id}`}>Edit</Link>
                    </Button>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="group hover:bg-red-100" onClick={() => handleDeleteClick(venue)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-red-500" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                  </CardFooter>
                </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="menu-items" className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Select Restaurant:</span>
                    <Select defaultValue="main-restaurant">
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select a restaurant" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main-restaurant">Main Restaurant</SelectItem>
                        <SelectItem value="cafe-111">Cafe 111</SelectItem>
                        <SelectItem value="indian-restaurant">Indian Restaurant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => router.push('/restaurant/menu/new')}><Plus className="mr-2 h-4 w-4" /> Add New Meal</Button>
                    <Button variant="outline"><Settings className="mr-2 h-4 w-4" /> Manage Category</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
             <Card>
              <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-4">
                      <div className="relative flex-1">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Search menu items..." className="pl-8" />
                      </div>
                      <Select>
                          <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="main-courses">Main Courses</SelectItem>
                              <SelectItem value="starters">Starters</SelectItem>
                              <SelectItem value="desserts">Desserts</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="rounded-md border">
                      <Table>
                          <TableHeader>
                          <TableRow>
                              <TableHead className="w-[250px]">Item Name</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Description</TableHead>
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
                                  <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                                  <TableCell>
                                      <Badge variant="outline" className={item.statusColor}>{item.status}</Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                      <div className="flex justify-end gap-1">
                                          <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-primary/10" asChild>
                                              <Link href={`/restaurant/menu/${item.id}`}>
                                                  <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                                  <span className="sr-only">View</span>
                                              </Link>
                                          </Button>
                                          <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-red-100" onClick={() => handleDeleteItemClick(item)}>
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
                  </div>
                   <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div>Showing 1 to 3 of 12 results</div>
                      <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">Previous</Button>
                          <Button variant="default" size="sm">1</Button>
                          <Button variant="outline" size="sm">2</Button>
                          <Button variant="outline" size="sm">Next</Button>
                      </div>
                  </div>
              </CardContent>
             </Card>
          </TabsContent>
          <TabsContent value="reservations" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">Select Restaurant:</span>
                    <Select defaultValue="main-restaurant">
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select a restaurant" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main-restaurant">Main Restaurant</SelectItem>
                        <SelectItem value="cafe-111">Cafe 111</SelectItem>
                        <SelectItem value="indian-restaurant">Indian Restaurant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={() => router.push('/restaurant/reservations/new')}>
                    <Plus className="mr-2 h-4 w-4" /> Add New Reservation
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by guest, booking ID..." className="pl-8" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead>Table Number</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time in</TableHead>
                      <TableHead>Time out</TableHead>
                      <TableHead>Guests</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Payment</TableHead>
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
                          <div className="text-xs text-muted-foreground">{res.email}</div>
                        </TableCell>
                        <TableCell>{res.table}</TableCell>
                        <TableCell>{res.date}</TableCell>
                        <TableCell>{res.timeIn}</TableCell>
                        <TableCell>{res.timeOut}</TableCell>
                        <TableCell>{res.guests}</TableCell>
                        <TableCell>{res.total}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={res.payment === 'Paid' ? 'text-green-700 bg-green-100' : 'text-yellow-700 bg-yellow-100'}>
                            {res.payment}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={res.status === 'Confirmed' ? 'text-blue-700 bg-blue-100' : 'text-yellow-700 bg-yellow-100'}>
                            {res.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                             <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-primary/10" asChild>
                                  <Link href={`/restaurant/reservations/${res.id.replace('#', '')}`}>
                                      <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                      <span className="sr-only">View</span>
                                  </Link>
                              </Button>
                              <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-red-100" onClick={() => handleDeleteReservationClick(res)}>
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
              <CardFooter className="flex items-center justify-between border-t px-6 py-3">
                <div className="text-sm text-muted-foreground">
                  Showing 1 to {reservations.length} of 247 bookings
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="default" size="sm">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="features">
            <RestaurantFeaturesPage />
          </TabsContent>
        </Tabs>
        <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader>
                <AlertDialogTitle className="text-center text-2xl font-bold">
                    {venueToDelete && "Do you want to Delete this Venue ?"}
                    {itemToDelete && "Do you want to Delete this Meal ?"}
                    {reservationToDelete && "Do you want to Delete this Reservation ?"}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-center text-red-500 text-lg">
                    {venueToDelete?.venue_name}
                    {itemToDelete?.name}
                    {reservationToDelete?.id}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center gap-4">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => {
                    if (venueToDelete) handleDeleteConfirm();
                    if (itemToDelete) handleDeleteItemConfirm();
                    if (reservationToDelete) handleDeleteReservationConfirm();
                }}>Delete</AlertDialogAction>
            </AlertDialogFooter>
            <button onClick={() => {
                setVenueToDelete(null);
                setItemToDelete(null);
                setReservationToDelete(null);
            }} className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted">
                <X className="h-5 w-5" />
            </button>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showDeleteSuccessDialog} onOpenChange={setShowDeleteSuccessDialog}>
          <DialogContent className="sm:max-w-md">
             <DialogHeader className="sr-only">
                  <DialogTitle>Success</DialogTitle>
                  <DialogDescriptionComponent>The venue was successfully deleted.</DialogDescriptionComponent>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center text-center p-8">
                  <div className="p-4 bg-red-100 rounded-full mb-4">
                      <div className="p-2 bg-red-200 rounded-full">
                         <Trash2 className="h-8 w-8 text-red-600" />
                      </div>
                  </div>
                  <h2 className="text-xl font-bold mb-2">Successfully Deleted!</h2>
                  <DialogClose asChild>
                      <Button className="mt-6 w-full" onClick={() => {
                        setShowDeleteSuccessDialog(false);
                      }}>Done</Button>
                  </DialogClose>
              </div>
          </DialogContent>
      </Dialog>
      <Dialog open={showDeleteItemSuccessDialog} onOpenChange={setShowDeleteItemSuccessDialog}>
          <DialogContent className="sm:max-w-xs">
            <DialogHeader className="sr-only">
              <DialogTitle>Successfully Deleted!</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center text-center p-6">
              <div className="mx-auto bg-red-100 rounded-full h-20 w-20 flex items-center justify-center mb-4">
                  <Trash2 className="h-10 w-10 text-red-600" />
              </div>
              <h2 className="text-xl font-bold mb-2">Successfully Deleted !</h2>
            </div>
            <DialogClose asChild>
                <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted" onClick={() => {
                  setShowDeleteItemSuccessDialog(false);
                  setItemToDelete(null);
                }}>
                    <X className="h-5 w-5" />
                </button>
            </DialogClose>
          </DialogContent>
      </Dialog>
      <Dialog open={showDeleteReservationSuccessDialog} onOpenChange={setShowDeleteReservationSuccessDialog}>
          <DialogContent className="sm:max-w-xs">
            <DialogHeader className="sr-only">
              <DialogTitle>Successfully Deleted!</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center text-center p-6">
              <div className="mx-auto bg-red-100 rounded-full h-20 w-20 flex items-center justify-center mb-4">
                  <Trash2 className="h-10 w-10 text-red-600" />
              </div>
              <h2 className="text-xl font-bold mb-2">Successfully Deleted !</h2>
            </div>
            <DialogClose asChild>
                <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted" onClick={() => {
                  setShowDeleteReservationSuccessDialog(false);
                  setReservationToDelete(null);
                }}>
                    <X className="h-5 w-5" />
                </button>
            </DialogClose>
          </DialogContent>
      </Dialog>
    </div>
  );
}

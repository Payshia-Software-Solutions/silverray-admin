
'use client';

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
import { Edit, Trash2, Plus, Users, Clock, Utensils, ClipboardList, CalendarCheck, Settings, Search, Eye } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const menuItems = [
    {
        name: 'Grilled Atlantic Salmon',
        subtext: 'Fresh, premium quality',
        image: 'https://placehold.co/40x40',
        category: 'Main Courses',
        categoryColor: 'bg-blue-100 text-blue-700',
        price: 'LKR. 2300',
        description: 'Perfectly grilled salmon with seasonal vegetables and lemon butter sauce',
        status: 'Available',
        statusColor: 'bg-green-100 text-green-700'
    },
    {
        name: 'Caesar Salad',
        subtext: 'Classic recipe',
        image: 'https://placehold.co/40x40',
        category: 'Starters',
        categoryColor: 'bg-green-100 text-green-700',
        price: 'LKR. 800',
        description: 'Fresh romaine lettuce with parmesan cheese and croutons',
        status: 'Available',
        statusColor: 'bg-green-100 text-green-700'
    },
    {
        name: 'Chocolate Lava Cake',
        subtext: 'Signature dessert',
        image: 'https://placehold.co/40x40',
        category: 'Desserts',
        categoryColor: 'bg-purple-100 text-purple-700',
        price: 'LKR. 600',
        description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
        status: 'Seasonal',
        statusColor: 'bg-yellow-100 text-yellow-700'
    }
];

const reservations = [
  {
    id: '#BK001',
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

  return (
    <div className="space-y-6">
      <Tabs defaultValue="dining-venues" className="space-y-4">
        <div className="flex items-center">
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
        </div>
        <TabsContent value="dining-venues" className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col">
              <div className="relative w-full aspect-video">
                <Image
                  src="https://placehold.co/600x400"
                  alt="Main Restaurant"
                  fill
                  className="object-cover rounded-t-lg"
                  data-ai-hint="restaurant interior"
                />
                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
              <CardContent className="p-4 flex-grow">
                <h3 className="text-lg font-semibold mb-1">
                  Main Restaurant
                </h3>
                <p className="text-sm text-muted-foreground">
                  Elegant fine dining experience with international cuisine and
                  sophisticated ambiance.
                </p>
                <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                  <div className='flex items-center gap-2'>
                    <Users className="h-4 w-4" />
                    <span>120 Capacity</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Clock className="h-4 w-4" />
                    <span>6:00 AM - 11:00 PM</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-4 pt-0 gap-2">
                <Button className="w-full" onClick={() => router.push('/restaurant/new')}>Edit</Button>
                <Button variant="outline" size="icon" className="text-muted-foreground hover:bg-destructive hover:text-destructive-foreground">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </CardFooter>
            </Card>
            <Card className="flex flex-col">
              <div className="relative w-full aspect-video">
                <Image
                  src="https://placehold.co/600x400"
                  alt="Cafe 111"
                  fill
                  className="object-cover rounded-t-lg"
                  data-ai-hint="cafe interior"
                />
                 <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
              <CardContent className="p-4 flex-grow">
                <h3 className="text-lg font-semibold mb-1">
                  Cafe 111
                </h3>
                <p className="text-sm text-muted-foreground">
                  Casual dining spot perfect for coffee, light meals, and
                  relaxed conversations.
                </p>
                <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                   <div className='flex items-center gap-2'>
                    <Users className="h-4 w-4" />
                    <span>45 Capacity</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Clock className="h-4 w-4" />
                    <span>7:00 AM - 10:00 PM</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-4 pt-0 gap-2">
                <Button className="w-full" onClick={() => router.push('/restaurant/new')}>Edit</Button>
                 <Button variant="outline" size="icon" className="text-muted-foreground hover:bg-destructive hover:text-destructive-foreground">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </CardFooter>
            </Card>
            <Card className="flex flex-col">
              <div className="relative w-full aspect-video">
                <Image
                  src="https://placehold.co/600x400"
                  alt="Indian Restaurant"
                  fill
                  className="object-cover rounded-t-lg"
                  data-ai-hint="indian restaurant"
                />
                 <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
              <CardContent className="p-4 flex-grow">
                <h3 className="text-lg font-semibold mb-1">
                  Indian Restaurant
                </h3>
                <p className="text-sm text-muted-foreground">
                  Authentic Indian cuisine with traditional spices and flavors
                  in a cultural setting.
                </p>
                 <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                   <div className='flex items-center gap-2'>
                    <Users className="h-4 w-4" />
                    <span>80 Capacity</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Clock className="h-4 w-4" />
                    <span>11:00 AM - 11:00 PM</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-4 pt-0 gap-2">
                <Button className="w-full" onClick={() => router.push('/restaurant/new')}>Edit</Button>
                 <Button variant="outline" size="icon" className="text-muted-foreground hover:bg-destructive hover:text-destructive-foreground">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="menu-items" className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-4">
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
                <Button onClick={() => router.push('/restaurant/menu/new')}><Plus className="mr-2 h-4 w-4" /> Add New Meal</Button>
                <Button variant="outline"><Settings className="mr-2 h-4 w-4" /> Manage Category</Button>
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
                                        <Image src={item.image} alt={item.name} width={40} height={40} className="rounded-md" data-ai-hint="food dish" />
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
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
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
                <Button>
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
                        <div className="flex justify-end gap-2">
                           <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Trash2 className="h-4 w-4" />
                            </Button>
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
      </Tabs>
    </div>
  );
}

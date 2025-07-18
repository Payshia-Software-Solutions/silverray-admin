
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
import { Edit, Trash2, Plus, Users, Clock, Utensils, ClipboardList, CalendarCheck, Eye } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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
          <div className="ml-auto">
            <Button onClick={() => router.push('/restaurant/new')}>
              <Plus className="mr-2 h-4 w-4" /> Add New Item
            </Button>
          </div>
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
                <CardTitle className="text-lg font-semibold mb-1">
                  Main Restaurant
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Elegant fine dining experience with international cuisine and
                  sophisticated ambiance.
                </CardDescription>
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
              <CardFooter className="flex justify-between items-center gap-2 p-4 pt-0">
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" /> View Bookings
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => router.push('/restaurant/new')}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
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
                <CardTitle className="text-lg font-semibold mb-1">
                  Cafe 111
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Casual dining spot perfect for coffee, light meals, and
                  relaxed conversations.
                </CardDescription>
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
              <CardFooter className="flex justify-between items-center gap-2 p-4 pt-0">
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" /> View Bookings
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => router.push('/restaurant/new')}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
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
                <CardTitle className="text-lg font-semibold mb-1">
                  Indian Restaurant
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Authentic Indian cuisine with traditional spices and flavors
                  in a cultural setting.
                </CardDescription>
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
              <CardFooter className="flex justify-between items-center gap-2 p-4 pt-0">
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" /> View Bookings
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => router.push('/restaurant/new')}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="menu-items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Menu Items</CardTitle>
              <CardDescription>Manage your restaurant's menu items.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Menu item list and management will go here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reservations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reservations</CardTitle>
              <CardDescription>Manage your restaurant's reservations.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Reservation list and management will go here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

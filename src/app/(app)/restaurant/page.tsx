
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
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function RestaurantDiningPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Restaurant & Dining Management
        </h2>
        <p className="text-muted-foreground">
          Manage dining venues, menu items, and reservations
        </p>
      </div>
      <Tabs defaultValue="dining-venues" className="space-y-4">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="dining-venues">Dining Venues</TabsTrigger>
            <TabsTrigger value="menu-items">Menu Items</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
          </TabsList>
          <div className="ml-auto">
            <Button onClick={() => router.push('/restaurant/new')}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Item
            </Button>
          </div>
        </div>
        <TabsContent value="dining-venues" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="p-0">
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
                <div className="p-4">
                  <CardTitle className="text-lg font-semibold">
                    Main Restaurant
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm text-muted-foreground">
                    Elegant fine dining experience with international cuisine and
                    sophisticated ambiance.
                  </CardDescription>
                  <div className="mt-4 text-sm">
                    <p className="text-muted-foreground">
                      Capacity: <span className="font-medium">120</span>
                    </p>
                    <p className="text-muted-foreground">
                      Hours: <span className="font-medium">6:00 AM - 11:00 PM</span>
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-4 pt-0">
                <Button variant="outline" onClick={() => router.push('/restaurant/new')}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button variant="outline" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardContent className="p-0">
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
                 <div className="p-4">
                  <CardTitle className="text-lg font-semibold">
                    Cafe 111
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm text-muted-foreground">
                    Casual dining spot perfect for coffee, light meals, and
                    relaxed conversations.
                  </CardDescription>
                  <div className="mt-4 text-sm">
                    <p className="text-muted-foreground">
                      Capacity: <span className="font-medium">45</span>
                    </p>
                    <p className="text-muted-foreground">
                      Hours: <span className="font-medium">7:00 AM - 10:00 PM</span>
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-4 pt-0">
                 <Button variant="outline" onClick={() => router.push('/restaurant/new')}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button variant="outline" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardContent className="p-0">
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
                 <div className="p-4">
                  <CardTitle className="text-lg font-semibold">
                    Indian Restaurant
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm text-muted-foreground">
                    Authentic Indian cuisine with traditional spices and flavors
                    in a cultural setting.
                  </CardDescription>
                   <div className="mt-4 text-sm">
                    <p className="text-muted-foreground">
                      Capacity: <span className="font-medium">80</span>
                    </p>
                    <p className="text-muted-foreground">
                      Hours: <span className="font-medium">11:00 AM - 11:00 PM</span>
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-4 pt-0">
                 <Button variant="outline" onClick={() => router.push('/restaurant/new')}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button variant="outline" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
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

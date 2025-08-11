

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, CalendarCheck, Building } from 'lucide-react';
import WeddingPackagesPage from '../weddingpackages/packages/page';
import WeddingBookingsPage from '../weddingpackages/booking/page';
import HallsPage from '../weddingpackages/halls/page';


export default function WeddingManagementPage() {
  const [activeTab, setActiveTab] = useState('wedding-packages');

  return (
    <div className="space-y-6">
        <Tabs defaultValue="wedding-packages" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="wedding-packages">
                <Heart className="mr-2 h-4 w-4" />
                Wedding Packages
            </TabsTrigger>
            <TabsTrigger value="wedding-bookings">
                <CalendarCheck className="mr-2 h-4 w-4" />
                Wedding Bookings
            </TabsTrigger>
            <TabsTrigger value="hall-management">
                <Building className="mr-2 h-4 w-4" />
                Hall Management
            </TabsTrigger>
          </TabsList>
          <TabsContent value="wedding-packages">
            <WeddingPackagesPage />
          </TabsContent>
          <TabsContent value="wedding-bookings">
            <WeddingBookingsPage />
          </TabsContent>
           <TabsContent value="hall-management">
             <HallsPage />
          </TabsContent>
        </Tabs>
    </div>
  );
}

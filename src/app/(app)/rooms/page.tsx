
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import RoomsList from '@/components/rooms-list';
import RoomTypesList from '@/components/room-types-list';

export default function RoomsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="rooms" className="space-y-4">
        <div className="flex justify-between items-center">
            <TabsList>
                <TabsTrigger value="rooms">Rooms</TabsTrigger>
                <TabsTrigger value="room-types">Room Types</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-4">
                 <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-full rounded-lg bg-background pl-10"
                    />
                </div>
                 <Button onClick={() => router.push('/rooms/new')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Room
                </Button>
            </div>
        </div>
        <TabsContent value="rooms">
          <RoomsList />
        </TabsContent>
        <TabsContent value="room-types">
            <RoomTypesList />
        </TabsContent>
      </Tabs>
    </div>
  );
}

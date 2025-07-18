
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const weddingPackages = [
  {
    name: 'Silver Grandeur',
    description: 'Premium wedding package with full service',
    price: 'LKR. 150,000',
    halls: 'Grand Ballroom, Garden Pavilion',
    inclusions: 'Premium Catering, Luxury Décor, Ceremony ...',
    maxGuests: 200,
    status: 'Active',
  },
  {
    name: 'Diamond Bliss',
    description: 'Luxury wedding package with exclusive amenities',
    price: 'LKR. 150,000',
    halls: 'Grand Ballroom, Rooftop Terrace',
    inclusions: 'Premium Catering, Luxury Décor, Ceremony ...',
    maxGuests: 300,
    status: 'Active',
  },
];


export default function WeddingManagementPage() {
    const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <div className="space-y-6">
      <Tabs defaultValue="wedding-packages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="wedding-packages">Wedding Packages</TabsTrigger>
          <TabsTrigger value="wedding-bookings">Wedding Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="wedding-packages" className="space-y-4">
          <Card>
             <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search packages..."
                        className="w-full rounded-lg bg-background pl-8"
                    />
                    </div>
                     <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={'outline'}
                            className={cn(
                            'w-[180px] justify-start text-left font-normal',
                            !date && 'text-muted-foreground'
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, 'PPP') : <span>mm/dd/yyyy</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <Button className="ml-auto">
                        <Plus className="mr-2 h-4 w-4" /> Add New Wedding Package
                    </Button>
                </div>
             </CardContent>
          </Card>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Package Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Halls Included</TableHead>
                    <TableHead>Other Including's</TableHead>
                    <TableHead>Max Guests</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                 {weddingPackages.map((pkg, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {pkg.name}
                      <p className="text-xs text-muted-foreground">{pkg.description}</p>
                    </TableCell>
                    <TableCell>{pkg.price}</TableCell>
                    <TableCell>{pkg.halls}</TableCell>
                     <TableCell>{pkg.inclusions}</TableCell>
                    <TableCell>{pkg.maxGuests}</TableCell>
                    <TableCell>
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                           {pkg.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                         <Button variant="ghost" size="icon" className="h-8 w-8">
                           <Eye className="h-4 w-4" />
                           <span className="sr-only">View</span>
                         </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="wedding-bookings" className="space-y-4">
           <Card>
            <CardHeader>
              <CardTitle>Wedding Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Wedding booking list and management will go here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

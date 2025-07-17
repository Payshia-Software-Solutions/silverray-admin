'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function WeddingManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Wedding Management</h2>
        <p className="text-muted-foreground">
          Manage wedding packages, halls, and bookings
        </p>
      </div>
      <Tabs defaultValue="wedding-packages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="wedding-packages">Wedding Packages</TabsTrigger>
          <TabsTrigger value="wedding-bookings">Wedding Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="wedding-packages" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search packages..."
                className="pl-8"
              />
            </div>
            <div className="relative">
               <CalendarIcon className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
               <Input type="text" placeholder="mm/dd/yyyy" className="pl-8"/>
            </div>
            <Button variant="secondary">Apply Filters</Button>
            <Button className="ml-auto">
              <Plus className="mr-2 h-4 w-4" /> Add New Wedding Package
            </Button>
          </div>
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Silver Grandeur
                      <p className="text-xs text-muted-foreground">Premium wedding package with full service</p>
                    </TableCell>
                    <TableCell>LKR. 150,000</TableCell>
                    <TableCell>Grand Ballroom, Garden Pavilion</TableCell>
                     <TableCell>Premium Catering, Luxury Décor, Ceremony ...</TableCell>
                    <TableCell>200</TableCell>
                    <TableCell><span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Active</span></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                         <Button variant="ghost" size="icon">
                           <Eye className="h-4 w-4" />
                         </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                   <TableRow>
                    <TableCell className="font-medium">
                      Diamond Bliss
                       <p className="text-xs text-muted-foreground">Luxury wedding package with exclusive amenities</p>
                    </TableCell>
                    <TableCell>LKR. 150,000</TableCell>
                    <TableCell>Grand Ballroom, Rooftop Terrace</TableCell>
                     <TableCell>Premium Catering, Luxury Décor, Ceremony ...</TableCell>
                    <TableCell>300</TableCell>
                    <TableCell><span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Active</span></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                         <Button variant="ghost" size="icon">
                           <Eye className="h-4 w-4" />
                         </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="wedding-bookings" className="space-y-4">
           <Card>
            <CardHeader>
              <CardTitle>Wedding Bookings</CardTitle>
              <CardDescription>Manage your wedding reservations.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder content for wedding bookings */}
              <p>Wedding booking list and management will go here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
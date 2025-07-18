
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bed, Minus, Plus, ShowerHead, Tv, Wifi, Wind, Award, Coffee, Lock, User, Square, DollarSign, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const amenities = [
    { id: 'king-bed', label: 'King-size Bed' },
    { id: 'rain-shower', label: 'Rain Shower' },
    { id: 'luxury-linens', label: 'Luxury Linens' },
    { id: 'high-speed-wifi', label: 'High-speed Wi-Fi' },
    { id: 'private-balcony', label: 'Private Balcony' },
    { id: 'nespresso', label: 'Nespresso Machine' },
    { id: 'climate-control', label: 'Climate Control' },
    { id: 'smart-tv', label: '55" Smart TV' },
    { id: 'in-room-safe', label: 'In-room Safe' },
    { id: 'mini-bar', label: 'Mini Bar' },
    { id: 'work-desk', label: 'Work Desk' },
    { id: 'room-service', label: 'Room Service' },
]

export default function AddNewRoomPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/rooms">Room Management</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add New Room</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="grid gap-6">
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="bg-primary/10 p-2 rounded-full"><Bed className="h-5 w-5 text-primary"/></span>
                    Basic Information
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="room-number">Room Number</Label>
                <Input id="room-number" placeholder="e.g., 105" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room-type">Room Type</Label>
                 <Select>
                  <SelectTrigger id="room-type">
                    <SelectValue placeholder="Select Room Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deluxe-double">Deluxe Double Room</SelectItem>
                    <SelectItem value="king-suite">King Suite</SelectItem>
                    <SelectItem value="premium-suite">Premium Suite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="descriptive-title">Descriptive Title</Label>
                <Input id="descriptive-title" placeholder="e.g., Mountain View King Suite" />
              </div>
            <div className="space-y-2">
              <Label htmlFor="short-description">Short Description</Label>
              <Textarea id="short-description" placeholder="Brief overview of the room..." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="bg-primary/10 p-2 rounded-full"><User className="h-5 w-5 text-primary"/></span>
                    Capacity & Dimensions
                </h3>
            </div>
            <div className="flex flex-wrap items-end gap-6">
               <div className="space-y-2">
                <Label htmlFor="adults">Adults</Label>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" className="h-9 w-9"><Minus className="h-4 w-4" /></Button>
                  <Input id="adults" type="number" defaultValue={0} className="w-16 text-center" />
                  <Button variant="outline" size="icon" className="h-9 w-9"><Plus className="h-4 w-4" /></Button>
                </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor="children">Children</Label>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" className="h-9 w-9"><Minus className="h-4 w-4" /></Button>
                  <Input id="children" type="number" defaultValue={0} className="w-16 text-center" />
                  <Button variant="outline" size="icon" className="h-9 w-9"><Plus className="h-4 w-4" /></Button>
                </div>
              </div>
                <div className="space-y-2">
                    <Label>Room Size</Label>
                    <div className="flex items-center gap-2">
                        <Input type="number" placeholder="450" className="w-24" />
                        <span className="text-sm text-muted-foreground">width</span>
                        <Input type="number" placeholder="450" className="w-24" />
                        <span className="text-sm text-muted-foreground">height</span>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>

         <Card>
          <CardContent className="p-6 space-y-6">
             <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="bg-primary/10 p-2 rounded-full"><DollarSign className="h-5 w-5 text-primary"/></span>
                    Pricing & Status
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="price">Price per night</Label>
                    <div className="flex items-center">
                        <span className="p-2 border rounded-l-md bg-muted text-muted-foreground text-sm">LKR</span>
                        <Input id="price" type="number" placeholder="25000" className="rounded-l-none" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="status">Current Status</Label>
                     <Select>
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Available" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="booked">Booked</SelectItem>
                            <SelectItem value="maintenance">Under Maintenance</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
            </div>
          </CardContent>
        </Card>

         <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="bg-primary/10 p-2 rounded-full"><Award className="h-5 w-5 text-primary"/></span>
                    Key Amenities
                </h3>
            </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {amenities.map(item => (
                <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox id={item.id} />
                    <Label htmlFor={item.id} className="font-normal">{item.label}</Label>
                </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="bg-primary/10 p-2 rounded-full"><ImageIcon className="h-5 w-5 text-primary"/></span>
                    Room Images
                </h3>
            </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                     <div key={i} className="flex items-center justify-center w-full">
                      <label
                        htmlFor={`image-upload-${i}`}
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <Plus className="w-8 h-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Add Image</p>
                        </div>
                        <Input id={`image-upload-${i}`} type="file" className="hidden" />
                      </label>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href="/rooms">Cancel</Link>
        </Button>
        <Button>Create New Room</Button>
      </div>
    </div>
  );
}

    

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bed, Minus, Plus, Award, ImageIcon, DollarSign, User, Trash2 } from 'lucide-react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Image from 'next/image';

const amenities = [
    { id: 'king-bed', label: 'King-size Bed', checked: true },
    { id: 'rain-shower', label: 'Rain Shower', checked: true },
    { id: 'luxury-linens', label: 'Luxury Linens', checked: true },
    { id: 'high-speed-wifi', label: 'High-speed Wi-Fi', checked: true },
    { id: 'private-balcony', label: 'Private Balcony', checked: true },
    { id: 'nespresso', label: 'Nespresso Machine', checked: true },
    { id: 'climate-control', label: 'Climate Control', checked: true },
    { id: 'smart-tv', label: '55" Smart TV', checked: true },
    { id: 'in-room-safe', label: 'In-room Safe', checked: true },
    { id: 'mini-bar', label: 'Mini Bar', checked: true },
    { id: 'work-desk', label: 'Work Desk', checked: true },
    { id: 'room-service', label: 'Room Service', checked: true },
];

const roomImages = [
    { src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop', hint: 'hotel room interior', primary: true },
    { src: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop', hint: 'modern hotel room', primary: false },
    { src: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop', hint: 'hotel bathroom marble', primary: false },
    { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop', hint: 'hotel room view', primary: false },
]

export default function EditRoomPage({ params }: { params: { id: string } }) {
  
  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/rooms">Room Management</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Room {params.id}</BreadcrumbPage>
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
                <Input id="room-number" value={params.id} disabled />
                <p className="text-xs text-muted-foreground">Room number cannot be changed</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="room-type">Room Type</Label>
                 <Select defaultValue="deluxe-double">
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
                <Input id="descriptive-title" defaultValue="Deluxe Double Room with Balcony" />
              </div>
            <div className="space-y-2">
              <Label htmlFor="short-description">Short Description</Label>
              <Textarea id="short-description" defaultValue="Spacious deluxe room with modern amenities, comfortable king-size bed, and private balcony overlooking the city." />
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
                  <Input id="adults" type="number" defaultValue={2} className="w-16 text-center" />
                  <Button variant="outline" size="icon" className="h-9 w-9"><Plus className="h-4 w-4" /></Button>
                </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor="children">Children</Label>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" className="h-9 w-9"><Minus className="h-4 w-4" /></Button>
                  <Input id="children" type="number" defaultValue={1} className="w-16 text-center" />
                  <Button variant="outline" size="icon" className="h-9 w-9"><Plus className="h-4 w-4" /></Button>
                </div>
              </div>
                <div className="space-y-2">
                    <Label>Room Size</Label>
                    <div className="flex items-center gap-2">
                        <Input type="number" defaultValue="450" className="w-24" />
                        <span className="text-sm text-muted-foreground">width</span>
                        <Input type="number" defaultValue="450" className="w-24" />
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
                        <span className="p-2 border rounded-l-md bg-muted text-muted-foreground text-sm">$</span>
                        <Input id="price" type="number" defaultValue="150" className="rounded-l-none" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="status">Current Status</Label>
                     <Select defaultValue="available">
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
                    <Checkbox id={item.id} defaultChecked={item.checked} />
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
             <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {roomImages.map((image, i) => (
                     <div key={i} className="relative">
                        <Image src={image.src} alt={`Room image ${i+1}`} width={200} height={150} className="rounded-lg object-cover aspect-[4/3]" data-ai-hint={image.hint} />
                        {image.primary && <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">Primary</div>}
                     </div>
                ))}
                 <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Plus className="w-8 h-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Add Image</p>
                    </div>
                    <Input id="image-upload" type="file" className="hidden" />
                  </label>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Room
        </Button>
        <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
                <Link href="/rooms">Cancel</Link>
            </Button>
            <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}


'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bed, Minus, Plus, Award, Image as ImageIcon, CheckCircle2, DollarSign, User, X } from 'lucide-react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import Image from 'next/image';


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

const initialImageSlots = Array(4).fill(null);

export default function AddNewRoomPage() {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>(initialImageSlots);

  const handleCreateRoom = () => {
    // In a real app, you would handle form submission here.
    setShowSuccessDialog(true);
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImagePreviews = [...imagePreviews];
        newImagePreviews[index] = reader.result as string;
        setImagePreviews(newImagePreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    const newImagePreviews = [...imagePreviews];
    newImagePreviews[index] = null;
    setImagePreviews(newImagePreviews);
    const fileInput = document.getElementById(`image-upload-${index}`) as HTMLInputElement;
    if (fileInput) {
        fileInput.value = '';
    }
  };

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
                {imagePreviews.map((preview, index) => (
                    <div key={index} className="flex items-center justify-center w-full">
                        {preview ? (
                            <div className="relative w-full h-32">
                                <Image src={preview} alt={`Room image preview ${index + 1}`} layout="fill" className="rounded-lg object-cover" />
                                <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 rounded-full" onClick={() => removeImage(index)}>
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Remove image</span>
                                </Button>
                            </div>
                        ) : (
                            <label
                                htmlFor={`image-upload-${index}`}
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
                            >
                                <div className="flex flex-col items-center justify-center">
                                    <Plus className="w-8 h-8 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">Add Image</p>
                                </div>
                                <Input id={`image-upload-${index}`} type="file" className="hidden" onChange={(e) => handleImageChange(e, index)} accept="image/png, image/jpeg" />
                            </label>
                        )}
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
        <Button onClick={handleCreateRoom}>Create New Room</Button>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="sr-only">
                    <DialogTitle>Success</DialogTitle>
                    <DialogDescription>A new room has been successfully created.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center text-center p-8">
                    <div className="p-4 bg-blue-100 rounded-full mb-4">
                        <div className="p-2 bg-blue-200 rounded-full">
                           <CheckCircle2 className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold mb-2">Successfully Created Room 101 !</h2>
                    <DialogClose asChild>
                        <Button className="mt-6" onClick={() => setShowSuccessDialog(false)}>Done</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
}

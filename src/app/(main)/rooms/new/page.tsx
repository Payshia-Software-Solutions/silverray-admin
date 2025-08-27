
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bed, Minus, Plus, Award, Image as ImageIcon, CheckCircle2, DollarSign, User, X, Trash2 } from 'lucide-react';
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
import { createRoom, getRoomTypes, getAmenities, type RoomTypeFromApi, type AmenityFromApi } from '@/lib/services/api';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useRouter } from 'next/navigation';

export default function AddNewRoomPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [roomTypes, setRoomTypes] = useState<RoomTypeFromApi[]>([]);
  const [loadingRoomTypes, setLoadingRoomTypes] = useState(true);
  const [amenities, setAmenities] = useState<AmenityFromApi[]>([]);
  const [loadingAmenities, setLoadingAmenities] = useState(true);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoadingRoomTypes(true);
        const roomTypesData = await getRoomTypes();
        setRoomTypes(roomTypesData);
      } catch (error) {
        console.error("Failed to fetch room types:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load room types. Please check the connection and try again.",
        });
      } finally {
        setLoadingRoomTypes(false);
      }

      try {
        setLoadingAmenities(true);
        const amenitiesData = await getAmenities();
        setAmenities(amenitiesData);
      } catch (error) {
        console.error("Failed to fetch amenities:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load amenities. Please check the connection and try again.",
        });
      } finally {
        setLoadingAmenities(false);
      }
    }
    fetchInitialData();
  }, [toast]);

  const handleCreateRoom = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(event.currentTarget);
    const selectedAmenities = formData.getAll('amenities');

    const roomDataFromForm = {
        room_number: formData.get('id'),
        room_type_id: formData.get('roomTypeId'),
        descriptive_title: formData.get('descriptiveTitle'),
        short_description: formData.get('shortDescription'),
        adults_capacity: formData.get('adults'),
        children_capacity: formData.get('children'),
        room_width: formData.get('roomWidth'),
        room_height: formData.get('roomHeight'),
        price_per_night: formData.get('pricePerNight'),
        current_status: formData.get('status'),
        amenities: selectedAmenities,
        room_images: formData.get('imageUrl'),
    };

    const roomDataForApi = {
        room_number: roomDataFromForm.room_number,
        amenities_id: roomDataFromForm.amenities.join(','),
        room_type_id: Number(roomDataFromForm.room_type_id),
        company_id: 'com-001',
        descriptive_title: roomDataFromForm.descriptive_title,
        short_description: roomDataFromForm.short_description,
        adults_capacity: Number(roomDataFromForm.adults_capacity),
        children_capacity: Number(roomDataFromForm.children_capacity),
        room_width: Number(roomDataFromForm.room_width || 0),
        room_height: Number(roomDataFromForm.room_height || 0),
        price_per_night: Number(roomDataFromForm.price_per_night),
        currency: 'LKR',
        current_status: roomDataFromForm.current_status,
        room_images: roomDataFromForm.room_images,
        created_by: 'admin',
    };

    try {
      const result = await createRoom(roomDataForApi);
      toast({
        title: "Success!",
        description: `Room ${result.room_number} has been created.`,
      });
      router.push(`/rooms/${result.id}`);
    } catch (error: any) {
      console.error('Error creating room:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create the room. Please check the server connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
    <Toaster />
    <form onSubmit={handleCreateRoom} className="space-y-6">
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
                <Input id="room-number" name="id" placeholder="e.g., 105" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room-type">Room Type</Label>
                 <Select name="roomTypeId" disabled={loadingRoomTypes}>
                  <SelectTrigger id="room-type">
                    <SelectValue placeholder={loadingRoomTypes ? "Loading..." : "Select Room Type"} />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((type) => (
                       <SelectItem key={type.id} value={String(type.id)}>
                        {type.type_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="descriptive-title">Descriptive Title</Label>
                <Input id="descriptive-title" name="descriptiveTitle" placeholder="e.g., Mountain View King Suite" />
              </div>
            <div className="space-y-2">
              <Label htmlFor="short-description">Short Description</Label>
              <Textarea id="short-description" name="shortDescription" placeholder="Brief overview of the room..." />
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
                  <Button type="button" variant="outline" size="icon" className="h-9 w-9"><Minus className="h-4 w-4" /></Button>
                  <Input id="adults" name="adults" type="number" defaultValue={2} className="w-16 text-center" />
                  <Button type="button" variant="outline" size="icon" className="h-9 w-9"><Plus className="h-4 w-4" /></Button>
                </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor="children">Children</Label>
                <div className="flex items-center space-x-2">
                  <Button type="button" variant="outline" size="icon" className="h-9 w-9"><Minus className="h-4 w-4" /></Button>
                  <Input id="children" name="children" type="number" defaultValue={0} className="w-16 text-center" />
                  <Button type="button" variant="outline" size="icon" className="h-9 w-9"><Plus className="h-4 w-4" /></Button>
                </div>
              </div>
                <div className="space-y-2">
                    <Label>Room Size</Label>
                    <div className="flex items-center gap-2">
                        <Input name="roomWidth" type="number" placeholder="Width" className="w-24" />
                        <Input name="roomHeight" type="number" placeholder="Height" className="w-24" />
                        <span className="text-sm text-muted-foreground">sqft</span>
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
                        <Input id="price" name="pricePerNight" type="number" placeholder="25000" className="rounded-l-none" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="status">Current Status</Label>
                     <Select name="status" defaultValue="Available">
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Available" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="Booked">Booked</SelectItem>
                            <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
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
                {loadingAmenities ? <p>Loading amenities...</p> : amenities.map(item => (
                <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox id={`amenity-${item.id}`} name="amenities" value={String(item.id)} />
                    <Label htmlFor={`amenity-${item.id}`} className="font-normal">{item.amenity_name}</Label>
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
                        Room Image
                    </h3>
                    <p className="text-sm text-muted-foreground">Provide a URL for the main room image.</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input id="imageUrl" name="imageUrl" placeholder="https://example.com/image.jpg" />
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href="/rooms">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : '+ Create New Room'}
        </Button>
      </div>
    </form>
    </>
  );
}

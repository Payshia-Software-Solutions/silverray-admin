
'use client';

import { useState, useEffect } from 'react';
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
import { createRoom, getRoomTypes, getAmenities, type RoomTypeFromApi, type AmenityFromApi } from '@/lib/services/api';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const initialImageSlots = Array(4).fill(null);

export default function AddNewRoomPage() {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>(initialImageSlots);
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
        roomSize: formData.get('roomSize'),
        price_per_night: formData.get('pricePerNight'),
        current_status: formData.get('status'),
        amenities: selectedAmenities,
    };

    const roomDataForApi = {
        room_number: roomDataFromForm.room_number,
        amenities_id: roomDataFromForm.amenities.join(','),
        room_type_id: Number(roomDataFromForm.room_type_id),
        company_id: 'C001',
        descriptive_title: roomDataFromForm.descriptive_title,
        short_description: roomDataFromForm.short_description,
        adults_capacity: Number(roomDataFromForm.adults_capacity),
        children_capacity: Number(roomDataFromForm.children_capacity),
        room_width: Number((roomDataFromForm.roomSize as string || '').split('x')[0] || 0),
        room_height: Number((roomDataFromForm.roomSize as string || '').split('x')[1] || 0),
        price_per_night: Number(roomDataFromForm.price_per_night),
        currency: 'LKR',
        current_status: roomDataFromForm.current_status,
        image_url: '/images/rooms/default.jpg',
        created_by: 'admin',
    };

    try {
      const result = await createRoom(roomDataForApi);
      console.log('Room created:', result);
      setShowSuccessDialog(true);
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
                    <Label>Room Size (sqft)</Label>
                    <div className="flex items-center gap-2">
                        <Input name="roomSize" type="text" placeholder="e.g. 450 or 20x30" className="w-24" />
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
                    Room Images
                </h3>
            </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                    <div key={index} className="flex items-center justify-center w-full">
                        {preview ? (
                            <div className="relative w-full h-32">
                                <Image src={preview} alt={`Room image preview ${index + 1}`} layout="fill" className="rounded-lg object-cover" />
                                <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 rounded-full" onClick={() => removeImage(index)}>
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
        <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : '+ Create New Room'}
        </Button>
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
                    <h2 className="text-xl font-bold mb-2">Successfully Created New Room!</h2>
                    <DialogClose asChild>
                        <Button className="mt-6" onClick={() => setShowSuccessDialog(false)}>Done</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    </form>
    </>
  );
}

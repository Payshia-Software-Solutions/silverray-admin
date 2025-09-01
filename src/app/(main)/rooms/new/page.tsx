
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bed, Minus, Plus, Award, Image as ImageIcon, CheckCircle2, DollarSign, User, X, Trash2, MoreVertical, Star } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { createRoom, getRoomTypes, getAmenities, uploadRoomImage, type RoomTypeFromApi, type AmenityFromApi, RoomFromApi } from '@/lib/services/api';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useRouter } from 'next/navigation';

interface ImageSlot {
  file: File | null;
  preview: string | null;
  isPrimary: boolean;
}

export default function AddNewRoomPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [roomTypes, setRoomTypes] = useState<RoomTypeFromApi[]>([]);
  const [loadingRoomTypes, setLoadingRoomTypes] = useState(true);
  const [amenities, setAmenities] = useState<AmenityFromApi[]>([]);
  const [loadingAmenities, setLoadingAmenities] = useState(true);
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>(Array(5).fill({ file: null, preview: null, isPrimary: false }));
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [newlyCreatedRoom, setNewlyCreatedRoom] = useState<RoomFromApi | null>(null);


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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImageSlots = [...imageSlots];
        // Set first uploaded image as primary by default
        const isFirstImage = !imageSlots.some(slot => slot.preview);
        newImageSlots[index] = { file, preview: reader.result as string, isPrimary: isFirstImage };
        setImageSlots(newImageSlots);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    const newImageSlots = [...imageSlots];
    const wasPrimary = newImageSlots[index].isPrimary;
    newImageSlots[index] = { file: null, preview: null, isPrimary: false };
    
    // If the removed image was primary, make the new first image primary
    if (wasPrimary) {
        const firstImageIndex = newImageSlots.findIndex(slot => slot.file);
        if (firstImageIndex !== -1) {
            newImageSlots[firstImageIndex].isPrimary = true;
        }
    }
    setImageSlots(newImageSlots);
  };
  
  const setPrimaryImage = (indexToSet: number) => {
      setImageSlots(currentSlots => 
          currentSlots.map((slot, index) => ({
              ...slot,
              isPrimary: index === indexToSet
          }))
      );
  }

  const handleCreateRoom = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(event.currentTarget);
    const selectedAmenities = formData.getAll('amenities');
    
    const roomDataForApi = {
        room_number: formData.get('id'),
        amenities_id: selectedAmenities.join(','),
        room_type_id: Number(formData.get('roomTypeId')),
        company_id: 'com-001',
        descriptive_title: formData.get('descriptiveTitle'),
        short_description: formData.get('shortDescription'),
        adults_capacity: Number(formData.get('adults')),
        children_capacity: Number(formData.get('children')),
        room_width: (formData.get('roomWidth') || '0'),
        room_height: (formData.get('roomHeight') || '0'),
        price_per_night: (formData.get('pricePerNight')),
        currency: 'LKR',
        current_status: formData.get('status'),
        image_url: '', // Will be updated after upload
        created_by: 'admin',
    };

    try {
      const result = await createRoom(roomDataForApi);
      setNewlyCreatedRoom(result);
      setShowImageDialog(true);
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

  const handleImageUploads = async () => {
    if (!newlyCreatedRoom) return;

    setIsSubmitting(true);
    const imagesToUpload = imageSlots.filter(slot => slot.file !== null);

    if (imagesToUpload.length === 0) {
        toast({ title: "No images to upload", description: "You can upload images later by editing the room."});
        setShowImageDialog(false);
        router.push('/rooms');
        return;
    }

    try {
        for (const slot of imagesToUpload) {
            if (slot.file) {
                await uploadRoomImage(newlyCreatedRoom.id, slot.file, slot.isPrimary);
            }
        }
        toast({ title: "Success!", description: "Room and images uploaded successfully."});
        setShowImageDialog(false);
        router.push('/rooms');

    } catch (error: any) {
         toast({
            variant: "destructive",
            title: "Image Upload Failed",
            description: error.message || "An unexpected error occurred during image upload.",
        });
    } finally {
        setIsSubmitting(false);
    }
  }
  
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
                        <Input name="roomWidth" type="text" placeholder="Width" className="w-24" />
                        <Input name="roomHeight" type="text" placeholder="Height" className="w-24" />
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
                        <Input id="price" name="pricePerNight" type="text" placeholder="25000" className="rounded-l-none" />
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {imageSlots.map((slot, index) => (
                <div key={index} className="relative aspect-video group">
                {slot.preview ? (
                    <>
                    <Image
                        src={slot.preview}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="rounded-lg object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setPrimaryImage(index)}>
                                    <Star className="mr-2 h-4 w-4" /> Set as Primary
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-500" onClick={() => removeImage(index)}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Remove
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    {slot.isPrimary && <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1"><Star className="w-3 h-3" /> Primary</div>}
                    </>
                ) : (
                    <label
                    htmlFor={`image-upload-${index}`}
                    className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
                    >
                    <div className="flex flex-col items-center justify-center text-center">
                        <Plus className="w-8 h-8 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground mt-1">Add Image</p>
                    </div>
                    <Input
                        id={`image-upload-${index}`}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, index)}
                    />
                    </label>
                )}
                </div>
            ))}
            </div>
          </CardContent>
        </Card>

      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild type="button">
          <Link href="/rooms">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Add New Room'}
        </Button>
      </div>
    </form>
    
    <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Step 2: Upload Room Images</DialogTitle>
            <DialogDescription>
              Add up to 5 images for Room <span className="font-bold">{newlyCreatedRoom?.room_number}</span>. The primary image will be shown first.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 py-4">
            {imageSlots.map((slot, index) => (
                <div key={index} className="relative aspect-video group">
                {slot.preview ? (
                    <>
                    <Image
                        src={slot.preview}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="rounded-lg object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setPrimaryImage(index)}>
                                    <Star className="mr-2 h-4 w-4" /> Set as Primary
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-500" onClick={() => removeImage(index)}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Remove
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    {slot.isPrimary && <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1"><Star className="w-3 h-3" /> Primary</div>}
                    </>
                ) : (
                    <label
                    htmlFor={`image-upload-${index}`}
                    className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
                    >
                    <div className="flex flex-col items-center justify-center text-center">
                        <Plus className="w-8 h-8 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground mt-1">Add Image</p>
                    </div>
                    <Input
                        id={`image-upload-${index}`}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, index)}
                    />
                    </label>
                )}
                </div>
            ))}
            </div>

          <DialogClose asChild>
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => router.push('/rooms')}>Skip for now</Button>
                <Button onClick={handleImageUploads} disabled={isSubmitting}>
                    {isSubmitting ? 'Uploading...' : 'Upload & Finish'}
                </Button>
            </div>
          </DialogClose>
        </DialogContent>
    </Dialog>
    </>
  );
}

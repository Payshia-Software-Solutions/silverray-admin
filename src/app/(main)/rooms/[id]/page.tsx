
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bed, Minus, Plus, Award, ImageIcon, DollarSign, User, Trash2, X, CheckCircle2, MoreVertical, Star } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle as DialogTitleComponent, DialogDescription as DialogDescriptionComponent, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useParams, useRouter } from 'next/navigation';
import { getRoomById, getAmenities, AmenityFromApi, RoomFromApi, updateRoom, getRoomTypes, RoomTypeFromApi, getRoomImages, RoomImageFromApi, CONTENT_PROVIDER_BASE_URL, uploadRoomImage } from '@/lib/services/api';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

interface ImageSlot {
  file: File | null;
  preview: string | null;
  isPrimary: boolean;
  id?: number;
}

export default function EditRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = Number(params.id);
  const { toast } = useToast();
  const [room, setRoom] = useState<RoomFromApi | null>(null);
  const [allAmenities, setAllAmenities] = useState<AmenityFromApi[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomTypeFromApi[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imageSlots, setImageSlots] = useState<ImageSlot[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);
  const [showSaveConfirmDialog, setShowSaveConfirmDialog] = useState(false);
  const [showSaveSuccessDialog, setShowSaveSuccessDialog] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);

   useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [roomData, amenitiesData, roomTypesData, imagesData] = await Promise.all([
          getRoomById(roomId),
          getAmenities(),
          getRoomTypes(),
          getRoomImages('com-001', roomId)
        ]);
        setRoom(roomData);
        setAllAmenities(amenitiesData);
        setRoomTypes(roomTypesData);
        
        if (roomData.amenities_id) {
          const amenityIds = new Set(roomData.amenities_id.split(',').filter(id => id));
          setSelectedAmenities(amenityIds);
        }
        
        const formattedImages = imagesData.map(img => ({
            id: img.id,
            file: null,
            preview: CONTENT_PROVIDER_BASE_URL + img.image_url,
            isPrimary: img.is_primary === 1,
        }));
        setImageSlots(formattedImages);

      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Error fetching data',
          description: error.message || 'An unexpected error occurred.',
        });
      } finally {
        setLoading(false);
      }
    }
    if (roomId) {
        fetchData();
    }
  }, [roomId, toast]);

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    setSelectedAmenities(prev => {
      const newSelected = new Set(prev);
      if (checked) {
        newSelected.add(amenityId);
      } else {
        newSelected.delete(amenityId);
      }
      return newSelected;
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const file = event.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const newImageSlots = [...imageSlots];
              const isFirstImage = !imageSlots.some(slot => slot.preview);
              newImageSlots[index] = { file, preview: reader.result as string, isPrimary: newImageSlots[index]?.isPrimary || isFirstImage, id: newImageSlots[index]?.id };
              setImageSlots(newImageSlots);
          };
          reader.readAsDataURL(file);
      }
  };

  const removeImage = (indexToRemove: number) => {
      const newImageSlots = imageSlots.filter((_, index) => index !== indexToRemove);
      setImageSlots(newImageSlots);
  };

  const setPrimaryImage = (selectedIndex: number) => {
      const newImageSlots = imageSlots.map((slot, index) => ({
          ...slot,
          isPrimary: index === selectedIndex,
      }));
      setImageSlots(newImageSlots);
  };

  const handleDelete = () => {
    setShowDeleteDialog(false);
    setShowDeleteSuccessDialog(true);
  }
  
  const handleSaveConfirm = async () => {
    if (!room || !formRef.current) return;
    
    setIsSubmitting(true);
    
    const formData = new FormData(formRef.current);

    const primaryImage = imageSlots.find(slot => slot.isPrimary);
    const primaryImageUrl = primaryImage?.file 
        ? (primaryImage.preview || '') // Use preview for new files
        : (primaryImage?.preview?.replace(CONTENT_PROVIDER_BASE_URL, '') || '/images/rooms/default.jpg'); // Get relative path for existing files


    const roomDataForApi = {
        room_number: room.room_number,
        amenities_id: Array.from(selectedAmenities).join(','),
        room_type_id: Number(formData.get('roomTypeId')),
        company_id: room.company_id || 'com-001', // Fallback
        descriptive_title: formData.get('descriptiveTitle') as string,
        short_description: formData.get('shortDescription') as string,
        adults_capacity: Number(formData.get('adults')),
        children_capacity: Number(formData.get('children')),
        room_width: (formData.get('roomWidth') as string),
        room_height: (formData.get('roomHeight') as string),
        price_per_night: (formData.get('pricePerNight') as string),
        currency: room.currency || 'USD',
        current_status: formData.get('status') as RoomFromApi['current_status'],
        image_url: primaryImageUrl,
        created_by: room.created_by || 'admin',
        updated_by: 'admin'
    };
    
    try {
        await updateRoom(room.id, roomDataForApi);

        const imagesToUpload = imageSlots.filter(slot => slot.file !== null);
        for (const slot of imagesToUpload) {
            if (slot.file) {
                // If it's a new image, it won't have an ID.
                // The backend should handle creating a new image record.
                await uploadRoomImage(room.id, slot.file, slot.isPrimary);
            }
        }

        setShowSaveConfirmDialog(false);
        setShowSaveSuccessDialog(true);
    } catch (error: any) {
        console.error('Error updating room:', error);
        toast({
            variant: "destructive",
            title: "Error",
            description: error.message || "Failed to update the room.",
        });
        setShowSaveConfirmDialog(false);
    } finally {
        setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!room) {
    return <div>Room not found.</div>;
  }

  return (
    <form ref={formRef} id="edit-room-form" onSubmit={(e) => { e.preventDefault(); setShowSaveConfirmDialog(true); }} className="space-y-6">
      <Toaster />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/rooms">Room Management</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Room {room.room_number}</BreadcrumbPage>
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
                <Input id="room-number" value={room.room_number} disabled />
                <p className="text-xs text-muted-foreground">Room number cannot be changed</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="room-type">Room Type</Label>
                 <Select name="roomTypeId" defaultValue={String(room.room_type_id)}>
                  <SelectTrigger id="room-type">
                    <SelectValue placeholder="Select Room Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map(type => (
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
                <Input id="descriptive-title" name="descriptiveTitle" defaultValue={room.descriptive_title} />
              </div>
            <div className="space-y-2">
              <Label htmlFor="short-description">Short Description</Label>
              <Textarea id="short-description" name="shortDescription" defaultValue={room.short_description} />
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
                  <Input id="adults" name="adults" type="number" defaultValue={room.adults_capacity} className="w-16 text-center" />
                  <Button type="button" variant="outline" size="icon" className="h-9 w-9"><Plus className="h-4 w-4" /></Button>
                </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor="children">Children</Label>
                <div className="flex items-center space-x-2">
                  <Button type="button" variant="outline" size="icon" className="h-9 w-9"><Minus className="h-4 w-4" /></Button>
                  <Input id="children" name="children" type="number" defaultValue={room.children_capacity} className="w-16 text-center" />
                  <Button type="button" variant="outline" size="icon" className="h-9 w-9"><Plus className="h-4 w-4" /></Button>
                </div>
              </div>
                <div className="space-y-2">
                    <Label>Room Size</Label>
                    <div className="flex items-center gap-2">
                        <Input name="roomWidth" type="text" defaultValue={room.room_width} className="w-24" />
                        <span className="text-sm text-muted-foreground">width</span>
                        <Input name="roomHeight" type="text" defaultValue={room.room_height} className="w-24" />
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
                        <span className="p-2 border rounded-l-md bg-muted text-muted-foreground text-sm">{room.currency}</span>
                        <Input id="price" name="pricePerNight" type="number" defaultValue={room.price_per_night} className="rounded-l-none" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="status">Current Status</Label>
                     <Select name="status" defaultValue={room.current_status}>
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
                {allAmenities.map(amenity => (
                  <div key={amenity.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`amenity-${amenity.id}`}
                      checked={selectedAmenities.has(String(amenity.id))}
                      onCheckedChange={(checked) => handleAmenityChange(String(amenity.id), !!checked)}
                    />
                    <Label htmlFor={`amenity-${amenity.id}`} className="font-normal">{amenity.amenity_name}</Label>
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
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="relative aspect-video group">
                        {imageSlots[index]?.preview ? (
                            <>
                            <Image
                                src={imageSlots[index].preview!}
                                alt={`Room image ${index + 1}`}
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
                            {imageSlots[index].isPrimary && <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1"><Star className="w-3 h-3" /> Primary</div>}
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

      <div className="flex justify-between items-center">
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Room
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader className="sr-only">
                    <AlertDialogTitle>Delete Room</AlertDialogTitle>
                    <AlertDialogDescription>Are you sure you want to delete this room?</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Do you want to Delete this Room ?</h2>
                    <p className="text-lg text-red-500">Room Number {room.room_number}</p>
                </div>
                <AlertDialogFooter className="sm:justify-center">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
                 <button onClick={() => setShowDeleteDialog(false)} className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200">
                    <X className="h-5 w-5" />
                </button>
            </AlertDialogContent>
        </AlertDialog>

        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" asChild>
                <Link href="/rooms">Cancel</Link>
            </Button>
            <AlertDialog open={showSaveConfirmDialog} onOpenChange={setShowSaveConfirmDialog}>
              <AlertDialogTrigger asChild>
                <Button type="submit">Save Changes</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                  <AlertDialogHeader className="sr-only">
                      <AlertDialogTitle>Update Room</AlertDialogTitle>
                      <AlertDialogDescription>Are you sure you want to update this room?</AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="text-center p-4">
                      <h2 className="text-2xl font-bold mb-4">Do you want to Update this Room ?</h2>
                  </div>
                  <AlertDialogFooter className="sm:justify-center">
                      <AlertDialogCancel type="button" onClick={() => setShowSaveConfirmDialog(false)}>Cancel</AlertDialogCancel>
                      <AlertDialogAction type="button" onClick={handleSaveConfirm} disabled={isSubmitting}>
                          {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </AlertDialogAction>
                  </AlertDialogFooter>
                  <button type="button" onClick={() => setShowSaveConfirmDialog(false)} className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200">
                      <X className="h-5 w-5" />
                  </button>
            </AlertDialogContent>
            </AlertDialog>
        </div>
      </div>
      
       <Dialog open={showDeleteSuccessDialog} onOpenChange={setShowDeleteSuccessDialog}>
          <DialogContent className="sm:max-w-md">
             <DialogHeader className="sr-only">
                  <DialogTitleComponent>Success</DialogTitleComponent>
                  <DialogDescriptionComponent>The room was successfully deleted.</DialogDescriptionComponent>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center text-center p-8">
                  <div className="p-4 bg-red-100 rounded-full mb-4">
                      <div className="p-2 bg-red-200 rounded-full">
                         <Trash2 className="h-8 w-8 text-red-600" />
                      </div>
                  </div>
                  <h2 className="text-xl font-bold mb-2">Successfully Deleted Room {room.room_number}!</h2>
                  <DialogClose asChild>
                      <Button className="mt-6 w-full" onClick={() => {
                        setShowDeleteSuccessDialog(false);
                        router.push('/rooms');
                      }}>Done</Button>
                  </DialogClose>
              </div>
          </DialogContent>
      </Dialog>
      <Dialog open={showSaveSuccessDialog} onOpenChange={setShowSaveSuccessDialog}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader className="sr-only">
                <DialogTitleComponent>Success</DialogTitleComponent>
                <DialogDescriptionComponent>The room was successfully updated.</DialogDescriptionComponent>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center text-center p-8">
                <div className="p-4 bg-blue-100 rounded-full mb-4">
                    <div className="p-2 bg-blue-200 rounded-full">
                        <CheckCircle2 className="h-8 w-8 text-blue-600" />
                    </div>
                </div>
                <h2 className="text-xl font-bold mb-2">Successfully Updated Room {room.room_number}!</h2>
                <DialogClose asChild>
                    <Button className="mt-6 w-full" onClick={() => {
                      setShowSaveSuccessDialog(false);
                      router.push('/rooms');
                      }}>Done</Button>
                </DialogClose>
            </div>
        </DialogContent>
      </Dialog>
    </form>
  );
}

    
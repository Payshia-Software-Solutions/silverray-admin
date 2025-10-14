
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Bold, Italic, List, Upload, X, CheckCircle2, Image as ImageIcon, Trash2, MoreVertical, Star, Plus, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { createRestaurant, uploadRestaurantImage, type RestaurantFromApi, getRestaurantFeatures, type RestaurantFeatureFromApi, createOperatingHours } from '@/lib/services/api';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
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
import OperatingHoursForm from '@/components/operating-hours-form';
import type { OperatingHoursState } from '@/components/operating-hours-form';

const restaurantSchema = z.object({
  venue_name: z.string().min(1, "Venue name is required"),
  capacity: z.coerce.number().min(1, "Capacity is required"),
  short_description: z.string().optional(),
  detailed_description: z.string().optional(),
  custom_feature: z.string().optional(),
  status: z.enum(['Active', 'Inactive', 'Seasonal']),
  status_notes: z.string().optional(),
  feature_ids: z.array(z.string()).optional(),
});

type RestaurantFormValues = z.infer<typeof restaurantSchema>;

interface ImageSlot {
  file: File | null;
  preview: string | null;
  isPrimary: boolean;
}

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function NewRestaurantPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [features, setFeatures] = useState<RestaurantFeatureFromApi[]>([]);
  const [loadingFeatures, setLoadingFeatures] = useState(true);

  const [operatingHours, setOperatingHours] = useState<OperatingHoursState>(
    daysOfWeek.reduce((acc, day) => {
        acc[day] = { open: true, open_time: '09:00', close_time: '22:00' };
        return acc;
    }, {} as OperatingHoursState)
  );

  const [imageSlots, setImageSlots] = useState<ImageSlot[]>(Array(5).fill({ file: null, preview: null, isPrimary: false }));
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [newlyCreatedRestaurant, setNewlyCreatedRestaurant] = useState<RestaurantFromApi | null>(null);
  
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      status: 'Active',
      feature_ids: [],
    }
  });

  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoadingFeatures(true);
        const featuresData = await getRestaurantFeatures();
        setFeatures(featuresData);
      } catch (err: any) {
        toast({ variant: 'destructive', title: 'Error fetching initial data', description: err.message });
      } finally {
        setLoadingFeatures(false);
      }
    }
    fetchInitialData();
  }, [toast]);

  const onSubmit: SubmitHandler<RestaurantFormValues> = async (data) => {
    try {
        const hoursData: any = { capacity: data.capacity, company_id: '1' };
        daysOfWeek.forEach(day => {
            const dayKey = day as keyof OperatingHoursState;
            hoursData[`${dayKey}_open`] = operatingHours[dayKey].open ? 1 : 0;
            hoursData[`${dayKey}_open_time`] = operatingHours[dayKey].open ? `${operatingHours[dayKey].open_time}:00` : null;
            hoursData[`${dayKey}_close_time`] = operatingHours[dayKey].open ? `${operatingHours[dayKey].close_time}:00` : null;
        });

        const createdHours = await createOperatingHours(hoursData);
        if (!createdHours || !createdHours.id) {
            throw new Error("Failed to create operating hours schedule.");
        }

        const restaurantData = {
            ...data,
            company_id: '1',
            created_by: 'admin_user',
            updated_by: 'admin_user',
            feature_id: data.feature_ids?.join(',') || '',
            images_url: '', // Image handled in second step
            operating_hours_id: String(createdHours.id),
        };
        const createdRestaurant = await createRestaurant(restaurantData);
        setNewlyCreatedRestaurant(createdRestaurant);
        setShowImageDialog(true);
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error Creating Venue",
            description: error.message || "An unexpected error occurred."
        });
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImageSlots = [...imageSlots];
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

  const handleImageUploads = async () => {
    if (!newlyCreatedRestaurant) return;

    const imagesToUpload = imageSlots.filter(slot => slot.file !== null);

    if (imagesToUpload.length === 0) {
        toast({ title: "No images to upload", description: "You can upload images later by editing the venue."});
        setShowImageDialog(false);
        router.push('/restaurant');
        return;
    }

    try {
        for (const slot of imagesToUpload) {
            if (slot.file) {
                await uploadRestaurantImage(newlyCreatedRestaurant.id, slot.file, slot.isPrimary);
            }
        }
        toast({ title: "Success!", description: "Venue and images uploaded successfully."});
        setShowImageDialog(false);
        router.push('/restaurant');

    } catch (error: any) {
         toast({
            variant: "destructive",
            title: "Image Upload Failed",
            description: error.message || "An unexpected error occurred during image upload.",
        });
    }
  }


  return (
    <>
    <Toaster/>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/restaurant">Restaurant Management</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add New Restaurant</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="grid gap-6">
        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="space-y-2">
                <Label htmlFor="venue-name">Venue Name *</Label>
                <Input id="venue-name" placeholder="e.g., Skyline Rooftop Bar" {...register('venue_name')} />
                    {errors.venue_name && <p className="text-red-500 text-sm">{errors.venue_name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="short-description">Short Description</Label>
              <Textarea id="short-description" placeholder="Brief overview of the venue" {...register('short_description')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="detailed-description">Detailed Description</Label>
              <div className="rounded-md border">
                <div className="p-2 border-b flex items-center gap-1">
                   <Button type="button" variant="ghost" size="icon" className="h-8 w-8"><Bold className="h-4 w-4" /></Button>
                   <Button type="button" variant="ghost" size="icon" className="h-8 w-8"><Italic className="h-4 w-4" /></Button>
                   <Button type="button" variant="ghost" size="icon" className="h-8 w-8"><List className="h-4 w-4" /></Button>
                </div>
                <Textarea
                  id="detailed-description"
                  className="min-h-[120px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Comprehensive description with formatting options"
                   {...register('detailed_description')}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
         <Card>
          <CardContent className="p-6 space-y-6">
             <OperatingHoursForm
              operatingHours={operatingHours}
              setOperatingHours={setOperatingHours}
              register={register}
              errors={errors}
            />
          </CardContent>
        </Card>

        <Card>
            <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2"><Star className="h-5 w-5 text-primary"/>Features & Ambiance</h3>
                 <Controller
                    name="feature_ids"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {loadingFeatures ? <p>Loading features...</p> : features.map(feature => (
                            <div key={feature.id} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={`feature-${feature.id}`}
                                    checked={field.value?.includes(String(feature.id))}
                                    onCheckedChange={(checked) => {
                                        const currentFeatures = field.value || [];
                                        if(checked) {
                                            field.onChange([...currentFeatures, String(feature.id)])
                                        } else {
                                            field.onChange(currentFeatures.filter(id => id !== String(feature.id)))
                                        }
                                    }}
                                />
                                <Label htmlFor={`feature-${feature.id}`} className="font-normal">{feature.feature_name}</Label>
                            </div>
                        ))}
                      </div>
                    )}
                 />
                <div className="space-y-2">
                    <Label htmlFor="custom-feature">Custom Feature</Label>
                    <Input id="custom-feature" placeholder="Add a unique feature" {...register('custom_feature')} />
                </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold">Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="status">Current Status</Label>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger id="status"><SelectValue placeholder="Select Status" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                        <SelectItem value="Seasonal">Seasonal</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
            <Button variant="outline" asChild type="button"><Link href="/restaurant">Cancel</Link></Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Venue'}
            </Button>
        </div>
      </div>
    </form>
    <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Step 2: Upload Venue Images</DialogTitle>
            <DialogDescription>
              Venue "{newlyCreatedRestaurant?.venue_name}" has been created. Add up to 5 images. The primary image will be shown first.
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
                <Button variant="outline" onClick={() => router.push('/restaurant')}>Skip for now</Button>
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

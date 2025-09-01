
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Bold, Italic, Underline, Plus, Image as ImageIcon, X, UploadCloud, CheckCircle2, MoreVertical, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getRestaurantFeatures, type RestaurantFeatureFromApi, createRestaurant, uploadRestaurantImage, type RestaurantFromApi } from '@/lib/services/api';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useRouter } from 'next/navigation';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const restaurantSchema = z.object({
  venue_name: z.string().min(1, "Venue name is required"),
  short_description: z.string().optional(),
  detailed_description: z.string().optional(),
  capacity: z.coerce.number().min(1, "Capacity is required"),
  status: z.enum(['Active', 'Inactive', 'Seasonal']),
  status_notes: z.string().optional(),
  operating_hours: z.any(),
  features: z.array(z.string()).optional(),
  image_urls: z.string().optional(),
});

type RestaurantFormValues = z.infer<typeof restaurantSchema>;

interface ImageSlot {
  file: File | null;
  preview: string | null;
  isPrimary: boolean;
}


export default function NewRestaurantVenuePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [features, setFeatures] = useState<RestaurantFeatureFromApi[]>([]);
  const [loadingFeatures, setLoadingFeatures] = useState(true);
  
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>(Array(5).fill({ file: null, preview: null, isPrimary: false }));
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [newlyCreatedVenue, setNewlyCreatedVenue] = useState<RestaurantFromApi | null>(null);

  
  const { register, handleSubmit, control, formState: { errors, isSubmitting }, setValue } = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      status: 'Active',
      capacity: 50,
      operating_hours: daysOfWeek.reduce((acc, day) => ({ ...acc, [day.toLowerCase()]: { isOpen: true, open: '09:00', close: '22:00' } }), {}),
      features: []
    }
  });


   useEffect(() => {
    async function fetchFeatures() {
      try {
        setLoadingFeatures(true);
        const data = await getRestaurantFeatures();
        setFeatures(data);
      } catch (err) {
        console.error("Failed to fetch features:", err);
      } finally {
        setLoadingFeatures(false);
      }
    }
    fetchFeatures();
  }, []);

  const onSubmit: SubmitHandler<RestaurantFormValues> = async (data) => {
    try {
        const restaurantData = {
          venue_name: data.venue_name,
          short_description: data.short_description || '',
          detailed_description: data.detailed_description || '',
          capacity: data.capacity,
          feature_id: data.features?.join(',') || '',
          images_url: '', // Will be updated after image upload
          status: data.status,
          status_notes: data.status_notes || '',
          company_id: 'COMP001',
          created_by: 'admin_user',
          updated_by: null,
          operating_hours_id: 1, // Placeholder as per your JSON structure
        };

        const createdVenue = await createRestaurant(restaurantData);
        setNewlyCreatedVenue(createdVenue);
        setShowImageDialog(true);

    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error creating venue', description: error.message });
    }
  }

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
    if (!newlyCreatedVenue) return;

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
                await uploadRestaurantImage(newlyCreatedVenue.id, slot.file, slot.isPrimary);
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
    <div className="space-y-6">
      <Toaster />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/restaurant">Restaurant Management</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add New Venue</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="venue-name">Venue Name *</Label>
              <Input id="venue-name" {...register('venue_name')} />
               {errors.venue_name && <p className="text-red-500 text-sm">{errors.venue_name.message}</p>}
            </div>
            <div>
              <Label htmlFor="short-description">Short Description</Label>
              <Textarea
                id="short-description"
                placeholder="e.g., Elegant fine dining with panoramic ocean views."
                 {...register('short_description')}
              />
            </div>
            <div>
              <Label htmlFor="detailed-description">Detailed Description</Label>
              <div className="rounded-md border">
                <div className="p-2 border-b">
                   <Button type="button" variant="ghost" size="icon" className="h-8 w-8"><Bold className="h-4 w-4" /></Button>
                   <Button type="button" variant="ghost" size="icon" className="h-8 w-8"><Italic className="h-4 w-4" /></Button>
                   <Button type="button" variant="ghost" size="icon" className="h-8 w-8"><Underline className="h-4 w-4" /></Button>
                </div>
                <Textarea
                  id="detailed-description"
                  className="min-h-[120px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Full description of the venue, ambiance, cuisine style, etc."
                   {...register('detailed_description')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Capacity &amp; Operating Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="capacity">Capacity *</Label>
              <div className="flex items-center gap-2">
                <Input id="capacity" type="number" className="w-24" {...register('capacity')} />
                <span>guests</span>
              </div>
              {errors.capacity && <p className="text-red-500 text-sm">{errors.capacity.message}</p>}
            </div>
            <div>
              <Label>Operating Hours</Label>
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {daysOfWeek.map((day) => (
                  <Controller
                    key={day}
                    name={`operating_hours.${day.toLowerCase()}`}
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <p className="font-medium text-sm">{day}</p>
                        <div className="flex items-center gap-2">
                          <Switch
                            id={`open-${day}`}
                            checked={field.value?.isOpen || false}
                            onCheckedChange={(checked) => field.onChange({...field.value, isOpen: checked})}
                          />
                          <Label htmlFor={`open-${day}`}>{field.value?.isOpen ? 'Open' : 'Closed'}</Label>
                        </div>
                         {field.value?.isOpen && (
                            <div className="flex items-center gap-1">
                              <Input type="time" className="w-full" value={field.value.open} onChange={(e) => field.onChange({...field.value, open: e.target.value})} />
                              <span>-</span>
                              <Input type="time" className="w-full" value={field.value.close} onChange={(e) => field.onChange({...field.value, close: e.target.value})} />
                            </div>
                         )}
                      </div>
                    )}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features &amp; Ambiance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Controller
                name="features"
                control={control}
                render={({ field }) => (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {loadingFeatures ? <p>Loading features...</p> : features.map(feature => (
                        <div key={feature.id} className="flex items-center space-x-2">
                            <Checkbox 
                            id={`feature-${feature.id}`}
                            checked={field.value?.includes(String(feature.id))}
                            onCheckedChange={(checked) => {
                                const currentFeatures = field.value || [];
                                if (checked) {
                                field.onChange([...currentFeatures, String(feature.id)]);
                                } else {
                                field.onChange(currentFeatures.filter(id => id !== String(feature.id)));
                                }
                            }}
                            />
                            <Label htmlFor={`feature-${feature.id}`} className="font-normal">{feature.feature_name}</Label>
                        </div>
                        ))}
                    </div>
                )}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="current-status">Current Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="current-status">
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="Seasonal">Seasonal</SelectItem>
                        </SelectContent>
                    </Select>
                  )}
                />
            </div>
             <div>
                <Label htmlFor="status-notes">Status Notes</Label>
                <Input id="status-notes" placeholder="Optional notes about status" {...register('status_notes')} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
            <Button variant="outline" asChild type="button"><Link href="/restaurant">Cancel</Link></Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Venue'}</Button>
        </div>
      </form>
       <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Step 2: Upload Venue Images</DialogTitle>
            <DialogDescription>
              Venue "{newlyCreatedVenue?.venue_name}" has been created. Add up to 5 images. The primary image will be shown first.
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
    </div>
  );
}

    

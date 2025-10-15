

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
import { Bold, Italic, List, Plus, Trash2, X, CheckCircle2, Upload, MoreVertical, Star, Building2, Clock, Users, Tag, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
    getRestaurantById, 
    updateRestaurant, 
    deleteRestaurant, 
    getRestaurantFeatures, 
    RestaurantFromApi, 
    RestaurantFeatureFromApi,
    OperatingHoursFromApi,
    getOperatingHoursById,
    updateOperatingHours,
    getRestaurantImages,
    uploadRestaurantImage,
    updateRestaurantImage,
    deleteRestaurantImage,
    RestaurantImageFromApi,
    CONTENT_PROVIDER_BASE_URL
} from '@/lib/services/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useRouter, useParams } from 'next/navigation';
import OperatingHoursForm, { type OperatingHoursState } from '@/components/operating-hours-form';
import { Skeleton } from '@/components/ui/skeleton';


const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];


const restaurantSchema = z.object({
  venue_name: z.string().min(1, "Venue name is required"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  short_description: z.string().optional(),
  detailed_description: z.string().optional(),
  status: z.enum(['Active', 'Inactive', 'Seasonal']),
  status_notes: z.string().optional(),
  feature_ids: z.array(z.string()).optional(),
  images_url: z.string().optional().nullable(),
});

type RestaurantFormValues = z.infer<typeof restaurantSchema>;

interface ImageSlot {
  file: File | null;
  preview: string | null;
  isPrimary: boolean;
  id?: number;
}

export default function EditRestaurantPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const { toast } = useToast();

  const [showSaveSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);
  const [restaurant, setRestaurant] = useState<RestaurantFromApi | null>(null);
  const [operatingHours, setOperatingHours] = useState<OperatingHoursState | null>(null);
  const [features, setFeatures] = useState<RestaurantFeatureFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingHours, setLoadingHours] = useState(true);
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>([]);
  const [imageToDelete, setImageToDelete] = useState<ImageSlot | null>(null);

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema),
  });

  useEffect(() => {
    async function fetchRestaurantData() {
      if (!id) return;
      setLoading(true);
      setLoadingHours(true);
      try {
        const [restaurantData, featuresData, imagesData] = await Promise.all([
            getRestaurantById(id),
            getRestaurantFeatures(),
            getRestaurantImages(id),
        ]);
        setRestaurant(restaurantData);
        setFeatures(featuresData);
        
        reset({
          ...restaurantData,
          feature_ids: restaurantData.feature_id ? restaurantData.feature_id.split(',') : [],
          capacity: Number(restaurantData.capacity)
        });
        
        const formattedImages = imagesData.map(img => ({
            id: img.id,
            file: null,
            preview: CONTENT_PROVIDER_BASE_URL + img.image_url,
            isPrimary: img.is_primary === 1,
        }));
        setImageSlots(formattedImages);

        if (restaurantData.operating_hours_id) {
          try {
            const hoursData = await getOperatingHoursById(restaurantData.operating_hours_id);
            if (hoursData) {
              const newOperatingHoursState: OperatingHoursState = {};
              daysOfWeek.forEach(day => {
                  const dayKey = day as keyof typeof newOperatingHoursState;
                  const openKey = `${dayKey}_open` as keyof OperatingHoursFromApi;
                  const openTimeKey = `${dayKey}_open_time` as keyof OperatingHoursFromApi;
                  const closeTimeKey = `${dayKey}_close_time` as keyof OperatingHoursFromApi;

                  newOperatingHoursState[dayKey] = {
                      open: hoursData[openKey] === 1,
                      open_time: String(hoursData[openTimeKey] || '00:00:00').substring(0, 5),
                      close_time: String(hoursData[closeTimeKey] || '00:00:00').substring(0, 5),
                  };
              });
              setOperatingHours(newOperatingHoursState);
            }
          } catch(hoursError) {
             console.error("Failed to fetch operating hours:", hoursError);
             toast({
                variant: "destructive",
                title: "Error fetching operating hours",
                description: "Could not load the schedule for this venue.",
             });
          }
        }

      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error fetching data",
          description: error.message || "An unexpected error occurred.",
        });
      } finally {
        setLoading(false);
        setLoadingHours(false);
      }
    }
    fetchRestaurantData();
  }, [id, reset, toast]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const file = event.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const newImageSlots = [...imageSlots];
              const isFirstImage = !imageSlots.some(slot => slot.preview);
              
              const newSlot: ImageSlot = { 
                  file, 
                  preview: reader.result as string, 
                  isPrimary: newImageSlots[index]?.isPrimary || isFirstImage, 
                  id: newImageSlots[index]?.id 
              };
              
              newImageSlots[index] = newSlot;
              setImageSlots(newImageSlots);
          };
          reader.readAsDataURL(file);
      }
  };

  const removeImage = (indexToRemove: number) => {
      const image = imageSlots[indexToRemove];
      if (image.id) {
          setImageToDelete(image);
      } else {
          const newSlots = imageSlots.filter((_, index) => index !== indexToRemove);
          setImageSlots(newSlots);
      }
  };

  const handleConfirmDeleteImage = async () => {
      if (!imageToDelete || !imageToDelete.id) return;
      try {
          await deleteRestaurantImage(imageToDelete.id);
          toast({ title: 'Success', description: 'Image deleted successfully.' });
          setImageSlots(currentSlots => currentSlots.filter(slot => slot.id !== imageToDelete.id));
      } catch (error: any) {
          toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete image.' });
      } finally {
          setImageToDelete(null);
      }
  }

  const setPrimaryImage = async (selectedIndex: number) => {
      const newPrimaryImage = imageSlots[selectedIndex];
      if (!newPrimaryImage || newPrimaryImage.isPrimary) return;

      const oldPrimaryImage = imageSlots.find(slot => slot.isPrimary);

      try {
          if (newPrimaryImage.id) {
              await updateRestaurantImage(newPrimaryImage.id, { is_primary: 1 });
          }
          if (oldPrimaryImage && oldPrimaryImage.id) {
              await updateRestaurantImage(oldPrimaryImage.id, { is_primary: 0 });
          }

          const newImageSlots = imageSlots.map((slot, index) => ({
              ...slot,
              isPrimary: index === selectedIndex,
          }));
          setImageSlots(newImageSlots);
          toast({ title: 'Success', description: 'Primary image updated.' });
      } catch (error) {
          toast({ variant: 'destructive', title: 'Error', description: 'Failed to update primary image.' });
      }
  };

  const onSubmit: SubmitHandler<RestaurantFormValues> = async (data) => {
    if (!restaurant) return;
    try {
      if (operatingHours && restaurant.operating_hours_id) {
         const hoursDataToUpdate: Partial<OperatingHoursFromApi> = {};
          daysOfWeek.forEach(day => {
              const dayKey = day as keyof OperatingHoursState;
              hoursDataToUpdate[`${dayKey}_open` as keyof OperatingHoursFromApi] = operatingHours[dayKey].open ? 1 : 0;
              hoursDataToUpdate[`${dayKey}_open_time` as keyof OperatingHoursFromApi] = operatingHours[dayKey].open ? operatingHours[dayKey].open_time + ':00' : null;
              hoursDataToUpdate[`${dayKey}_close_time` as keyof OperatingHoursFromApi] = operatingHours[dayKey].open ? operatingHours[dayKey].close_time + ':00' : null;
          });
        await updateOperatingHours(restaurant.operating_hours_id, hoursDataToUpdate);
      }
      
      const primaryImage = imageSlots.find(slot => slot.isPrimary);
      const primaryImageUrl = primaryImage?.file
          ? '' // will be handled by upload
          : (primaryImage?.preview?.replace(CONTENT_PROVIDER_BASE_URL, '') || null);

      const restaurantDataToUpdate = {
        ...data,
        feature_id: data.feature_ids?.join(','),
        images_url: primaryImageUrl,
      };
      await updateRestaurant(restaurant.id, restaurantDataToUpdate);
      
      const newImages = imageSlots.filter(slot => slot.file);
      for (const slot of newImages) {
          if (slot.file) {
              await uploadRestaurantImage(id, slot.file, slot.isPrimary);
          }
      }

      setShowSuccessDialog(true);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating venue",
        description: error.message || "An unexpected error occurred."
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!restaurant) return;
    setShowDeleteConfirmDialog(false);
    try {
      await deleteRestaurant(restaurant.id);
      setShowDeleteSuccessDialog(true);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error Deleting Venue',
        description: error.message || 'An unexpected error occurred.',
      });
    }
  }
  
  if (loading) return <div>Loading...</div>;
  if (!restaurant) return <div>Restaurant not found.</div>;

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
            <BreadcrumbPage>{restaurant.venue_name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Building2 className="h-5 w-5 text-primary"/>Basic Information</h3>
            <div className="space-y-2">
                <Label htmlFor="venue-name">Venue Name</Label>
                <Input id="venue-name" {...register('venue_name')} />
                {errors.venue_name && <p className="text-red-500 text-sm">{errors.venue_name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="short-description">Short Description</Label>
              <Textarea id="short-description" {...register('short_description')} />
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
                  {...register('detailed_description')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardContent className="p-6 space-y-6">
              {loadingHours ? (
                 <div className="space-y-4">
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-10 w-1/2" />
                   <div className="space-y-3">
                      {daysOfWeek.map(day => <Skeleton key={day} className="h-16 w-full" />)}
                   </div>
                 </div>
              ) : operatingHours ? (
                  <OperatingHoursForm 
                      operatingHours={operatingHours}
                      setOperatingHours={setOperatingHours}
                      register={register}
                      errors={errors}
                  />
              ) : (
                <p>No operating hours schedule found for this venue.</p>
              )}
            </CardContent>
        </Card>
        
        <Card>
            <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2"><Star className="h-5 w-5 text-primary"/>Features &amp; Ambiance</h3>
                 <Controller
                    name="feature_ids"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {features.map(feature => (
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
            <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2"><ImageIcon className="h-5 w-5 text-primary"/>Image Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="relative aspect-video group">
                        {imageSlots[index]?.preview ? (
                            <>
                            <Image
                                src={imageSlots[index].preview!}
                                alt={`Restaurant image ${index + 1}`}
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

        <Card>
            <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2"><Tag className="h-5 w-5 text-primary"/>Status</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="status">Current Status</Label>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                        <SelectItem value="Seasonal">Seasonal</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status-notes">Status Notes</Label>
                        <Textarea id="status-notes" placeholder="Optional notes about status" {...register('status_notes')} />
                    </div>
                </div>
            </CardContent>
        </Card>
      
        <div className="flex justify-between items-center">
            <AlertDialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" type="button"><Trash2 className="mr-2 h-4 w-4" /> Delete Venue</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-center text-2xl font-bold">Do you want to Delete this Venue?</AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-red-500 text-lg">
                            {restaurant.venue_name}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                        <button onClick={() => setShowDeleteConfirmDialog(false)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted">
                        <X className="h-5 w-5" />
                    </button>
                </AlertDialogContent>
            </AlertDialog>
            <div className="flex justify-end gap-2">
                <Button variant="outline" asChild type="button">
                <Link href="/restaurant">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
      </form>

      <Dialog open={showSaveSuccessDialog} onOpenChange={setShowSuccessDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="sr-only">
                    <DialogTitle>Success</DialogTitle>
                    <DialogDescription>The changes have been saved.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center text-center p-8 pt-0">
                    <div className="p-4 bg-blue-100 rounded-full mb-4">
                        <div className="p-2 bg-blue-200 rounded-full">
                           <CheckCircle2 className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold mb-2">Successfully Saved Changes!</h2>
                    <DialogClose asChild>
                        <Button className="mt-6 w-full" onClick={() => router.push('/restaurant')}>Done</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>

        <Dialog open={showDeleteSuccessDialog} onOpenChange={setShowDeleteSuccessDialog}>
          <DialogContent>
            <DialogHeader className='sr-only'>
              <DialogTitle>Venue Deleted</DialogTitle>
              <DialogDescription>The venue has been successfully deleted.</DialogDescription>
            </DialogHeader>
            <div className="text-center p-6 flex flex-col items-center">
                <div className="p-3 bg-red-100 rounded-full mb-4">
                    <Trash2 className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Successfully Deleted {restaurant.venue_name}!</h2>
                 <DialogClose asChild>
                    <Button className="mt-4" onClick={() => router.push('/restaurant')}>Done</Button>
                </DialogClose>
            </div>
            <DialogClose asChild>
                <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted" onClick={() => setShowDeleteSuccessDialog(false)}>
                    <X className="h-5 w-5" />
                </button>
            </DialogClose>
          </DialogContent>
      </Dialog>
      <AlertDialog open={!!imageToDelete} onOpenChange={setImageToDelete.bind(null, null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Delete Image?</AlertDialogTitle>
                <AlertDialogDescription>
                    Are you sure you want to permanently delete this image? This action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDeleteImage}>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </div>
  );
}



    




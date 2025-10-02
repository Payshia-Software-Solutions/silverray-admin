
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
import { Bold, Italic, List, Upload, X, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { createRestaurant, uploadRestaurantImage, createOperatingHours, type RestaurantFromApi, type OperatingHoursFromApi, getRestaurantFeatures, type RestaurantFeatureFromApi } from '@/lib/services/api';
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

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const restaurantSchema = z.object({
  venue_name: z.string().min(1, "Venue name is required"),
  capacity: z.coerce.number().min(1, "Capacity is required"),
  short_description: z.string().optional(),
  detailed_description: z.string().optional(),
  special_hours_notes: z.string().optional(),
  custom_feature: z.string().optional(),
  status: z.enum(['Active', 'Inactive', 'Seasonal']),
  status_notes: z.string().optional(),
});

type RestaurantFormValues = z.infer<typeof restaurantSchema>;

interface ImageSlot {
  file: File | null;
  preview: string | null;
}

export default function NewRestaurantPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [features, setFeatures] = useState<RestaurantFeatureFromApi[]>([]);
  const [loadingFeatures, setLoadingFeatures] = useState(true);
  const [operatingHours, setOperatingHours] = useState<any>({});
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>(Array(5).fill({ file: null, preview: null }));
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      status: 'Active',
    }
  });

  useEffect(() => {
    async function fetchFeatures() {
      try {
        setLoadingFeatures(true);
        const data = await getRestaurantFeatures();
        setFeatures(data);
      } catch (err: any) {
        toast({ variant: 'destructive', title: 'Error fetching features', description: err.message });
      } finally {
        setLoadingFeatures(false);
      }
    }
    fetchFeatures();
  }, [toast]);
  
  const handleDayToggle = (day: string, checked: boolean) => {
    setOperatingHours((prev: any) => ({
      ...prev,
      [`${day}_open`]: checked ? 1 : 0
    }));
  };

  const handleTimeChange = (day: string, type: 'open_time' | 'close_time', value: string) => {
    setOperatingHours((prev: any) => ({
      ...prev,
      [`${day}_${type}`]: value
    }));
  };
  
  const onSubmit: SubmitHandler<RestaurantFormValues> = async (data) => {
    try {
        // Step 1: Create operating hours
        const hoursData = {
          ...operatingHours,
          capacity: data.capacity,
          company_id: '1'
        };
        const createdHours = await createOperatingHours(hoursData);

        // Step 2: Create restaurant
        const restaurantData = {
            ...data,
            company_id: '1',
            created_by: 'admin_user',
            operating_hours_id: createdHours.id.toString(),
            feature_id: '1', // This should be dynamic
            images_url: '', // Will be updated after upload
        };
        const createdRestaurant = await createRestaurant(restaurantData);

        // Step 3: Upload images
        const imagesToUpload = imageSlots.filter(slot => slot.file);
        if (imagesToUpload.length > 0) {
            for (const [index, slot] of imagesToUpload.entries()) {
                if (slot.file) {
                    await uploadRestaurantImage(createdRestaurant.id, slot.file, index === 0);
                }
            }
        }
        
        setShowSuccessDialog(true);
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
        newImageSlots[index] = { file, preview: reader.result as string };
        setImageSlots(newImageSlots);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    const newImageSlots = [...imageSlots];
    newImageSlots[index] = { file: null, preview: null };
    setImageSlots(newImageSlots);
  };


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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="venue-name">Venue Name *</Label>
                    <Input id="venue-name" placeholder="e.g., Skyline Rooftop Bar" {...register('venue_name')} />
                     {errors.venue_name && <p className="text-red-500 text-sm">{errors.venue_name.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity *</Label>
                    <Input id="capacity" type="number" placeholder="Maximum occupancy" {...register('capacity')} />
                     {errors.capacity && <p className="text-red-500 text-sm">{errors.capacity.message}</p>}
                </div>
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
            <h3 className="text-lg font-semibold">Operating Hours</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {daysOfWeek.map(day => (
                    <div key={day} className="space-y-2">
                        <Label htmlFor={`${day}-open`} className="capitalize text-sm font-medium">{day}</Label>
                         <div className="flex items-center gap-2">
                            <Checkbox id={`${day}-open-check`} defaultChecked={day !== 'sunday'} onCheckedChange={(checked) => handleDayToggle(day, !!checked)} />
                            <Label htmlFor={`${day}-open-check`} className="text-sm">Open</Label>
                         </div>
                        <Input id={`${day}-open-time`} type="time" defaultValue={day !== 'saturday' && day !== 'sunday' ? '09:00' : '10:00'} disabled={day === 'sunday'} onChange={(e) => handleTimeChange(day, 'open_time', e.target.value)} />
                        <Input id={`${day}-close-time`} type="time" defaultValue={day !== 'saturday' && day !== 'sunday' ? '22:00' : '23:00'} disabled={day === 'sunday'} onChange={(e) => handleTimeChange(day, 'close_time', e.target.value)} />
                    </div>
                ))}
            </div>
            <div className="space-y-2">
                <Label htmlFor="special-hours-notes">Special Hours Notes</Label>
                <Input id="special-hours-notes" placeholder="e.g., Brunch only on Sundays, Happy hour 5-7 PM" {...register('special_hours_notes')} />
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Features & Ambiance</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {loadingFeatures ? <p>Loading features...</p> : features.map(feature => (
                        <div key={feature.id} className="flex items-center space-x-2">
                            <Checkbox id={`feature-${feature.id}`} />
                            <Label htmlFor={`feature-${feature.id}`} className="font-normal">{feature.feature_name}</Label>
                        </div>
                    ))}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="custom-feature">Custom Feature</Label>
                    <Input id="custom-feature" placeholder="Add a unique feature" {...register('custom_feature')} />
                </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold">Venue Images</h3>
                 <div className="flex items-center justify-center w-full">
                    <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Drag and drop images here, or <span className="font-semibold text-primary">click to browse files</span></p>
                        </div>
                        <Input id="dropzone-file" type="file" multiple className="hidden" onChange={(e) => handleImageChange(e, 0)} />
                    </label>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {imageSlots.map((slot, index) => slot.preview && (
                        <div key={index} className="relative aspect-square">
                            <Image src={slot.preview} alt={`Preview ${index}`} layout="fill" className="rounded-md object-cover" />
                            <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeImage(index)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardContent className="p-6 space-y-4">
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
                    <div className="space-y-2">
                        <Label htmlFor="status-notes">Status Notes</Label>
                        <Input id="status-notes" placeholder="Optional notes about status" {...register('status_notes')} />
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
    <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader className="sr-only">
                <DialogTitle>Success</DialogTitle>
                <DialogDescription>A new venue has been created.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center text-center p-8">
                <div className="p-4 bg-blue-100 rounded-full mb-4">
                    <div className="p-2 bg-blue-200 rounded-full">
                        <CheckCircle2 className="h-8 w-8 text-blue-600" />
                    </div>
                </div>
                <h2 className="text-xl font-bold mb-2">Successfully Created Venue!</h2>
                <DialogClose asChild>
                    <Button className="mt-6 w-full" onClick={() => router.push('/restaurant')}>Done</Button>
                </DialogClose>
            </div>
        </DialogContent>
    </Dialog>
    </>
  );
}

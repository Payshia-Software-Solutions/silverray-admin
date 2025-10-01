

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Bold, Italic, List, UploadCloud, Plus, Clock, Users, CheckCircle2, X, DollarSign, Trash2 } from 'lucide-react';
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
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { createExperience, uploadExperienceImage, type ExperienceFromApi } from '@/lib/services/api';
import { useRouter } from 'next/navigation';

const experienceSchema = z.object({
  name: z.string().min(1, 'Experience name is required'),
  meeting_Point: z.string().min(1, 'Meeting point is required'),
  short_description: z.string().optional(),
  detailed_description: z.string().optional(),
  duration: z.string().min(1, 'Duration is required'),
  Price: z.string().min(1, 'Price is required'),
  pricing_basis: z.string().min(1, 'Pricing basis is required'),
  min_participants: z.coerce.number().min(1),
  max_participants: z.coerce.number().min(1),
  advance_booking_required: z.boolean(),
  walk_in_available: z.boolean(),
  day_of_week: z.string().min(1, 'Day of week is required'),
  time_slot: z.string().min(1, 'Time slot is required'),
  schedule_note: z.string().optional(),
  status: z.enum(['Active', 'Inactive', 'Seasonal']),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

interface ImageSlot {
  file: File | null;
  preview: string | null;
}

export default function AddExperiencePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showImageUploadDialog, setShowImageUploadDialog] = useState(false);
  const [newlyCreatedExperience, setNewlyCreatedExperience] = useState<ExperienceFromApi | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, control } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      status: 'Active',
      advance_booking_required: true,
      walk_in_available: false,
      min_participants: 1,
      max_participants: 20
    }
  });

  const onSubmit: SubmitHandler<ExperienceFormValues> = async (data) => {
    try {
      const experienceData = {
        ...data,
        images_url: '', // Image handled in second step
        advance_booking_required: data.advance_booking_required ? 1 : 0,
        walk_in_available: data.walk_in_available ? 1 : 0,
        is_available: 1, 
        company_id: '1',
        created_by: 'admin@company.com',
        updated_by: 'admin@company.com',
      };
      
      const { experience: createdExperience } = await createExperience(experienceData);
      setNewlyCreatedExperience(createdExperience);
      setShowImageUploadDialog(true); // Open dialog for step 2

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating experience",
        description: error.message || "An unexpected error occurred."
      });
    }
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    const fileInput = document.getElementById('dropzone-file') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = '';
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile || !newlyCreatedExperience) {
        toast({ title: "No image selected", description: "Please select an image file to upload.", variant: "destructive" });
        return;
    }
    setIsUploading(true);
    try {
        await uploadExperienceImage(newlyCreatedExperience.id, imageFile, true);
        toast({ title: "Success", description: "Image uploaded and experience created successfully!" });
        setShowImageUploadDialog(false);
        router.push('/experience');
    } catch(error: any) {
        toast({ title: "Image Upload Failed", description: error.message, variant: "destructive" });
    } finally {
        setIsUploading(false);
    }
  }


  return (
    <div className="space-y-6">
      <Toaster />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/experience">Experience Management</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add New Experience</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="bg-primary/10 p-2 rounded-full"><List className="h-5 w-5 text-primary"/></span>
                    Basic Information
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="experience-name">Experience Name *</Label>
                <Input id="experience-name" placeholder="e.g., Tea Factory Tour" {...register('name')} />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="meeting-point">Meeting Point *</Label>
                <Input id="meeting-point" placeholder="e.g., Hotel Lobby" {...register('meeting_Point')} />
                 {errors.meeting_Point && <p className="text-red-500 text-sm">{errors.meeting_Point.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="short-description">Short Description</Label>
              <Textarea id="short-description" placeholder="Brief overview for experience cards..." {...register('short_description')} />
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
                  placeholder="Comprehensive description with formatting..."
                  {...register('detailed_description')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="bg-primary/10 p-2 rounded-full"><DollarSign className="h-5 w-5 text-primary"/></span>
                    Pricing & Schedule
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="duration">Duration *</Label>
                    <Input id="duration" placeholder="e.g., 2 hours" {...register('duration')} />
                    {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <div className="flex items-center">
                        <span className="p-2 border rounded-l-md bg-muted text-muted-foreground text-sm">LKR</span>
                        <Input id="price" type="text" placeholder="5000" className="rounded-l-none" {...register('Price')} />
                    </div>
                     {errors.Price && <p className="text-red-500 text-sm">{errors.Price.message}</p>}
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="pricing-basis">Pricing Basis *</Label>
                    <Input id="pricing-basis" placeholder="per person / per group" {...register('pricing_basis')} />
                     {errors.pricing_basis && <p className="text-red-500 text-sm">{errors.pricing_basis.message}</p>}
                 </div>
            </div>
            <div className="space-y-4">
                <Label>Booking Requirements</Label>
                <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <Controller name="advance_booking_required" control={control} render={({ field }) => <Checkbox id="adv-booking" checked={field.value} onCheckedChange={field.onChange} />} />
                        <Label htmlFor="adv-booking" className="font-normal">Advance Booking Required</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Controller name="walk_in_available" control={control} render={({ field }) => <Checkbox id="walk-in" checked={field.value} onCheckedChange={field.onChange} />} />
                        <Label htmlFor="walk-in" className="font-normal">Walk-in Available</Label>
                    </div>
                </div>
            </div>
             <div className="space-y-4">
                <Label>Schedule</Label>
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Day Available *</Label>
                    <Input id="day_of_week" placeholder="e.g. monday" {...register('day_of_week')} />
                    {errors.day_of_week && <p className="text-red-500 text-sm">{errors.day_of_week.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Time Slot *</Label>
                    <Input type="time" className="w-32" {...register('time_slot')} />
                    {errors.time_slot && <p className="text-red-500 text-sm">{errors.time_slot.message}</p>}
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="schedule-notes" className="text-xs text-muted-foreground">Schedule Notes</Label>
                    <Input id="schedule-notes" placeholder="e.g., Every Friday Evening, Daily except Tuesdays" {...register('schedule_note')} />
                 </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="bg-primary/10 p-2 rounded-full"><Users className="h-5 w-5 text-primary"/></span>
                    Participants & Status
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="min-participants">Minimum Participants *</Label>
                <Input id="min-participants" type="number" {...register('min_participants')} />
                {errors.min_participants && <p className="text-red-500 text-sm">{errors.min_participants.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-participants">Maximum Participants *</Label>
                <Input id="max-participants" type="number" {...register('max_participants')} />
                {errors.max_participants && <p className="text-red-500 text-sm">{errors.max_participants.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Controller name="status" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="status"><SelectValue placeholder="Select Status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Seasonal">Seasonal</SelectItem>
                    </SelectContent>
                    </Select>
                )} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" asChild>
              <Link href="/experience">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : '+ Add Experience'}
            </Button>
        </div>
      </form>

      <Dialog open={showImageUploadDialog} onOpenChange={setShowImageUploadDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Step 2: Upload Image</DialogTitle>
            <DialogDescription>
              Your experience "{newlyCreatedExperience?.name}" has been created. Now, upload a primary image for it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!imagePreview ? (
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG (MAX. 5MB)</p>
                </div>
                <Input id="dropzone-file" type="file" className="hidden" onChange={handleImageChange} accept="image/png, image/jpeg" />
              </label>
            ) : (
              <div className="relative w-full max-w-sm mx-auto">
                <Image src={imagePreview} alt="Experience preview" width={400} height={300} className="rounded-lg object-cover aspect-[4/3]" />
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 rounded-full h-8 w-8" onClick={removeImage} type="button">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove image</span>
                </Button>
              </div>
            )}
          </div>
          <DialogClose asChild>
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => router.push('/experience')}>Skip for now</Button>
                <Button onClick={handleImageUpload} disabled={isUploading || !imageFile}>
                    {isUploading ? 'Uploading...' : 'Upload & Finish'}
                </Button>
            </div>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}

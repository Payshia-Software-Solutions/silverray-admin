
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
import { Bold, Italic, List, Plus, Clock, Trash2, X, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription as DialogDescriptionComponent,
  DialogHeader as DialogHeaderComponent,
  DialogTitle as DialogTitleComponent
} from '@/components/ui/dialog';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { getExperienceById, updateExperience, type ExperienceFromApi } from '@/lib/services/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  images_url: z.string().optional(),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

export default function EditExperiencePage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params?.id);
    const { toast } = useToast();

    const [images, setImages] = useState<{ src: string; alt: string; hint: string; primary: boolean }[]>([]);
    const [showSaveConfirmDialog, setShowSaveConfirmDialog] = useState(false);
    const [showSaveSuccessDialog, setShowSaveSuccessDialog] = useState(false);
    const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
    const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);
    const [deletedExperienceTitle, setDeletedExperienceTitle] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting }, control, reset, watch } = useForm<ExperienceFormValues>({
        resolver: zodResolver(experienceSchema),
    });

    const experienceName = watch('name');

    useEffect(() => {
        if (id) {
            async function fetchExperience() {
                try {
                    const experience = await getExperienceById(id);
                    reset({
                        ...experience,
                        advance_booking_required: experience.advance_booking_required === 1,
                        walk_in_available: experience.walk_in_available === 1,
                    });
                     if (experience.images_url) {
                        setImages([{ src: experience.images_url, alt: experience.name, hint: 'experience photo', primary: true }]);
                    }
                } catch (error: any) {
                    toast({
                        variant: 'destructive',
                        title: 'Error fetching experience',
                        description: error.message || 'An unexpected error occurred.',
                    });
                }
            }
            fetchExperience();
        }
    }, [id, reset, toast]);
    
    const onSubmit: SubmitHandler<ExperienceFormValues> = async (data) => {
        try {
            const dataToSubmit = {
                ...data,
                advance_booking_required: data.advance_booking_required ? 1 : 0,
                walk_in_available: data.walk_in_available ? 1 : 0,
                updated_by: 'admin@company.com',
            };
            await updateExperience(id, dataToSubmit);
            setShowSaveConfirmDialog(false);
            setShowSaveSuccessDialog(true);
        } catch (error: any) {
            setShowSaveConfirmDialog(false);
            toast({
                variant: 'destructive',
                title: 'Error updating experience',
                description: error.message || 'An unexpected error occurred.',
            });
        }
    };
    
    const handleDelete = () => {
        // In a real app, you would handle the delete logic here
        setDeletedExperienceTitle(experienceName);
        setShowDeleteConfirmDialog(false);
        setShowDeleteSuccessDialog(true);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages([...images, { 
                    src: reader.result as string, 
                    alt: 'New image', 
                    hint: 'uploaded image', 
                    primary: false 
                }]);
            };
            reader.readAsDataURL(file);
        }
    };

  return (
    <>
    <Toaster />
    <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/experience">Experience Management</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{experienceName || 'Edit Experience'}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild type="button"><Link href={`/experience`}>Cancel</Link></Button>
            <AlertDialog open={showSaveConfirmDialog} onOpenChange={setShowSaveConfirmDialog}>
                <AlertDialogTrigger asChild>
                    <Button type="submit" variant="default">Save Changes</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-center text-2xl font-bold">Do you want to Update this Experience ?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                     <button type="button" onClick={() => setShowSaveConfirmDialog(false)} className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200">
                        <X className="h-5 w-5" />
                    </button>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
                <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive">Delete Experience</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-center text-2xl font-bold">Do you want to Delete this Experience ?</AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-red-500 text-lg">
                          {experienceName}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                     <button type="button" onClick={() => setShowDeleteConfirmDialog(false)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted">
                        <X className="h-5 w-5" />
                    </button>
                </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="space-y-2">
                    <Label htmlFor="experience-name">Experience Name</Label>
                    <Input id="experience-name" {...register('name')} />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="meeting-point">Meeting Point</Label>
                    <Input id="meeting-point" {...register('meeting_Point')} />
                    {errors.meeting_Point && <p className="text-red-500 text-sm">{errors.meeting_Point.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="short-description">Short Description</Label>
                  <Textarea id="short-description" {...register('short_description')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="detailed-description">Detailed Description</Label>
                  <div className="rounded-md border">
                    <div className="p-2 border-b flex items-center gap-1">
                       <Button variant="ghost" size="icon" className="h-8 w-8"><Bold className="h-4 w-4" /></Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8"><Italic className="h-4 w-4" /></Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8"><List className="h-4 w-4" /></Button>
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
                <h3 className="text-lg font-semibold">Pricing & Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="space-y-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Input id="duration" {...register('duration')} />
                        {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="price">Price</Label>
                         <div className="flex items-center">
                            <span className="p-2 border rounded-l-md bg-muted text-muted-foreground text-sm">LKR</span>
                            <Input id="price" type="text" className="rounded-l-none" {...register('Price')} />
                        </div>
                        {errors.Price && <p className="text-red-500 text-sm">{errors.Price.message}</p>}
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="pricing-basis">Pricing Basis</Label>
                        <Input id="pricing-basis" {...register('pricing_basis')} />
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
                    <Label>Available Days & Times</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Day Available *</Label>
                          <Input id="day_of_week" {...register('day_of_week')} />
                          {errors.day_of_week && <p className="text-red-500 text-sm">{errors.day_of_week.message}</p>}
                      </div>
                       <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Time Slot *</Label>
                          <Input type="time" className="w-32" {...register('time_slot')} />
                          {errors.time_slot && <p className="text-red-500 text-sm">{errors.time_slot.message}</p>}
                       </div>
                       <div className="space-y-2">
                          <Label htmlFor="schedule-notes" className="text-xs text-muted-foreground">Schedule Notes</Label>
                          <Input id="schedule-notes" {...register('schedule_note')} />
                       </div>
                    </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold">Participants & Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="min-participants">Minimum Participants</Label>
                    <Input id="min-participants" type="number" {...register('min_participants')} />
                    {errors.min_participants && <p className="text-red-500 text-sm">{errors.min_participants.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-participants">Maximum Participants</Label>
                    <Input id="max-participants" type="number" {...register('max_participants')} />
                    {errors.max_participants && <p className="text-red-500 text-sm">{errors.max_participants.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Controller name="status" control={control} render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
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

            <Card>
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold">Image Gallery</h3>
                <p className="text-sm text-muted-foreground">Drag to reorder images. Click the star to set as primary thumbnail.</p>
                <div className="flex gap-4 items-center flex-wrap">
                    {images.map((image, index) => (
                        <div key={index} className="relative">
                            <Image src={image.src} alt={image.alt} width={200} height={150} className="rounded-lg" data-ai-hint={image.hint} />
                            {image.primary && <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">Primary</div>}
                        </div>
                    ))}
                     <label htmlFor="image-upload" className="flex items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                        <div className="flex flex-col items-center justify-center">
                            <Plus className="w-8 h-8 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Add Image</span>
                        </div>
                        <Input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </form>
    
    <Dialog open={showSaveSuccessDialog} onOpenChange={setShowSaveSuccessDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeaderComponent className="sr-only">
              <DialogTitleComponent>Successfully Updated!</DialogTitleComponent>
            </DialogHeaderComponent>
            <div className="flex flex-col items-center justify-center text-center p-6 pt-8">
              <div className="mx-auto bg-blue-100 rounded-full h-20 w-20 flex items-center justify-center mb-4">
                  <div className="p-2 bg-blue-200 rounded-full">
                    <CheckCircle2 className="h-10 w-10 text-blue-600" />
                  </div>
              </div>
              <h2 className="text-xl font-bold mb-2">Successfully Updated {experienceName} !</h2>
            </div>
            <DialogClose asChild>
                <button type="button" className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted" onClick={() => {setShowSaveSuccessDialog(false); router.push('/experience');}}>
                    <X className="h-5 w-5" />
                </button>
            </DialogClose>
          </DialogContent>
      </Dialog>
      <Dialog open={showDeleteSuccessDialog} onOpenChange={setShowDeleteSuccessDialog}>
        <DialogContent className="sm:max-w-md">
            <DialogHeaderComponent className="sr-only">
                <DialogTitleComponent>Success</DialogTitleComponent>
                <DialogDescriptionComponent>The experience was successfully deleted.</DialogDescriptionComponent>
            </DialogHeaderComponent>
            <div className="flex flex-col items-center justify-center text-center p-6 pt-8">
                <div className="p-4 bg-red-100 rounded-full mb-4">
                   <div className="p-3 bg-red-200 rounded-full">
                        <Trash2 className="h-8 w-8 text-red-600" />
                    </div>
                </div>
                <h2 className="text-xl font-bold">Successfully Deleted {deletedExperienceTitle} !</h2>
            </div>
            <DialogClose asChild>
              <button type="button" className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted" onClick={() => router.push('/experience')}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
              </button>
            </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}



'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Users, Clock, Gift, Building, Plus, Wallet, Tag, Check, Trash2, CheckCircle2, UploadCloud, MoreVertical, Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getHalls, type HallFromApi, createEvent, uploadEventImage, EventFromApi } from '@/lib/services/api';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';

const eventSchema = z.object({
  event_name: z.string().min(1, 'Event name is required'),
  event_type: z.enum(['Corporate', 'Private Party', 'Wedding', 'Conference']),
  event_date: z.date({ required_error: "Event date is required." }),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  hall_ids: z.array(z.string()).min(1, "At least one hall must be selected"),
  guest_count: z.coerce.number().min(1, "Guest count must be at least 1"),
  booking_status: z.enum(['Confirmed', 'Pending', 'Cancelled']),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface ImageSlot {
  file: File | null;
  preview: string | null;
  isPrimary: boolean;
}

export default function NewEventPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [halls, setHalls] = useState<HallFromApi[]>([]);
    const [loadingHalls, setLoadingHalls] = useState(true);

    const [imageSlots, setImageSlots] = useState<ImageSlot[]>(Array(5).fill({ file: null, preview: null, isPrimary: false }));
    const [showImageDialog, setShowImageDialog] = useState(false);
    const [newlyCreatedEvent, setNewlyCreatedEvent] = useState<EventFromApi | null>(null);

     const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<EventFormValues>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            event_type: 'Corporate',
            booking_status: 'Pending',
            hall_ids: [],
        },
    });

    useEffect(() => {
        async function fetchHalls() {
            try {
                setLoadingHalls(true);
                const data = await getHalls();
                setHalls(data);
            } catch (err) {
                console.error("Failed to fetch halls:", err);
                toast({
                    variant: "destructive",
                    title: "Error fetching halls",
                    description: "Could not load halls. Please try again later.",
                })
            } finally {
                setLoadingHalls(false);
            }
        }
        fetchHalls();
    }, [toast]);

    const onSubmit: SubmitHandler<EventFormValues> = async (data) => {
        const dataToSend = {
            ...data,
            event_date: format(data.event_date, 'yyyy-MM-dd'),
            hall_id: data.hall_ids.join(','),
            created_by: 'admin@silverray.com',
            company_id: 'com-001',
            images_url: '',
        };
        
        try {
            const createdEvent = await createEvent(dataToSend);
            setNewlyCreatedEvent(createdEvent);
            setShowImageDialog(true);
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Error creating event',
                description: error.message || 'An unexpected error occurred.',
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
        if (!newlyCreatedEvent) return;

        const imagesToUpload = imageSlots.filter(slot => slot.file !== null);

        if (imagesToUpload.length === 0) {
            toast({ title: "No images to upload", description: "You can upload images later by editing the event."});
            setShowImageDialog(false);
            router.push('/events');
            return;
        }

        try {
            for (const slot of imagesToUpload) {
                if (slot.file) {
                    await uploadEventImage(newlyCreatedEvent.id, slot.file, slot.isPrimary);
                }
            }
            toast({ title: "Success!", description: "Event and images uploaded successfully."});
            setShowImageDialog(false);
            router.push('/events');

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
        <Toaster />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Event</CardTitle>
                    <CardDescription>Fill in the details to plan and create a new event.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                     <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Gift className="h-5 w-5 text-primary"/>
                            Event Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="event-name">Event Name *</Label>
                                <Input id="event-name" placeholder="e.g., Annual Tech Conference 2025" {...register('event_name')} />
                                {errors.event_name && <p className="text-red-500 text-sm">{errors.event_name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="event-type">Event Type *</Label>
                                <Controller
                                    name="event_type"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger id="event-type"><SelectValue placeholder="Select event type" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Corporate">Corporate</SelectItem>
                                                <SelectItem value="Private Party">Private Party</SelectItem>
                                                <SelectItem value="Wedding">Wedding</SelectItem>
                                                <SelectItem value="Conference">Conference</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.event_type && <p className="text-red-500 text-sm">{errors.event_type.message}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary"/>
                            Date & Time
                        </h3>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="event-date">Event Date *</Label>
                                <Controller
                                    name="event_date"
                                    control={control}
                                    render={({ field }) => (
                                         <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? format(field.value, 'PPP') : <span>mm/dd/yyyy</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                                        </Popover>
                                    )}
                                />
                                {errors.event_date && <p className="text-red-500 text-sm">{errors.event_date.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="start-time">Start Time</Label>
                                <Input id="start-time" type="time" {...register('start_time')} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end-time">End Time</Label>
                                <Input id="end-time" type="time" {...register('end_time')} />
                            </div>
                         </div>
                    </div>
                    
                     <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Building className="h-5 w-5 text-primary"/>
                            Venue & Capacity
                        </h3>
                        <div className="space-y-2">
                             <Label>Hall/Venue *</Label>
                             <Controller
                                name="hall_ids"
                                control={control}
                                render={({ field }) => (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {loadingHalls ? <p>Loading halls...</p> : halls.map((hall) => (
                                            <div key={hall.id} className="flex items-center space-x-2 p-3 border rounded-md">
                                                <Checkbox
                                                    id={`hall-${hall.id}`}
                                                    checked={field.value?.includes(String(hall.id))}
                                                    onCheckedChange={(checked) => {
                                                        const currentValues = field.value || [];
                                                        if(checked) {
                                                            field.onChange([...currentValues, String(hall.id)])
                                                        } else {
                                                            field.onChange(currentValues.filter(id => id !== String(hall.id)))
                                                        }
                                                    }}
                                                />
                                                <Label htmlFor={`hall-${hall.id}`} className="font-normal">{hall.hall_name}</Label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                             />
                             {errors.hall_ids && <p className="text-red-500 text-sm">{errors.hall_ids.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="guests">Number of Guests *</Label>
                            <Input id="guests" type="number" placeholder="150" {...register('guest_count')} />
                             {errors.guest_count && <p className="text-red-500 text-sm">{errors.guest_count.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Tag className="h-5 w-5 text-primary"/>
                            Status
                        </h3>
                         <div className="space-y-2">
                            <Label htmlFor="booking-status">Booking Status</Label>
                             <Controller
                                name="booking_status"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger id="booking-status"><SelectValue placeholder="Select Status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                             />
                        </div>
                    </div>

                </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
                <Button variant="outline" asChild type="button">
                  <Link href="/events">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : '+ Create Event'}
                </Button>
            </div>
        </form>

        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
            <DialogContent className="max-w-4xl">
            <DialogHeader>
                <DialogTitle>Step 2: Upload Event Images</DialogTitle>
                <DialogDescription>
                Event "{newlyCreatedEvent?.event_name}" has been created. Add up to 5 images. The primary image will be shown first.
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
                    <Button variant="outline" onClick={() => router.push('/events')}>Skip for now</Button>
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

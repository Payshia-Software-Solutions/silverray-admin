

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
import { Bold, Italic, List, Plus, Trash2, UploadCloud, CheckCircle2, X, MoreVertical, Star } from 'lucide-react';
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
import { getHalls, type HallFromApi, getPackageInclusions, type PackageInclusionFromApi, createWeddingPackage, uploadWeddingPackageImage, type WeddingPackageFromApi } from '@/lib/services/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useRouter } from 'next/navigation';

const packageSchema = z.object({
  package_name: z.string().min(1, 'Package name is required'),
  hall_id: z.string().min(1, 'Hall selection is required'),
  status: z.enum(['Active', 'Inactive', 'Seasonal']),
  short_description: z.string().optional(),
  detailed_description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  max_guests: z.coerce.number().min(1, 'Max guests must be at least 1'),
  inclusions: z.array(z.string()).optional(),
  image_urls: z.string().optional(),
});

type PackageFormValues = z.infer<typeof packageSchema>;

interface ImageSlot {
  file: File | null;
  preview: string | null;
  isPrimary: boolean;
}

export default function NewWeddingPackagePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [inclusions, setInclusions] = useState<PackageInclusionFromApi[]>([]);
  const [loadingInclusions, setLoadingInclusions] = useState(true);
  const [halls, setHalls] = useState<HallFromApi[]>([]);
  const [loadingHalls, setLoadingHalls] = useState(true);

  const [imageSlots, setImageSlots] = useState<ImageSlot[]>(Array(5).fill({ file: null, preview: null, isPrimary: false }));
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [newlyCreatedPackage, setNewlyCreatedPackage] = useState<WeddingPackageFromApi | null>(null);
  
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      status: 'Active',
      inclusions: [],
    }
  });

   useEffect(() => {
    async function fetchHalls() {
      try {
        setLoadingHalls(true);
        const data = await getHalls();
        setHalls(data);
      } catch (err) {
        console.error("Failed to fetch halls:", err);
      } finally {
        setLoadingHalls(false);
      }
    }
    fetchHalls();
    
    async function fetchInclusions() {
        try {
            setLoadingInclusions(true);
            const data = await getPackageInclusions();
            if (Array.isArray(data)) {
                setInclusions(data);
            } else {
                setInclusions([]); // Ensure inclusions is always an array
            }
        } catch (err) {
            console.error("Failed to fetch inclusions:", err);
            setInclusions([]);
        } finally {
            setLoadingInclusions(false);
        }
    }
    fetchInclusions();
  }, []);

  const onSubmit: SubmitHandler<PackageFormValues> = async (data) => {
    const dataToSend = {
      ...data,
      company_id: '1',
      created_by: 'admin@weddingvenue.com',
      updated_by: 'admin@weddingvenue.com',
      price: String(data.price),
      inclusions: data.inclusions?.join(',') || '',
      image_urls: '', // Image handled in second step
    };

    try {
      const createdPackage = await createWeddingPackage(dataToSend as any);
      setNewlyCreatedPackage(createdPackage);
      setShowImageDialog(true);
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error Creating Package",
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
    if (!newlyCreatedPackage) return;

    const imagesToUpload = imageSlots.filter(slot => slot.file !== null);

    if (imagesToUpload.length === 0) {
        toast({ title: "No images to upload", description: "You can upload images later by editing the package."});
        setShowImageDialog(false);
        router.push('/weddingpackages');
        return;
    }

    try {
        for (const slot of imagesToUpload) {
            if (slot.file) {
                await uploadWeddingPackageImage(newlyCreatedPackage.id, slot.file, slot.isPrimary);
            }
        }
        toast({ title: "Success!", description: "Package and images uploaded successfully."});
        setShowImageDialog(false);
        router.push('/weddingpackages');

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
            <BreadcrumbLink href="/weddingpackages">Wedding Management</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create New Wedding Packages</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="package-name">Package Name *</Label>
                    <Input id="package-name" placeholder="e.g., Silver Grandeur" {...register('package_name')} />
                    {errors.package_name && <p className="text-red-500 text-sm">{errors.package_name.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger id="status">
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="short-description">Short Description</Label>
              <Textarea id="short-description" placeholder="Brief overview of the package" {...register('short_description')} />
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
                  placeholder="Comprehensive description of the package, theme, and experience"
                  {...register('detailed_description')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-semibold">Pricing & Capacity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="price">Price (Starting From) *</Label>
                    <div className="flex items-center">
                        <span className="p-2 border rounded-l-md bg-muted text-muted-foreground text-sm">LKR</span>
                        <Input id="price" type="number" placeholder="150000" className="rounded-l-none" {...register('price')} />
                    </div>
                    {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="max-guests">Maximum Guest Capacity</Label>
                    <Input id="max-guests" type="number" placeholder="200" {...register('max_guests')} />
                    {errors.max_guests && <p className="text-red-500 text-sm">{errors.max_guests.message}</p>}
                 </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Package Inclusions</h3>
                     <Button variant="default" asChild>
                        <Link href="/package-inclusions/new">
                            <Plus className="mr-2 h-4 w-4" /> Add New Inclusion
                        </Link>
                    </Button>
                </div>
                <Controller
                    name="inclusions"
                    control={control}
                    render={({ field }) => (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {loadingInclusions ? <p>Loading inclusions...</p> : inclusions.map(inclusion => (
                                <div key={inclusion.id} className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={`inclusion-${inclusion.id}`} 
                                        checked={field.value?.includes(String(inclusion.id))}
                                        onCheckedChange={(checked) => {
                                            const currentInclusions = field.value || [];
                                            if (checked) {
                                                field.onChange([...currentInclusions, String(inclusion.id)]);
                                            } else {
                                                field.onChange(currentInclusions.filter(id => id !== String(inclusion.id)));
                                            }
                                        }}
                                    />
                                    <Label htmlFor={`inclusion-${inclusion.id}`} className="font-normal">{inclusion.inclusion_type}</Label>
                                </div>
                            ))}
                        </div>
                    )}
                />
            </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Associated Halls</h3>
             <Controller
                name="hall_id"
                control={control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                            <SelectValue placeholder={loadingHalls ? "Loading halls..." : "Select a hall"} />
                        </SelectTrigger>
                        <SelectContent>
                            {halls.map((hall) => (
                                <SelectItem key={hall.id} value={String(hall.id)} disabled={!hall.is_active}>
                                    {hall.hall_name} {!hall.is_active && '(Booked)'}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />
            {errors.hall_id && <p className="text-red-500 text-sm">{errors.hall_id.message}</p>}
          </CardContent>
        </Card>
      
        <div className="flex justify-end gap-2">
            <Button variant="outline" asChild type="button">
            <Link href="/weddingpackages">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : '+ Add Wedding Package'}
            </Button>
        </div>
      </form>

        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
            <DialogContent className="max-w-4xl">
            <DialogHeader>
                <DialogTitle>Step 2: Upload Package Images</DialogTitle>
                <DialogDescription>
                Package "{newlyCreatedPackage?.package_name}" has been created. Add up to 5 images. The primary image will be shown first.
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
                    <Button variant="outline" onClick={() => router.push('/weddingpackages')}>Skip for now</Button>
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

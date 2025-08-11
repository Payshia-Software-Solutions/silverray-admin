
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
import { Bold, Italic, List, Plus, Trash2, UploadCloud, CheckCircle2, Award } from 'lucide-react';
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
import { getHalls, type HallFromApi, getPackageInclusions, type PackageInclusionFromApi, createWeddingPackage, type WeddingPackageFromApi } from '@/lib/services/api';
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


export default function NewWeddingPackagePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [inclusions, setInclusions] = useState<PackageInclusionFromApi[]>([]);
  const [loadingInclusions, setLoadingInclusions] = useState(true);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [halls, setHalls] = useState<HallFromApi[]>([]);
  const [loadingHalls, setLoadingHalls] = useState(true);

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
      company_id: '3900',
      created_by: 'admin@weddingvenue.com',
      updated_by: 'admin@weddingvenue.com',
      price: String(data.price),
      inclusions: data.inclusions?.join(',') || null,
      image_urls: null
    };

    try {
      await createWeddingPackage(dataToSend as any);
      setShowSuccessDialog(true);
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error Creating Package",
            description: error.message || "An unexpected error occurred."
        });
    }
  };

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
            <CardContent className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <span className="bg-primary/10 p-2 rounded-full"><Award className="h-5 w-5 text-primary"/></span>
                        Package Inclusions
                    </h3>
                     <Button variant="outline" asChild>
                        <Link href="/package-inclusions">
                            <Plus className="mr-2 h-4 w-4" /> Manage Inclusions
                        </Link>
                    </Button>
                </div>
                <Controller
                  name="inclusions"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {loadingInclusions ? (
                        <p>Loading inclusions...</p>
                      ) : (
                        inclusions.map((inclusion) => (
                          <div key={inclusion.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`inclusion-${inclusion.id}`}
                              checked={field.value?.includes(String(inclusion.id))}
                              onCheckedChange={(checked) => {
                                const currentInclusions = field.value || [];
                                const newInclusions = checked
                                  ? [...currentInclusions, String(inclusion.id)]
                                  : currentInclusions.filter((id) => id !== String(inclusion.id));
                                field.onChange(newInclusions);
                              }}
                            />
                            <Label htmlFor={`inclusion-${inclusion.id}`} className="font-normal">
                              {inclusion.inclusion_type}
                            </Label>
                          </div>
                        ))
                      )}
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
        
        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-semibold">Package Images</h3>
             <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    Drag and drop images here, or <Button asChild variant="link" className="p-0"><span className="font-semibold text-primary">browse files</span></Button>
                  </p>
                  <p className="text-xs text-muted-foreground">Supports: JPG, PNG, WebP (Max 5MB each)</p>
                </div>
                <Input id="dropzone-file" type="file" className="hidden" />
              </label>
            </div>
            <div className="flex flex-wrap gap-4">
                <div className="relative">
                    <Image src="https://images.unsplash.com/photo-1595431677320-991c68277257?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwaGFsbCUyMGdvbGR8ZW58MHx8fHwxNzUyODQzMjQwfDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Wedding hall" width={200} height={150} className="rounded-lg object-cover" data-ai-hint="wedding hall gold" />
                    <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">Primary</div>
                </div>
                 <div className="relative">
                    <Image src="https://images.unsplash.com/photo-1550081692-564a275a4073?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHx3ZWRkaW5nJTIwdGFibGUlMjBkZWNvcmF0aW9ufGVufDB8fHx8MTc1Mjg0MzI0MHww&ixlib=rb-4.1.0&q=80&w=1080" alt="Wedding decor" width={200} height={150} className="rounded-lg object-cover" data-ai-hint="wedding table decoration" />
                </div>
                 <div className="relative">
                    <Image src="https://images.unsplash.com/photo-1579344475510-53c8253138b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2VyZW1vbnklMjBhcmNofGVufDB8fHx8MTc1Mjg0MzI0MHww&ixlib=rb-4.1.0&q=80&w=1080" alt="Wedding ceremony" width={200} height={150} className="rounded-lg object-cover" data-ai-hint="wedding ceremony arch" />
                </div>
                 <div className="relative">
                    <Image src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwZmxvd2Vyc3xlbnwwfHx8fDE3NTI4NDM0NDF8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Wedding flowers" width={200} height={150} className="rounded-lg object-cover" data-ai-hint="wedding flowers" />
                </div>
            </div>
          </CardContent>
        </Card>
      
        <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
            <Link href="/weddingpackages">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : '+ Add Wedding Package'}
            </Button>
        </div>
      </form>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="sr-only">
                    <DialogTitle>Success</DialogTitle>
                    <DialogDescription>A new wedding package has been successfully created.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center text-center p-8 pt-0">
                    <div className="p-4 bg-blue-100 rounded-full mb-4">
                        <div className="p-2 bg-blue-200 rounded-full">
                           <CheckCircle2 className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold mb-2">Successfully Created New Wedding Package !</h2>
                    <p className="text-muted-foreground">The new package is now available for booking.</p>
                    <DialogClose asChild>
                        <Button className="mt-6 w-full" onClick={() => router.push('/weddingpackages')}>Done</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
}

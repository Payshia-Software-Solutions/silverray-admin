
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Bold, Italic, Underline, Plus, Image as ImageIcon, X, UploadCloud, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getRestaurantFeatures, type RestaurantFeatureFromApi, getRestaurantById, updateRestaurant, type RestaurantFromApi } from '@/lib/services/api';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';

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
  images_url: z.string().optional(),
});

type RestaurantFormValues = z.infer<typeof restaurantSchema>;


export default function EditRestaurantVenuePage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);
  const { toast } = useToast();

  const [features, setFeatures] = useState<RestaurantFeatureFromApi[]>([]);
  const [loadingFeatures, setLoadingFeatures] = useState(true);
  const [showSaveSuccessDialog, setShowSaveSuccessDialog] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<RestaurantFormValues>({
      resolver: zodResolver(restaurantSchema),
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

  useEffect(() => {
    async function fetchRestaurant() {
        if (!id) return;
        try {
            const data = await getRestaurantById(id);
            reset({
              ...data,
              operating_hours: data.operating_hours ? JSON.parse(data.operating_hours) : {},
              features: data.features ? JSON.parse(data.features) : [],
            });
        } catch(e: any) {
            toast({ variant: 'destructive', title: 'Failed to fetch restaurant data', description: e.message });
        }
    }
    fetchRestaurant();
  }, [id, reset, toast]);

  const onSubmit: SubmitHandler<RestaurantFormValues> = async (data) => {
    const dataToSend = {
      ...data,
      operating_hours: JSON.stringify(data.operating_hours),
      features: JSON.stringify(data.features),
      company_id: '5', // This should be dynamic in a real app
      updated_by: '101'
    };
    try {
        await updateRestaurant(id, dataToSend);
        setShowSaveSuccessDialog(true);
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error saving venue', description: error.message });
    }
  }

  return (
    <>
    <Toaster />
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/restaurant">Restaurant Management</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Venue</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="venue-name">Venue Name</Label>
              <Input id="venue-name" {...register('venue_name')} />
              {errors.venue_name && <p className="text-red-500 text-sm">{errors.venue_name.message}</p>}
            </div>
            <div>
              <Label htmlFor="short-description">Short Description</Label>
              <Textarea
                id="short-description"
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
              <Label htmlFor="capacity">Capacity</Label>
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
                    name={`operating_hours.${day}`}
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
            <CardTitle>Venue Images</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex items-center justify-center w-full">
                <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-10 h-10 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-lg text-muted-foreground">
                        Drag and drop images here
                    </p>
                    <p className="text-sm text-muted-foreground">or click to browse files</p>
                    <Button type="button" className="mt-4">Browse Files</Button>
                    </div>
                    <Input id="dropzone-file" type="file" className="hidden" />
                </label>
             </div>
             <div className="pt-6 flex flex-wrap gap-4">
                <div className="relative">
                    <Image 
                        src="https://images.unsplash.com/photo-1729394405518-eaf2a0203aa7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxyZXN0YXVyYW50JTIwaW50ZXJpb3J8ZW58MHx8fHwxNzUyODM3MDY0fDA&ixlib=rb-4.1.0&q=80&w=1080" 
                        alt="Restaurant interior" 
                        width={200} 
                        height={150} 
                        className="rounded-lg object-cover aspect-[4/3]"
                        data-ai-hint="restaurant interior" 
                    />
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">Primary</div>
                </div>
                 <div className="relative">
                    <Image 
                        src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxyZXN0YXVyYW50fGVufDB8fHx8MTc1Mjg0NTg1MHww&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Restaurant outdoor seating"
                        width={200}
                        height={150}
                        className="rounded-lg object-cover aspect-[4/3]"
                        data-ai-hint="outdoor restaurant"
                    />
                </div>
            </div>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
            <Button variant="outline" type="button" asChild><Link href="/restaurant">Cancel</Link></Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
        </div>
      </div>
      
       <Dialog open={showSaveSuccessDialog} onOpenChange={setShowSaveSuccessDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="sr-only">
                    <DialogTitle>Success</DialogTitle>
                    <DialogDescription>The changes have been saved successfully.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center text-center p-8 pt-12">
                    <div className="p-4 bg-blue-100 rounded-full mb-4">
                        <div className="p-2 bg-blue-200 rounded-full">
                           <CheckCircle2 className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold mb-2">Successfully Updated Venue!</h2>
                    <DialogClose asChild>
                        <Button className="mt-6" onClick={() => router.push('/restaurant')}>Done</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    </form>
    </>
  );
}

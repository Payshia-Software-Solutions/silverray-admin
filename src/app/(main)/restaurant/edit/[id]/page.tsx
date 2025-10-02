

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

import { getHalls, type HallFromApi, getPackageInclusions, type PackageInclusionFromApi, updateWeddingPackage, getWeddingPackageById, type WeddingPackageFromApi, getWeddingPackageImages, type WeddingPackageImageFromApi, CONTENT_PROVIDER_BASE_URL, uploadWeddingPackageImage, updateWeddingPackageImage, deleteWeddingPackageImage } from '@/lib/services/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useRouter, useParams } from 'next/navigation';

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function EditRestaurantPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  
  const [showSaveSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);

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
            <BreadcrumbPage>Main Restaurant</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <form onSubmit={(e) => { e.preventDefault(); setShowSuccessDialog(true); }} className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Building2 className="h-5 w-5 text-primary"/>Basic Information</h3>
            <div className="space-y-2">
                <Label htmlFor="venue-name">Venue Name</Label>
                <Input id="venue-name" defaultValue="Main Restaurant" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="short-description">Short Description</Label>
              <Textarea id="short-description" defaultValue="Elegant fine dining restaurant featuring contemporary cuisine with panoramic ocean views." />
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
                  defaultValue="Experience culinary excellence at our signature Main Restaurant, where master chefs craft innovative dishes using the finest local and international ingredients. The sophisticated ambiance, complemented by floor-to-ceiling windows offering breathtaking ocean views, creates an unforgettable dining experience for our distinguished guests."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Clock className="h-5 w-5 text-primary"/>Capacity & Operating Hours</h3>
            <div className="space-y-2 w-1/4">
                <Label htmlFor="capacity">Capacity</Label>
                <div className="flex items-center gap-2">
                    <Input id="capacity" type="number" defaultValue="120" />
                    <span className="text-sm text-muted-foreground">guests</span>
                </div>
            </div>
             <div className="space-y-4">
                <Label>Operating Hours</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {daysOfWeek.map(day => (
                        <div key={day} className="space-y-2">
                            <Label htmlFor={`${day}-open`} className="capitalize text-sm font-medium">{day}</Label>
                             <div className="flex items-center gap-2">
                                <Checkbox id={`${day}-open-check`} defaultChecked={day !== 'sunday'}/>
                                <Label htmlFor={`${day}-open-check`} className="text-sm">Open</Label>
                             </div>
                            <Input id={`${day}-open-time`} type="time" defaultValue={day !== 'saturday' && day !== 'sunday' ? '09:00' : '10:00'} disabled={day === 'sunday'} />
                            <Input id={`${day}-close-time`} type="time" defaultValue={day !== 'saturday' && day !== 'sunday' ? '22:00' : '23:00'} disabled={day === 'sunday'} />
                        </div>
                    ))}
                </div>
             </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2"><Star className="h-5 w-5 text-primary"/>Features & Ambiance</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2"><Checkbox id="ocean-view" defaultChecked /><Label htmlFor="ocean-view" className="font-normal">Ocean View</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="wine-bar" defaultChecked /><Label htmlFor="wine-bar" className="font-normal">Wine Bar</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="fine-dining" defaultChecked /><Label htmlFor="fine-dining" className="font-normal">Fine Dining</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="private-dining" /><Label htmlFor="private-dining" className="font-normal">Private Dining</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="live-music" /><Label htmlFor="live-music" className="font-normal">Live Music</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="outdoor-seating" defaultChecked /><Label htmlFor="outdoor-seating" className="font-normal">Outdoor Seating</Label></div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="custom-features">Custom Features</Label>
                    <Input id="custom-features" placeholder="Add custom features..."/>
                </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2"><ImageIcon className="h-5 w-5 text-primary"/>Image Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div className="relative aspect-video group">
                        <Image src="https://picsum.photos/seed/restaurant1/600/400" alt="Restaurant interior" fill className="rounded-lg object-cover" />
                        <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1"><Star className="w-3 h-3" /> Primary</div>
                    </div>
                     <div className="relative aspect-video group">
                        <Image src="https://picsum.photos/seed/restaurant-bar/600/400" alt="Restaurant bar" fill className="rounded-lg object-cover" />
                    </div>
                     <div className="relative aspect-video group">
                        <Image src="https://picsum.photos/seed/restaurant-patio/600/400" alt="Restaurant patio" fill className="rounded-lg object-cover" />
                    </div>
                    <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                        <div className="flex flex-col items-center justify-center text-center">
                            <Plus className="w-8 h-8 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground mt-1">Add Image</p>
                        </div>
                        <Input id="image-upload" type="file" className="hidden" accept="image/*" />
                    </label>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2"><Tag className="h-5 w-5 text-primary"/>Status</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="status">Current Status</Label>
                        <Select defaultValue="Active">
                            <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                                <SelectItem value="Seasonal">Seasonal</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status-notes">Status Notes</Label>
                        <Textarea id="status-notes" placeholder="Optional notes about status" />
                    </div>
                </div>
            </CardContent>
        </Card>
      
        <AlertDialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
            <div className="flex justify-between items-center">
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" type="button"><Trash2 className="mr-2 h-4 w-4" /> Delete Venue</Button>
                </AlertDialogTrigger>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" asChild type="button">
                    <Link href="/restaurant">Cancel</Link>
                    </Button>
                    <Button type="submit">
                        Save Changes
                    </Button>
                </div>
            </div>
             <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-center text-2xl font-bold">Do you want to Delete this Venue ?</AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-red-500 text-lg">
                        Main Restaurant
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-center">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                </AlertDialogFooter>
                 <button onClick={() => setShowDeleteConfirmDialog(false)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted">
                    <X className="h-5 w-5" />
                </button>
            </AlertDialogContent>
        </AlertDialog>
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
    </div>
  );
}


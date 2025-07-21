
'use client';

import { useState } from 'react';
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
import { useParams } from 'next/navigation';
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

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];

const initialImages = [
    { src: 'https://placehold.co/200x150', alt: 'Tea plantation', hint: 'tea plantation worker', primary: true },
    { src: 'https://placehold.co/200x150', alt: 'Tea processing', hint: 'tea factory interior', primary: false },
    { src: 'https://placehold.co/200x150', alt: 'Tea tasting', hint: 'tea cups tasting', primary: false },
];

export default function EditExperiencePage() {
    const params = useParams();
    const experienceId = params.id as string;
    const experienceTitle = experienceId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const [showSaveConfirmDialog, setShowSaveConfirmDialog] = useState(false);
    const [showSaveSuccessDialog, setShowSaveSuccessDialog] = useState(false);
    const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
    const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);
    const [deletedExperienceTitle, setDeletedExperienceTitle] = useState('');
    const [images, setImages] = useState(initialImages);

    const handleSave = () => {
        // In a real app, you would handle the save logic here
        setShowSaveConfirmDialog(false);
        setShowSaveSuccessDialog(true);
    };
    
    const handleDelete = () => {
        // In a real app, you would handle the delete logic here
        setDeletedExperienceTitle(experienceTitle);
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
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/experience">Experience Management</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{experienceTitle}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild><Link href={`/experience/${experienceId}`}>Cancel</Link></Button>
        <AlertDialog open={showSaveConfirmDialog} onOpenChange={setShowSaveConfirmDialog}>
            <AlertDialogTrigger asChild>
                <Button variant="default">Save Changes</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-center text-2xl font-bold">Do you want to Update this Experience ?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-center">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSave}>Save Changes</AlertDialogAction>
                </AlertDialogFooter>
                 <button onClick={() => setShowSaveConfirmDialog(false)} className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200">
                    <X className="h-5 w-5" />
                </button>
            </AlertDialogContent>
        </AlertDialog>
        <AlertDialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Experience</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-center text-2xl font-bold">Do you want to Delete this Experience ?</AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-red-500 text-lg">
                      {experienceTitle}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-center">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
                 <button onClick={() => setShowDeleteConfirmDialog(false)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted">
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
                <Input id="experience-name" defaultValue="Tea Factory Tour" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="short-description">Short Description</Label>
              <Textarea id="short-description" defaultValue="Discover the art of tea making with a guided tour through our organic tea plantation and traditional processing facilities." />
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
                  defaultValue="Join us for an immersive journey through our century-old tea plantation. This guided experience includes a walk through the tea gardens, learning about organic cultivation methods, witnessing the traditional tea processing techniques, and ending with a tasting session of our finest blends. Perfect for tea enthusiasts and nature lovers alike."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-semibold">Inclusions & Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>What's Included</Label>
                <div className="p-4 border rounded-md min-h-[100px] text-sm text-muted-foreground">
                    <ul className="list-disc list-inside space-y-1">
                        <li>Guided tour of tea plantation</li>
                        <li>Tea processing demonstration</li>
                        <li>Tea tasting session (5 varieties)</li>
                        <li>Complimentary tea samples</li>
                        <li>Traditional Sri Lankan snacks</li>
                    </ul>
                </div>
              </div>
              <div className="space-y-2">
                <Label>What to Bring</Label>
                <div className="p-4 border rounded-md min-h-[100px] text-sm text-muted-foreground">
                     <ul className="list-disc list-inside space-y-1">
                        <li>Comfortable walking shoes</li>
                        <li>Sun hat or cap</li>
                        <li>Camera</li>
                        <li>Water bottle</li>
                        <li>Light jacket (early morning tours)</li>
                    </ul>
                </div>
              </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="meeting-point">Meeting Point</Label>
                <Input id="meeting-point" defaultValue="Hotel Main Lobby" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-semibold">Pricing & Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input id="duration" defaultValue="3" />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="price">Price (USD)</Label>
                    <Input id="price" type="number" defaultValue="45" />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="pricing-basis">Pricing Basis</Label>
                    <Input id="pricing-basis" />
                 </div>
            </div>
            <div className="space-y-4">
                <Label>Booking Requirements</Label>
                <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="adv-booking" defaultChecked/>
                        <Label htmlFor="adv-booking" className="font-normal">Advance Booking Required</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="walk-in" />
                        <Label htmlFor="walk-in" className="font-normal">Walk-in Available</Label>
                    </div>
                </div>
            </div>
             <div className="space-y-4">
                <Label>Available Days & Times</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {daysOfWeek.map((day) => (
                     <div key={day} className="space-y-2">
                       <div className="flex items-center space-x-2">
                         <Checkbox id={`day-${day.toLowerCase()}`} defaultChecked={day !== 'Thursday'}/>
                         <Label htmlFor={`day-${day.toLowerCase()}`} className="font-normal">{day}</Label>
                       </div>
                       <Input type="time" defaultValue="08:00" />
                     </div>
                   ))}
                </div>
                 <div className="flex items-center gap-2 mt-2">
                    <Button variant="outline"><Plus className="mr-2 h-4 w-4" /> Add Day/Slot</Button>
                    <Button variant="ghost" size="icon"><Clock className="h-4 w-4" /></Button>
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
                <Input id="min-participants" type="number" defaultValue="2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-participants">Maximum Participants</Label>
                <Input id="max-participants" type="number" defaultValue="12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Input id="status" />
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
              <h2 className="text-xl font-bold mb-2">Successfully Updated {experienceTitle} !</h2>
            </div>
            <DialogClose asChild>
                <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted" onClick={() => setShowSaveSuccessDialog(false)}>
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
              <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
              </button>
            </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}

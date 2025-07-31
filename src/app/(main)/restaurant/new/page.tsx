
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function NewRestaurantVenuePage() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);
  const [showSaveSuccessDialog, setShowSaveSuccessDialog] = useState(false);

  const handleDelete = () => {
    setShowDeleteDialog(false);
    setShowDeleteSuccessDialog(true);
  }

  const handleSaveChanges = () => {
    setShowSaveSuccessDialog(true);
  }

  return (
    <div className="space-y-6">
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

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="venue-name">Venue Name</Label>
              <Input id="venue-name" defaultValue="Main Restaurant" />
            </div>
            <div>
              <Label htmlFor="short-description">Short Description</Label>
              <Textarea
                id="short-description"
                defaultValue="Elegant fine dining restaurant featuring contemporary cuisine with panoramic ocean views."
              />
            </div>
            <div>
              <Label htmlFor="detailed-description">Detailed Description</Label>
              <div className="rounded-md border">
                <div className="p-2 border-b">
                   <Button variant="ghost" size="icon" className="h-8 w-8"><Bold className="h-4 w-4" /></Button>
                   <Button variant="ghost" size="icon" className="h-8 w-8"><Italic className="h-4 w-4" /></Button>
                   <Button variant="ghost" size="icon" className="h-8 w-8"><Underline className="h-4 w-4" /></Button>
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
          <CardHeader>
            <CardTitle>Capacity & Operating Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <div className="flex items-center gap-2">
                <Input id="capacity" type="number" defaultValue="120" className="w-24" />
                <span>guests</span>
              </div>
            </div>
            <div>
              <Label>Operating Hours</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {daysOfWeek.map((day, index) => (
                  <div key={day} className="space-y-2">
                    <p className="font-medium text-sm">{day}</p>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked={day !== 'Sunday'} id={`open-${day}`} />
                      <Label htmlFor={`open-${day}`}>{day !== 'Sunday' ? 'Open' : 'Closed'}</Label>
                    </div>
                     {day !== 'Sunday' && (
                        <div className="flex items-center gap-1">
                          <Input type="time" defaultValue={index < 5 ? "09:00" : "10:00"} className="w-full"/>
                          <span>-</span>
                          <Input type="time" defaultValue={index < 4 ? "22:00" : "23:00"} className="w-full"/>
                        </div>
                     )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features & Ambiance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="ocean-view" defaultChecked />
                <Label htmlFor="ocean-view">Ocean View</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="fine-dining" defaultChecked />
                <Label htmlFor="fine-dining">Fine Dining</Label>
              </div>
               <div className="flex items-center space-x-2">
                <Checkbox id="live-music" />
                <Label htmlFor="live-music">Live Music</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="wine-bar" defaultChecked />
                <Label htmlFor="wine-bar">Wine Bar</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="private-dining" />
                <Label htmlFor="private-dining">Private Dining</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="outdoor-seating" defaultChecked />
                <Label htmlFor="outdoor-seating">Outdoor Seating</Label>
              </div>
            </div>
            <div>
              <Label htmlFor="custom-features">Custom Features</Label>
              <Input id="custom-features" placeholder="Add custom features..." />
            </div>
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
                    <Button className="mt-4">Browse Files</Button>
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
                <div className="relative">
                    <Image 
                        src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxyZXN0YXVyYW50fGVufDB8fHx8MTc1Mjg0NTg1MHww&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Restaurant bar area"
                        width={200}
                        height={150}
                        className="rounded-lg object-cover aspect-[4/3]"
                        data-ai-hint="restaurant bar"
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
                <Select defaultValue="active">
                    <SelectTrigger id="current-status">
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="seasonal">Seasonal</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div>
                <Label htmlFor="status-notes">Status Notes</Label>
                <Input id="status-notes" placeholder="Optional notes about status" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Venue
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-center text-2xl font-bold">Do you want to Delete this Venue ?</AlertDialogTitle>
                  <AlertDialogDescription className="text-center text-red-500 text-lg">
                    Main Restaurant
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-center">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
                 <button onClick={() => setShowDeleteDialog(false)} className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200">
                    <X className="h-5 w-5" />
                  </button>
              </AlertDialogContent>
            </AlertDialog>
            <div className="flex gap-2">
                <Button variant="outline" asChild><Link href="/restaurant">Cancel</Link></Button>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
            </div>
        </div>
      </div>
       <Dialog open={showDeleteSuccessDialog} onOpenChange={setShowDeleteSuccessDialog}>
          <DialogContent className="sm:max-w-md">
             <DialogHeader className="sr-only">
                  <DialogTitle>Success</DialogTitle>
                  <DialogDescription>The venue was successfully deleted.</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center text-center p-8">
                  <div className="p-4 bg-red-100 rounded-full mb-4">
                      <div className="p-2 bg-red-200 rounded-full">
                         <Trash2 className="h-8 w-8 text-red-600" />
                      </div>
                  </div>
                  <h2 className="text-xl font-bold mb-2">Successfully Deleted Main Restaurant !</h2>
                  <DialogClose asChild>
                      <Button className="mt-6 w-full" onClick={() => setShowDeleteSuccessDialog(false)}>Done</Button>
                  </DialogClose>
              </div>
          </DialogContent>
      </Dialog>
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
                    <h2 className="text-xl font-bold mb-2">Successfully Created New Restaurants !</h2>
                    <DialogClose asChild>
                        <Button className="mt-6" onClick={() => setShowSaveSuccessDialog(false)}>Done</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
}


'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog';
import { Bold, Italic, List, UploadCloud, Plus, Clock, Users, CheckCircle2 } from 'lucide-react';
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

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function AddExperiencePage() {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleAddExperience = () => {
    // In a real app, you would handle form submission here.
    setShowSuccessDialog(true);
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
            <BreadcrumbPage>Add New Experience</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="grid gap-6">
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
                <Input id="experience-name" placeholder="e.g., Tea Factory Tour" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meeting-point">Meeting Point</Label>
                <Input id="meeting-point" placeholder="e.g., Hotel Lobby" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="short-description">Short Description</Label>
              <Textarea id="short-description" placeholder="Brief overview for experience cards..." />
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
                  placeholder="Comprehensive description with formatting..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="bg-primary/10 p-2 rounded-full"><List className="h-5 w-5 text-primary"/></span>
                    Inclusions & Requirements
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>What's Included</Label>
                <div className="p-4 border rounded-md min-h-[100px] text-sm text-muted-foreground">
                    <ul>
                        <li>• Performance</li>
                        <li>• Live music</li>
                        <li>• Refreshments</li>
                    </ul>
                </div>
              </div>
              <div className="space-y-2">
                <Label>What to Bring</Label>
                <div className="p-4 border rounded-md min-h-[100px] text-sm text-muted-foreground">
                    <ul>
                        <li>• Comfortable attire</li>
                        <li>• Sunscreen</li>
                        <li>• Camera</li>
                    </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-6">
             <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="bg-primary/10 p-2 rounded-full"><List className="h-5 w-5 text-primary"/></span>
                    Pricing & Schedule
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="duration">Duration *</Label>
                    <Input id="duration" placeholder="e.g., 2 hours" />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <div className="flex items-center">
                        <span className="p-2 border rounded-l-md bg-muted text-muted-foreground text-sm">LKR</span>
                        <Input id="price" type="number" placeholder="5000" className="rounded-l-none" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="pricing-basis">Pricing Basis</Label>
                    <Input id="pricing-basis" placeholder="per person / per group" />
                 </div>
            </div>
            <div className="space-y-4">
                <Label>Booking Requirements</Label>
                <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="adv-booking" />
                        <Label htmlFor="adv-booking" className="font-normal">Advance Booking Required</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="walk-in" />
                        <Label htmlFor="walk-in" className="font-normal">Walk-in Available</Label>
                    </div>
                </div>
            </div>
             <div className="space-y-4">
                <Label>Schedule</Label>
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Days Available</Label>
                    <div className="flex flex-wrap gap-4">
                       {daysOfWeek.map((day) => (
                         <div key={day} className="flex items-center space-x-2">
                           <Checkbox id={`day-${day.toLowerCase()}`} />
                           <Label htmlFor={`day-${day.toLowerCase()}`} className="font-normal">{day}</Label>
                         </div>
                       ))}
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Time Slots</Label>
                    <div className="flex items-center gap-2">
                        <Input type="time" className="w-32" />
                        <Button variant="outline"><Plus className="mr-2 h-4 w-4" /> Add Slot</Button>
                        <Button variant="ghost" size="icon"><Clock className="h-4 w-4" /></Button>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="schedule-notes" className="text-xs text-muted-foreground">Schedule Notes</Label>
                    <Input id="schedule-notes" placeholder="e.g., Every Friday Evening, Daily except Tuesdays" />
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
                <Label htmlFor="min-participants">Minimum Participants</Label>
                <Input id="min-participants" type="number" defaultValue="1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-participants">Maximum Participants</Label>
                <Input id="max-participants" type="number" defaultValue="20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="seasonal">Seasonal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="bg-primary/10 p-2 rounded-full"><UploadCloud className="h-5 w-5 text-primary"/></span>
                    Experience Images
                </h3>
            </div>
             <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    Drag and drop images here, or <span className="font-semibold text-primary">browse files</span>
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB each</p>
                </div>
                <Input id="dropzone-file" type="file" className="hidden" />
              </label>
            </div>
            <div className="flex gap-4">
                <div className="relative">
                    <Image src="https://placehold.co/200x150" alt="Tea plantation" width={200} height={150} className="rounded-lg" data-ai-hint="tea plantation" />
                    <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">Primary</div>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href="/experience">Cancel</Link>
        </Button>
        <Button onClick={handleAddExperience}>+ Add Experience</Button>
      </div>
      
       <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
            <DialogContent className="sm:max-w-md">
                <div className="flex flex-col items-center justify-center text-center p-8">
                    <div className="p-4 bg-blue-100 rounded-full mb-4">
                        <div className="p-2 bg-blue-200 rounded-full">
                           <CheckCircle2 className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold mb-2">Successfully Created New Experience !</h2>
                    <p className="text-muted-foreground">The new experience is now available for booking.</p>
                    <DialogClose asChild>
                        <Button className="mt-6 w-full" onClick={() => setShowSuccessDialog(false)}>Done</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
}

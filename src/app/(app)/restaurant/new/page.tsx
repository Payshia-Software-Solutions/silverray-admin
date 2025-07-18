
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Bold, Italic, Underline, Plus, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
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
            <CardTitle>Image Gallery</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <div className="relative group">
                <Image src="https://placehold.co/200x150" alt="Restaurant interior" width={200} height={150} className="rounded-lg object-cover w-full aspect-[4/3]" data-ai-hint="restaurant interior" />
                 <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">Primary</div>
              </div>
              <Image src="https://placehold.co/200x150" alt="Restaurant bar" width={200} height={150} className="rounded-lg object-cover w-full aspect-[4/3]" data-ai-hint="restaurant bar" />
              <Image src="https://placehold.co/200x150" alt="Outdoor seating" width={200} height={150} className="rounded-lg object-cover w-full aspect-[4/3]" data-ai-hint="outdoor seating" />
              <Button variant="outline" className="w-full aspect-[4/3] flex flex-col items-center justify-center gap-2">
                 <ImageIcon className="h-6 w-6 text-muted-foreground" />
                 <span className="text-sm">Add Image</span>
              </Button>
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
            <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Venue
            </Button>
            <div className="flex gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
            </div>
        </div>
      </div>
    </div>
  );
}

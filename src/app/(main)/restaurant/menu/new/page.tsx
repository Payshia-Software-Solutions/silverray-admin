
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Utensils, DollarSign, Sprout, Pepper, Upload, Image as ImageIcon, CheckCircle2, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';

const dietaryOptions = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'keto-friendly', label: 'Keto-Friendly' },
];

export default function NewMenuItemPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccessDialog(true);
  };

  return (
    <>
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/restaurant">Restaurant Management</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add New Menu Item</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <form onSubmit={handleCreateItem} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2"><Utensils className="h-5 w-5 text-primary"/>Basic Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="item-name">Item Name *</Label>
                  <Input id="item-name" placeholder="e.g., Grilled Atlantic Salmon" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="A brief, appealing description of the dish" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 space-y-6">
                 <h3 className="text-lg font-semibold flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary"/>Pricing & Category</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <div className="flex items-center">
                        <span className="p-2 border rounded-l-md bg-muted text-muted-foreground text-sm">LKR</span>
                        <Input id="price" type="number" placeholder="2300" className="rounded-l-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select>
                      <SelectTrigger id="category"><SelectValue placeholder="Select Category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starter">Starter</SelectItem>
                        <SelectItem value="main-course">Main Course</SelectItem>
                        <SelectItem value="dessert">Dessert</SelectItem>
                        <SelectItem value="beverage">Beverage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2"><Sprout className="h-5 w-5 text-primary"/>Dietary Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {dietaryOptions.map(option => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox id={option.id} />
                      <Label htmlFor={option.id} className="font-normal">{option.label}</Label>
                    </div>
                  ))}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="spice-level"><Pepper className="h-4 w-4 inline-block mr-2"/>Spice Level</Label>
                    <Select>
                        <SelectTrigger id="spice-level"><SelectValue placeholder="Not Spicy" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="not-spicy">Not Spicy</SelectItem>
                            <SelectItem value="mild">Mild</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hot">Hot</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2"><ImageIcon className="h-5 w-5 text-primary"/>Item Image</h3>
                <div className="w-full aspect-video rounded-lg border-2 border-dashed bg-muted/50 flex items-center justify-center relative overflow-hidden">
                  {imagePreview ? (
                    <Image src={imagePreview} alt="Menu item preview" fill className="object-cover" />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Upload className="mx-auto h-8 w-8 mb-2" />
                      <p className="text-sm">Upload an image</p>
                    </div>
                  )}
                </div>
                <Input id="image-upload" type="file" className="text-sm" onChange={handleImageChange} />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">Status</h3>
                <div className="space-y-2">
                    <Label htmlFor="status">Availability Status</Label>
                    <Select>
                        <SelectTrigger id="status"><SelectValue placeholder="Select Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="seasonal">Seasonal</SelectItem>
                            <SelectItem value="unavailable">Unavailable</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="restaurant-assignment">Restaurant</Label>
                    <Select>
                        <SelectTrigger id="restaurant-assignment"><SelectValue placeholder="Select Restaurant" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="main-restaurant">Main Restaurant</SelectItem>
                            <SelectItem value="poolside-grill">Poolside Grill & Bar</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-2">
            <Button variant="outline" asChild type="button">
                <Link href="/restaurant?tab=menu">Cancel</Link>
            </Button>
            <Button type="submit">
                Create Menu Item
            </Button>
        </div>
      </form>
    </div>

    <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader className="sr-only">
                <DialogTitle>Success</DialogTitle>
                <DialogDescription>A new menu item has been created.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center text-center p-8">
                <div className="p-4 bg-blue-100 rounded-full mb-4">
                    <div className="p-2 bg-blue-200 rounded-full">
                       <CheckCircle2 className="h-8 w-8 text-blue-600" />
                    </div>
                </div>
                <h2 className="text-xl font-bold mb-2">Successfully Created Menu Item!</h2>
                <DialogClose asChild>
                    <Button className="mt-6" onClick={() => setShowSuccessDialog(false)}>Done</Button>
                </DialogClose>
            </div>
             <button onClick={() => setShowSuccessDialog(false)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted">
                <X className="h-5 w-5" />
            </button>
        </DialogContent>
    </Dialog>
    </>
  );
}

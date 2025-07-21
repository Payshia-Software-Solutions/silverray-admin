
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { UploadCloud, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

export default function EditMenuItemPage() {
  const params = useParams();
  const id = params.id as string;

  // This would be fetched from a DB in a real app based on the id
  const menuItem = {
    id: 'grilled-atlantic-salmon',
    name: 'Grilled Atlantic Salmon',
    restaurant: 'Main Restaurant',
    category: 'starter',
    price: '28.50',
    description: 'Fresh Atlantic salmon grilled to perfection, served with seasonal vegetables and lemon herb butter. Our signature dish features sustainably sourced fish with a delicate balance of flavors.',
    status: 'available',
    dietary: ['gluten-free', 'keto-friendly'],
    image: 'https://placehold.co/400x300',
    imageHint: 'grilled salmon dish'
  };
  const [imagePreview, setImagePreview] = useState<string | null>(menuItem.image);

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/restaurant">Restaurant & Dining Management</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {/* This would typically link to the menu items tab */}
            <BreadcrumbLink href="/restaurant">Menu Items</BreadcrumbLink>
          </BreadcrumbItem>
           <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{menuItem.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">{menuItem.name}</h1>
            <Badge className="bg-green-100 text-green-700 border-green-200">Available</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardContent className="p-6 space-y-6">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="restaurant">Restaurant</Label>
                            <Input id="restaurant" value={menuItem.restaurant} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="item-name">Item Name</Label>
                            <Input id="item-name" defaultValue={menuItem.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select defaultValue={menuItem.category}>
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="starter">Starters</SelectItem>
                                <SelectItem value="main-course">Main Courses</SelectItem>
                                <SelectItem value="dessert">Desserts</SelectItem>
                                <SelectItem value="beverage">Beverages</SelectItem>
                            </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="price">Price</Label>
                            <div className="flex items-center">
                                <span className="p-2 border rounded-l-md bg-muted text-muted-foreground text-sm">$</span>
                                <Input id="price" type="number" defaultValue={menuItem.price} className="rounded-l-none" />
                            </div>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" defaultValue={menuItem.description} className="min-h-[100px]" />
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardContent className="p-6 space-y-6">
                    <h3 className="text-lg font-semibold">Dietary & Status Information</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <Label>Dietary Information</Label>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="gluten-free" defaultChecked={menuItem.dietary.includes('gluten-free')} />
                                    <Label htmlFor="gluten-free" className="font-normal">Gluten-Free</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="vegetarian" defaultChecked={menuItem.dietary.includes('vegetarian')} />
                                    <Label htmlFor="vegetarian" className="font-normal">Vegetarian</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="vegan" defaultChecked={menuItem.dietary.includes('vegan')} />
                                    <Label htmlFor="vegan" className="font-normal">Vegan</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="keto-friendly" defaultChecked={menuItem.dietary.includes('keto-friendly')} />
                                    <Label htmlFor="keto-friendly" className="font-normal">Keto-Friendly</Label>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                             <Select defaultValue={menuItem.status}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="unavailable">Unavailable</SelectItem>
                                    <SelectItem value="seasonal">Seasonal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
             <Card>
                <CardContent className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold">Menu Item Image</h3>
                    {imagePreview && (
                        <div className="relative">
                            <Image src={imagePreview} alt={menuItem.name} width={400} height={300} className="rounded-lg object-cover w-full aspect-[4/3]" data-ai-hint={menuItem.imageHint} />
                             <Button variant="link" className="text-red-500 hover:text-red-600 p-0 h-auto text-xs absolute bottom-[-20px] left-0">Remove Image</Button>
                        </div>
                    )}
                    <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                        <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-1 text-sm text-muted-foreground">
                            Drop a new image here or
                        </p>
                        <Button type="button" variant="link" size="sm">Choose File</Button>
                        </div>
                        <Input id="dropzone-file" type="file" className="hidden" />
                    </label>
                </CardContent>
            </Card>
        </div>
      </div>
       <div className="flex justify-between items-center mt-6">
        <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Item
        </Button>
        <div className="flex gap-2">
            <Button variant="outline" asChild>
                <Link href="/restaurant">Cancel</Link>
            </Button>
            <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}


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
import { Bold, Italic, List, Plus, Trash2, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const associatedHalls = [
    { id: 'grand-ballroom', label: 'Grand Ballroom' },
    { id: 'garden-pavilion', label: 'Garden Pavilion' },
    { id: 'rooftop-terrace', label: 'Rooftop Terrace' },
    { id: 'crystal-hall', label: 'Crystal Hall' },
    { id: 'seaside-deck', label: 'Seaside Deck' },
    { id: 'heritage-room', label: 'Heritage Room' },
];

export default function NewWeddingPackagePage() {
  const [inclusions, setInclusions] = useState([{ id: 1, title: '', details: '' }]);

  const addInclusion = () => {
    setInclusions([...inclusions, { id: Date.now(), title: '', details: '' }]);
  };

  const removeInclusion = (id: number) => {
    setInclusions(inclusions.filter(inclusion => inclusion.id !== id));
  };

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/weddings">Wedding Management</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create New Wedding Packages</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="package-name">Package Name *</Label>
                    <Input id="package-name" placeholder="e.g., Silver Grandeur" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Input id="status" placeholder="e.g., Active" />
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="short-description">Short Description</Label>
              <Textarea id="short-description" placeholder="Brief overview of the package" />
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
                  placeholder="Comprehensive description of the package, theme, and experience"
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
                        <Input id="price" type="number" placeholder="150,000" className="rounded-l-none" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="max-guests">Maximum Guest Capacity</Label>
                    <Input id="max-guests" type="number" placeholder="200" />
                 </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Package Inclusions</h3>
                    <Button variant="outline" onClick={addInclusion}>
                        <Plus className="mr-2 h-4 w-4" /> Add Inclusion
                    </Button>
                </div>
                {inclusions.map((inclusion, index) => (
                    <div key={inclusion.id} className="space-y-2">
                        <Label>Inclusion {index + 1}</Label>
                        <div className="flex items-center gap-2">
                            <Input placeholder="Type/Title (e.g., Catering)" />
                            <Input placeholder="Detailed description of this inclusion" />
                            <Button variant="ghost" size="icon" onClick={() => removeInclusion(inclusion.id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Associated Halls</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {associatedHalls.map((hall) => (
                  <div key={hall.id} className="flex items-center space-x-2">
                    <Checkbox id={hall.id} />
                    <Label htmlFor={hall.id} className="font-normal">{hall.label}</Label>
                  </div>
                ))}
            </div>
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
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href="/weddings">Cancel</Link>
        </Button>
        <Button>+ Add Wedding Package</Button>
      </div>
    </div>
  );
}

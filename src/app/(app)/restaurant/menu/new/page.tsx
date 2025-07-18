
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, UploadCloud } from 'lucide-react';
import Link from 'next/link';

export default function NewMealItemPage() {
  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200 text-blue-800">
        <Info className="h-4 w-4 !text-blue-800" />
        <AlertDescription>
          Adding to: <span className="font-semibold">Main Restaurant</span>
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="item-name">Item Name *</Label>
                <Input id="item-name" placeholder="e.g., Grilled Atlantic Salmon" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select>
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
                <Label htmlFor="price">Price (LKR) *</Label>
                <Input id="price" type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select>
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
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the dish, ingredients, cooking style, and flavor profile..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dietary Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'vegetarian', label: 'Vegetarian' },
              { id: 'vegan', label: 'Vegan' },
              { id: 'gluten-free', label: 'Gluten-Free' },
              { id: 'dairy-free', label: 'Dairy-Free' },
              { id: 'nut-free', label: 'Nut-Free' },
              { id: 'contains-shellfish', label: 'Contains Shellfish' },
              { id: 'contains-dairy', label: 'Contains Dairy' },
              { id: 'contains-nuts', label: 'Contains Nuts' },
            ].map(item => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox id={item.id} />
                <Label htmlFor={item.id} className="font-normal">{item.label}</Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spice Level</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup defaultValue="mild" className="flex items-center gap-6">
              {[
                { id: 'not-spicy', label: 'Not Spicy' },
                { id: 'mild', label: 'Mild' },
                { id: 'medium', label: 'Medium' },
                { id: 'hot', label: 'Hot' },
              ].map(item => (
                <div key={item.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={item.id} id={item.id} />
                  <Label htmlFor={item.id} className="font-normal">{item.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meal Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">Drop your image here, or browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                </div>
                <Input id="dropzone-file" type="file" className="hidden" />
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline" asChild>
            <Link href="/restaurant">Cancel</Link>
          </Button>
          <Button>Add Meal Item</Button>
        </div>
      </div>
    </div>
  );
}


'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { User, Shield, Upload, Eye, EyeOff, UserPlus, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog';

export default function AddNewAdminPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleCreateAccount = () => {
    // In a real app, you would handle form submission here.
    setShowSuccessDialog(true);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/user-management">User Management</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add New Admin</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-8 max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-full">
                    <User className="h-5 w-5 text-primary" />
                </span>
                <h2 className="text-lg font-semibold">User Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="col-span-1 flex flex-col items-center text-center gap-4">
                    <Label htmlFor="profile-picture">Profile Picture (Optional)</Label>
                    <div className="flex flex-col items-center justify-center h-32 w-32 border-2 border-dashed rounded-full bg-muted/50">
                        <UserPlus className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <label htmlFor="profile-picture-upload">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Photo
                        </label>
                    </Button>
                    <Input id="profile-picture-upload" type="file" className="hidden" />
                    <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
                </div>
                <div className="col-span-2 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="full-name">Full Name *</Label>
                        <Input id="full-name" placeholder="Saman Edirimuni" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" placeholder="admin@grandsilverray.com" />
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-full">
                    <Shield className="h-5 w-5 text-primary" />
                </span>
                <h2 className="text-lg font-semibold">Security & Role Assignment</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 relative">
                <Label htmlFor="password">Password *</Label>
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" />
                <Button variant="ghost" size="icon" className="absolute right-1 top-7 h-8 w-8" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <div className="space-y-2 relative">
                <Label htmlFor="confirm-password">Confirm Password *</Label>
                <Input id="confirm-password" type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••" />
                <Button variant="ghost" size="icon" className="absolute right-1 top-7 h-8 w-8" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
               <div className="space-y-2">
                <Label htmlFor="role-assignment">Role Assignment *</Label>
                <Select>
                  <SelectTrigger id="role-assignment">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super-admin">Super Admin</SelectItem>
                    <SelectItem value="booking-manager">Booking Manager</SelectItem>
                    <SelectItem value="restaurant-manager">Restaurant Manager</SelectItem>
                    <SelectItem value="front-desk">Front Desk</SelectItem>
                    <SelectItem value="housekeeping">Housekeeping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Account Status</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="account-status" defaultChecked />
                  <Label htmlFor="account-status" className="font-normal">Active</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline" asChild>
            <Link href="/user-management">Cancel</Link>
          </Button>
          <Button onClick={handleCreateAccount}>
            <UserPlus className="mr-2 h-4 w-4" />
            Create Account
          </Button>
        </div>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="sm:max-w-md">
              <div className="flex flex-col items-center justify-center text-center p-8">
                  <div className="p-4 bg-blue-100 rounded-full mb-4">
                      <div className="p-2 bg-blue-200 rounded-full">
                         <CheckCircle2 className="h-8 w-8 text-blue-600" />
                      </div>
                  </div>
                  <h2 className="text-xl font-bold mb-2">Successfully Admin Account Created !</h2>
                  <p className="text-muted-foreground">The new admin account is ready to be used.</p>
                  <DialogClose asChild>
                      <Button className="mt-6 w-full" onClick={() => setShowSuccessDialog(false)}>Done</Button>
                  </DialogClose>
              </div>
          </DialogContent>
      </Dialog>
    </div>
  );
}

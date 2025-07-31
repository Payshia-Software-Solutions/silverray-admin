
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadCloud } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hotel Information</CardTitle>
              <CardDescription>
                Update your hotel's public details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hotel-name">Hotel Name</Label>
                <Input id="hotel-name" defaultValue="Grand Silver Ray" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  defaultValue="123 Luxury Ave, Paradise City, 10100"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    defaultValue="contact@grandsilverray.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    defaultValue="+94 11 234 5678"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Localization</CardTitle>
              <CardDescription>
                Set your hotel's local preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select defaultValue="lkr">
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lkr">LKR (Sri Lankan Rupee)</SelectItem>
                    <SelectItem value="usd">USD (US Dollar)</SelectItem>
                    <SelectItem value="eur">EUR (Euro)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="sri-lanka">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sri-lanka">
                      (GMT+5:30) Sri Jayawardenepura Kotte
                    </SelectItem>
                    <SelectItem value="new-york">
                      (GMT-4:00) New York
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </TabsContent>
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>
                Customize your hotel's branding and logo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Logo</Label>
                    <div className="flex items-center gap-4">
                        <div className="w-24 h-24 bg-muted rounded-md flex items-center justify-center">
                            <span className="text-muted-foreground text-sm">Logo</span>
                        </div>
                         <label
                            htmlFor="logo-upload"
                            className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
                        >
                            <div className="flex flex-col items-center justify-center">
                            <UploadCloud className="w-6 h-6 mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                Drag and drop or <span className="font-semibold text-primary">browse</span>
                            </p>
                            </div>
                            <Input id="logo-upload" type="file" className="hidden" />
                        </label>
                    </div>
                </div>
            </CardContent>
          </Card>
           <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </TabsContent>
         <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Manage your email notification preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <Label htmlFor="new-booking-notif">New Booking</Label>
                  <p className="text-sm text-muted-foreground">Receive an email for every new booking made.</p>
                </div>
                <Switch id="new-booking-notif" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <Label htmlFor="new-message-notif">New Contact Message</Label>
                  <p className="text-sm text-muted-foreground">Receive an email when a new message is submitted.</p>
                </div>
                <Switch id="new-message-notif" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <Label htmlFor="cancellation-notif">Cancellations</Label>
                  <p className="text-sm text-muted-foreground">Receive an email when a booking is cancelled.</p>
                </div>
                <Switch id="cancellation-notif" />
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </TabsContent>
         <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your account password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                    <Label htmlFor="2fa-switch">Enable 2FA</Label>
                    <p className="text-sm text-muted-foreground">Secure your account with a second factor.</p>
                    </div>
                    <Switch id="2fa-switch" />
                </div>
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

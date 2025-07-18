
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Calendar as CalendarIcon, Users, Clock, Gift, Building, Plus, Wallet, Tag, Check, Trash2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';


export default function NewWeddingBookingPage() {
  const [weddingDate, setWeddingDate] = useState<Date | undefined>(undefined);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleCreateBooking = () => {
    // In a real app, you would handle form submission here.
    setShowSuccessDialog(true);
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
            <BreadcrumbPage>Wedding Booking</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-primary"/>
                Couple & Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bride-name">Bride's Name *</Label>
                <Input id="bride-name" placeholder="Enter bride's full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="groom-name">Groom's/Partner's Name *</Label>
                <Input id="groom-name" placeholder="Enter groom's/partner's full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email *</Label>
                <Input id="contact-email" type="email" placeholder="contact@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Contact Phone *</Label>
                <Input id="contact-phone" type="tel" placeholder="+1 (555) 123-4567" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="mailing-address">Mailing Address</Label>
                <Textarea id="mailing-address" placeholder="Enter complete mailing address" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="internal-notes">Internal Notes</Label>
                <Textarea id="internal-notes" placeholder="Internal notes about the couple (admin use only)" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary"/>
                Wedding Event Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="wedding-date">Wedding Date *</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !weddingDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {weddingDate ? format(weddingDate, 'PPP') : <span>mm/dd/yyyy</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={weddingDate} onSelect={setWeddingDate} initialFocus /></PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wedding-time">Wedding Time</Label>
                <Input id="wedding-time" type="time" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expected-guests">Expected Guests *</Label>
                <Input id="expected-guests" type="number" placeholder="150" />
              </div>
              <div className="md:col-span-3 space-y-2">
                <Label htmlFor="wedding-package">Wedding Package *</Label>
                <Select>
                    <SelectTrigger id="wedding-package"><SelectValue placeholder="Select a package" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="silver-grandeur">Silver Grandeur</SelectItem>
                        <SelectItem value="diamond-bliss">Diamond Bliss</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>
            <div className="p-4 bg-primary/5 rounded-md space-y-2">
                <h4 className="font-semibold text-sm">Package Inclusions:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Grand Ballroom (8 hours)</div>
                    <div className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Premium Catering for 150</div>
                    <div className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Floral Arrangements</div>
                    <div className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Professional Photography</div>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary"/>
                    Wedding Halls Selection
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="font-semibold">Grand Ballroom</h4>
                                <Badge variant="outline" className="bg-green-100 text-green-700">Available</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">Capacity: 200 guests</p>
                        </div>
                        <div className="flex items-center space-x-2 mt-4">
                            <Checkbox id="hall-grand-ballroom" />
                            <Label htmlFor="hall-grand-ballroom" className="font-normal">Select this hall</Label>
                        </div>
                    </Card>
                     <Card className="p-4 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="font-semibold">Crystal Hall</h4>
                                <Badge variant="outline" className="bg-green-100 text-green-700">Available</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">Capacity: 120 guests</p>
                        </div>
                        <div className="flex items-center space-x-2 mt-4">
                            <Checkbox id="hall-crystal-hall" />
                            <Label htmlFor="hall-crystal-hall" className="font-normal">Select this hall</Label>
                        </div>
                    </Card>
                     <Card className="p-4 flex flex-col justify-between bg-muted/50">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="font-semibold text-muted-foreground">Royal Suite</h4>
                                <Badge variant="outline" className="bg-red-100 text-red-700">Booked</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">Capacity: 80 guests</p>
                        </div>
                        <div className="flex items-center space-x-2 mt-4">
                            <Checkbox id="hall-royal-suite" disabled />
                            <Label htmlFor="hall-royal-suite" className="font-normal text-muted-foreground">Unavailable</Label>
                        </div>
                    </Card>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Gift className="h-5 w-5 text-primary"/>
                    Additional Services
                </h3>
                <div className="flex items-center gap-2">
                    <Input placeholder="Search or add a service..." />
                    <Button><Plus className="mr-2 h-4 w-4" /> Add</Button>
                </div>
                <div className="p-3 border rounded-md flex justify-between items-center">
                    <div>
                        <p className="font-medium">Premium Photography Upgrade</p>
                        <p className="text-sm text-muted-foreground">Professional photographer with extended coverage</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Input type="number" defaultValue="1" className="w-16 text-center" />
                        <span className="font-semibold">$800</span>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary"/>
                    Financial Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Package Cost:</span>
                            <span className="font-semibold">$8,999</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Add-ons Total:</span>
                            <span className="font-semibold">$800</span>
                        </div>
                        <div className="flex justify-between items-center text-lg p-3 bg-primary/10 rounded-md">
                            <span className="font-bold">Grand Total:</span>
                            <span className="font-bold">$9,799</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="payment-status">Payment Status</Label>
                            <Select>
                                <SelectTrigger id="payment-status"><SelectValue placeholder="Select Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="deposit-paid">Deposit Paid</SelectItem>
                                    <SelectItem value="full-paid">Full Paid</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount-paid">Amount Paid</Label>
                            <Input id="amount-paid" type="number" placeholder="0.00" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="payment-method">Payment Method</Label>
                            <Select>
                                <SelectTrigger id="payment-method"><SelectValue placeholder="Select Method" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="credit-card">Credit Card</SelectItem>
                                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="cash">Cash</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary"/>
                    Booking Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="booking-status">Initial Booking Status</Label>
                        <Select>
                            <SelectTrigger id="booking-status"><SelectValue placeholder="Select Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="tentative">Tentative</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="booking-source">Booking Source</Label>
                        <Select>
                            <SelectTrigger id="booking-source"><SelectValue placeholder="Select Source" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="website">Website</SelectItem>
                                <SelectItem value="phone-call">Phone Call</SelectItem>
                                <SelectItem value="referral">Referral</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href="/weddings">Cancel</Link>
        </Button>
        <Button onClick={handleCreateBooking}>+ Create Wedding Booking</Button>
      </div>

       <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="sr-only">
                    <DialogTitle>Success</DialogTitle>
                    <DialogDescription>A new booking has been successfully created.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center text-center p-8">
                    <div className="p-4 bg-blue-100 rounded-full mb-4">
                        <div className="p-2 bg-blue-200 rounded-full">
                           <CheckCircle2 className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold mb-2">Successfully Created New Booking !</h2>
                    <DialogClose asChild>
                        <Button className="mt-6" onClick={() => setShowSuccessDialog(false)}>Done</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
}

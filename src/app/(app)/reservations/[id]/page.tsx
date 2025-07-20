
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Calendar as CalendarIcon, User, BedDouble, Wallet, Info, CheckCircle, Clock, Mail, Printer, Check, AlertTriangle, X, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const activityLog = [
    { text: 'Email confirmation sent', time: 'May 10, 2025 - 10:16 AM' },
    { text: 'Payment of LKR 20,000 recorded', time: 'May 10, 2025 - 10:15 AM' },
    { text: 'Status changed to Confirmed', time: 'May 8, 2025 - 2:35 PM' },
    { text: 'Booking created by Admin John', time: 'May 8, 2025 - 2:30 PM' },
]

export default function BookingDetailsPage() {
    const params = useParams<{ id: string }>();
    const bookingId = params.id;

  const [checkinDate, setCheckinDate] = useState<Date | undefined>(new Date('2025-06-15'));
  const [checkoutDate, setCheckoutDate] = useState<Date | undefined>(new Date('2025-06-18'));

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/reservations">Booking Management</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>#{bookingId}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex items-center gap-2 flex-wrap">
            <Button>Save Changes</Button>
            <Button variant="outline">Cancel</Button>
            <div className="flex-grow"/>
            <Button variant="outline" className="bg-green-600 text-white hover:bg-green-700 hover:text-white">Record Payment</Button>
            <Button variant="outline"><Mail className="mr-2 h-4 w-4"/>Send Email</Button>
            <Button variant="outline"><Printer className="mr-2 h-4 w-4"/>Print Invoice</Button>
            <Button variant="outline"><Check className="mr-2 h-4 w-4"/>Check In</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><User className="h-5 w-5 text-primary"/> Guest Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input id="full-name" defaultValue="John Smith" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="john.smith@email.com" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                     <Textarea id="address" defaultValue="123 Main Street, New York, NY 10001" className="min-h-[40px]" />
                </div>
                <div className="md:col-span-2 space-y-2">
                     <Label htmlFor="special-requests">Special Requests</Label>
                    <Textarea id="special-requests" defaultValue="Late check-in after 10 PM, extra pillows requested" />
                </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><BedDouble className="h-5 w-5 text-primary"/> Room & Stay Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="room-type">Room Type</Label>
                    <Select defaultValue="deluxe">
                        <SelectTrigger id="room-type"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="deluxe">Deluxe Double Room with Balcony</SelectItem>
                            <SelectItem value="suite">King Suite</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="room-number">Room Number</Label>
                    <Select defaultValue="101">
                        <SelectTrigger id="room-number"><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="101">Room 101</SelectItem>
                            <SelectItem value="102">Room 102</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="checkin-date">Check-in Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !checkinDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {checkinDate ? format(checkinDate, 'PPP') : <span>mm/dd/yyyy</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={checkinDate} onSelect={setCheckinDate} initialFocus /></PopoverContent>
                    </Popover>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="checkout-date">Check-out Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !checkoutDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {checkoutDate ? format(checkoutDate, 'PPP') : <span>mm/dd/yyyy</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={checkoutDate} onSelect={setCheckoutDate} initialFocus /></PopoverContent>
                    </Popover>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="adults">Adults</Label>
                    <Input id="adults" type="number" defaultValue={2} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="children">Children</Label>
                    <Input id="children" type="number" defaultValue={0} />
                </div>
            </div>
             <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Room available for selected dates</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><Wallet className="h-5 w-5 text-primary"/> Pricing & Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="discount-code">Discount Code</Label>
                    <Input id="discount-code" defaultValue="PAYSHIA25" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="payment-status">Payment Status</Label>
                     <Select defaultValue="paid"><SelectTrigger id="payment-status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="paid">Paid</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="due">Due</SelectItem></SelectContent></Select>
                </div>
            </div>
            <div className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                    <p className="text-muted-foreground">Subtotal (3 nights)</p>
                    <p>LKR 45,000</p>
                </div>
                <div className="flex justify-between text-sm text-red-500">
                    <p>Discount (20%)</p>
                    <p>-LKR 9,000</p>
                </div>
                 <div className="flex justify-between text-sm">
                    <p className="text-muted-foreground">Taxes & Fees</p>
                    <p>LKR 3,600</p>
                </div>
                <div className="border-t my-2"></div>
                <div className="flex justify-between font-bold text-lg">
                    <p>Total Amount</p>
                    <p>LKR 39,600</p>
                </div>
                 <div className="flex justify-between text-sm">
                    <p className="text-muted-foreground">Amount Paid</p>
                    <p>LKR 20,000</p>
                </div>
                 <div className="flex justify-between text-sm text-red-500 font-semibold">
                    <p>Balance Due</p>
                    <p>LKR 19,600</p>
                </div>
            </div>
            <div>
                <h4 className="font-medium mb-2">Payment History</h4>
                <div className="border rounded-lg">
                    <div className="p-3 flex justify-between items-center">
                        <div>
                            <p className="font-medium">LKR 20,000</p>
                            <p className="text-sm text-muted-foreground">Credit Card</p>
                        </div>
                         <div>
                            <p className="text-sm text-muted-foreground text-right">Dec 10, 2024</p>
                            <p className="text-sm text-green-600 font-semibold text-right">Completed</p>
                        </div>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Info className="h-5 w-5 text-primary"/> Booking Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="current-status">Current Status</Label>
                    <Select defaultValue="confirmed">
                        <SelectTrigger id="current-status"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="checked-in">Checked In</SelectItem>
                             <SelectItem value="checked-out">Checked Out</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="booking-source">Booking Source</Label>
                    <Select defaultValue="web">
                        <SelectTrigger id="booking-source"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="web">Web</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="walk-in">Walk-in</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="text-sm text-muted-foreground space-y-1 pt-2">
                    <p>Booking ID: <span className="font-medium text-foreground">#{bookingId}</span></p>
                    <p>Created: <span className="font-medium text-foreground">May 8, 2025</span></p>
                    <p>Nights: <span className="font-medium text-foreground">3</span></p>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Clock className="h-5 w-5 text-primary"/> Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-border"></div>
                    <div className="space-y-6">
                        {activityLog.map((item, index) => (
                             <div key={index} className="flex items-start gap-3 relative">
                                <div className="h-2 w-2 rounded-full bg-primary mt-1.5 border-2 border-background"></div>
                                <div>
                                    <p className="text-sm text-foreground">{item.text}</p>
                                    <p className="text-xs text-muted-foreground">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="border-red-500 bg-red-50">
             <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-red-700"><AlertTriangle className="h-5 w-5"/> Danger Zone</CardTitle>
            </CardHeader>
             <CardContent className="space-y-3">
                <Button variant="destructive" className="w-full"><X className="mr-2 h-4 w-4"/> Cancel Booking</Button>
                <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700"><Trash2 className="mr-2 h-4 w-4"/> Delete Booking</Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}


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
import { Calendar as CalendarIcon, User, BedDouble, Wallet, Info, Minus, Plus, CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Link from 'next/link';

export default function NewBookingPage() {
  const [checkinDate, setCheckinDate] = useState<Date | undefined>(undefined);
  const [checkoutDate, setCheckoutDate] = useState<Date | undefined>(undefined);

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/reservations">Booking Management</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add New Booking</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <Card>
        <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Create New Booking</h1>
                    <p className="text-muted-foreground">Fill in the details to create a new room or suite booking</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <X className="h-5 w-5"/>
                </Button>
            </div>

            <div className="space-y-8">
                {/* Guest Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2"><User className="h-5 w-5 text-primary"/> Guest Information</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="full-name">Full Name *</Label>
                            <Input id="full-name" placeholder="Enter guest full name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input id="email" type="email" placeholder="guest@example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input id="phone" placeholder="+1 (555) 123-4567" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                             <Textarea id="address" placeholder="Enter guest address" className="min-h-[40px]" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                             <Label htmlFor="special-requests">Special Requests / Notes</Label>
                            <Textarea id="special-requests" placeholder="Any special requests or notes about the guest" />
                        </div>
                    </div>
                </div>

                {/* Room & Stay Details */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2"><BedDouble className="h-5 w-5 text-primary"/> Room & Stay Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         <div className="space-y-2">
                            <Label htmlFor="room-type">Room Type *</Label>
                            <Select>
                                <SelectTrigger id="room-type"><SelectValue placeholder="Select Room Type" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="deluxe">Deluxe Double Room</SelectItem>
                                    <SelectItem value="suite">King Suite</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="room-number">Specific Room Number</Label>
                            <Select>
                                <SelectTrigger id="room-number"><SelectValue placeholder="Select Room Number" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="101">Room 101</SelectItem>
                                    <SelectItem value="102">Room 102</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div />
                         <div className="space-y-2">
                            <Label htmlFor="checkin-date">Check-in Date *</Label>
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
                            <Label htmlFor="checkout-date">Check-out Date *</Label>
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
                            <Label htmlFor="nights">Number of Nights</Label>
                            <Input id="nights" type="number" defaultValue="3" readOnly />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="adults">Adults *</Label>
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="icon" className="h-9 w-9"><Minus className="h-4 w-4" /></Button>
                                <Input id="adults" type="number" defaultValue={2} className="w-16 text-center" />
                                <Button variant="outline" size="icon" className="h-9 w-9"><Plus className="h-4 w-4" /></Button>
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="children">Children</Label>
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="icon" className="h-9 w-9"><Minus className="h-4 w-4" /></Button>
                                <Input id="children" type="number" defaultValue={0} className="w-16 text-center" />
                                <Button variant="outline" size="icon" className="h-9 w-9"><Plus className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    </div>
                     <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">5 rooms available for selected dates</span>
                    </div>
                </div>

                 {/* Pricing & Payment */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2"><Wallet className="h-5 w-5 text-primary"/> Pricing & Payment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label>Total Price</Label>
                            <Input readOnly value="$450.00" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="discount-code">Discount Code</Label>
                            <Input id="discount-code" placeholder="Enter discount code" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="payment-status">Payment Status</Label>
                             <Select><SelectTrigger id="payment-status"><SelectValue placeholder="Select Payment Status" /></SelectTrigger><SelectContent><SelectItem value="paid">Paid</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="due">Due</SelectItem></SelectContent></Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="amount-paid">Amount Paid</Label>
                            <Input id="amount-paid" type="number" placeholder="0.00" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="payment-method">Payment Method</Label>
                            <Select><SelectTrigger id="payment-method"><SelectValue placeholder="Select Payment Method" /></SelectTrigger><SelectContent><SelectItem value="cc">Credit Card</SelectItem><SelectItem value="cash">Cash</SelectItem><SelectItem value="transfer">Bank Transfer</SelectItem></SelectContent></Select>
                        </div>
                         <div className="space-y-2">
                            <Label>Balance Due</Label>
                            <div className="p-2 rounded-md bg-yellow-50 border border-yellow-200 font-semibold text-yellow-800">
                                $450.00
                            </div>
                        </div>
                    </div>
                </div>

                 {/* Booking Status & Source */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2"><Info className="h-5 w-5 text-primary"/> Booking Status & Source</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <Label htmlFor="booking-status">Initial Booking Status</Label>
                            <Select><SelectTrigger id="booking-status"><SelectValue placeholder="Select Booking Status" /></SelectTrigger><SelectContent><SelectItem value="confirmed">Confirmed</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent></Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="booking-source">Booking Source</Label>
                             <Select><SelectTrigger id="booking-source"><SelectValue placeholder="Select Booking Source" /></SelectTrigger><SelectContent><SelectItem value="online">Online</SelectItem><SelectItem value="phone">Phone Call</SelectItem><SelectItem value="walk-in">Walk-in</SelectItem></SelectContent></Select>
                        </div>
                    </div>
                </div>
                
                 <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" asChild><Link href="/reservations">Cancel</Link></Button>
                    <Button>+ Create Booking</Button>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

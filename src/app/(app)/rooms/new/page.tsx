'use client';

import { useState } from 'react'; // Keep useState import
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

export default function NewRoomBookingPage() {
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);

  return (
    <div className="flex flex-1 flex-col space-y-8 p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Create New Booking</h2>
          <p className="text-muted-foreground">Fill in the details to create a new room or suite booking</p>
        </div>
      </div>
      <Separator />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Guest Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full Name*</Label>
              <Input id="full-name" placeholder="Enter guest full name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address*</Label>
              <Input id="email" type="email" placeholder="guest@example.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number*</Label>
              <Input id="phone" placeholder="+1 (555) 123-4567" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="Enter guest address" />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="special-requests">Special Requests / Notes</Label>
              <Textarea id="special-requests" placeholder="Any special requests or notes about the guest" />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Room & Stay Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="grid gap-2">
              <Label htmlFor="room-type">Room Type*</Label>
              <Select>
                <SelectTrigger id="room-type">
                  <SelectValue placeholder="Select Room Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Room</SelectItem>
                  <SelectItem value="double">Double Room</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="specific-room">Specific Room Number</Label>
              <Select>
                <SelectTrigger id="specific-room">
                  <SelectValue placeholder="Select Room Number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="101">101</SelectItem>
                  <SelectItem value="102">102</SelectItem>
                  <SelectItem value="201">201</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="check-in-date">Check-in Date*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn('w-full justify-start text-left font-normal', !checkInDate && 'text-muted-foreground')}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkInDate ? format(checkInDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={checkInDate} onSelect={setCheckInDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="check-out-date">Check-out Date*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn('w-full justify-start text-left font-normal', !checkOutDate && 'text-muted-foreground')}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOutDate ? format(checkOutDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={checkOutDate} onSelect={setCheckOutDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="number-of-nights">Number of Nights</Label>
              <Input id="number-of-nights" type="number" defaultValue={1} min={1} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="adults">Adults*</Label>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon">
                  -
                </Button>
                <Input id="adults" type="number" defaultValue={2} min={1} className="text-center" />
                <Button variant="outline" size="icon">
                  +
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="children">Children</Label>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon">
                  -
                </Button>
                <Input id="children" type="number" defaultValue={0} min={0} className="text-center" />
                <Button variant="outline" size="icon">
                  +
                </Button>
              </div>
            </div>
            <div className="col-span-full flex items-center justify-center rounded-md bg-green-100 p-2 text-green-700">
              5 rooms available for selected dates
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-1">
          <CardHeader>
            <CardTitle>Pricing & Payment</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="total-price">Total Price</Label>
              <Input id="total-price" defaultValue="$450.00" readOnly />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discount-code">Discount Code</Label>
              <Input id="discount-code" placeholder="Enter discount code" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="payment-status">Payment Status</Label>
              <Select>
                <SelectTrigger id="payment-status">
                  <SelectValue placeholder="Select Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="due">Due</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount-paid">Amount Paid</Label>
              <Input id="amount-paid" defaultValue="0.00" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select>
                <SelectTrigger id="payment-method">
                  <SelectValue placeholder="Select Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="balance-due">Balance Due</Label>
              <Input id="balance-due" defaultValue="$450.00" readOnly className="font-semibold text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-1">
          <CardHeader>
            <CardTitle>Booking Status & Source</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="initial-booking-status">Initial Booking Status</Label>
              <Select>
                <SelectTrigger id="initial-booking-status">
                  <SelectValue placeholder="Select Booking Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="booking-source">Booking Source</Label>
              <Select>
                <SelectTrigger id="booking-source">
                  <SelectValue placeholder="Select Booking Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="walk_in">Walk-in</SelectItem>
                  <SelectItem value="ota">Online Travel Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button>+ Create Booking</Button>
      </div>
    </div>
  );
}

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
import { Calendar as CalendarIcon, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Link from 'next/link';

export default function NewDiningReservationPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/restaurant">Restaurant & Dining</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/restaurant">Reservations</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add New Reservation</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div>
        <h1 className="text-2xl font-bold">Create New Dining Reservation</h1>
        <p className="text-muted-foreground">Fill in the details below to create a new dining reservation</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dining Venue</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="select-restaurant">Select Restaurant *</Label>
                <Select>
                  <SelectTrigger id="select-restaurant">
                    <SelectValue placeholder="Select Restaurant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main-restaurant">Main Restaurant</SelectItem>
                    <SelectItem value="cafe-111">Cafe 111</SelectItem>
                    <SelectItem value="indian-restaurant">Indian Restaurant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-source">Booking Source</Label>
                 <Select>
                  <SelectTrigger id="booking-source">
                    <SelectValue placeholder="Booking Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                    <SelectItem value="walk-in">Walk-in</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Guest Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name *</Label>
                <Input id="full-name" placeholder="Enter guest full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone-number">Phone Number *</Label>
                <Input id="phone-number" placeholder="+1 (555) 123-4567" />
              </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="email-address">Email Address *</Label>
                <Input id="email-address" type="email" placeholder="guest@email.com" />
              </div>
            <div className="space-y-2">
              <Label htmlFor="special-requests">Special Requests / Notes</Label>
              <Textarea id="special-requests" placeholder="Any special requests, dietary restrictions, or celebration notes..." />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Reservation Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="reservation-date">Reservation Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : <span>mm/dd/yyyy</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time-in">Time in *</Label>
                <Input id="time-in" type="time" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" placeholder="e.g. 2 hours" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="table-preference">Table Preference</Label>
                <Input id="table-preference" placeholder="e.g. Window seat" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adults">Adults *</Label>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" className="h-9 w-9">-</Button>
                  <Input id="adults" type="number" defaultValue={2} className="w-16 text-center" />
                  <Button variant="outline" size="icon" className="h-9 w-9">+</Button>
                </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor="children">Children</Label>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" className="h-9 w-9">-</Button>
                  <Input id="children" type="number" defaultValue={0} className="w-16 text-center" />
                  <Button variant="outline" size="icon" className="h-9 w-9">+</Button>
                </div>
              </div>
            </div>
             <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Available - Tables available for selected time slot</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Status & Payment</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="booking-status">Booking Status</Label>
                <Select>
                  <SelectTrigger id="booking-status">
                    <SelectValue placeholder="Booking Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div className="space-y-2">
                <Label htmlFor="payment-status">Payment Status</Label>
                <Select>
                  <SelectTrigger id="payment-status">
                    <SelectValue placeholder="Payment Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="due">Due at venue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                 <Label htmlFor="estimated-bill">Estimated Bill</Label>
                <Input id="estimated-bill" readOnly value="$85.00 (avg. $42.50/person)" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

       <div className="flex justify-end gap-2">
          <Button variant="outline" asChild>
            <Link href="/restaurant">Cancel</Link>
          </Button>
          <Button>+ Create Reservation</Button>
        </div>
    </div>
  );
}


'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Users, Clock, Gift, Building, Plus, Wallet, Tag, Check, Trash2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';

export default function NewEventPage() {
    const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const handleCreateEvent = () => {
        setShowSuccessDialog(true);
    }
  
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Event</CardTitle>
                    <CardDescription>Fill in the details to plan and create a new event.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                     <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Gift className="h-5 w-5 text-primary"/>
                            Event Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="event-name">Event Name *</Label>
                                <Input id="event-name" placeholder="e.g., Annual Tech Conference 2025" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="event-type">Event Type *</Label>
                                <Select>
                                    <SelectTrigger id="event-type"><SelectValue placeholder="Select event type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="corporate">Corporate</SelectItem>
                                        <SelectItem value="private-party">Private Party</SelectItem>
                                        <SelectItem value="wedding">Wedding</SelectItem>
                                        <SelectItem value="conference">Conference</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary"/>
                            Date & Time
                        </h3>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="event-date">Event Date *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !eventDate && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {eventDate ? format(eventDate, 'PPP') : <span>mm/dd/yyyy</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={eventDate} onSelect={setEventDate} initialFocus /></PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="start-time">Start Time</Label>
                                <Input id="start-time" type="time" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end-time">End Time</Label>
                                <Input id="end-time" type="time" />
                            </div>
                         </div>
                    </div>
                    
                     <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Building className="h-5 w-5 text-primary"/>
                            Venue & Capacity
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="hall">Hall/Venue *</Label>
                                <Select>
                                    <SelectTrigger id="hall"><SelectValue placeholder="Select a hall" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="grand-ballroom">Grand Ballroom</SelectItem>
                                        <SelectItem value="terrace-garden">Terrace Garden</SelectItem>
                                        <SelectItem value="conference-a">Conference Hall A</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="guests">Number of Guests *</Label>
                                <Input id="guests" type="number" placeholder="150" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Tag className="h-5 w-5 text-primary"/>
                            Status
                        </h3>
                         <div className="space-y-2">
                            <Label htmlFor="booking-status">Booking Status</Label>
                            <Select>
                                <SelectTrigger id="booking-status"><SelectValue placeholder="Select Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                <Link href="/events">Cancel</Link>
                </Button>
                <Button onClick={handleCreateEvent}>+ Create Event</Button>
            </div>

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Success</DialogTitle>
                        <DialogDescription>A new event has been successfully created.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center text-center p-8">
                        <div className="p-3 bg-blue-100 rounded-full mb-4">
                            <div className="p-2 bg-blue-200 rounded-full">
                            <CheckCircle2 className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold mb-2">Successfully Created Event!</h2>
                        <DialogClose asChild>
                            <Button className="mt-6 w-full" onClick={() => setShowSuccessDialog(false)}>Done</Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}


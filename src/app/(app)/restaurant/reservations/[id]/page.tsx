
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  CheckCircle,
  Clock,
  Mail,
  Minus,
  Plus,
  Save,
  Trash2,
  User,
  X,
  Calendar as CalendarIcon,
  CheckCircle2,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const activityLog = [
    { text: 'Reservation created', time: 'Jan 10, 2024 at 2:30 PM by Admin A', color: 'bg-blue-500' },
    { text: 'Status changed to Confirmed', time: 'Jan 10, 2024 at 3:15 PM by Admin A', color: 'bg-green-500' },
    { text: 'Special requests updated', time: 'Jan 12, 2024 at 10:20 AM by Admin B', color: 'bg-yellow-500' },
]


export default function EditRestaurantReservationPage() {
  const params = useParams();
  const id = params.id as string;
  const [date, setDate] = useState<Date | undefined>(new Date('2024-01-15'));
  const [showSaveSuccessDialog, setShowSaveSuccessDialog] = useState(false);


  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/restaurant">
                    Restaurant & Dining
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/restaurant">Reservations</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Edit Reservation</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center gap-4 mt-2">
              <h1 className="text-3xl font-bold">
                Edit & View: John Smith - #{id}
              </h1>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                Confirmed
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Modify reservation details and manage booking status
            </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setShowSaveSuccessDialog(true)}>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle className="mr-2 h-4 w-4" /> Mark as Seated
                    </Button>
                    <Button variant="outline" className="bg-orange-500 hover:bg-orange-600 text-white">
                        <Mail className="mr-2 h-4 w-4" /> Send Email
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                            <X className="mr-2 h-4 w-4" /> Cancel Reservation
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-center text-2xl font-bold">Do you want to Cancel this Reservation ?</AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="sm:justify-center">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-500 hover:bg-red-600">Cancel Reservation</AlertDialogAction>
                          </AlertDialogFooter>
                          <AlertDialogCancel asChild>
                              <button className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200">
                                  <X className="h-5 w-5" />
                              </button>
                          </AlertDialogCancel>
                      </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </CardContent>
      </Card>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Guest Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input id="full-name" defaultValue="John Smith" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="john.smith@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="special-requests">Special Requests/Notes</Label>
                <Textarea
                  id="special-requests"
                  defaultValue="Vegetarian menu, window table preferred"
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Reservation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="dining-venue">Dining Venue</Label>
                    <Input id="dining-venue" defaultValue="Main Restaurant" disabled />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="reservation-date">Reservation Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, 'yyyy-MM-dd') : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} initialFocus /></PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="time-in">Time In</Label>
                    <div className="relative">
                        <Input id="time-in" type="time" defaultValue="19:30" />
                        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="duration">Duration (Optional)</Label>
                    <Input id="duration" placeholder="e.g. 2 hours" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="adults">Number of Adults</Label>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon" className="h-9 w-9"><Minus className="h-4 w-4" /></Button>
                        <Input id="adults" type="number" defaultValue={2} className="w-16 text-center" />
                        <Button variant="outline" size="icon" className="h-9 w-9"><Plus className="h-4 w-4" /></Button>
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="children">Number of Children</Label>
                     <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon" className="h-9 w-9"><Minus className="h-4 w-4" /></Button>
                        <Input id="children" type="number" defaultValue={0} className="w-16 text-center" />
                        <Button variant="outline" size="icon" className="h-9 w-9"><Plus className="h-4 w-4" /></Button>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="table-number">Table Number/Area</Label>
                    <Input id="table-number" defaultValue="Table 12 - Window Side" />
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
              </div>
               <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Table available for selected time</span>
              </div>
            </CardContent>
          </Card>
          <Card>
             <CardHeader>
                <CardTitle>Status & Payment</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="booking-status">Booking Status</Label>
                    <Select defaultValue="active">
                        <SelectTrigger id="booking-status"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="seated">Seated</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="payment-status">Payment Status</Label>
                    <Select defaultValue="advanced">
                        <SelectTrigger id="payment-status"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Booking ID:</span>
                    <span className="font-semibold">#{id}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-semibold">Jan 10, 2024</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Guests:</span>
                    <span className="font-semibold">2 Adults</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Bill:</span>
                    <span className="font-semibold">$120.00</span>
                </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="relative">
                    <div className="absolute left-1.5 top-0 bottom-0 w-0.5 bg-border"></div>
                    <div className="space-y-4">
                        {activityLog.map((item, index) => (
                             <div key={index} className="flex items-start gap-3 relative">
                                <div className={cn("h-3 w-3 rounded-full mt-1 border-2 border-background", item.color)}></div>
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
        </div>
      </div>

       <Dialog open={showSaveSuccessDialog} onOpenChange={setShowSaveSuccessDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="sr-only">
              <DialogTitle>Successfully Saved Changes!</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center text-center p-8">
              <div className="mx-auto bg-blue-100 rounded-full h-20 w-20 flex items-center justify-center mb-4">
                <div className="p-2 bg-blue-200 rounded-full">
                  <CheckCircle2 className="h-10 w-10 text-blue-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold mb-2">Successfully Saved Changes !</h2>
            </div>
            <DialogClose asChild>
                <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted">
                    <X className="h-5 w-5" />
                </button>
            </DialogClose>
          </DialogContent>
      </Dialog>
    </div>
  );
}

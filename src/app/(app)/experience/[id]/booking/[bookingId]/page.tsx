
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { CheckCircle, Mail, Minus, Plus, Save, Wallet, X, User, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle as DialogTitleComponent
} from '@/components/ui/dialog';
import { useState } from 'react';

const activityLog = [
    { text: 'Booking created by Admin Sarah', time: 'Jan 15, 2024 - 10:15 AM', color: 'bg-blue-500' },
    { text: 'Payment of LKR 5,000 recorded', time: 'Jan 15, 2024 - 2:30 PM', color: 'bg-green-500' },
    { text: 'Status changed to Confirmed', time: 'Jan 15, 2024 - 2:31 PM', color: 'bg-yellow-500' },
]

export default function ViewExperienceBookingPage() {
  const params = useParams();
  const { id: experienceId, bookingId } = params as { id: string; bookingId: string };
  const experienceTitle = experienceId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showCancelSuccessDialog, setShowCancelSuccessDialog] = useState(false);
  const [showSaveConfirmDialog, setShowSaveConfirmDialog] = useState(false);
 
  const handleCancelBooking = () => {
    setShowCancelDialog(false);
    setShowCancelSuccessDialog(true);
  }

  const handleSaveChanges = () => {
    setShowSaveConfirmDialog(false);
    // Logic to show success dialog will be added in a subsequent step
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/experience">Experience Management</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
             <BreadcrumbLink href={`/experience/${experienceId}`}>{experienceTitle}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tea Factory Booking</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold">Tea Factory Booking</h1>
                <p className="text-muted-foreground">John Smith - #{bookingId}</p>
            </div>
            <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-100 text-green-700 border-transparent">Confirmed</Badge>
                <span className="text-sm text-muted-foreground">Last updated: Dec 10, 2024 at 2:30 PM</span>
            </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
            <AlertDialog open={showSaveConfirmDialog} onOpenChange={setShowSaveConfirmDialog}>
                <AlertDialogTrigger asChild>
                    <Button><Save className="mr-2 h-4 w-4"/>Save Changes</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-center text-2xl font-bold">Do you want to Update Booking ?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-yellow-500 text-yellow-900 hover:bg-yellow-600" onClick={handleSaveChanges}>Save Changes</AlertDialogAction>
                    </AlertDialogFooter>
                    <button onClick={() => setShowSaveConfirmDialog(false)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted">
                        <X className="h-5 w-5" />
                    </button>
                </AlertDialogContent>
            </AlertDialog>
            <Button variant="outline">Cancel</Button>
            <div className="flex-grow"/>
            <Button variant="outline" className="bg-yellow-500 text-yellow-900 hover:bg-yellow-600 hover:text-white"><Wallet className="mr-2 h-4 w-4"/>Record Payment</Button>
            <Button variant="outline" className="bg-green-600 text-white hover:bg-green-700"><Mail className="mr-2 h-4 w-4"/>Send Confirmation</Button>
             <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive"><X className="mr-2 h-4 w-4"/>Cancel Booking</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-center text-2xl font-bold">Do you want to Cancel this Booking?</AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-red-500 text-lg">
                           BK-{bookingId}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center">
                        <AlertDialogCancel>Go Back</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleCancelBooking}>Cancel</AlertDialogAction>
                    </AlertDialogFooter>
                    <button onClick={() => setShowCancelDialog(false)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted">
                        <X className="h-5 w-5" />
                    </button>
                </AlertDialogContent>
             </AlertDialog>
        </div>
        
      <div className="space-y-6">
        <Card>
            <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Experience Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <Label className="text-muted-foreground">Experience Name</Label>
                        <p className="font-medium">Tea Factory Tour</p>
                    </div>
                    <div>
                        <Label className="text-muted-foreground">Duration</Label>
                        <p className="font-medium">3 hours</p>
                    </div>
                     <div>
                        <Label className="text-muted-foreground">Max Participants</Label>
                        <p className="font-medium">15 people</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold">Guest Information</h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input id="full-name" defaultValue="John Smith" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="john.smith@email.com" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+94 77 123 4567" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="special-requests">Special Requests</Label>
                    <Textarea id="special-requests" defaultValue="Vegetarian meals required" />
                  </div>
                </div>
              </CardContent>
            </Card>

             <Card>
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold">Booking Details</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <Label htmlFor="experience-date">Experience Date</Label>
                        <Input id="experience-date" type="date" defaultValue="2024-02-15" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="experience-time">Experience Time</Label>
                        <Input id="experience-time" type="time" />
                    </div>
                 </div>
                 <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Slot Available - 8 spots remaining</span>
                </div>
                <div className="flex items-center gap-8">
                     <div className="space-y-1">
                        <Label htmlFor="adults" className="text-sm">Adults</Label>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="icon" className="h-9 w-9"><Minus className="h-4 w-4" /></Button>
                            <Input id="adults" type="number" defaultValue={2} className="w-16 text-center" />
                            <Button variant="outline" size="icon" className="h-9 w-9"><Plus className="h-4 w-4" /></Button>
                        </div>
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="children" className="text-sm">Children</Label>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="icon" className="h-9 w-9"><Minus className="h-4 w-4" /></Button>
                            <Input id="children" type="number" defaultValue={1} className="w-16 text-center" />
                            <Button variant="outline" size="icon" className="h-9 w-9"><Plus className="h-4 w-4" /></Button>
                        </div>
                    </div>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="booking-source">Booking Source</Label>
                    <Input id="booking-source" />
                </div>
              </CardContent>
            </Card>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold">Pricing & Payment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="discount-code">Discount Code</Label>
                            <Input id="discount-code" defaultValue="EARLY20" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="payment-status">Payment Status</Label>
                            <Input id="payment-status" />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center text-sm">
                            <span>Adults (2 x LKR 5,000)</span>
                            <span className="font-medium">LKR 10,000</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span>Children (1 x LKR 2,500)</span>
                            <span className="font-medium">LKR 2,500</span>
                        </div>
                         <div className="flex justify-between items-center text-sm text-red-600">
                            <span>Discount (EARLY20 - 20%)</span>
                            <span className="font-medium">-LKR 2,500</span>
                        </div>
                        <div className="border-t my-2"></div>
                        <div className="flex justify-between items-center font-bold">
                            <span>Total Price</span>
                            <span>LKR 10,000</span>
                        </div>
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-green-600">Amount Paid</span>
                            <span className="font-medium text-green-600">LKR 5,000</span>
                        </div>
                         <div className="flex justify-between items-center text-primary font-bold">
                            <span className="text-red-600">Balance Due</span>
                            <span className="font-bold text-red-600">LKR 5,000</span>
                        </div>
                    </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Payment History</h3>
                    <Button variant="outline" className="bg-yellow-500 text-yellow-900 hover:bg-yellow-600 hover:text-white">+ Add Payment</Button>
                </div>
                <div className="border rounded-lg p-3 flex justify-between items-center">
                    <div>
                        <p className="font-bold">LKR 5,000</p>
                        <p className="text-sm text-muted-foreground">Credit Card</p>
                        <p className="text-xs text-muted-foreground">Jan 15, 2024 - 2:30 PM</p>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-transparent">Completed</Badge>
                </div>
              </CardContent>
            </Card>
        </div>
        
        <Card>
            <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Booking Activity Log</h3>
                <div className="relative pl-6">
                    <div className="absolute left-2 top-1 bottom-1 w-0.5 bg-border"></div>
                    <div className="space-y-6">
                        {activityLog.map((item, index) => (
                             <div key={index} className="flex items-start gap-3 relative">
                                <div className={cn("h-4 w-4 rounded-full mt-1 border-4 border-background", item.color)}></div>
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

       <Dialog open={showCancelSuccessDialog} onOpenChange={setShowCancelSuccessDialog}>
          <DialogContent>
            <DialogHeader className='sr-only'>
              <DialogTitleComponent>Booking Cancelled</DialogTitleComponent>
              <DialogDescription>The booking has been successfully cancelled.</DialogDescription>
            </DialogHeader>
            <div className="text-center p-6 flex flex-col items-center">
                <div className="p-3 bg-red-100 rounded-full mb-4">
                    <Trash2 className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Successfully Cancelled BK-{bookingId} !</h2>
            </div>
            <DialogClose asChild>
                <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted" onClick={() => setShowCancelSuccessDialog(false)}>
                    <X className="h-5 w-5" />
                </button>
            </DialogClose>
          </DialogContent>
      </Dialog>
    </div>
  );
}

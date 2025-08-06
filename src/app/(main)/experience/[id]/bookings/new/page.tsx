
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
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Calendar as CalendarIcon, Minus, Plus, CheckCircle, X, CheckCircle2, User, ClipboardList, Wallet, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function NewExperienceBookingPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const params = useParams();
  const experienceId = params.id as string;
  const experienceTitle = experienceId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const handleCreateBooking = () => {
    // In a real app, you would handle form submission here.
    setShowSuccessDialog(true);
  };

  const LeafIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.2829 12.6485C14.0729 14.5285 12.9229 15.9385 11.2329 16.5985C10.1029 17.0285 8.85289 16.9485 7.84289 16.2085C6.01289 14.8885 5.56289 12.7285 6.48289 10.7085C7.26289 9.01851 8.84289 7.88851 10.5929 7.61851C12.7129 7.30851 14.6829 8.28851 15.5929 10.1585" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.8231 10.2404C17.7931 11.1604 19.1631 12.8304 19.5331 14.9304" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.3735 4.25C13.8935 5.86 13.7835 8.23 12.1835 9.7C10.5835 11.17 8.24354 11.28 6.72354 9.67C6.62354 9.56 6.52354 9.45 6.43354 9.34" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

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
            <BreadcrumbPage>New Booking</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
        <Alert className="bg-blue-50 border-blue-200 text-blue-800">
          <LeafIcon />
          <AlertDescription>
            <div className='font-semibold'>Booking for: {experienceTitle}</div>
            <div className='text-sm'>Duration: 3 hours • Price: $45/adult, $25/child • Max 12 guests</div>
          </AlertDescription>
        </Alert>

      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5 text-primary"/>
                Guest Information
            </h3>
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
                <Label htmlFor="special-requests">Special Requests/Notes</Label>
                <Textarea id="special-requests" placeholder="Any special requirements or notes" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary"/>
                Booking Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="experience-date">Experience Date *</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, 'PPP') : <span>mm/dd/yyyy</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} initialFocus /></PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience-time">Experience Time *</Label>
                <Input id="experience-time" type="time" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-source">Booking Source</Label>
                <Input id="booking-source" placeholder="e.g. Online" />
              </div>
            </div>
            <div className="space-y-2">
                <Label>Number of Participants</Label>
                <div className="flex items-center gap-8">
                     <div className="space-y-1">
                        <Label htmlFor="adults" className="text-sm">Adults *</Label>
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
                            <Input id="children" type="number" defaultValue={0} className="w-16 text-center" />
                            <Button variant="outline" size="icon" className="h-9 w-9"><Plus className="h-4 w-4" /></Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Capacity Check: 2 participants selected, 8 spots remaining for this time slot</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary"/>
                Pricing & Payment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span>Adults (2 x $45)</span>
                        <span className="font-medium">$90.00</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span>Children (0 x $25)</span>
                        <span className="font-medium">$0.00</span>
                    </div>
                    <div className="border-t"></div>
                    <div className="flex justify-between items-center font-bold">
                        <span>Total Price</span>
                        <span>$90.00</span>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="discount-code">Discount Code</Label>
                        <Input id="discount-code" placeholder="Enter discount code" />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="payment-status">Payment Status</Label>
                        <Input id="payment-status" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="amount-paid">Amount Paid</Label>
                        <Input id="amount-paid" type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="payment-method">Payment Method</Label>
                        <Input id="payment-method" />
                    </div>
                    <div className="mt-2 text-right">
                        <span className="text-sm">Balance Due:</span>
                        <span className="font-bold text-lg ml-2 text-primary">$90.00</span>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardContent className="p-6 space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary"/>
                    Booking Status
                </h3>
                <Label htmlFor="initial-status" className="sr-only">Initial Booking Status</Label>
                <Input id="initial-status" placeholder="Initial Booking Status"/>
            </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2">
            <Button variant="outline" asChild><Link href={`/experience/${experienceId}`}>Cancel</Link></Button>
            <Button onClick={handleCreateBooking}>Create Booking</Button>
        </div>
      </div>
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
            <DialogContent className="sm:max-w-sm p-8">
                <DialogHeader className="sr-only">
                    <DialogTitle>Success</DialogTitle>
                    <DialogDescription>Booking created successfully.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="p-3 bg-blue-100 rounded-full mb-4">
                        <div className="p-2 bg-blue-200 rounded-full">
                           <CheckCircle2 className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Successfully Created Booking !</h2>
                </div>
                <DialogClose asChild>
                    <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted">
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close</span>
                    </button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    </div>
  );
}
    

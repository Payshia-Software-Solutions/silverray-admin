
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Search, Plus, Trash2, Eye, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
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
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription as DialogDescriptionComponent,
  DialogClose,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

const weddingPackages = [
  {
    name: 'Silver Grandeur',
    description: 'Premium wedding package with full service',
    price: 'LKR. 150,000',
    halls: 'Grand Ballroom, Garden Pavilion',
    inclusions: 'Premium Catering, Luxury Décor, Ceremony ...',
    maxGuests: 200,
    status: 'Active',
  },
  {
    name: 'Diamond Bliss',
    description: 'Luxury wedding package with exclusive amenities',
    price: 'LKR. 150,000',
    halls: 'Grand Ballroom, Rooftop Terrace',
    inclusions: 'Premium Catering, Luxury Décor, Ceremony ...',
    maxGuests: 300,
    status: 'Active',
  },
];

const weddingBookings = [
    {
        id: '#WB2024001',
        couple: 'Mr. & Mrs. Silva',
        date: 'June 15, 2025',
        package: 'Silver Grandeur',
        halls: 'Grand Ballroom',
        guests: 150,
        price: 'LKR. 531,000',
        payment: 'Deposit Paid',
        paymentColor: 'bg-yellow-100 text-yellow-700',
        status: 'Confirmed',
        statusColor: 'bg-blue-100 text-blue-700'
    },
    {
        id: '#WB2024002',
        couple: 'Kalum & Nilmini',
        date: 'July 22, 2025',
        package: 'Golden Elegance',
        halls: 'Garden Pavilion, Terrace',
        guests: 200,
        price: 'LKR. 150,000',
        payment: 'Full Paid',
        paymentColor: 'bg-green-100 text-green-700',
        status: 'Pending',
        statusColor: 'bg-orange-100 text-orange-700'
    }
];


export default function WeddingManagementPage() {
    const router = useRouter();
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);
    const [packageToDelete, setPackageToDelete] = useState('');

    const handleDeleteClick = (packageName: string) => {
        setPackageToDelete(packageName);
        setShowDeleteDialog(true);
    }

    const handleDeleteConfirm = () => {
        console.log(`Deleting ${packageToDelete}`);
        // Add actual delete logic here
        setShowDeleteDialog(false);
        setShowDeleteSuccessDialog(true);
    }

  return (
    <div className="space-y-6">
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <Tabs defaultValue="wedding-packages" className="space-y-4">
          <TabsList>
            <TabsTrigger value="wedding-packages">Wedding Packages</TabsTrigger>
            <TabsTrigger value="wedding-bookings">Wedding Bookings</TabsTrigger>
          </TabsList>
          <TabsContent value="wedding-packages" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                      <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                          type="search"
                          placeholder="Search packages..."
                          className="w-full rounded-lg bg-background pl-8"
                      />
                      </div>
                      <Popover>
                          <PopoverTrigger asChild>
                          <Button
                              variant={'outline'}
                              className={cn(
                              'w-[180px] justify-start text-left font-normal',
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
                      <Button className="ml-auto" onClick={() => router.push('/weddings/new')}>
                          <Plus className="mr-2 h-4 w-4" /> Add New Wedding Package
                      </Button>
                  </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Package Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Halls Included</TableHead>
                      <TableHead>Other Including's</TableHead>
                      <TableHead>Max Guests</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {weddingPackages.map((pkg, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {pkg.name}
                        <p className="text-xs text-muted-foreground">{pkg.description}</p>
                      </TableCell>
                      <TableCell>{pkg.price}</TableCell>
                      <TableCell>{pkg.halls}</TableCell>
                      <TableCell>{pkg.inclusions}</TableCell>
                      <TableCell>{pkg.maxGuests}</TableCell>
                      <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                            {pkg.status}
                          </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-500 hover:bg-red-500/10" onClick={() => handleDeleteClick(pkg.name)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                          </AlertDialogTrigger>
                        </div>
                      </TableCell>
                    </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="wedding-bookings" className="space-y-4">
              <Card>
                  <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                          <div className="relative flex-1">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                              type="search"
                              placeholder="Search bookings..."
                              className="w-full rounded-lg bg-background pl-8"
                          />
                          </div>
                          <Popover>
                              <PopoverTrigger asChild>
                              <Button
                                  variant={'outline'}
                                  className={cn(
                                  'w-[180px] justify-start text-left font-normal',
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
                          <Button className="ml-auto">
                              <Plus className="mr-2 h-4 w-4" /> Add New Wedding Booking
                          </Button>
                      </div>
                  </CardContent>
              </Card>
              <Card>
                  <CardContent className="p-0">
                      <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead>Booking ID</TableHead>
                                  <TableHead>Couple Names</TableHead>
                                  <TableHead>Wedding Date</TableHead>
                                  <TableHead>Package</TableHead>
                                  <TableHead>Hall(s)</TableHead>
                                  <TableHead>Guests</TableHead>
                                  <TableHead>Total Price</TableHead>
                                  <TableHead>Payment</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {weddingBookings.map((booking, index) => (
                                  <TableRow key={index}>
                                      <TableCell className="font-semibold text-primary">{booking.id}</TableCell>
                                      <TableCell>{booking.couple}</TableCell>
                                      <TableCell>{booking.date}</TableCell>
                                      <TableCell>{booking.package}</TableCell>
                                      <TableCell>{booking.halls}</TableCell>
                                      <TableCell>{booking.guests}</TableCell>
                                      <TableCell>{booking.price}</TableCell>
                                      <TableCell>
                                          <Badge variant="outline" className={cn('border-transparent', booking.paymentColor)}>{booking.payment}</Badge>
                                      </TableCell>
                                      <TableCell>
                                          <Badge variant="outline" className={cn('border-transparent', booking.statusColor)}>{booking.status}</Badge>
                                      </TableCell>
                                      <TableCell className="text-right">
                                          <div className="flex items-center justify-end gap-1">
                                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                                  <Eye className="h-4 w-4" />
                                                  <span className="sr-only">View</span>
                                              </Button>
                                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                                  <Trash2 className="h-4 w-4" />
                                                  <span className="sr-only">Delete</span>
                                              </Button>
                                          </div>
                                      </TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t px-6 py-3">
                      <div className="text-sm text-muted-foreground">
                          Showing 1 to {weddingBookings.length} of 47 results
                      </div>
                      <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">Previous</Button>
                          <Button variant="default" size="sm">1</Button>
                          <Button variant="outline" size="sm">2</Button>
                          <Button variant="outline" size="sm">Next</Button>
                      </div>
                  </CardFooter>
              </Card>
          </TabsContent>
        </Tabs>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold">Do you want to Delete this Package ?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-red-500 text-lg">
              {packageToDelete}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
          <button onClick={() => setShowDeleteDialog(false)} className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200">
              <X className="h-5 w-5" />
            </button>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={showDeleteSuccessDialog} onOpenChange={setShowDeleteSuccessDialog}>
          <DialogContent className="sm:max-w-md">
             <DialogHeader className="sr-only">
                  <DialogTitle>Success</DialogTitle>
                  <DialogDescriptionComponent>The package was successfully deleted.</DialogDescriptionComponent>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center text-center p-8">
                  <div className="p-4 bg-red-100 rounded-full mb-4">
                      <div className="p-2 bg-red-200 rounded-full">
                         <Trash2 className="h-8 w-8 text-red-600" />
                      </div>
                  </div>
                  <h2 className="text-xl font-bold mb-2">Successfully Deleted Package !</h2>
                  <DialogClose asChild>
                      <Button className="mt-6 w-full" onClick={() => {
                        setShowDeleteSuccessDialog(false);
                        setPackageToDelete('');
                      }}>Done</Button>
                  </DialogClose>
              </div>
          </DialogContent>
      </Dialog>
    </div>
  );
}

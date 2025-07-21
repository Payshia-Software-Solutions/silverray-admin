
'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Eye, Trash2, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { useState } from 'react';
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
  DialogContent,
  DialogHeader as DialogHeaderComponent,
  DialogTitle as DialogTitleComponent,
  DialogDescription as DialogDescriptionComponent,
  DialogClose,
} from '@/components/ui/dialog';

const bookings = [
  {
    id: '#TF001',
    guest: 'John Smith',
    email: 'john.smith@email.com',
    avatar: 'https://placehold.co/40x40.png',
    avatarHint: 'man face colorful',
    bookingDate: 'Dec 15, 2024',
    experienceDate: 'Dec 20, 2024',
    experienceTime: '10:00 AM',
    participants: '2 Adults',
    price: 'LKR. 12700',
    paymentStatus: 'Paid',
    status: 'Confirmed',
  },
  {
    id: '#TF002',
    guest: 'Emma Johnson',
    email: 'emma.j@email.com',
    avatar: 'https://placehold.co/40x40.png',
    avatarHint: 'woman face smiling',
    bookingDate: 'Dec 14, 2024',
    experienceDate: 'Dec 22, 2024',
    experienceTime: '2:00 PM',
    participants: '4 Adults',
    price: 'LKR. 12700',
    paymentStatus: 'Pending',
    status: 'Pending',
  },
];

type Booking = typeof bookings[0];

const paymentVariant = {
  Paid: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
} as const;

const statusVariant = {
  Confirmed: 'bg-blue-100 text-blue-700',
  Pending: 'bg-yellow-100 text-yellow-700',
} as const;


export default function ExperienceBookingsPage() {
  const router = useRouter();
  const params = useParams();
  const experienceId = params.id as string;
  const experienceTitle = experienceId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);

  const handleDeleteClick = (booking: Booking) => {
    setBookingToDelete(booking);
  };

  const handleCancelDelete = () => {
    setBookingToDelete(null);
  };

  const handleDeleteConfirm = () => {
    if (bookingToDelete) {
      console.log(`Deleting booking ${bookingToDelete.id}`);
      // Add actual delete logic here
      setBookingToDelete(null);
      setShowDeleteSuccessDialog(true);
    }
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
            <BreadcrumbPage>{experienceTitle}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardContent className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
                <LeafIcon />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{experienceTitle}</h2>
              <p className="text-muted-foreground">2 hours • $45 per person • Max 12 guests</p>
            </div>
          </div>
          <div className="flex gap-8 text-right">
            <div>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-2xl font-bold text-green-600">$1,080</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Guest name or booking ID..."
            className="w-full rounded-lg bg-background pl-8"
          />
        </div>
        <Button asChild>
          <Link href={`/experience/${experienceId}/bookings/new`}>
            <Plus className="mr-2 h-4 w-4" /> Add Booking
          </Link>
        </Button>
      </div>

    <AlertDialog open={!!bookingToDelete} onOpenChange={(open) => !open && handleCancelDelete()}>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Guest Name</TableHead>
                <TableHead>Booking Date</TableHead>
                <TableHead>Experience Date</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-semibold text-primary">{booking.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={booking.avatar} alt={booking.guest} data-ai-hint={booking.avatarHint} />
                        <AvatarFallback>{booking.guest.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{booking.guest}</p>
                        <p className="text-xs text-muted-foreground">{booking.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{booking.bookingDate}</TableCell>
                  <TableCell>
                     <div>{booking.experienceDate}</div>
                     <div className="text-xs text-muted-foreground">{booking.experienceTime}</div>
                  </TableCell>
                  <TableCell>{booking.participants}</TableCell>
                  <TableCell>{booking.price}</TableCell>
                   <TableCell>
                    <Badge variant="outline" className={cn('border-transparent font-medium', paymentVariant[booking.paymentStatus as keyof typeof paymentVariant])}>
                      {booking.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('border-transparent font-medium', statusVariant[booking.status as keyof typeof statusVariant])}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-primary/10" asChild>
                        <Link href={`/experience/${experienceId}/booking/${booking.id.replace('#', '')}`}>
                          <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        </Link>
                      </Button>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-red-100" onClick={() => handleDeleteClick(booking)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t px-6 py-3">
            <div className="text-sm text-muted-foreground">
                Showing 1-10 of 247 bookings
            </div>
            <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                    Previous
                </Button>
                <Button variant="default" size="sm">
                    1
                </Button>
                <Button variant="outline" size="sm">
                    2
                </Button>
                <Button variant="outline" size="sm">
                    Next
                </Button>
            </div>
        </CardFooter>
      </Card>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle className="text-center text-2xl font-bold">Do you want to Delete this Booking ?</AlertDialogTitle>
                <AlertDialogDescription className="text-center text-red-500 text-lg">
                    {bookingToDelete?.id}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center">
                <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
            </AlertDialogFooter>
             <button onClick={handleCancelDelete} className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200">
                <X className="h-5 w-5" />
            </button>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={showDeleteSuccessDialog} onOpenChange={setShowDeleteSuccessDialog}>
          <DialogContent className="sm:max-w-xs">
            <DialogHeaderComponent className="sr-only">
              <DialogTitleComponent>Successfully Deleted!</DialogTitleComponent>
            </DialogHeaderComponent>
            <div className="flex flex-col items-center justify-center text-center p-6">
              <div className="mx-auto bg-red-100 rounded-full h-20 w-20 flex items-center justify-center mb-4">
                  <Trash2 className="h-10 w-10 text-red-600" />
              </div>
              <h2 className="text-xl font-bold mb-2">Successfully Deleted Booking !</h2>
            </div>
            <DialogClose asChild>
                <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted" onClick={() => setShowDeleteSuccessDialog(false)}>
                    <X className="h-5 w-5" />
                </button>
            </DialogClose>
          </DialogContent>
      </Dialog>
    </div>
  );
}

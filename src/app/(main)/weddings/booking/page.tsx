
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Search, Plus, Eye, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const weddingBookings = [
    {
        id: 'WB2024001',
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
        id: 'WB2024002',
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

export default function WeddingBookingsPage() {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <div className="space-y-4">
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
            <Button onClick={() => router.push('/weddings/booking/new')}>
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
                      <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-primary/10" asChild>
                        <Link href={`/weddings/booking/${booking.id.replace('#', '')}`}>
                          <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-red-100">
                        <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-red-500" />
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
    </div>
  );
}

'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { PlusCircle, Pencil, Trash2, Check, X } from 'lucide-react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const reservations = [
  { id: 'RES001', guest: 'John Doe', room: 'RM102', checkIn: '2024-08-15', checkOut: '2024-08-20', status: 'Checked-In', guests: 2, total: 'LKR. 24,500', payment: 'Paid' },
  { id: 'RES002', guest: 'Jane Smith', room: 'RM302', checkIn: '2024-08-16', checkOut: '2024-08-18', status: 'Checked-In', guests: 1, total: 'LKR. 18,000', payment: 'Paid' },
  { id: 'RES003', guest: 'Peter Jones', room: 'RM201', checkIn: '2024-08-17', checkOut: '2024-08-22', status: 'Confirmed', guests: 3, total: 'LKR. 35,000', payment: 'Pending' },
  { id: 'RES004', guest: 'Mary Johnson', room: 'RM101', checkIn: '2024-08-10', checkOut: '2024-08-14', status: 'Checked-Out', guests: 1, total: 'LKR. 15,000', payment: 'Paid' },
  { id: 'RES005', guest: 'David Williams', room: 'RM401', checkIn: '2024-08-20', checkOut: '2024-08-25', status: 'Confirmed', guests: 2, total: 'LKR. 28,000', payment: 'Pending' },
  { id: 'RES006', guest: 'Emily Brown', room: 'RM101', checkIn: '2024-08-22', checkOut: '2024-08-24', status: 'Canceled', guests: 1, total: 'LKR. 12,000', payment: 'Refunded' },
];

const statusVariant = {
  'Confirmed': 'default',
  'Checked-In': 'outline',
  'Checked-Out': 'secondary',
  'Canceled': 'destructive'
} as const;

export default function ReservationsPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1 flex items-center space-x-4">
           <Input
            placeholder="Search by guest name, booking ID..."
            className="max-w-sm"
           />
           <Popover>
             <PopoverTrigger asChild>
               <Button
                 variant={'outline'}
                 className={cn(
                   'w-[240px] justify-start text-left font-normal',
                   !date && 'text-muted-foreground'
                 )}
               >
                 <CalendarIcon className="mr-2 h-4 w-4" />
                 {date ? format(date, 'PPP') : <span>Pick a date</span>}
               </Button>
             </PopoverTrigger>
             <PopoverContent className="w-auto p-0" align="start">
               <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
             </PopoverContent>
           </Popover>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Reservation
        </Button>
      </div>
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            {/* Icon placeholder */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checked in</CardTitle>
            {/* Icon placeholder */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            {/* Icon placeholder */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            {/* Icon placeholder */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">LKR. 45,890</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Reservation List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Guest Name</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((res) => (
                <TableRow key={res.id}>
                  <TableCell className="font-medium">{res.id}</TableCell>
                  <TableCell>{res.guest}</TableCell>
                  <TableCell>{res.room}</TableCell>
                  <TableCell>{res.checkIn}</TableCell>
                  <TableCell>{res.checkOut}</TableCell>
                  <TableCell>{res.guests}</TableCell>
                  <TableCell>{res.total}</TableCell>
                  <TableCell>{res.payment}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[res.status as keyof typeof statusVariant]}>
                      {res.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {res.status === 'Confirmed' && <Button variant="outline" size="sm" className='mr-2'><Check className="mr-1 h-4 w-4" /> Check In</Button>}
                    {res.status === 'Checked-In' && <Button variant="outline" size="sm" className='mr-2'><X className="mr-1 h-4 w-4" /> Check Out</Button>}
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                       <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                       <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

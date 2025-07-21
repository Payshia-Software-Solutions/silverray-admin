
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, DollarSign, Clock, UserCheck, Search, Plus, Eye, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const stats = [
  {
    title: 'Total Bookings',
    value: '1,247',
    icon: CalendarIcon,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Checked In',
    value: '89',
    icon: UserCheck,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    title: 'Pending',
    value: '23',
    icon: Clock,
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
  {
    title: 'Revenue',
    value: 'LKR. 45,890',
    icon: DollarSign,
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
];

const reservations = [
  {
    id: '#BK001',
    guest: 'John Smith',
    email: 'john@email.com',
    avatar: 'https://placehold.co/40x40.png',
    avatarHint: 'man face colorful',
    roomType: 'Deluxe Suite',
    roomNumber: 'Room 205',
    checkIn: 'June 15, 2025',
    checkOut: 'June 18, 2025',
    guests: '2 Adults',
    total: 'LKR. 24,500',
    payment: 'Paid',
    status: 'Confirmed',
  },
  {
    id: '#BK002',
    guest: 'Emily Davis',
    email: 'emily@email.com',
    avatar: 'https://placehold.co/40x40.png',
    avatarHint: 'woman face smiling',
    roomType: 'Standard Room',
    roomNumber: 'Room 102',
    checkIn: 'Aug 28, 2025',
    checkOut: 'Aug 22, 2025',
    guests: '1 Adult',
    total: 'LKR. 24,500',
    payment: 'Pending',
    status: 'Pending',
  },
];

const paymentVariant = {
  Paid: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
} as const;

const statusVariant = {
  Confirmed: 'bg-blue-100 text-blue-700',
  Pending: 'bg-yellow-100 text-yellow-700',
} as const;

export default function ReservationsPage() {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={cn('p-2 rounded-md', stat.bgColor)}>
                <stat.icon className={cn('h-4 w-4', stat.iconColor)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by guest name, booking ID..."
                className="pl-8"
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
            <Button onClick={() => router.push('/reservations/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Booking
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
                <TableHead className="w-[200px]">Guest</TableHead>
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
                  <TableCell className="font-semibold text-primary">{res.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={res.avatar} alt={res.guest} data-ai-hint={res.avatarHint} />
                        <AvatarFallback>{res.guest.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{res.guest}</p>
                        <p className="text-xs text-muted-foreground">{res.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-sm">{res.roomType}</p>
                    <p className="text-xs text-muted-foreground">{res.roomNumber}</p>
                  </TableCell>
                  <TableCell>{res.checkIn}</TableCell>
                  <TableCell>{res.checkOut}</TableCell>
                  <TableCell>{res.guests}</TableCell>
                  <TableCell>{res.total}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('border-transparent', paymentVariant[res.payment as keyof typeof paymentVariant])}>
                      {res.payment}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('border-transparent', statusVariant[res.status as keyof typeof statusVariant])}>
                      {res.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                     <div className="flex justify-end items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 group" asChild>
                            <Link href={`/reservations/${res.id.replace('#', '')}`}>
                              <Eye className="h-4 w-4 text-muted-foreground group-hover:text-blue-600" />
                              <span className="sr-only">View</span>
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
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
                Showing 1 to {reservations.length} of 247 bookings
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
    </div>
  );
}

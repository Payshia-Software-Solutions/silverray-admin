
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Mail, CheckCircle, Archive, MessageSquare, Trash2, Eye, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';


// Placeholder data for stats
const stats = [
  {
    title: 'New Messages',
    value: '12',
    icon: Mail,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Replied',
    value: '45',
    icon: CheckCircle,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    title: 'Archived',
    value: '128',
    icon: Archive,
    bgColor: 'bg-gray-100',
    iconColor: 'text-gray-600',
  },
  {
    title: 'Total Messages',
    value: '185',
    icon: MessageSquare,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
];

// Placeholder data for messages
const messages = [
  {
    sender: 'John Smith',
    email: 'john.smith@email.com',
    subject: 'Booking Inquiry for Wedding',
    snippet: 'Looking for availability for a wedding reception...',
    date: 'Dec 15, 2025',
    status: 'New',
    avatar: 'https://placehold.co/40x40.png',
    avatarHint: 'man face',
  },
  {
    sender: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    subject: 'Room Service Complaint',
    snippet: 'Had issues with room service during my stay...',
    date: 'Dec 14, 2025',
    status: 'Replied',
    avatar: 'https://placehold.co/40x40.png',
    avatarHint: 'woman face',
  },
  {
    sender: 'Michael Brown',
    email: 'm.brown@email.com',
    subject: 'Corporate Event Booking',
    snippet: 'Need to book conference rooms for company retreat...',
    date: 'Dec 13, 2025',
    status: 'New',
    avatar: 'https://placehold.co/40x40.png',
    avatarHint: 'man portrait',
  },
];

export default function ContactMessagesPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={cn('rounded-md p-2', stat.bgColor)}>
                <stat.icon className={cn('h-4 w-4', stat.iconColor)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or subject..."
            className="pl-8"
          />
        </div>
        <div className="relative">
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
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
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
        <Button>
            <Filter className="mr-2 h-4 w-4" />
            Apply Filters
        </Button>
      </div>

      {/* Messages Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sender</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.avatar} alt={message.sender} data-ai-hint={message.avatarHint} />
                        <AvatarFallback>{message.sender.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{message.sender}</p>
                        <p className="text-xs text-muted-foreground">{message.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                     <p className="font-medium">{message.subject}</p>
                     <p className="text-xs text-muted-foreground truncate max-w-xs">{message.snippet}</p>
                  </TableCell>
                  <TableCell>{message.date}</TableCell>
                  <TableCell>
                    <Badge variant={message.status === 'New' ? 'default' : 'outline'} className={cn(
                        message.status === 'New' && 'bg-blue-100 text-blue-700 border-blue-200',
                        message.status === 'Replied' && 'bg-green-100 text-green-700 border-green-200'
                    )}>
                      {message.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                        </Button>
                        <Button variant="destructive" size="icon" className="h-8 w-8">
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
        {/* Pagination */}
        <CardFooter className="flex items-center justify-between border-t px-6 py-3">
            <div className="text-sm text-muted-foreground">
                Showing 1 to {messages.length} of 97 results
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

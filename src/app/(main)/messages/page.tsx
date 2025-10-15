
'use client';

import { useState, useEffect } from 'react';
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
import { Search, Mail, CheckCircle, Archive, MessageSquare, Trash2, Eye, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { getContactMessages, deleteContactMessage, type ContactMessageFromApi } from '@/lib/services/api';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
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
  DialogClose,
} from '@/components/ui/dialog';
import Link from 'next/link';

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

export default function ContactMessagesPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [messages, setMessages] = useState<ContactMessageFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<ContactMessageFromApi | null>(null);
  const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);
  const [deletedMessageSubject, setDeletedMessageSubject] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    async function fetchMessages() {
      try {
        setLoading(true);
        const data = await getContactMessages();
        setMessages(data);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, []);

  const handleDeleteClick = (message: ContactMessageFromApi) => {
    setMessageToDelete(message);
  };

  const handleDeleteConfirm = async () => {
    if (messageToDelete) {
      try {
        await deleteContactMessage(messageToDelete.id);
        setDeletedMessageSubject(messageToDelete.subject);
        setMessages(prev => prev.filter(msg => msg.id !== messageToDelete.id));
        setShowDeleteSuccessDialog(true);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error Deleting Message",
          description: error.message || "An unexpected error occurred.",
        });
      } finally {
        setMessageToDelete(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Toaster />
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
      <AlertDialog open={!!messageToDelete} onOpenChange={(open) => !open && setMessageToDelete(null)}>
        <Card>
          <CardContent className="p-0">
            {loading && <p className="p-4 text-center">Loading messages...</p>}
            {error && <p className="p-4 text-center text-red-500">{error}</p>}
            {!loading && !error && (
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
                  {messages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://placehold.co/40x40.png`} alt={message.name} data-ai-hint="person face" />
                            <AvatarFallback>{message.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{message.name}</p>
                            <p className="text-xs text-muted-foreground">{message.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                         <p className="font-medium">{message.subject}</p>
                         <p className="text-xs text-muted-foreground truncate max-w-xs">{message.message}</p>
                      </TableCell>
                      <TableCell>{format(new Date(message.created_at), 'PP')}</TableCell>
                      <TableCell>
                        <Badge variant={'outline'} className={cn(
                            message.status === 'unread' && 'bg-blue-100 text-blue-700 border-blue-200',
                            message.status === 'read' && 'bg-gray-100 text-gray-700 border-gray-200',
                            message.status === 'replied' && 'bg-green-100 text-green-700 border-green-200',
                            message.status === 'archived' && 'bg-purple-100 text-purple-700 border-purple-200'
                        )}>
                          {message.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-primary/10" asChild>
                              <Link href={`/messages/${message.id}`}>
                                <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                              </Link>
                            </Button>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-red-100" onClick={() => handleDeleteClick(message)}>
                                  <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-red-500" />
                                  <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          {/* Pagination */}
          <CardFooter className="flex items-center justify-between border-t px-6 py-3">
              <div className="text-sm text-muted-foreground">
                  Showing 1 to {messages.length} of {messages.length} results
              </div>
              <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                      Previous
                  </Button>
                  <Button variant="default" size="sm">
                      1
                  </Button>
                  <Button variant="outline" size="sm">
                      Next
                  </Button>
              </div>
          </CardFooter>
        </Card>
        <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center text-2xl font-bold">Delete Message?</AlertDialogTitle>
              <AlertDialogDescription className="text-center text-lg">
                Are you sure you want to delete this message? <strong className="text-red-500">{messageToDelete?.subject}</strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
        <Dialog open={showDeleteSuccessDialog} onOpenChange={setShowDeleteSuccessDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeaderComponent className="sr-only">
                    <DialogTitleComponent>Successfully Deleted</DialogTitleComponent>
                </DialogHeaderComponent>
                <div className="flex flex-col items-center justify-center text-center p-6 pt-8">
                    <div className="p-4 bg-red-100 rounded-full mb-4">
                        <Trash2 className="h-8 w-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold">Successfully Deleted Message!</h2>
                </div>
                <DialogClose asChild>
                <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted" onClick={() => setShowDeleteSuccessDialog(false)}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                </button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    </div>
  );
}

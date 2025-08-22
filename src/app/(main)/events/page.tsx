
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const events = [
    {
        id: 'EVT001',
        name: 'Annual Tech Conference 2025',
        type: 'Corporate',
        date: 'Oct 15, 2025',
        hall: 'Grand Ballroom',
        guests: 200,
        status: 'Confirmed'
    },
    {
        id: 'EVT002',
        name: 'Johnson Family Birthday Gala',
        type: 'Private Party',
        date: 'Nov 22, 2025',
        hall: 'Terrace Garden',
        guests: 50,
        status: 'Pending'
    }
];

export default function EventManagementPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => { /* router.push('/events/new') */ }}>
          <Plus className="mr-2 h-4 w-4" /> Add New Event
        </Button>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>All Events</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Hall</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{event.type}</Badge>
                  </TableCell>
                  <TableCell>{event.date}</TableCell>
                  <TableCell>{event.hall}</TableCell>
                  <TableCell>{event.guests}</TableCell>
                  <TableCell>
                    <Badge variant={event.status === 'Confirmed' ? 'default' : 'secondary'} className={event.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                        {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-primary/10">
                          <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                          <span className="sr-only">View/Edit</span>
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
                Showing 1 to {events.length} of {events.length} events
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}

import { PlusCircle, Pencil, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const reservations = [
  { id: 'RES001', guest: 'John Doe', room: 'RM102', checkIn: '2024-08-15', checkOut: '2024-08-20', status: 'Checked-In' },
  { id: 'RES002', guest: 'Jane Smith', room: 'RM302', checkIn: '2024-08-16', checkOut: '2024-08-18', status: 'Checked-In' },
  { id: 'RES003', guest: 'Peter Jones', room: 'RM201', checkIn: '2024-08-17', checkOut: '2024-08-22', status: 'Confirmed' },
  { id: 'RES004', guest: 'Mary Johnson', room: 'RM101', checkIn: '2024-08-10', checkOut: '2024-08-14', status: 'Checked-Out' },
  { id: 'RES005', guest: 'David Williams', room: 'RM401', checkIn: '2024-08-20', checkOut: '2024-08-25', status: 'Confirmed' },
  { id: 'RES006', guest: 'Emily Brown', room: 'RM101', checkIn: '2024-08-22', checkOut: '2024-08-24', status: 'Canceled' },
];

const statusVariant = {
  'Confirmed': 'default',
  'Checked-In': 'outline',
  'Checked-Out': 'secondary',
  'Canceled': 'destructive'
} as const;

export default function ReservationsPage() {
  return (
    <>
      <PageHeader title="Reservations" description="Manage all guest reservations and their status.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Reservation
        </Button>
      </PageHeader>
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

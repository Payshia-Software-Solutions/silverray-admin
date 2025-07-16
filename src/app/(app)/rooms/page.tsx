import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const rooms = [
  { id: 'RM101', type: 'Single', price: 120, status: 'Available' },
  { id: 'RM102', type: 'Double', price: 180, status: 'Occupied' },
  { id: 'RM201', type: 'Suite', price: 350, status: 'Available' },
  { id: 'RM202', type: 'Double', price: 180, status: 'Maintenance' },
  { id: 'RM301', type: 'Single', price: 120, status: 'Available' },
  { id: 'RM302', type: 'Suite', price: 350, status: 'Occupied' },
  { id: 'RM401', type: 'Penthouse', price: 800, status: 'Available' },
];

const statusVariant = {
  Available: 'default',
  Occupied: 'secondary',
  Maintenance: 'destructive',
} as const;

export default function RoomsPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div></div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Room
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Room List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room Number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price/Night</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.id}</TableCell>
                  <TableCell>{room.type}</TableCell>
                  <TableCell>${room.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[room.status as keyof typeof statusVariant]}>
                      {room.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
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

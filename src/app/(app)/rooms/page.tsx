'use client';
import { PlusCircle, Pencil, Trash2, Search, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';


const rooms = [
  { id: 'RM101', type: 'Single', price: 120, status: 'Available', occupancy: 1 },
  { id: 'RM102', type: 'Double', price: 180, status: 'Occupied', occupancy: 2 },
  { id: 'RM201', type: 'Suite', price: 350, status: 'Available', occupancy: 4 },
  { id: 'RM202', type: 'Double', price: 180, status: 'Maintenance', occupancy: 2 },
  { id: 'RM301', type: 'Single', price: 120, status: 'Available', occupancy: 1 },
  { id: 'RM302', type: 'Suite', price: 350, status: 'Occupied', occupancy: 4 },
  { id: 'RM401', type: 'Penthouse', price: 800, status: 'Available', occupancy: 6 },
];

const statusVariant = {
  Available: 'default',
  Occupied: 'secondary',
  Maintenance: 'destructive',
} as const;

export default function RoomsPage() {
  const router = useRouter();
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by room number, type..."
            className="w-full rounded-lg bg-background pl-8"
          />
        </div>
        <Button onClick={() => router.push('/rooms/new')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Room
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
                <TableHead>Occupancy</TableHead>
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {room.occupancy}
                    </div>
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
    </div>
  );
}

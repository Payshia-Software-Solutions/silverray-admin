
'use client';
import { Plus, Search, Eye, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const rooms = [
  { id: '101', type: 'Deluxe Double Room with Balcony', price: 'LKR. 29500', status: 'Available', occupancy: '2 Adults / 1 Child' },
  { id: '102', type: 'King Suite with Balcony', price: 'LKR. 29500', status: 'Booked', occupancy: '2 Adults / 2 Children' },
  { id: '201', type: 'Premium Suite', price: 'LKR. 29500', status: 'Under Maintenance', occupancy: '4 Adults / 2 Children' },
  { id: '202', type: 'Premium Suite', price: 'LKR. 29500', status: 'Under Maintenance', occupancy: '4 Adults / 2 Children' },
  { id: '203', type: 'Premium Suite', price: 'LKR. 29500', status: 'Under Maintenance', occupancy: '4 Adults / 2 Children' },
];

const statusVariant = {
  Available: 'bg-green-100 text-green-700',
  Booked: 'bg-red-100 text-red-700',
  'Under Maintenance': 'bg-yellow-100 text-yellow-700',
} as const;

export default function RoomsPage() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 p-4 bg-card rounded-lg shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by room number..."
            className="w-full rounded-lg bg-background pl-10"
          />
        </div>
        <Button onClick={() => router.push('/rooms/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Room
          </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room Number</TableHead>
                <TableHead>Room Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price/Night</TableHead>
                <TableHead>Occupancy</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.id}</TableCell>
                  <TableCell>{room.type}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('border-transparent', statusVariant[room.status as keyof typeof statusVariant])}>
                      {room.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{room.price}</TableCell>
                  <TableCell>
                    {room.occupancy}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
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
                Showing 1 to 5 of 47 rooms
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

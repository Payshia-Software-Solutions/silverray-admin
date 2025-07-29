
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getRooms, type RoomFromApi } from '@/lib/services/api';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const statusVariant = {
  Available: 'bg-green-100 text-green-700',
  Booked: 'bg-red-100 text-red-700',
  'Under Maintenance': 'bg-yellow-100 text-yellow-700',
} as const;

export default function ApiExamplePage() {
  const [rooms, setRooms] = useState<RoomFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This function is called when the component mounts.
    async function fetchRooms() {
      try {
        setLoading(true);
        setError(null);
        const data = await getRooms();
        setRooms(data);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred. Make sure your PHP server is running and CORS is configured.');
      } finally {
        setLoading(false);
      }
    }

    fetchRooms();
  }, []); // The empty array ensures this effect runs only once.

  return (
    <div className="space-y-6">
       <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>API Connection Example</AlertTitle>
        <AlertDescription>
          This page demonstrates how to fetch data from a PHP back-end. The data below is loaded by calling the `getRooms` function from our API service, which makes a `fetch` request to your PHP server.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Rooms Fetched from PHP Back-end</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading rooms from your PHP server...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room Number</TableHead>
                  <TableHead>Room Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price/Night</TableHead>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

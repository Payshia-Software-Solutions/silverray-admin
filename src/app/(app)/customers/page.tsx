import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const customers = [
  { id: 'CUST001', name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', stays: 5, avatar: 'https://placehold.co/40x40/C0A060/FFFFFF.png?text=JD' },
  { id: 'CUST002', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '234-567-8901', stays: 2, avatar: 'https://placehold.co/40x40/333333/FFFFFF.png?text=JS' },
  { id: 'CUST003', name: 'Peter Jones', email: 'peter.jones@example.com', phone: '345-678-9012', stays: 10, avatar: 'https://placehold.co/40x40/C0A060/FFFFFF.png?text=PJ' },
  { id: 'CUST004', name: 'Mary Johnson', email: 'mary.j@example.com', phone: '456-789-0123', stays: 1, avatar: 'https://placehold.co/40x40/333333/FFFFFF.png?text=MJ' },
  { id: 'CUST005', name: 'David Williams', email: 'd.williams@example.com', phone: '567-890-1234', stays: 8, avatar: 'https://placehold.co/40x40/C0A060/FFFFFF.png?text=DW' },
];

export default function CustomersPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div></div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Total Stays</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={customer.avatar} alt={customer.name} data-ai-hint="person avatar" />
                        <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{customer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.stays}</TableCell>
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

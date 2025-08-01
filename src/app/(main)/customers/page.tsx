
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const customers = [
  {
    id: 'CUST001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://placehold.co/40x40.png',
    avatarHint: 'man face',
    totalBookings: 5,
    status: 'Active',
    joinedDate: '2023-01-15',
  },
  {
    id: 'CUST002',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 987-6543',
    avatar: 'https://placehold.co/40x40.png',
    avatarHint: 'woman face',
    totalBookings: 2,
    status: 'Active',
    joinedDate: '2023-03-22',
  },
  {
    id: 'CUST003',
    name: 'Michael Chen',
    email: 'm.chen@example.com',
    phone: '+1 (555) 555-5555',
    avatar: 'https://placehold.co/40x40.png',
    avatarHint: 'man portrait',
    totalBookings: 1,
    status: 'Inactive',
    joinedDate: '2024-05-10',
  },
  {
    id: 'CUST004',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    phone: '+44 20 7946 0958',
    avatar: 'https://placehold.co/40x40.png',
    avatarHint: 'woman smiling',
    totalBookings: 8,
    status: 'Active',
    joinedDate: '2022-11-30',
  },
];

export default function CustomerManagementPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Customer Management</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search customers..." className="pl-8" />
              </div>
              <Button onClick={() => console.log('Add New Customer Clicked')}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Customer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Total Bookings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-semibold text-primary">{customer.id}</TableCell>
                  <TableCell>
                     <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={customer.avatar} alt={customer.name} data-ai-hint={customer.avatarHint} />
                        <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      {customer.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{customer.email}</div>
                    <div className="text-xs text-muted-foreground">{customer.phone}</div>
                  </TableCell>
                  <TableCell className="text-center">{customer.totalBookings}</TableCell>
                   <TableCell>
                    <Badge
                      variant={customer.status === 'Active' ? 'default' : 'secondary'}
                      className={customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                    >
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.joinedDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-primary/10">
                        <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-primary/10">
                        <Edit className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        <span className="sr-only">Edit</span>
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
                Showing 1 to {customers.length} of {customers.length} customers
            </div>
            <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="default" size="sm">1</Button>
                <Button variant="outline" size="sm">Next</Button>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}

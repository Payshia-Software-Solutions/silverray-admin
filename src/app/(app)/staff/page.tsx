import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const staff = [
  { id: 'STF001', name: 'Admin User', email: 'admin@silverray.com', role: 'Administrator', avatar: 'https://placehold.co/40x40/2E3192/E8E9F3.png?text=AU' },
  { id: 'STF002', name: 'Manager Mike', email: 'mike.m@silverray.com', role: 'Manager', avatar: 'https://placehold.co/40x40/D4AF37/2E3192.png?text=MM' },
  { id: 'STF003', name: 'Receptionist Rita', email: 'rita.r@silverray.com', role: 'Reception', avatar: 'https://placehold.co/40x40/2E3192/E8E9F3.png?text=RR' },
  { id: 'STF004', name: 'Housekeeper Harry', email: 'harry.h@silverray.com', role: 'Housekeeping', avatar: 'https://placehold.co/40x40/D4AF37/2E3192.png?text=HH' },
];

const roleVariant = {
  Administrator: 'destructive',
  Manager: 'default',
  Reception: 'secondary',
  Housekeeping: 'outline',
} as const;

export default function StaffPage() {
  return (
    <>
      <PageHeader title="Staff Management" description="Manage employee records and user permissions.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Staff List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                         <AvatarImage src={member.avatar} alt={member.name} data-ai-hint="person avatar" />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge variant={roleVariant[member.role as keyof typeof roleVariant]}>{member.role}</Badge>
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

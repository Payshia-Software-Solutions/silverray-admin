
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Search, Key } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  status: "Active" | "Inactive";
  avatarUrl: string;
}

const sampleUsers: User[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Super Admin",
    lastLogin: "2 hours ago",
    status: "Active",
    avatarUrl: "https://placehold.co/40x40.png",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "Booking Manager",
    lastLogin: "1 day ago",
    status: "Active",
    avatarUrl: "https://placehold.co/40x40.png",
  },
  {
    id: 3,
    name: "Mike Davis",
    email: "mike.davis@example.com",
    role: "Restaurant Manager",
    lastLogin: "3 days ago",
    status: "Inactive",
    avatarUrl: "https://placehold.co/40x40.png",
  },
   {
    id: 4,
    name: 'Emily Wilson',
    email: 'emily.w@example.com',
    role: 'Front Desk',
    lastLogin: '5 hours ago',
    status: 'Active',
    avatarUrl: 'https://placehold.co/40x40.png',
  },
  {
    id: 5,
    name: 'Chris Lee',
    email: 'chris.lee@example.com',
    role: 'Housekeeping',
    lastLogin: '2 days ago',
    status: 'Active',
    avatarUrl: 'https://placehold.co/40x40.png',
  },
  {
    id: 6,
    name: 'Jessica Brown',
    email: 'jessica.b@example.com',
    role: 'Events Coordinator',
    lastLogin: '7 days ago',
    status: 'Inactive',
    avatarUrl: 'https://placehold.co/40x40.png',
  },
];

export function AdminUsersTable() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Admin Users</CardTitle>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-8" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person face" />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        user.role === "Super Admin"
                          ? "bg-purple-100 text-purple-700 border-purple-200"
                          : user.role === "Booking Manager"
                          ? "bg-blue-100 text-blue-700 border-blue-200"
                          : user.role === "Restaurant Manager"
                          ? "bg-orange-100 text-orange-700 border-orange-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === "Active" ? 'default' : 'secondary'}
                      className={
                        user.status === "Active"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 group">
                        <Pencil className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        <span className="sr-only">Edit</span>
                      </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 group">
                        <Key className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        <span className="sr-only">Permissions</span>
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
                Showing 1 to {sampleUsers.length} of 24 results
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
  );
}
export default AdminUsersTable;

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

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
    avatarUrl: "https://github.com/shadcn.png", // Placeholder image
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "Booking Manager",
    lastLogin: "1 day ago",
    status: "Active",
    avatarUrl: "https://github.com/shadcn.png", // Placeholder image
  },
  {
    id: 3,
    name: "Mike Davis",
    email: "mike.davis@example.com",
    role: "Restaurant Manager",
    lastLogin: "3 days ago",
    status: "Inactive",
    avatarUrl: "https://github.com/shadcn.png", // Placeholder image
  },
];

export function AdminUsersTable() {
  return (
    <div className="rounded-md border">
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
              <TableCell className="font-medium flex items-center">
                <Avatar className="mr-2 h-8 w-8">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {user.name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    user.role === "Super Admin"
                      ? "bg-purple-100 text-purple-800"
                      : user.role === "Booking Manager"
                      ? "bg-blue-100 text-blue-800"
                      : user.role === "Restaurant Manager"
                      ? "bg-orange-100 text-orange-800"
                      : ""
                  }
                >
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>{user.lastLogin}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    user.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Pencil className="h-4 w-4 text-gray-500 cursor-pointer" />
                  <Trash2 className="h-4 w-4 text-gray-500 cursor-pointer" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
export default AdminUsersTable;
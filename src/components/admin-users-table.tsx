

'use client'

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
import { Pencil, Trash2, Search, Key, X } from "lucide-react";
import { useState, useEffect } from "react";
import { getUsers, deleteUser, type UserFromApi, getUserImage, CONTENT_PROVIDER_BASE_URL } from "@/lib/services/api";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "./ui/toaster";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader as DialogHeaderComponent,
  DialogTitle as DialogTitleComponent,
  DialogClose,
} from '@/components/ui/dialog';
import Link from "next/link";
import { formatDistanceToNow } from 'date-fns';


export function AdminUsersTable() {
    const { toast } = useToast();
    const [users, setUsers] = useState<UserFromApi[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userToDelete, setUserToDelete] = useState<UserFromApi | null>(null);
    const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);
    const [deletedUserName, setDeletedUserName] = useState('');

    useEffect(() => {
        async function fetchUsers() {
            try {
                setLoading(true);
                const data = await getUsers();
                const usersWithImages = await Promise.all(data.map(async (user) => {
                    try {
                        const image = await getUserImage(user.id);
                        return { ...user, avatar_url: image ? CONTENT_PROVIDER_BASE_URL + image.image_url : null };
                    } catch (e) {
                        console.error(`Failed to load image for user ${user.id}`, e);
                        return { ...user, avatar_url: null };
                    }
                }));

                setUsers(usersWithImages);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch users');
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: err.message || 'Failed to fetch users'
                });
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, [toast]);

    const handleDeleteClick = (user: UserFromApi) => {
        setUserToDelete(user);
    }

    const handleDeleteConfirm = async () => {
        if (userToDelete) {
            try {
                await deleteUser(userToDelete.id);
                setDeletedUserName(userToDelete.full_name);
                setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
                setShowDeleteSuccessDialog(true);
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Error Deleting User",
                    description: error.message || "An unexpected error occurred.",
                });
            } finally {
                setUserToDelete(null);
            }
        }
    };

    const formatLastLogin = (dateString: string | null) => {
        if (!dateString) return 'Never';
        return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    }

  return (
    <>
    <Toaster />
    <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
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
            {loading && <p className="p-4 text-center">Loading users...</p>}
            {error && <p className="p-4 text-center text-red-500">{error}</p>}
            {!loading && !error && (
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
                    {users.map((user) => (
                        <TableRow key={user.id}>
                        <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar_url || 'https://placehold.co/40x40.png'} alt={user.full_name} data-ai-hint="person face" />
                                <AvatarFallback>{user.full_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            {user.full_name}
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
                        <TableCell>{formatLastLogin(user.last_login)}</TableCell>
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
                                <Button asChild variant="ghost" size="icon" className="h-8 w-8 group hover:bg-primary/10">
                                    <Link href={`/user-management/${user.id}`}>
                                        <Pencil className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                        <span className="sr-only">Edit</span>
                                    </Link>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-primary/10">
                                    <Key className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                    <span className="sr-only">Reset Password</span>
                                </Button>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-red-100" onClick={() => handleDeleteClick(user)}>
                                        <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-red-500" />
                                        <span className="sr-only">Delete</span>
                                    </Button>
                                </AlertDialogTrigger>
                            </div>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            )}
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t px-6 py-3">
            <div className="text-sm text-muted-foreground">
                Showing 1 to {users.length} of {users.length} results
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
        <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center text-2xl font-bold">Delete User?</AlertDialogTitle>
              <AlertDialogDescription className="text-center text-lg">
                Are you sure you want to delete user: <strong className="text-red-500">{userToDelete?.full_name}</strong>?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center">
              <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
    </AlertDialog>
    <Dialog open={showDeleteSuccessDialog} onOpenChange={setShowDeleteSuccessDialog}>
    <DialogContent className="sm:max-w-md">
        <DialogHeaderComponent className="sr-only">
            <DialogTitleComponent>Successfully Deleted</DialogTitleComponent>
        </DialogHeaderComponent>
        <div className="flex flex-col items-center justify-center text-center p-6 pt-8">
            <div className="p-4 bg-red-100 rounded-full mb-4">
                <Trash2 className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold">Successfully Deleted {deletedUserName}!</h2>
        </div>
        <DialogClose asChild>
        <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted" onClick={() => setShowDeleteSuccessDialog(false)}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
        </button>
        </DialogClose>
    </DialogContent>
    </Dialog>
    </>
  );
}
export default AdminUsersTable;

    
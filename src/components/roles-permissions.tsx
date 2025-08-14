

'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CheckCircle2, XCircle, ShieldCheck, Shield, ShieldX, Key, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { getRoles, deleteRole, type RoleFromApi } from "@/lib/services/api";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
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

interface PermissionItemProps {
  text: string;
}

const PermissionItem: React.FC<PermissionItemProps> = ({ text }) => (
  <div className="flex items-center text-sm mb-2">
    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
    <span className="text-muted-foreground">{text}</span>
  </div>
);

const roleIcons: { [key: string]: React.ElementType } = {
    "Super Admin": ShieldCheck,
    "Booking Manager": Shield,
    "Restaurant Manager": ShieldX,
    "default": Shield,
};

const RolesPermissions: React.FC = () => {
    const { toast } = useToast();
    const [roles, setRoles] = useState<RoleFromApi[]>([]);
    const [loading, setLoading] = useState(true);
    const [roleToDelete, setRoleToDelete] = useState<RoleFromApi | null>(null);

    useEffect(() => {
        async function fetchRoles() {
            try {
                setLoading(true);
                const data = await getRoles();
                setRoles(data);
            } catch (err: any) {
                toast({
                    variant: 'destructive',
                    title: 'Error fetching roles',
                    description: err.message,
                });
            } finally {
                setLoading(false);
            }
        }
        fetchRoles();
    }, [toast]);
    
    const handleDelete = async () => {
        if (!roleToDelete) return;

        try {
            await deleteRole(roleToDelete.id);
            setRoles(roles.filter(role => role.id !== roleToDelete.id));
            toast({ title: "Success", description: `Role "${roleToDelete.name}" deleted successfully.` });
        } catch (error: any) {
            toast({ variant: 'destructive', title: "Error", description: error.message });
        } finally {
            setRoleToDelete(null);
        }
    }

  return (
    <AlertDialog open={!!roleToDelete} onOpenChange={(open) => !open && setRoleToDelete(null)}>
        <div>
        <h2 className="text-xl font-semibold mb-2">Roles & Permissions</h2>
        <p className="text-sm text-muted-foreground mb-4">Manage role-based access controls and permissions for your team</p>

        {loading && <p>Loading roles...</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map(role => {
                 const Icon = roleIcons[role.name] || roleIcons.default;
                 return (
                    <Card key={role.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>{role.name}</CardTitle>
                                <CardDescription>{role.description}</CardDescription>
                            </div>
                            <Icon className="w-8 h-8 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            {role.permissions.split(',').map((permission, index) => (
                                <PermissionItem key={index} text={permission.trim().replace(/_/g, ' ')} />
                            ))}
                        </CardContent>
                        <CardFooter className="gap-2">
                             <Button variant="outline" className="w-full" asChild>
                                <Link href={`/user-management/roles/${role.id}`}>
                                    <Key className="mr-2 h-4 w-4" /> Manage
                                </Link>
                            </Button>
                             <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon" onClick={() => setRoleToDelete(role)}>
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                             </AlertDialogTrigger>
                        </CardFooter>
                    </Card>
                 )
            })}
        </div>
        </div>
         <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center text-2xl font-bold">Delete Role?</AlertDialogTitle>
              <AlertDialogDescription className="text-center text-lg">
                Are you sure you want to delete the role: <strong className="text-red-500">{roleToDelete?.name}</strong>?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center">
              <AlertDialogCancel onClick={() => setRoleToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
    </AlertDialog>
  );
};

export default RolesPermissions;

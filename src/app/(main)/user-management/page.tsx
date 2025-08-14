
'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import UserStatsCards from '@/components/user-stats-cards';
import AdminUsersTable from '@/components/admin-users-table';
import RolesPermissions from '@/components/roles-permissions';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Key } from 'lucide-react';

const UserManagementPage = () => {
  return (
    <div className="flex flex-col gap-6">
       <Tabs defaultValue="admins" className="space-y-4">
        <div className="flex justify-between items-center">
            <TabsList>
                <TabsTrigger value="admins"><Users className="mr-2 h-4 w-4"/> Admins</TabsTrigger>
                <TabsTrigger value="roles"><Key className="mr-2 h-4 w-4" /> Roles & Permissions</TabsTrigger>
            </TabsList>
        </div>
        <TabsContent value="admins" className="space-y-6">
             <div className="flex justify-between items-center">
                <div></div>
                <Button asChild>
                <Link href="/user-management/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Admin
                </Link>
                </Button>
            </div>
            <UserStatsCards />
            <AdminUsersTable />
        </TabsContent>
        <TabsContent value="roles" className="space-y-6">
            <div className="flex justify-between items-center">
                <div></div>
                <Button asChild>
                    <Link href="/user-management/roles/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Role
                    </Link>
                </Button>
            </div>
            <RolesPermissions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagementPage;

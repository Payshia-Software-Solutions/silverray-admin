
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import UserStatsCards from '@/components/user-stats-cards';
import AdminUsersTable from '@/components/admin-users-table';
import RolesPermissions from '@/components/roles-permissions';
import Link from 'next/link';

const UserManagementPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        {/* This space is intentionally left for alignment, or can be used for a subtitle */}
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
      <RolesPermissions />
    </div>
  );
};

export default UserManagementPage;
